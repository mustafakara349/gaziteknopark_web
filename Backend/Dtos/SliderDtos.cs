using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class SliderTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ButtonText { get; set; }
}

public class SliderTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string? Title { get; set; }
    [MaxLength(500)]
    public string? Description { get; set; }
    [MaxLength(100)]
    public string? ButtonText { get; set; }
}

public class SliderDto
{
    public uint Id { get; set; }
    public uint? ImageFileId { get; set; }
    public string? LinkUrl { get; set; }
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; }
    public List<SliderTranslationDto> Translations { get; set; } = new();
}

public class SliderUpsertDto
{
    public uint? ImageFileId { get; set; }
    [MaxLength(255)]
    public string? LinkUrl { get; set; }
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
    [MinLength(1)]
    public List<SliderTranslationUpsertDto> Translations { get; set; } = new();
}
