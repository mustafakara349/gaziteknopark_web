using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("internship_applications")]
public class InternshipApplication
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    [MaxLength(150)]
    public string FirstName { get; set; } = string.Empty;
    [MaxLength(150)]
    public string LastName { get; set; } = string.Empty;
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [MaxLength(30)]
    public string? Phone { get; set; }
    [MaxLength(200)]
    public string? University { get; set; }
    [MaxLength(200)]
    public string? Department { get; set; }
    [MaxLength(20)]
    public string? ClassYear { get; set; }
    [Column(TypeName = "date")]
    public DateTime? UniversityStartDate { get; set; }
    public uint? CvFileId { get; set; }
    public uint? PhotoFileId { get; set; }
    public string? CoverLetter { get; set; }
    public InternshipTime? InternshipTime { get; set; }
    public InternshipType? InternshipType { get; set; }
    public DateTime? KvkkConsentAt { get; set; }
    public DateTime? ExplicitConsentAt { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Beklemede;
    public uint? ApprovedBy { get; set; }
    public DateTime? AppliedAt { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    [ForeignKey(nameof(CvFileId))]
    public FileAsset? CvFile { get; set; }
    
    [ForeignKey(nameof(PhotoFileId))]
    public FileAsset? PhotoFile { get; set; }
}
