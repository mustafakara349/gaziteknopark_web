using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("sliders")]
public class Slider
{
    [Key]
    public uint Id { get; set; }
    public uint? ImageFileId { get; set; }
    [MaxLength(255)]
    public string? LinkUrl { get; set; }
    [MaxLength(255)]
    public string? SecondaryButtonUrl { get; set; }
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    [ForeignKey(nameof(ImageFileId))]
    public FileAsset? ImageFile { get; set; }

    public ICollection<SliderTranslation> Translations { get; set; } = new List<SliderTranslation>();
}

[Table("slider_translations")]
public class SliderTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint SliderId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(100)]
    public string? Badge { get; set; }
    [MaxLength(255)]
    public string? Title { get; set; }
    [MaxLength(500)]
    public string? Description { get; set; }
    [MaxLength(100)]
    public string? ButtonText { get; set; }
    [MaxLength(100)]
    public string? SecondaryButtonText { get; set; }

    [ForeignKey(nameof(SliderId))]
    public Slider Slider { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}
