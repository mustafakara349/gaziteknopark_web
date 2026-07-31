using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class CompanyCategoryTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class CompanyCategoryTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;
}

public class CompanyCategoryDto
{
    public uint Id { get; set; }
    public string? Color { get; set; }
    public List<CompanyCategoryTranslationDto> Translations { get; set; } = new();
}

public class CompanyCategoryUpsertDto
{
    [MaxLength(20)]
    public string? Color { get; set; }
    [MinLength(1)]
    public List<CompanyCategoryTranslationUpsertDto> Translations { get; set; } = new();
}

public class ActivityAreaTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class ActivityAreaTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;
}

public class ActivityAreaDto
{
    public uint Id { get; set; }
    public List<ActivityAreaTranslationDto> Translations { get; set; } = new();
}

public class ActivityAreaUpsertDto
{
    [MinLength(1)]
    public List<ActivityAreaTranslationUpsertDto> Translations { get; set; } = new();
}

public class CompanyTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string? Description { get; set; }
}

public class CompanyTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    public string? Description { get; set; }
}

public class CompanyDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public string Name { get; set; } = string.Empty;
    public uint? LogoFileId { get; set; }
    public string? Website { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public int? FoundedYear { get; set; }
    public uint? EmployeeCount { get; set; }
    public string? OfficeNo { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<uint> CategoryIds { get; set; } = new();
    public List<uint> ActivityAreaIds { get; set; } = new();
    public List<CompanyTranslationDto> Translations { get; set; } = new();
}

public class CompanyUpsertDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    public uint? LogoFileId { get; set; }
    [MaxLength(255)]
    public string? Website { get; set; }
    [MaxLength(150), EmailAddress]
    public string? Email { get; set; }
    [MaxLength(30)]
    public string? Phone { get; set; }
    [MaxLength(255)]
    public string? Address { get; set; }
    public int? FoundedYear { get; set; }
    public uint? EmployeeCount { get; set; }
    [MaxLength(50)]
    public string? OfficeNo { get; set; }
    [Required]
    public string Status { get; set; } = "aktif";
    public List<uint> CategoryIds { get; set; } = new();
    public List<uint> ActivityAreaIds { get; set; } = new();
    public List<CompanyTranslationUpsertDto> Translations { get; set; } = new();
}
