using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("news_categories")]
public class NewsCategory
{
    [Key]
    public uint Id { get; set; }
    public uint OrderNo { get; set; }
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<NewsCategoryTranslation> Translations { get; set; } = new List<NewsCategoryTranslation>();
    public ICollection<NewsAnnouncement> NewsAnnouncements { get; set; } = new List<NewsAnnouncement>();
}

[Table("news_category_translations")]
public class NewsCategoryTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint NewsCategoryId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [ForeignKey(nameof(NewsCategoryId))]
    public NewsCategory NewsCategory { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}

[Table("news_announcements")]
public class NewsAnnouncement
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
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? PublishedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey(nameof(CategoryId))]
    public NewsCategory? Category { get; set; }
    [ForeignKey(nameof(CoverImageFileId))]
    public FileAsset? CoverImageFile { get; set; }

    public ICollection<NewsAnnouncementTranslation> Translations { get; set; } = new List<NewsAnnouncementTranslation>();
}

[Table("news_announcement_translations")]
public class NewsAnnouncementTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint NewsId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(255)]
    public string Slug { get; set; } = string.Empty;
    [MaxLength(500)]
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

    [ForeignKey(nameof(NewsId))]
    public NewsAnnouncement News { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
    [ForeignKey(nameof(OgImageFileId))]
    public FileAsset? OgImageFile { get; set; }
}
