using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("partners")]
public class Partner
{
    [Key]
    public uint Id { get; set; }
    public uint? LogoFileId { get; set; }
    [MaxLength(255)]
    public string? Url { get; set; }
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    [ForeignKey(nameof(LogoFileId))]
    public FileAsset? LogoFile { get; set; }

    public ICollection<PartnerTranslation> Translations { get; set; } = new List<PartnerTranslation>();
}

[Table("partner_translations")]
public class PartnerTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint PartnerId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    [MaxLength(500)]
    public string? Description { get; set; }

    [ForeignKey(nameof(PartnerId))]
    public Partner Partner { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}
