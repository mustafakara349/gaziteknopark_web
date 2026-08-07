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

public class FaqCategoryDto
{
    public uint Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; }
    public int FaqCount { get; set; }
}

public class FaqCategoryUpsertDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string Slug { get; set; } = string.Empty;

    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
}

public class TagDto
{
    public uint Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}

public class FaqDto
{
    public uint Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string? ButtonLink { get; set; }
    public string? ButtonText { get; set; }
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; }
    public uint? FaqCategoryId { get; set; }
    public FaqCategoryDto? FaqCategory { get; set; }
    public List<TagDto> Tags { get; set; } = new();
    public List<FaqTranslationDto> Translations { get; set; } = new();
}

public class FaqUpsertDto
{
    [Required]
    [MaxLength(255)]
    public string Question { get; set; } = string.Empty;

    [Required]
    public string Answer { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? ButtonLink { get; set; }

    [MaxLength(100)]
    public string? ButtonText { get; set; }

    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
    public uint? FaqCategoryId { get; set; }
    public List<string> Tags { get; set; } = new();
    public List<FaqTranslationUpsertDto> Translations { get; set; } = new();
}

public class FaqReorderDto
{
    public List<FaqOrderItemDto> Items { get; set; } = new();
}

public class FaqOrderItemDto
{
    public uint Id { get; set; }
    public uint OrderNo { get; set; }
}
