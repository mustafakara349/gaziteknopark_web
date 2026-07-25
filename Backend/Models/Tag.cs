using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("tags")]
public class Tag
{
    [Key]
    public uint Id { get; set; }
    public uint? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<TagTranslation> Translations { get; set; } = new List<TagTranslation>();
    public ICollection<Taggable> Taggables { get; set; } = new List<Taggable>();
}

[Table("tag_translations")]
public class TagTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint TagId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [ForeignKey(nameof(TagId))]
    public Tag Tag { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}

[Table("taggables")]
public class Taggable
{
    [Key]
    public uint Id { get; set; }
    public uint TagId { get; set; }
    [MaxLength(50)]
    public string ModelType { get; set; } = string.Empty;
    public uint ModelId { get; set; }

    [ForeignKey(nameof(TagId))]
    public Tag Tag { get; set; } = null!;
}
