using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("linkedin_posts")]
public class LinkedInPost
{
    [Key]
    public uint Id { get; set; }

    public uint CompanyId { get; set; }

    [Column("linkedin_post_urn")]
    [MaxLength(150)]
    public string LinkedInPostUrn { get; set; } = string.Empty;

    public string? PostText { get; set; }

    [MaxLength(20)]
    public string? MediaType { get; set; }

    public string? MediaUrl { get; set; }

    [MaxLength(500)]
    public string? PostUrl { get; set; }

    public DateTime PublishedAt { get; set; }

    public bool IsVisible { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(CompanyId))]
    public Company Company { get; set; } = null!;
}
