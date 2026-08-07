using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("faq_categories")]
public class FaqCategory
{
    [Key]
    public uint Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string Slug { get; set; } = string.Empty;

    public uint OrderNo { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<Faq> Faqs { get; set; } = new List<Faq>();
}
