using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using GaziTeknoparkApi.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/internship-applications")]
public class InternshipApplicationsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IWebHostEnvironment _env;

    public InternshipApplicationsController(ApplicationDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    [HttpPost]
    public async Task<ActionResult<InternshipApplicationDto>> Create([FromForm] InternshipApplicationFormDto dto)
    {
        // Temel reCAPTCHA kontrolü
        if (string.IsNullOrEmpty(dto.CaptchaToken))
        {
            return BadRequest("reCAPTCHA doğrulaması başarısız.");
        }

        // KVKK Onay Kontrolleri
        if (!dto.KvkkConsent || !dto.ExplicitConsent)
        {
            return BadRequest("KVKK Aydınlatma ve Açık Rıza metinlerinin onaylanması zorunludur.");
        }

        // Üniversiteye Başlangıç Tarihi Mantık Kontrolü
        if (dto.UniversityStartDate < new DateTime(1970, 1, 1) || dto.UniversityStartDate > DateTime.UtcNow)
        {
            return BadRequest("Geçersiz üniversite başlangıç tarihi.");
        }

        // Fotoğraf Güvenlik ve Boyut Doğrulaması
        var allowedPhotoExts = new[] { ".jpg", ".jpeg", ".png" };
        var photoExt = Path.GetExtension(dto.Photo.FileName).ToLowerInvariant();
        if (!allowedPhotoExts.Contains(photoExt) || dto.Photo.Length > 5 * 1024 * 1024)
        {
            return BadRequest("Fotoğraf sadece JPG/PNG formatında ve en fazla 5MB büyüklüğünde olabilir.");
        }

        // CV Güvenlik ve Boyut Doğrulaması
        var cvExt = Path.GetExtension(dto.Cv.FileName).ToLowerInvariant();
        if (cvExt != ".pdf" || dto.Cv.Length > 10 * 1024 * 1024)
        {
            return BadRequest("CV sadece PDF formatında ve en fazla 10MB büyüklüğünde olabilir.");
        }

        uint? photoFileId = await SaveFileAsync(dto.Photo);
        uint? cvFileId = await SaveFileAsync(dto.Cv);

        var application = new InternshipApplication
        {
            Uuid = Guid.NewGuid(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            University = dto.University,
            Department = dto.Department,
            ClassYear = dto.ClassYear,
            UniversityStartDate = dto.UniversityStartDate,
            InternshipTime = EnumParsing.TryParse<InternshipTime>(dto.InternshipTime?.Replace("-", ""), out var time) ? time : null,
            InternshipType = EnumParsing.TryParse<InternshipType>(dto.InternshipType?.Replace("-", ""), out var type) ? type : null,
            CoverLetter = dto.AboutMe,
            PhotoFileId = photoFileId,
            CvFileId = cvFileId,
            KvkkConsentAt = DateTime.UtcNow,
            ExplicitConsentAt = DateTime.UtcNow,
            Status = ApplicationStatus.Beklemede,
            AppliedAt = DateTime.UtcNow
        };

        _db.InternshipApplications.Add(application);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = application.Id }, Map(application));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpGet]
    public async Task<ActionResult<List<InternshipApplicationDto>>> GetAll()
    {
        var applications = await _db.InternshipApplications.Where(a => a.DeletedAt == null)
            .OrderByDescending(a => a.AppliedAt).ToListAsync();
        return Ok(applications.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpGet("{id}")]
    public async Task<ActionResult<InternshipApplicationDto>> GetById(uint id)
    {
        var application = await _db.InternshipApplications.FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        if (application is null) return NotFound();
        return Ok(Map(application));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var application = await _db.InternshipApplications.FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        if (application is null) return NotFound();
        application.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<uint> SaveFileAsync(IFormFile file)
    {
        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploadsFolder = Path.Combine(webRoot, "uploads", "internships");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileAsset = new FileAsset
        {
            Uuid = Guid.NewGuid(),
            Name = uniqueFileName,
            OriginalName = file.FileName,
            Path = $"/uploads/internships/{uniqueFileName}",
            Size = (uint)file.Length,
            Mime = file.ContentType,
            CreatedAt = DateTime.UtcNow
        };

        _db.Files.Add(fileAsset);
        await _db.SaveChangesAsync();
        return fileAsset.Id;
    }

    private static InternshipApplicationDto Map(InternshipApplication a) => new()
    {
        Id = a.Id,
        Uuid = a.Uuid,
        FirstName = a.FirstName,
        LastName = a.LastName,
        Email = a.Email,
        Phone = a.Phone,
        University = a.University,
        Department = a.Department,
        ClassYear = a.ClassYear,
        UniversityStartDate = a.UniversityStartDate,
        InternshipTime = a.InternshipTime?.ToString(),
        InternshipType = a.InternshipType?.ToString(),
        KvkkConsentAt = a.KvkkConsentAt,
        ExplicitConsentAt = a.ExplicitConsentAt,
        Status = a.Status.ToString(),
        AppliedAt = a.AppliedAt
    };
}
