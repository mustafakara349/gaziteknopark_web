using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("users")]
public class User
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [MaxLength(255)]
    public string Password { get; set; } = string.Empty;
    public uint? PhotoFileId { get; set; }
    public uint? RoleId { get; set; }
    public UserType UserType { get; set; } = UserType.Admin;
    public uint? CompanyId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? EmailVerifiedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    [MaxLength(45)]
    public string? LastLoginIp { get; set; }
    public uint FailedLoginAttempts { get; set; }
    public DateTime? LockedUntil { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }

    [ForeignKey(nameof(PhotoFileId))]
    public FileAsset? PhotoFile { get; set; }
    [ForeignKey(nameof(RoleId))]
    public Role? Role { get; set; }
    [ForeignKey(nameof(CompanyId))]
    public Company? Company { get; set; }

    public ICollection<PasswordResetToken> PasswordResetTokens { get; set; } = new List<PasswordResetToken>();
}

[Table("password_reset_tokens")]
public class PasswordResetToken
{
    [Key]
    public uint Id { get; set; }
    public uint UserId { get; set; }
    [MaxLength(255)]
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
    public DateTime? CreatedAt { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
}
