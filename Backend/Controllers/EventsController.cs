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
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public EventsController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<EventDto>>> GetAll()
    {
        var query = _db.Events.Where(e => e.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(e => e.Status == ContentStatus.Published);
        }

        var events = await query.Include(e => e.Translations).ThenInclude(t => t.Language)
            .OrderByDescending(e => e.StartDate).ToListAsync();
        return Ok(events.Select(Map).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDto>> GetById(uint id)
    {
        var ev = await _db.Events.Include(e => e.Translations).ThenInclude(t => t.Language)
            .FirstOrDefaultAsync(e => e.Id == id && e.DeletedAt == null);
        if (ev is null) return NotFound();
        if (!IsPrivileged && ev.Status != ContentStatus.Published) return NotFound();
        return Ok(Map(ev));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<EventDto>> Create(EventUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var ev = new Event
        {
            Uuid = Guid.NewGuid(),
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            CoverImageFileId = dto.CoverImageFileId,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };
        foreach (var t in dto.Translations)
        {
            ev.Translations.Add(new EventTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Slug = t.Slug,
                Location = t.Location,
                Description = t.Description,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription,
                MetaKeywords = t.MetaKeywords,
                CanonicalUrl = t.CanonicalUrl,
                OgImageFileId = t.OgImageFileId,
                SearchKeywords = t.SearchKeywords
            });
        }

        _db.Events.Add(ev);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = ev.Id }, Map(ev));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<EventDto>> Update(uint id, EventUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var ev = await _db.Events.Include(e => e.Translations).FirstOrDefaultAsync(e => e.Id == id && e.DeletedAt == null);
        if (ev is null) return NotFound();

        ev.StartDate = dto.StartDate;
        ev.EndDate = dto.EndDate;
        ev.CoverImageFileId = dto.CoverImageFileId;
        ev.Status = status;
        ev.UpdatedAt = DateTime.UtcNow;

        _db.EventTranslations.RemoveRange(ev.Translations);
        ev.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            ev.Translations.Add(new EventTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Slug = t.Slug,
                Location = t.Location,
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
        return Ok(Map(ev));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var ev = await _db.Events.FirstOrDefaultAsync(e => e.Id == id && e.DeletedAt == null);
        if (ev is null) return NotFound();
        ev.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static EventDto Map(Event e) => new()
    {
        Id = e.Id,
        Uuid = e.Uuid,
        StartDate = e.StartDate,
        EndDate = e.EndDate,
        CoverImageFileId = e.CoverImageFileId,
        Status = e.Status.ToString(),
        Translations = e.Translations.Select(t => new EventTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Title = t.Title,
            Slug = t.Slug,
            Location = t.Location,
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
