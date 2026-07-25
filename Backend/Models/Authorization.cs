using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("roles")]
public class Role
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

[Table("permissions")]
public class Permission
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;
    [MaxLength(150)]
    public string Slug { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

[Table("role_permissions")]
public class RolePermission
{
    public uint RoleId { get; set; }
    public uint PermissionId { get; set; }

    [ForeignKey(nameof(RoleId))]
    public Role Role { get; set; } = null!;
    [ForeignKey(nameof(PermissionId))]
    public Permission Permission { get; set; } = null!;
}
