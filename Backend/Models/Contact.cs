using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("contact_messages")]
public class ContactMessage
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [MaxLength(30)]
    public string? Phone { get; set; }
    [MaxLength(255)]
    public string? Subject { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? CreatedAt { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
}

[Table("contact_info")]
public class ContactInfo
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(30)]
    public string? Phone { get; set; }
    [MaxLength(150)]
    public string? Email { get; set; }
    public string? MapEmbedUrl { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }

    public ICollection<ContactInfoTranslation> Translations { get; set; } = new List<ContactInfoTranslation>();
}

[Table("contact_info_translations")]
public class ContactInfoTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint ContactInfoId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string? Address { get; set; }
    [MaxLength(150)]
    public string? WorkingHours { get; set; }

    [ForeignKey(nameof(ContactInfoId))]
    public ContactInfo ContactInfo { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}
