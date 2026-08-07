using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using GaziTeknoparkApi.Helpers;
using GaziTeknoparkApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/internship-applications")]
public class InternshipApplicationsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IWebHostEnvironment _env;
    private readonly IRecaptchaService _recaptcha;

    public InternshipApplicationsController(
        ApplicationDbContext db,
        IWebHostEnvironment env,
        IRecaptchaService recaptcha)
    {
        _db = db;
        _env = env;
        _recaptcha = recaptcha;
    }

    [HttpPost]
    [EnableRateLimiting("internship-submit")]
    public async Task<ActionResult<InternshipApplicationDto>> Create([FromForm] InternshipApplicationFormDto dto)
    {
        // reCAPTCHA Sunucu Tarafı Doğrulaması
        if (string.IsNullOrEmpty(dto.CaptchaToken) || !await _recaptcha.VerifyAsync(dto.CaptchaToken))
        {
            return BadRequest("reCAPTCHA doğrulaması başarısız.");
        }

        // KVKK Onay Kontrolleri
        if (!dto.KvkkConsent || !dto.ExplicitConsent)
        {
            return BadRequest("KVKK Aydınlatma ve Açık Rıza metinlerinin onaylanması zorunludur.");
        }

        // Üniversiteye Başlangıç Tarihi Mantık Kontrolü
        var today = DateTime.UtcNow.Date;
        if (dto.UniversityStartDate < new DateTime(1970, 1, 1) || dto.UniversityStartDate.Date > today)
        {
            return BadRequest("Geçersiz üniversite başlangıç tarihi. Tarih bugünden ileri veya 1970 öncesi olamaz.");
        }

        // ── Fotoğraf Güvenlik ve Boyut Doğrulaması ──
        var allowedPhotoExts = new[] { ".jpg", ".jpeg", ".png" };
        var allowedPhotoMimes = new[] { "image/jpeg", "image/png" };
        var photoExt = Path.GetExtension(dto.Photo.FileName).ToLowerInvariant();
        var photoMime = dto.Photo.ContentType.ToLowerInvariant();

        if (!allowedPhotoExts.Contains(photoExt)
            || !allowedPhotoMimes.Contains(photoMime)
            || dto.Photo.Length > 5 * 1024 * 1024)
        {
            return BadRequest("Fotoğraf sadece JPG/PNG formatında ve en fazla 5MB büyüklüğünde olabilir.");
        }

        // ── CV Güvenlik ve Boyut Doğrulaması ──
        var cvExt = Path.GetExtension(dto.Cv.FileName).ToLowerInvariant();
        var cvMime = dto.Cv.ContentType.ToLowerInvariant();

        if (cvExt != ".pdf"
            || cvMime != "application/pdf"
            || dto.Cv.Length > 10 * 1024 * 1024)
        {
            return BadRequest("CV sadece PDF formatında ve en fazla 10MB büyüklüğünde olabilir.");
        }

        // ── Atomik Dosya Kaydetme ──
        // Önce dosyaları kaydet, ardından başvuruyu kaydet.
        // Başvuru kaydı başarısız olursa dosyalar temizlenir.
        uint? photoFileId = null;
        uint? cvFileId = null;

        try
        {
            photoFileId = await SaveFileAsync(dto.Photo);
            cvFileId = await SaveFileAsync(dto.Cv);

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

            // Dosya URL'leri için navigation property'leri yükle
            await _db.Entry(application).Reference(a => a.CvFile).LoadAsync();
            await _db.Entry(application).Reference(a => a.PhotoFile).LoadAsync();

            return CreatedAtAction(nameof(GetById), new { id = application.Id }, Map(application));
        }
        catch
        {
            // Başvuru kaydı başarısız olursa yüklenen dosyaları temizle (orphan önleme)
            await CleanupFileAsync(photoFileId);
            await CleanupFileAsync(cvFileId);
            throw;
        }
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpGet]
    public async Task<ActionResult<List<InternshipApplicationDto>>> GetAll()
    {
        var applications = await _db.InternshipApplications
            .Where(a => a.DeletedAt == null)
            .Include(a => a.CvFile)
            .Include(a => a.PhotoFile)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        return Ok(applications.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpGet("{id}")]
    public async Task<ActionResult<InternshipApplicationDto>> GetById(uint id)
    {
        var application = await _db.InternshipApplications
            .Include(a => a.CvFile)
            .Include(a => a.PhotoFile)
            .FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);

        if (application is null) return NotFound();
        return Ok(Map(application));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<InternshipApplicationDto>> UpdateStatus(uint id, [FromBody] UpdateApplicationStatusDto dto)
    {
        var application = await _db.InternshipApplications
            .Include(a => a.CvFile)
            .Include(a => a.PhotoFile)
            .FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);

        if (application is null) return NotFound();

        if (!EnumParsing.TryParse<ApplicationStatus>(dto.Status, out var newStatus))
            return BadRequest($"Geçersiz durum değeri: '{dto.Status}'. Geçerli değerler: Beklemede, Incelendi, Kabul, Red.");

        application.Status = newStatus;
        application.UpdatedAt = DateTime.UtcNow;

        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("id")?.Value
            ?? User.FindFirst("sub")?.Value;
        if (uint.TryParse(userIdStr, out var currentUserId))
        {
            application.UpdatedBy = currentUserId;
            if (newStatus == ApplicationStatus.Kabul)
            {
                application.ApprovedBy = currentUserId;
            }
        }

        await _db.SaveChangesAsync();

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

    // ── Private Helpers ──

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

    private async Task CleanupFileAsync(uint? fileId)
    {
        if (fileId is null) return;
        try
        {
            var asset = await _db.Files.FindAsync(fileId);
            if (asset is null) return;

            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var fullPath = Path.Combine(webRoot, asset.Path.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }

            _db.Files.Remove(asset);
            await _db.SaveChangesAsync();
        }
        catch
        {
            // Cleanup hatası asıl hatanın üstüne yazmasın; loglama yeterli
        }
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
        CoverLetter = a.CoverLetter,
        KvkkConsentAt = a.KvkkConsentAt,
        ExplicitConsentAt = a.ExplicitConsentAt,
        Status = a.Status.ToString(),
        AppliedAt = a.AppliedAt,
        ApprovedBy = a.ApprovedBy,
        UpdatedBy = a.UpdatedBy,
        UpdatedAt = a.UpdatedAt,
        CvFileId = a.CvFileId,
        CvFileUrl = a.CvFile?.Path,
        PhotoFileId = a.PhotoFileId,
        PhotoFileUrl = a.PhotoFile?.Path
    };
}
