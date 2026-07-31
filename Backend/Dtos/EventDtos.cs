using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class EventTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Description { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string? CanonicalUrl { get; set; }
    public uint? OgImageFileId { get; set; }
    public string? SearchKeywords { get; set; }
}

public class EventTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [Required, MaxLength(255)]
    public string Slug { get; set; } = string.Empty;
    [MaxLength(255)]
    public string? Location { get; set; }
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

public class EventDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public uint? CoverImageFileId { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<EventTranslationDto> Translations { get; set; } = new();
}

public class EventUpsertDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public uint? CoverImageFileId { get; set; }
    [Required]
    public string Status { get; set; } = "draft";
    [MinLength(1)]
    public List<EventTranslationUpsertDto> Translations { get; set; } = new();
}

// Genel "Etkinlikler" listeleme sayfasındaki kart yapısına göre düzleştirilmiş, tek dilli DTO.
public class EventListDto
{
    public uint Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? Location { get; set; }
    public string? CoverImageUrl { get; set; }
    public DateTime? StartDate { get; set; }
    public string? StartTime { get; set; }
}

// Etkinlik detay sayfası için SEO alanları dahil tam çeviri içeriği.
public class EventDetailDto
{
    public uint Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string? CanonicalUrl { get; set; }
    public string? OgImageUrl { get; set; }
    public string? SearchKeywords { get; set; }
}

public class PagedResultDto<T>
{
    public List<T> Items { get; set; } = new();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}
