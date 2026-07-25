using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class SettingTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string? Value { get; set; }
    public uint? FileId { get; set; }
}

public class SettingTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    public string? Value { get; set; }
    public uint? FileId { get; set; }
}

public class SettingDto
{
    public uint Id { get; set; }
    public string SettingKey { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsTranslatable { get; set; }
    public List<SettingTranslationDto> Translations { get; set; } = new();
}

public class SettingUpsertDto
{
    [Required, MaxLength(100)]
    public string SettingKey { get; set; } = string.Empty;
    [Required]
    public string Type { get; set; } = "text";
    public bool IsTranslatable { get; set; } = true;
    [MinLength(1)]
    public List<SettingTranslationUpsertDto> Translations { get; set; } = new();
}
