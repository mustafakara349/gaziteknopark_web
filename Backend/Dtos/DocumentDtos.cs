using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class DocumentCategoryTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class DocumentCategoryTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;
}

public class DocumentCategoryDto
{
    public uint Id { get; set; }
    public List<DocumentCategoryTranslationDto> Translations { get; set; } = new();
}

public class DocumentCategoryUpsertDto
{
    [MinLength(1)]
    public List<DocumentCategoryTranslationUpsertDto> Translations { get; set; } = new();
}

public class DocumentTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Title { get; set; } = string.Empty;
    public uint FileId { get; set; }
    public string? FileUrl { get; set; }
    public string? FilePath { get; set; }
    public uint? FileSize { get; set; }
}

public class DocumentTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [Required]
    public uint FileId { get; set; }
}

public class DocumentDto
{
    public uint Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? PublishedDate { get; set; }
    public string? ExternalUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public Guid? Uuid { get; set; }
    public uint? CategoryId { get; set; }
    public uint OrderNo { get; set; }
    public List<DocumentTranslationDto> Translations { get; set; } = new();
}

public class DocumentUpsertDto
{
    public uint? CategoryId { get; set; }
    public DateTime? PublishedDate { get; set; }
    public uint OrderNo { get; set; }
    [Required]
    public string Status { get; set; } = "published";
    [MinLength(1)]
    public List<DocumentTranslationUpsertDto> Translations { get; set; } = new();
}
