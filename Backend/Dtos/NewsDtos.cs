using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class NewsCategoryTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class NewsCategoryTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}

public class NewsCategoryDto
{
    public uint Id { get; set; }
    public uint OrderNo { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public List<NewsCategoryTranslationDto> Translations { get; set; } = new();
}

public class NewsCategoryUpsertDto
{
    public uint OrderNo { get; set; }
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    [MaxLength(100)]
    public string? Slug { get; set; }
    public List<NewsCategoryTranslationUpsertDto> Translations { get; set; } = new();
}

public class NewsTranslationDto
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

public class NewsTranslationUpsertDto
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
}

public class NewsDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public uint? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public uint? CoverImageFileId { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? UnpublishedAt { get; set; }
    public uint Views { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;
    public string? AuthorName { get; set; }
    public int? ReadTime { get; set; }
    public string? VideoUrl { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }

    public List<uint>? AdditionalImageFileIds { get; set; }
    public string? CoverImageUrl { get; set; }
    public List<string>? AdditionalImageUrls { get; set; }

    public List<NewsTranslationDto> Translations { get; set; } = new();
}

public class NewsUpsertDto
{
    public uint? CategoryId { get; set; }
    public uint? CoverImageFileId { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? UnpublishedAt { get; set; }
    
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;
    [MaxLength(100)]
    public string? AuthorName { get; set; }
    public int? ReadTime { get; set; }
    [MaxLength(500)]
    public string? VideoUrl { get; set; }

    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [Required, MaxLength(255)]
    public string Slug { get; set; } = string.Empty;
    [MaxLength(1000)]
    public string? Summary { get; set; }
    public string? Content { get; set; }

    public List<uint>? AdditionalImageFileIds { get; set; }

    public List<NewsTranslationUpsertDto> Translations { get; set; } = new();
}
