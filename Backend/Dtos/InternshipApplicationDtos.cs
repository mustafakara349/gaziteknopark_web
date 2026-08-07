using System.ComponentModel.DataAnnotations;
using GaziTeknoparkApi.Models.Enums;
using Microsoft.AspNetCore.Http;

namespace GaziTeknoparkApi.Dtos;

public class InternshipApplicationFormDto
{
    [Required, MaxLength(150)]
    public string FirstName { get; set; } = string.Empty;
    [Required, MaxLength(150)]
    public string LastName { get; set; } = string.Empty;
    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Telefon alanı zorunludur.")]
    [RegularExpression(@"^(\+?90|0)?\s*5\d{2}\s*\d{3}\s*\d{2}\s*\d{2}$", ErrorMessage = "Geçerli bir telefon numarası giriniz (Örn: 05XX XXX XX XX).")]
    [MaxLength(30)]
    public string Phone { get; set; } = string.Empty;
    [Required, MaxLength(200)]
    public string University { get; set; } = string.Empty;
    [Required, MaxLength(200)]
    public string Department { get; set; } = string.Empty;
    [Required, MaxLength(20)]
    public string ClassYear { get; set; } = string.Empty;
    [Required]
    public DateTime UniversityStartDate { get; set; }
    [Required]
    public string InternshipTime { get; set; } = string.Empty;
    [Required]
    public string InternshipType { get; set; } = string.Empty;
    [Required, MaxLength(500)]
    public string AboutMe { get; set; } = string.Empty;
    
    [Required]
    public IFormFile Photo { get; set; } = null!;
    [Required]
    public IFormFile Cv { get; set; } = null!;
    
    [Required]
    public bool KvkkConsent { get; set; }
    [Required]
    public bool ExplicitConsent { get; set; }

    [Required]
    public string CaptchaToken { get; set; } = string.Empty;
}

public class UpdateApplicationStatusDto
{
    [Required(ErrorMessage = "Durum alanı zorunludur.")]
    public string Status { get; set; } = string.Empty;
}

public class InternshipApplicationDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? University { get; set; }
    public string? Department { get; set; }
    public string? ClassYear { get; set; }
    public DateTime? UniversityStartDate { get; set; }
    public string? InternshipTime { get; set; }
    public string? InternshipType { get; set; }
    public string? CoverLetter { get; set; }
    public DateTime? KvkkConsentAt { get; set; }
    public DateTime? ExplicitConsentAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? AppliedAt { get; set; }
    public uint? ApprovedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? CvFileId { get; set; }
    public string? CvFileUrl { get; set; }
    public uint? PhotoFileId { get; set; }
    public string? PhotoFileUrl { get; set; }
}

