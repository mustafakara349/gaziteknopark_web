using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class InitiativeOfficeTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string? CanonicalUrl { get; set; }
    public uint? OgImageFileId { get; set; }
    public string? SearchKeywords { get; set; }
}

public class InitiativeOfficeTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
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

public class InitiativeOfficeIncubatorTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? Features { get; set; }
}

public class InitiativeOfficeIncubatorDto
{
    public uint Id { get; set; }
    public string Icon { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? Features { get; set; }
    public List<InitiativeOfficeIncubatorTranslationDto> Translations { get; set; } = new();
}

public class InitiativeOfficeIncubatorTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(255)]
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? Features { get; set; }
}

public class InitiativeOfficeIncubatorUpsertDto
{
    public uint? Id { get; set; }
    [MaxLength(50)]
    public string Icon { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    [Required]
    public string Status { get; set; } = "published";
    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(255)]
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? Features { get; set; }
    [MinLength(1)]
    public List<InitiativeOfficeIncubatorTranslationUpsertDto> Translations { get; set; } = new();
}

public class InitiativeOfficeDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public uint? ImageFileId { get; set; }
    public string? ImageUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public List<InitiativeOfficeTranslationDto> Translations { get; set; } = new();
    public List<InitiativeOfficeIncubatorDto> Incubators { get; set; } = new();
}

public class InitiativeOfficeUpsertDto
{
    public uint? ImageFileId { get; set; }
    [Required]
    public string Status { get; set; } = "published";
    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    [MinLength(1)]
    public List<InitiativeOfficeTranslationUpsertDto> Translations { get; set; } = new();
    public List<InitiativeOfficeIncubatorUpsertDto> Incubators { get; set; } = new();
}
