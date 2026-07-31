using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("announcement_categories")]
public class AnnouncementCategory
{
    [Key]
    public uint Id { get; set; }

    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    [MaxLength(100)]
    public string? Slug { get; set; }
    public uint OrderNo { get; set; }

    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<AnnouncementCategoryTranslation> Translations { get; set; } = new List<AnnouncementCategoryTranslation>();
    public ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();
}

[Table("announcement_category_translations")]
public class AnnouncementCategoryTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint AnnouncementCategoryId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [ForeignKey(nameof(AnnouncementCategoryId))]
    public AnnouncementCategory AnnouncementCategory { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}

[Table("announcements")]
public class Announcement
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    public uint? CategoryId { get; set; }
    public uint? CoverImageFileId { get; set; }
    public ContentStatus Status { get; set; } = ContentStatus.Draft;
    public DateTime? PublishedAt { get; set; }
    public uint Views { get; set; }
    public bool IsPinned { get; set; }

    // Core Text Content Fields
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(255)]
    public string Slug { get; set; } = string.Empty;
    [MaxLength(1000)]
    public string? Summary { get; set; }
    public string? Content { get; set; }

    // SEO Fields
    [MaxLength(255)]
    public string? MetaTitle { get; set; }
    [MaxLength(500)]
    public string? MetaDescription { get; set; }
    [MaxLength(500)]
    public string? MetaKeywords { get; set; }

    // CTA (Call-to-Action) Fields
    [MaxLength(500)]
    public string? ActionUrl { get; set; }
    [MaxLength(100)]
    public string? ActionLabel { get; set; }

    // Audit Fields
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? PublishedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    [ForeignKey(nameof(CategoryId))]
    public AnnouncementCategory? Category { get; set; }
    [ForeignKey(nameof(CoverImageFileId))]
    public FileAsset? CoverImageFile { get; set; }

    public ICollection<AnnouncementTranslation> Translations { get; set; } = new List<AnnouncementTranslation>();
    public ICollection<AnnouncementAttachment> Attachments { get; set; } = new List<AnnouncementAttachment>();
}

[Table("announcement_translations")]
public class AnnouncementTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint AnnouncementId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(255)]
    public string Slug { get; set; } = string.Empty;
    [MaxLength(1000)]
    public string? Summary { get; set; }
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
    [MaxLength(100)]
    public string? ActionLabel { get; set; }

    [ForeignKey(nameof(AnnouncementId))]
    public Announcement Announcement { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
    [ForeignKey(nameof(OgImageFileId))]
    public FileAsset? OgImageFile { get; set; }
}

[Table("announcement_attachments")]
public class AnnouncementAttachment
{
    [Key]
    public uint Id { get; set; }
    public uint AnnouncementId { get; set; }
    public uint FileId { get; set; }
    public uint OrderNo { get; set; }

    public DateTime? CreatedAt { get; set; }
    public uint? CreatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    [ForeignKey(nameof(AnnouncementId))]
    public Announcement Announcement { get; set; } = null!;
    [ForeignKey(nameof(FileId))]
    public FileAsset File { get; set; } = null!;
}
