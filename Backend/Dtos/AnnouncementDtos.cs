using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

// ─── Category DTOs ───────────────────────────────────────────

public class AnnouncementCategoryTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class AnnouncementCategoryTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}

public class AnnouncementCategoryDto
{
    public uint Id { get; set; }
    public uint OrderNo { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public List<AnnouncementCategoryTranslationDto> Translations { get; set; } = new();
}

public class AnnouncementCategoryUpsertDto
{
    public uint OrderNo { get; set; }
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    [MaxLength(100)]
    public string? Slug { get; set; }
    public List<AnnouncementCategoryTranslationUpsertDto> Translations { get; set; } = new();
}

// ─── Announcement Translation DTOs ──────────────────────────

public class AnnouncementTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string? CanonicalUrl { get; set; }
    public uint? OgImageFileId { get; set; }
    public string? SearchKeywords { get; set; }
    public string? ActionLabel { get; set; }
}

public class AnnouncementTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [Required, MaxLength(255)]
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
}

// ─── Attachment DTO ─────────────────────────────────────────

public class AnnouncementAttachmentDto
{
    public uint Id { get; set; }
    public uint FileId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string? FileMime { get; set; }
    public uint? FileSize { get; set; }
    public uint OrderNo { get; set; }
}

// ─── Announcement DTOs ──────────────────────────────────────

public class AnnouncementDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public uint? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public uint? CoverImageFileId { get; set; }
    public string? CoverImageUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? PublishedAt { get; set; }
    public DateTime? UnpublishedAt { get; set; }
    public uint Views { get; set; }
    public DateTime? CreatedAt { get; set; }
    public bool IsPinned { get; set; }
    public bool IsActive { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }

    // CTA
    public string? ActionUrl { get; set; }
    public string? ActionLabel { get; set; }

    // Attachments
    public List<AnnouncementAttachmentDto> Attachments { get; set; } = new();

    public List<AnnouncementTranslationDto> Translations { get; set; } = new();
}

public class AnnouncementUpsertDto
{
    public uint? CategoryId { get; set; }
    public uint? CoverImageFileId { get; set; }
    [Required]
    public string Status { get; set; } = "draft";
    public DateTime? PublishedAt { get; set; }
    public DateTime? UnpublishedAt { get; set; }
    public bool IsPinned { get; set; }
    public bool IsActive { get; set; } = true;

    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [Required, MaxLength(255)]
    public string Slug { get; set; } = string.Empty;
    [MaxLength(1000)]
    public string? Summary { get; set; }
    public string? Content { get; set; }

    // CTA
    [MaxLength(500)]
    public string? ActionUrl { get; set; }
    [MaxLength(100)]
    public string? ActionLabel { get; set; }

    // Attachment file IDs
    public List<uint>? AttachmentFileIds { get; set; }

    public List<AnnouncementTranslationUpsertDto> Translations { get; set; } = new();
}
