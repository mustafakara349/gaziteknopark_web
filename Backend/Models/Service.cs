using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("services")]
public class Service
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    [MaxLength(255)]
    public string? Icon { get; set; }
    public uint OrderNo { get; set; }
    public ContentStatus Status { get; set; } = ContentStatus.Published;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<ServiceTranslation> Translations { get; set; } = new List<ServiceTranslation>();
}

[Table("service_translations")]
public class ServiceTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint ServiceId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    [MaxLength(255)]
    public string? MetaTitle { get; set; }
    [MaxLength(500)]
    public string? MetaDescription { get; set; }
    [MaxLength(500)]
    public string? MetaKeywords { get; set; }
    [MaxLength(255)]
    public string? CanonicalUrl { get; set; }
    public uint? OgImageFileId { get; set; }
    [MaxLength(500)]
    public string? SearchKeywords { get; set; }

    [ForeignKey(nameof(ServiceId))]
    public Service Service { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
    [ForeignKey(nameof(OgImageFileId))]
    public FileAsset? OgImageFile { get; set; }
}
