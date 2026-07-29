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
[Route("api/pages")]
public class PagesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public PagesController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<PageDto>>> GetAll()
    {
        var query = _db.Pages.Where(p => p.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(p => p.Status == ContentStatus.Published);
        }

        var pages = await query.Include(p => p.Translations).ThenInclude(t => t.Language).ToListAsync();
        return Ok(pages.Select(Map).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PageDto>> GetById(uint id)
    {
        var page = await _db.Pages.Include(p => p.Translations).ThenInclude(t => t.Language)
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);
        if (page is null) return NotFound();
        if (!IsPrivileged && page.Status != ContentStatus.Published) return NotFound();
        return Ok(Map(page));
    }

    [HttpGet("by-slug/{slug}")]
    public async Task<ActionResult<PageDto>> GetBySlug(string slug, [FromQuery] uint? languageId)
    {
        var query = _db.Pages.Include(p => p.Translations).ThenInclude(t => t.Language)
            .Where(p => p.DeletedAt == null && p.Translations.Any(t => t.Slug == slug && (!languageId.HasValue || t.LanguageId == languageId)));
        var page = await query.FirstOrDefaultAsync();
        if (page is null) return NotFound();
        if (!IsPrivileged && page.Status != ContentStatus.Published) return NotFound();
        return Ok(Map(page));
    }

    /// <summary>
    /// Public endpoint for rendering a single static page (e.g. "Hakkımızda") by slug and language.
    /// Returns only published content mapped to a flat, frontend-friendly DTO.
    /// </summary>
    [HttpGet("content/{slug}")]
    public async Task<ActionResult<PageContentDto>> GetContentBySlug(string slug, [FromQuery] uint? languageId)
    {
        // languageId verilmemişse önce varsayılan (is_default) dile, o da tanımlı değilse
        // birincil dile (language_id = 1) düş.
        var resolvedLanguageId = languageId
            ?? await _db.Languages.Where(l => l.IsActive && l.IsDefault).Select(l => (uint?)l.Id).FirstOrDefaultAsync()
            ?? 1u;

        var translation = await _db.PageTranslations
            .Include(t => t.Page)
            .FirstOrDefaultAsync(t =>
                t.Slug == slug &&
                t.LanguageId == resolvedLanguageId &&
                t.Page.DeletedAt == null);

        if (translation is null) return NotFound();

        // Durum karşılaştırması, veritabanındaki harf durumundan (örn. "published" / "Published")
        // tamamen bağımsız olsun diye açıkça case-insensitive string karşılaştırması olarak yapılır.
        var isPublished = string.Equals(translation.Page.Status.ToString(), nameof(ContentStatus.Published), StringComparison.OrdinalIgnoreCase);
        if (!isPublished) return NotFound();

        return Ok(new PageContentDto
        {
            Slug = translation.Slug,
            Title = translation.Title,
            Content = translation.Content,
            MetaTitle = translation.MetaTitle,
            MetaDescription = translation.MetaDescription
        });
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<PageDto>> Create(PageUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var page = new Page { Uuid = Guid.NewGuid(), ImageFileId = dto.ImageFileId, Status = status, CreatedAt = DateTime.UtcNow };
        foreach (var t in dto.Translations)
        {
            page.Translations.Add(new PageTranslation
            {
                LanguageId = t.LanguageId,
                Slug = t.Slug,
                Title = t.Title,
                Content = t.Content,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription,
                MetaKeywords = t.MetaKeywords,
                CanonicalUrl = t.CanonicalUrl,
                OgImageFileId = t.OgImageFileId,
                SearchKeywords = t.SearchKeywords
            });
        }

        _db.Pages.Add(page);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = page.Id }, Map(page));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<PageDto>> Update(uint id, PageUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var page = await _db.Pages.Include(p => p.Translations).FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);
        if (page is null) return NotFound();

        page.ImageFileId = dto.ImageFileId;
        page.Status = status;
        page.UpdatedAt = DateTime.UtcNow;

        _db.PageTranslations.RemoveRange(page.Translations);
        page.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            page.Translations.Add(new PageTranslation
            {
                LanguageId = t.LanguageId,
                Slug = t.Slug,
                Title = t.Title,
                Content = t.Content,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription,
                MetaKeywords = t.MetaKeywords,
                CanonicalUrl = t.CanonicalUrl,
                OgImageFileId = t.OgImageFileId,
                SearchKeywords = t.SearchKeywords
            });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(page));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var page = await _db.Pages.FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);
        if (page is null) return NotFound();
        page.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static PageDto Map(Page p) => new()
    {
        Id = p.Id,
        Uuid = p.Uuid,
        ImageFileId = p.ImageFileId,
        Status = p.Status.ToString(),
        Translations = p.Translations.Select(t => new PageTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Slug = t.Slug,
            Title = t.Title,
            Content = t.Content,
            MetaTitle = t.MetaTitle,
            MetaDescription = t.MetaDescription,
            MetaKeywords = t.MetaKeywords,
            CanonicalUrl = t.CanonicalUrl,
            OgImageFileId = t.OgImageFileId,
            SearchKeywords = t.SearchKeywords
        }).ToList()
    };
}
