using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("statistics")]
public class Statistic
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(50)]
    public string Value { get; set; } = string.Empty;
    [MaxLength(255)]
    public string? Icon { get; set; }
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<StatisticTranslation> Translations { get; set; } = new List<StatisticTranslation>();
}

[Table("statistics_translations")]
public class StatisticTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint StatisticId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(150)]
    public string Label { get; set; } = string.Empty;

    [ForeignKey(nameof(StatisticId))]
    public Statistic Statistic { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}
