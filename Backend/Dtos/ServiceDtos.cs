using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class ServiceTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string? CanonicalUrl { get; set; }
    public uint? OgImageFileId { get; set; }
    public string? SearchKeywords { get; set; }
}

public class ServiceTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(255)]
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
}

public class ServiceDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public string? Icon { get; set; }
    public uint OrderNo { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<ServiceTranslationDto> Translations { get; set; } = new();
}

public class ServiceUpsertDto
{
    [MaxLength(255)]
    public string? Icon { get; set; }
    public uint OrderNo { get; set; }
    [Required]
    public string Status { get; set; } = "published";
    [MinLength(1)]
    public List<ServiceTranslationUpsertDto> Translations { get; set; } = new();
}
