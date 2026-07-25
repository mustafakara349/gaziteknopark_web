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
[Route("api/news-categories")]
public class NewsCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public NewsCategoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<NewsCategoryDto>>> GetAll()
    {
        var categories = await _db.NewsCategories
            .Where(c => c.DeletedAt == null)
            .Include(c => c.Translations).ThenInclude(t => t.Language)
            .OrderBy(c => c.OrderNo)
            .ToListAsync();

        return Ok(categories.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<NewsCategoryDto>> Create(NewsCategoryUpsertDto dto)
    {
        var category = new NewsCategory { OrderNo = dto.OrderNo, CreatedAt = DateTime.UtcNow };
        foreach (var t in dto.Translations)
        {
            category.Translations.Add(new NewsCategoryTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        _db.NewsCategories.Add(category);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = category.Id }, Map(category));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<NewsCategoryDto>> Update(uint id, NewsCategoryUpsertDto dto)
    {
        var category = await _db.NewsCategories.Include(c => c.Translations)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (category is null) return NotFound();

        category.OrderNo = dto.OrderNo;
        category.UpdatedAt = DateTime.UtcNow;
        _db.NewsCategoryTranslations.RemoveRange(category.Translations);
        category.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            category.Translations.Add(new NewsCategoryTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(category));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var category = await _db.NewsCategories.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (category is null) return NotFound();
        category.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static NewsCategoryDto Map(NewsCategory c) => new()
    {
        Id = c.Id,
        OrderNo = c.OrderNo,
        Translations = c.Translations.Select(t => new NewsCategoryTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Name = t.Name
        }).ToList()
    };
}

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public NewsController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<NewsDto>>> GetAll([FromQuery] uint? categoryId)
    {
        var query = _db.NewsAnnouncements.Where(n => n.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(n => n.Status == ContentStatus.Published);
        }
        if (categoryId.HasValue)
        {
            query = query.Where(n => n.CategoryId == categoryId);
        }

        var news = await query
            .Include(n => n.Translations).ThenInclude(t => t.Language)
            .OrderByDescending(n => n.PublishedAt)
            .ToListAsync();

        return Ok(news.Select(Map).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NewsDto>> GetById(uint id)
    {
        var news = await _db.NewsAnnouncements
            .Include(n => n.Translations).ThenInclude(t => t.Language)
            .FirstOrDefaultAsync(n => n.Id == id && n.DeletedAt == null);

        if (news is null) return NotFound();
        if (!IsPrivileged && news.Status != ContentStatus.Published) return NotFound();

        news.Views++;
        await _db.SaveChangesAsync();

        return Ok(Map(news));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<NewsDto>> Create(NewsUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var news = new NewsAnnouncement
        {
            Uuid = Guid.NewGuid(),
            CategoryId = dto.CategoryId,
            CoverImageFileId = dto.CoverImageFileId,
            Status = status,
            PublishedAt = dto.PublishedAt,
            CreatedAt = DateTime.UtcNow
        };
        foreach (var t in dto.Translations)
        {
            news.Translations.Add(new NewsAnnouncementTranslation
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

        _db.NewsAnnouncements.Add(news);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = news.Id }, Map(news));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<NewsDto>> Update(uint id, NewsUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var news = await _db.NewsAnnouncements.Include(n => n.Translations)
            .FirstOrDefaultAsync(n => n.Id == id && n.DeletedAt == null);
        if (news is null) return NotFound();

        news.CategoryId = dto.CategoryId;
        news.CoverImageFileId = dto.CoverImageFileId;
        news.Status = status;
        news.PublishedAt = dto.PublishedAt;
        news.UpdatedAt = DateTime.UtcNow;

        _db.NewsAnnouncementTranslations.RemoveRange(news.Translations);
        news.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            news.Translations.Add(new NewsAnnouncementTranslation
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
        return Ok(Map(news));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var news = await _db.NewsAnnouncements.FirstOrDefaultAsync(n => n.Id == id && n.DeletedAt == null);
        if (news is null) return NotFound();
        news.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static NewsDto Map(NewsAnnouncement n) => new()
    {
        Id = n.Id,
        Uuid = n.Uuid,
        CategoryId = n.CategoryId,
        CoverImageFileId = n.CoverImageFileId,
        Status = n.Status.ToString(),
        PublishedAt = n.PublishedAt,
        Views = n.Views,
        CreatedAt = n.CreatedAt,
        Translations = n.Translations.Select(t => new NewsTranslationDto
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
