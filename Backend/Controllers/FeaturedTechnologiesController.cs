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
[Route("api/featured-technologies")]
public class FeaturedTechnologiesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public FeaturedTechnologiesController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<FeaturedTechnologyDto>>> GetAll([FromQuery] uint? companyId)
    {
        var query = _db.FeaturedTechnologies.Where(f => f.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(f => f.Status == ContentStatus.Published);
        }
        if (companyId.HasValue)
        {
            query = query.Where(f => f.CompanyId == companyId);
        }

        var items = await query.Include(f => f.Translations).ThenInclude(t => t.Language)
            .OrderBy(f => f.OrderNo).ToListAsync();
        return Ok(items.Select(Map).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FeaturedTechnologyDto>> GetById(uint id)
    {
        var item = await _db.FeaturedTechnologies.Include(f => f.Translations).ThenInclude(t => t.Language)
            .FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null);
        if (item is null) return NotFound();
        if (!IsPrivileged && item.Status != ContentStatus.Published) return NotFound();
        return Ok(Map(item));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<FeaturedTechnologyDto>> Create(FeaturedTechnologyUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var item = new FeaturedTechnology
        {
            Uuid = Guid.NewGuid(),
            CompanyId = dto.CompanyId,
            CoverImageFileId = dto.CoverImageFileId,
            Status = status,
            PublishedAt = dto.PublishedAt,
            OrderNo = dto.OrderNo,
            CreatedAt = DateTime.UtcNow
        };
        foreach (var t in dto.Translations)
        {
            item.Translations.Add(new FeaturedTechnologyTranslation
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

        _db.FeaturedTechnologies.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, Map(item));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<FeaturedTechnologyDto>> Update(uint id, FeaturedTechnologyUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var item = await _db.FeaturedTechnologies.Include(f => f.Translations).FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null);
        if (item is null) return NotFound();

        item.CompanyId = dto.CompanyId;
        item.CoverImageFileId = dto.CoverImageFileId;
        item.Status = status;
        item.PublishedAt = dto.PublishedAt;
        item.OrderNo = dto.OrderNo;
        item.UpdatedAt = DateTime.UtcNow;

        _db.FeaturedTechnologyTranslations.RemoveRange(item.Translations);
        item.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            item.Translations.Add(new FeaturedTechnologyTranslation
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
        return Ok(Map(item));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var item = await _db.FeaturedTechnologies.FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null);
        if (item is null) return NotFound();
        item.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static FeaturedTechnologyDto Map(FeaturedTechnology f) => new()
    {
        Id = f.Id,
        Uuid = f.Uuid,
        CompanyId = f.CompanyId,
        CoverImageFileId = f.CoverImageFileId,
        Status = f.Status.ToString(),
        PublishedAt = f.PublishedAt,
        OrderNo = f.OrderNo,
        Translations = f.Translations.Select(t => new FeaturedTechnologyTranslationDto
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
