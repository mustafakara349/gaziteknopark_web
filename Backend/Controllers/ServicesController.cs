using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Helpers;
using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/services")]
public class ServicesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ServicesController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<ServiceDto>>> GetAll()
    {
        var query = _db.Services.Where(s => s.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(s => s.Status == ContentStatus.Published);
        }

        var services = await query.Include(s => s.Translations).ThenInclude(t => t.Language)
            .OrderBy(s => s.OrderNo).ToListAsync();
        return Ok(services.Select(Map).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceDto>> GetById(uint id)
    {
        var service = await _db.Services.Include(s => s.Translations).ThenInclude(t => t.Language)
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (service is null) return NotFound();
        if (!IsPrivileged && service.Status != ContentStatus.Published) return NotFound();
        return Ok(Map(service));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<ServiceDto>> Create(ServiceUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var service = new Service { Uuid = Guid.NewGuid(), Icon = dto.Icon, OrderNo = dto.OrderNo, Status = status, CreatedAt = DateTime.UtcNow };
        foreach (var t in dto.Translations)
        {
            service.Translations.Add(new ServiceTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Description = t.Description,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription,
                MetaKeywords = t.MetaKeywords,
                CanonicalUrl = t.CanonicalUrl,
                OgImageFileId = t.OgImageFileId,
                SearchKeywords = t.SearchKeywords
            });
        }

        _db.Services.Add(service);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = service.Id }, Map(service));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ServiceDto>> Update(uint id, ServiceUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var service = await _db.Services.Include(s => s.Translations).FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (service is null) return NotFound();

        service.Icon = dto.Icon;
        service.OrderNo = dto.OrderNo;
        service.Status = status;
        service.UpdatedAt = DateTime.UtcNow;

        _db.ServiceTranslations.RemoveRange(service.Translations);
        service.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            service.Translations.Add(new ServiceTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Description = t.Description,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription,
                MetaKeywords = t.MetaKeywords,
                CanonicalUrl = t.CanonicalUrl,
                OgImageFileId = t.OgImageFileId,
                SearchKeywords = t.SearchKeywords
            });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(service));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var service = await _db.Services.FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (service is null) return NotFound();
        service.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static ServiceDto Map(Service s) => new()
    {
        Id = s.Id,
        Uuid = s.Uuid,
        Icon = s.Icon,
        OrderNo = s.OrderNo,
        Status = s.Status.ToString(),
        Translations = s.Translations.Select(t => new ServiceTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Title = t.Title,
            Description = t.Description,
            MetaTitle = t.MetaTitle,
            MetaDescription = t.MetaDescription,
            MetaKeywords = t.MetaKeywords,
            CanonicalUrl = t.CanonicalUrl,
            OgImageFileId = t.OgImageFileId,
            SearchKeywords = t.SearchKeywords
        }).ToList()
    };
}
