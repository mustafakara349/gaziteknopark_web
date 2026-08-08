using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

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

    public LinkedInPostStatus Status { get; set; } = LinkedInPostStatus.Pending;

    public bool ShowOnHomepage { get; set; } = true;

    public bool ShowOnStories { get; set; } = true;

    public bool IsFeatured { get; set; } = false;

    [Column("approved_by")]
    public uint? ApprovedBy { get; set; }

    [ForeignKey(nameof(ApprovedBy))]
    public User? ApprovedByUser { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(CompanyId))]
    public Company Company { get; set; } = null!;
}
