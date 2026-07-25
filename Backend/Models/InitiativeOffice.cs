using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("initiative_office")]
public class InitiativeOffice
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    public uint? ImageFileId { get; set; }
    public ContentStatus Status { get; set; } = ContentStatus.Published;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey(nameof(ImageFileId))]
    public FileAsset? ImageFile { get; set; }

    public ICollection<InitiativeOfficeTranslation> Translations { get; set; } = new List<InitiativeOfficeTranslation>();
}

[Table("initiative_office_translations")]
public class InitiativeOfficeTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint InitiativeOfficeId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
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

    [ForeignKey(nameof(InitiativeOfficeId))]
    public InitiativeOffice InitiativeOffice { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
    [ForeignKey(nameof(OgImageFileId))]
    public FileAsset? OgImageFile { get; set; }
}
