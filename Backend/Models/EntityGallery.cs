using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("entity_gallery")]
public class EntityGallery
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(50)]
    public string ModelType { get; set; } = string.Empty;
    public uint ModelId { get; set; }
    public uint FileId { get; set; }
    [MaxLength(255)]
    public string? Caption { get; set; }
    public uint OrderNo { get; set; }
    public DateTime? CreatedAt { get; set; }
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    [ForeignKey(nameof(FileId))]
    public FileAsset File { get; set; } = null!;
}
