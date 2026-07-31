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

    // Etkinlikler sayfası kart grid'i için: seçili dile göre tekil çeviri, sayfalama, arama,
    // zaman durumu (yaklaşan/geçmiş) ve sıralama destekli liste.
    [HttpGet("list")]
    public async Task<ActionResult<PagedResultDto<EventListDto>>> GetList(
        [FromQuery] uint? languageId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 9,
        [FromQuery] string? search = null,
        [FromQuery] string when = "upcoming",
        [FromQuery] string sort = "date_asc")
    {
        var resolvedLanguageId = await ResolveLanguageIdAsync(languageId);
        if (resolvedLanguageId is null)
        {
            return Ok(new PagedResultDto<EventListDto> { Page = page, PageSize = pageSize });
        }

        page = page < 1 ? 1 : page;
        pageSize = pageSize is < 1 or > 100 ? 9 : pageSize;

        var query = _db.Events
            .Where(e => e.DeletedAt == null && e.Status == ContentStatus.Published)
            .Where(e => e.Translations.Any(t => t.LanguageId == resolvedLanguageId));

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(e => e.Translations.Any(t =>
                t.LanguageId == resolvedLanguageId &&
                (t.Title.Contains(search) ||
                 (t.Description != null && t.Description.Contains(search)) ||
                 (t.Location != null && t.Location.Contains(search)))));
        }

        if (when == "upcoming")
        {
            var now = DateTime.UtcNow;
            query = query.Where(e => e.StartDate != null && e.StartDate >= now);
        }
        else if (when == "past")
        {
            var now = DateTime.UtcNow;
            query = query.Where(e => e.StartDate != null && e.StartDate < now);
        }

        query = sort == "date_desc"
            ? query.OrderByDescending(e => e.StartDate).ThenByDescending(e => e.Id)
            : query.OrderBy(e => e.StartDate).ThenBy(e => e.Id);

        var totalItems = await query.CountAsync();

        var pageEvents = await query
            .Include(e => e.Translations)
            .Include(e => e.CoverImageFile)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = pageEvents.Select(e =>
        {
            var t = e.Translations.First(tr => tr.LanguageId == resolvedLanguageId);
            return new EventListDto
            {
                Id = e.Id,
                Title = t.Title,
                Slug = t.Slug,
                Summary = TextHelper.ToPlainSummary(t.Description),
                Location = t.Location,
                CoverImageUrl = FileUrlHelper.ToAbsoluteUrl(Request, e.CoverImageFile),
                StartDate = e.StartDate,
                StartTime = e.StartDate?.ToString("HH:mm")
            };
        }).ToList();

        return Ok(new PagedResultDto<EventListDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        });
    }

    // Etkinlik detay sayfası için slug + dile göre tam içerik ve SEO alanları.
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<EventDetailDto>> GetBySlug(string slug, [FromQuery] uint? languageId)
    {
        var resolvedLanguageId = await ResolveLanguageIdAsync(languageId);
        if (resolvedLanguageId is null) return NotFound();

        var ev = await _db.Events
            .Include(e => e.Translations)
            .Include(e => e.CoverImageFile)
            .Where(e => e.DeletedAt == null && e.Status == ContentStatus.Published)
            .FirstOrDefaultAsync(e => e.Translations.Any(t => t.LanguageId == resolvedLanguageId && t.Slug == slug));

        if (ev is null) return NotFound();

        var translation = ev.Translations.First(t => t.LanguageId == resolvedLanguageId);
        var ogImageFile = translation.OgImageFileId.HasValue
            ? await _db.Files.FirstOrDefaultAsync(f => f.Id == translation.OgImageFileId)
            : null;

        return Ok(new EventDetailDto
        {
            Id = ev.Id,
            Title = translation.Title,
            Slug = translation.Slug,
            Location = translation.Location,
            Description = translation.Description,
            CoverImageUrl = FileUrlHelper.ToAbsoluteUrl(Request, ev.CoverImageFile),
            StartDate = ev.StartDate,
            EndDate = ev.EndDate,
            MetaTitle = translation.MetaTitle,
            MetaDescription = translation.MetaDescription,
            MetaKeywords = translation.MetaKeywords,
            CanonicalUrl = translation.CanonicalUrl,
            OgImageUrl = FileUrlHelper.ToAbsoluteUrl(Request, ogImageFile),
            SearchKeywords = translation.SearchKeywords
        });
    }

    // languageId query parametresi verilmezse veritabanındaki varsayılan (IsDefault) aktif dile düşer.
    private async Task<uint?> ResolveLanguageIdAsync(uint? languageId)
    {
        if (languageId.HasValue) return languageId;

        var defaultLanguage = await _db.Languages
            .Where(l => l.IsActive)
            .OrderByDescending(l => l.IsDefault)
            .FirstOrDefaultAsync();

        return defaultLanguage?.Id;
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
