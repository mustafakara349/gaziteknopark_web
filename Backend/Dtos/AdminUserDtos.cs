using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class AdminUserListDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public uint? RoleId { get; set; }
    public string? RoleName { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class AdminUserCreateDto
{
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;
    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;
    public uint? RoleId { get; set; }
    public bool IsActive { get; set; } = true;
}

public class AdminUserUpdateDto
{
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;
    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [MinLength(6)]
    public string? Password { get; set; }
    public uint? RoleId { get; set; }
    public bool IsActive { get; set; } = true;
}

public class AdminRoleDto
{
    public uint Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int UserCount { get; set; }
}

public class AdminRoleUpsertDto
{
    [Required, MaxLength(50)]
    public string Name { get; set; } = string.Empty;
}
