using System.Security.Claims;
using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Helpers;
using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers.Admin;

[ApiController]
[Route("api/admin/users")]
[Authorize]
[AdminOnly]
public class AdminUsersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminUsersController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<AdminUserListDto>>> GetAll()
    {
        var users = await _db.Users.Include(u => u.Role)
            .Where(u => u.UserType == UserType.Admin && u.DeletedAt == null)
            .OrderBy(u => u.Name)
            .ToListAsync();

        return Ok(users.Select(Map).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<AdminUserListDto>> Create(AdminUserCreateDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email && u.DeletedAt == null))
        {
            return Conflict("Bu e-posta adresi zaten kullanılıyor.");
        }

        if (dto.RoleId.HasValue && !await _db.Roles.AnyAsync(r => r.Id == dto.RoleId && r.DeletedAt == null))
        {
            return BadRequest("Geçersiz rol.");
        }

        var user = new User
        {
            Uuid = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            UserType = UserType.Admin,
            RoleId = dto.RoleId,
            IsActive = dto.IsActive,
            LastPasswordChangeAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        await _db.Entry(user).Reference(u => u.Role).LoadAsync();

        return CreatedAtAction(nameof(GetAll), Map(user));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AdminUserListDto>> Update(uint id, AdminUserUpdateDto dto)
    {
        var user = await _db.Users.Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == id && u.UserType == UserType.Admin && u.DeletedAt == null);
        if (user is null) return NotFound();

        if (await _db.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id && u.DeletedAt == null))
        {
            return Conflict("Bu e-posta adresi zaten kullanılıyor.");
        }

        if (dto.RoleId.HasValue && !await _db.Roles.AnyAsync(r => r.Id == dto.RoleId && r.DeletedAt == null))
        {
            return BadRequest("Geçersiz rol.");
        }

        var selfId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (user.Id == selfId && !dto.IsActive)
        {
            return BadRequest("Kendi hesabınızı pasif hale getiremezsiniz.");
        }

        user.Name = dto.Name;
        user.Email = dto.Email;
        user.RoleId = dto.RoleId;
        user.IsActive = dto.IsActive;
        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            user.LastPasswordChangeAt = DateTime.UtcNow;
        }
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        await _db.Entry(user).Reference(u => u.Role).LoadAsync();

        return Ok(Map(user));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var selfId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (id == selfId)
        {
            return BadRequest("Kendi hesabınızı silemezsiniz.");
        }

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id && u.UserType == UserType.Admin && u.DeletedAt == null);
        if (user is null) return NotFound();

        var activeAdminCount = await _db.Users.CountAsync(u =>
            u.UserType == UserType.Admin && u.IsActive && u.DeletedAt == null);
        if (user.IsActive && activeAdminCount <= 1)
        {
            return BadRequest("Sistemde en az bir aktif yönetici kalmalıdır.");
        }

        user.DeletedAt = DateTime.UtcNow;
        user.IsActive = false;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static AdminUserListDto Map(User u) => new()
    {
        Id = u.Id,
        Uuid = u.Uuid,
        Name = u.Name,
        Email = u.Email,
        RoleId = u.RoleId,
        RoleName = u.Role?.Name,
        IsActive = u.IsActive,
        LastLoginAt = u.LastLoginAt,
        CreatedAt = u.CreatedAt
    };
}
