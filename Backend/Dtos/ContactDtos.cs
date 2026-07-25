using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class ContactMessageDto
{
    public uint Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Subject { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class ContactMessageCreateDto
{
    [Required, MaxLength(150)]
    public string FullName { get; set; } = string.Empty;
    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [MaxLength(30)]
    public string? Phone { get; set; }
    [MaxLength(255)]
    public string? Subject { get; set; }
    [Required]
    public string Message { get; set; } = string.Empty;
}

public class ContactInfoTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string? Address { get; set; }
    public string? WorkingHours { get; set; }
}

public class ContactInfoTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string? Address { get; set; }
    [MaxLength(150)]
    public string? WorkingHours { get; set; }
}

public class ContactInfoDto
{
    public uint Id { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? MapEmbedUrl { get; set; }
    public List<ContactInfoTranslationDto> Translations { get; set; } = new();
}

public class ContactInfoUpsertDto
{
    [MaxLength(30)]
    public string? Phone { get; set; }
    [MaxLength(150), EmailAddress]
    public string? Email { get; set; }
    public string? MapEmbedUrl { get; set; }
    public List<ContactInfoTranslationUpsertDto> Translations { get; set; } = new();
}
