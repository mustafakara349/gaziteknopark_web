using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class InternshipApplicationCreateDto
{
    [Required, MaxLength(150)]
    public string FullName { get; set; } = string.Empty;
    [MaxLength(20)]
    public string? IdentityNo { get; set; }
    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [MaxLength(30)]
    public string? Phone { get; set; }
    [MaxLength(200)]
    public string? University { get; set; }
    [MaxLength(200)]
    public string? Department { get; set; }
    [MaxLength(20)]
    public string? ClassYear { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public uint? CvFileId { get; set; }
    public string? CoverLetter { get; set; }
}

public class InternshipApplicationDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? University { get; set; }
    public string? Department { get; set; }
    public string? ClassYear { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? AppliedAt { get; set; }
}
