using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("faq")]
public class Faq
{
    [Key]
    public uint Id { get; set; }

    public uint? FaqCategoryId { get; set; }

    [ForeignKey(nameof(FaqCategoryId))]
    public FaqCategory? FaqCategory { get; set; }

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
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<FaqTranslation> Translations { get; set; } = new List<FaqTranslation>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
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
