using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("faq")]
public class Faq
{
    [Key]
    public uint Id { get; set; }
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<FaqTranslation> Translations { get; set; } = new List<FaqTranslation>();
}

[Table("faq_translations")]
public class FaqTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint FaqId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(500)]
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;

    [ForeignKey(nameof(FaqId))]
    public Faq Faq { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}
