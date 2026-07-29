using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class TeamMemberTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string? Title { get; set; }
    public string? Bio { get; set; }
}

public class TeamMemberTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [MaxLength(150)]
    public string? Title { get; set; }
    public string? Bio { get; set; }
}

public class TeamMemberDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public string FullName { get; set; } = string.Empty;
    public uint? PhotoFileId { get; set; }
    public string? Email { get; set; }
    public string? LinkedinUrl { get; set; }
    public uint OrderNo { get; set; }
    public uint? ParentId { get; set; }
    public bool IsUnit { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<TeamMemberTranslationDto> Translations { get; set; } = new();
}

public class TeamMemberUpsertDto
{
    [Required, MaxLength(150)]
    public string FullName { get; set; } = string.Empty;
    public uint? PhotoFileId { get; set; }
    [MaxLength(255)]
    public string? Email { get; set; }
    [MaxLength(255)]
    public string? LinkedinUrl { get; set; }
    public uint OrderNo { get; set; }
    public uint? ParentId { get; set; }
    public bool IsUnit { get; set; }
    [Required]
    public string Status { get; set; } = "published";
    [MinLength(1)]
    public List<TeamMemberTranslationUpsertDto> Translations { get; set; } = new();
}
