using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("social_links")]
public class SocialLink
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(100)]
    public string Icon { get; set; } = string.Empty;
    [MaxLength(255)]
    public string Url { get; set; } = string.Empty;
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
