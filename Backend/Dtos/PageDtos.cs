using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class PageTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string? CanonicalUrl { get; set; }
    public uint? OgImageFileId { get; set; }
    public string? SearchKeywords { get; set; }
}

public class PageTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(150)]
    public string Slug { get; set; } = string.Empty;
    [Required, MaxLength(255)]
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
}

public class PageDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public uint? ImageFileId { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<PageTranslationDto> Translations { get; set; } = new();
}

public class PageUpsertDto
{
    public uint? ImageFileId { get; set; }
    [Required]
    public string Status { get; set; } = "draft";
    [MinLength(1)]
    public List<PageTranslationUpsertDto> Translations { get; set; } = new();
}
