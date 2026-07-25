using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("languages")]
public class Language
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(5)]
    public string Code { get; set; } = string.Empty;
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? CreatedAt { get; set; }
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
}

[Table("files")]
public class FileAsset
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;
    [MaxLength(255)]
    public string? OriginalName { get; set; }
    [MaxLength(500)]
    public string Path { get; set; } = string.Empty;
    public uint? Size { get; set; }
    [MaxLength(100)]
    public string? Mime { get; set; }
    public uint? Width { get; set; }
    public uint? Height { get; set; }
    [MaxLength(255)]
    public string? AltText { get; set; }
    [MaxLength(255)]
    public string? Title { get; set; }
    [MaxLength(500)]
    public string? Caption { get; set; }
    [MaxLength(255)]
    public string? Copyright { get; set; }
    public uint? UploadedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
}
