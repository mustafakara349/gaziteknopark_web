using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class SuccessStoryTranslationDto
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
}

public class SuccessStoryTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [Required, MaxLength(255)]
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
}

public class SuccessStoryDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public uint? CompanyId { get; set; }
    public uint? CoverImageFileId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? PublishedDate { get; set; }
    public List<SuccessStoryTranslationDto> Translations { get; set; } = new();
}

public class SuccessStoryUpsertDto
{
    public uint? CompanyId { get; set; }
    public uint? CoverImageFileId { get; set; }
    [Required]
    public string Status { get; set; } = "draft";
    public DateTime? PublishedDate { get; set; }
    [MinLength(1)]
    public List<SuccessStoryTranslationUpsertDto> Translations { get; set; } = new();
}
