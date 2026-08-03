using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using GaziTeknoparkApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private const int MaxFailedAttempts = 5;
    private static readonly TimeSpan LockDuration = TimeSpan.FromMinutes(15);

    private readonly ApplicationDbContext _db;
    private readonly IJwtTokenService _jwt;
    private readonly IConfiguration _config;

    public AuthController(ApplicationDbContext db, IJwtTokenService jwt, IConfiguration config)
    {
        _db = db;
        _jwt = jwt;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return Conflict("Bu e-posta adresi zaten kayıtlı.");
        }

        if (dto.CompanyId.HasValue && !await _db.Companies.AnyAsync(c => c.Id == dto.CompanyId))
        {
            return BadRequest("Belirtilen firma bulunamadı.");
        }

        var user = new User
        {
            Uuid = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            UserType = UserType.Company,
            CompanyId = dto.CompanyId,
            IsActive = true,
            LastPasswordChangeAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(await BuildAuthResponse(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _db.Users.Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.DeletedAt == null);

        if (user is null)
        {
            return Unauthorized("E-posta veya şifre hatalı.");
        }

        if (user.LockedUntil.HasValue && user.LockedUntil > DateTime.UtcNow)
        {
            return Unauthorized($"Hesap çok sayıda başarısız girişten dolayı kilitli. Lütfen {user.LockedUntil:HH:mm} sonrasında tekrar deneyin.");
        }

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
        {
            user.FailedLoginAttempts++;
            if (user.FailedLoginAttempts >= MaxFailedAttempts)
            {
                user.LockedUntil = DateTime.UtcNow.Add(LockDuration);
            }
            await _db.SaveChangesAsync();
            return Unauthorized("E-posta veya şifre hatalı.");
        }

        if (!user.IsActive)
        {
            return Unauthorized("Hesap aktif değil.");
        }

        user.FailedLoginAttempts = 0;
        user.LockedUntil = null;
        user.LastLoginAt = DateTime.UtcNow;
        user.LastLoginIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        await _db.SaveChangesAsync();

        return Ok(await BuildAuthResponse(user));
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken(RefreshTokenRequestDto dto)
    {
        // Find user by matching hashed refresh token
        var users = await _db.Users.Include(u => u.Role)
            .Where(u => u.RefreshToken != null && u.DeletedAt == null && u.IsActive)
            .ToListAsync();

        var user = users.FirstOrDefault(u => VerifyRefreshTokenHash(dto.RefreshToken, u.RefreshToken!));

        if (user is null)
        {
            return Unauthorized("Geçersiz refresh token.");
        }

        if (user.RefreshTokenExpiryTime < DateTime.UtcNow)
        {
            // Expired — clear it and force re-login
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _db.SaveChangesAsync();
            return Unauthorized("Refresh token süresi dolmuş. Lütfen tekrar giriş yapın.");
        }

        // Token Rotation: issue new pair, invalidate old refresh token
        return Ok(await BuildAuthResponse(user));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var id = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(id);
        if (user is not null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _db.SaveChangesAsync();
        }

        return Ok(new { message = "Başarıyla çıkış yapıldı." });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> Me()
    {
        var id = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
        if (user is null)
        {
            return NotFound();
        }

        return Ok(MapUser(user));
    }

    private async Task<AuthResponseDto> BuildAuthResponse(User user)
    {
        var accessToken = _jwt.GenerateToken(user, out var expiresAt);
        var refreshToken = _jwt.GenerateRefreshToken();
        var refreshTokenExpiryDays = int.Parse(_config["Jwt:RefreshTokenExpiryDays"] ?? "7");
        var refreshTokenExpiresAt = DateTime.UtcNow.AddDays(refreshTokenExpiryDays);

        // Store hashed refresh token in DB
        user.RefreshToken = HashRefreshToken(refreshToken);
        user.RefreshTokenExpiryTime = refreshTokenExpiresAt;
        await _db.SaveChangesAsync();

        return new AuthResponseDto
        {
            Token = accessToken,
            ExpiresAt = expiresAt,
            RefreshToken = refreshToken,
            RefreshTokenExpiresAt = refreshTokenExpiresAt,
            User = MapUser(user)
        };
    }

    private static string HashRefreshToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(bytes);
    }

    private static bool VerifyRefreshTokenHash(string token, string storedHash)
    {
        var hash = HashRefreshToken(token);
        return hash == storedHash;
    }

    private static UserDto MapUser(User user) => new()
    {
        Id = user.Id,
        Uuid = user.Uuid,
        Name = user.Name,
        Email = user.Email,
        UserType = user.UserType.ToString(),
        RoleId = user.RoleId,
        RoleName = user.Role?.Name,
        CompanyId = user.CompanyId,
        IsActive = user.IsActive
    };
}
