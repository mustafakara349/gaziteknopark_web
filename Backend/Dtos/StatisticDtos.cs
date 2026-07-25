using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class StatisticTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Label { get; set; } = string.Empty;
}

public class StatisticTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(150)]
    public string Label { get; set; } = string.Empty;
}

public class StatisticDto
{
    public uint Id { get; set; }
    public string Value { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; }
    public List<StatisticTranslationDto> Translations { get; set; } = new();
}

public class StatisticUpsertDto
{
    [Required, MaxLength(50)]
    public string Value { get; set; } = string.Empty;
    [MaxLength(255)]
    public string? Icon { get; set; }
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
    [MinLength(1)]
    public List<StatisticTranslationUpsertDto> Translations { get; set; } = new();
}
