using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class RegisterDto
{
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;
    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;
    public uint? CompanyId { get; set; }
}

public class LoginDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}

public class UserDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string UserType { get; set; } = string.Empty;
    public uint? RoleId { get; set; }
    public string? RoleName { get; set; }
    public uint? CompanyId { get; set; }
    public bool IsActive { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserDto User { get; set; } = null!;
}
