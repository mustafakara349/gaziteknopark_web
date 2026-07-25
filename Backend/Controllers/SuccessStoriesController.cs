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
[Route("api/success-stories")]
public class SuccessStoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public SuccessStoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<SuccessStoryDto>>> GetAll([FromQuery] uint? companyId)
    {
        var query = _db.SuccessStories.Where(s => s.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(s => s.Status == ContentStatus.Published);
        }
        if (companyId.HasValue)
        {
            query = query.Where(s => s.CompanyId == companyId);
        }

        var stories = await query.Include(s => s.Translations).ThenInclude(t => t.Language)
            .OrderByDescending(s => s.PublishedDate).ToListAsync();
        return Ok(stories.Select(Map).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SuccessStoryDto>> GetById(uint id)
    {
        var story = await _db.SuccessStories.Include(s => s.Translations).ThenInclude(t => t.Language)
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (story is null) return NotFound();
        if (!IsPrivileged && story.Status != ContentStatus.Published) return NotFound();
        return Ok(Map(story));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<SuccessStoryDto>> Create(SuccessStoryUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var story = new SuccessStory
        {
            Uuid = Guid.NewGuid(),
            CompanyId = dto.CompanyId,
            CoverImageFileId = dto.CoverImageFileId,
            Status = status,
            PublishedDate = dto.PublishedDate,
            CreatedAt = DateTime.UtcNow
        };
        foreach (var t in dto.Translations)
        {
            story.Translations.Add(new SuccessStoryTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Slug = t.Slug,
                Summary = t.Summary,
                Content = t.Content,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription,
                MetaKeywords = t.MetaKeywords,
                CanonicalUrl = t.CanonicalUrl,
                OgImageFileId = t.OgImageFileId,
                SearchKeywords = t.SearchKeywords
            });
        }

        _db.SuccessStories.Add(story);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = story.Id }, Map(story));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<SuccessStoryDto>> Update(uint id, SuccessStoryUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var story = await _db.SuccessStories.Include(s => s.Translations).FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (story is null) return NotFound();

        story.CompanyId = dto.CompanyId;
        story.CoverImageFileId = dto.CoverImageFileId;
        story.Status = status;
        story.PublishedDate = dto.PublishedDate;
        story.UpdatedAt = DateTime.UtcNow;

        _db.SuccessStoryTranslations.RemoveRange(story.Translations);
        story.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            story.Translations.Add(new SuccessStoryTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Slug = t.Slug,
                Summary = t.Summary,
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
        return Ok(Map(story));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var story = await _db.SuccessStories.FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (story is null) return NotFound();
        story.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static SuccessStoryDto Map(SuccessStory s) => new()
    {
        Id = s.Id,
        Uuid = s.Uuid,
        CompanyId = s.CompanyId,
        CoverImageFileId = s.CoverImageFileId,
        Status = s.Status.ToString(),
        PublishedDate = s.PublishedDate,
        Translations = s.Translations.Select(t => new SuccessStoryTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Title = t.Title,
            Slug = t.Slug,
            Summary = t.Summary,
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
