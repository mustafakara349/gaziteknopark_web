using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class FaqTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
}

public class FaqTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(500)]
    public string Question { get; set; } = string.Empty;
    [Required]
    public string Answer { get; set; } = string.Empty;
}

public class FaqDto
{
    public uint Id { get; set; }
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; }
    public List<FaqTranslationDto> Translations { get; set; } = new();
}

public class FaqUpsertDto
{
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
    [MinLength(1)]
    public List<FaqTranslationUpsertDto> Translations { get; set; } = new();
}
