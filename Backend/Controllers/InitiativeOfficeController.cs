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
[Route("api/initiative-office")]
public class InitiativeOfficeController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public InitiativeOfficeController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<InitiativeOfficeDto>>> GetAll()
    {
        var query = _db.InitiativeOffices.Where(i => i.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(i => i.Status == ContentStatus.Published);
        }

        var items = await query.Include(i => i.Translations).ThenInclude(t => t.Language).ToListAsync();
        return Ok(items.Select(Map).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InitiativeOfficeDto>> GetById(uint id)
    {
        var item = await _db.InitiativeOffices.Include(i => i.Translations).ThenInclude(t => t.Language)
            .FirstOrDefaultAsync(i => i.Id == id && i.DeletedAt == null);
        if (item is null) return NotFound();
        if (!IsPrivileged && item.Status != ContentStatus.Published) return NotFound();
        return Ok(Map(item));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<InitiativeOfficeDto>> Create(InitiativeOfficeUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var item = new InitiativeOffice { Uuid = Guid.NewGuid(), ImageFileId = dto.ImageFileId, Status = status, CreatedAt = DateTime.UtcNow };
        foreach (var t in dto.Translations)
        {
            item.Translations.Add(new InitiativeOfficeTranslation
            {
                LanguageId = t.LanguageId,
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

        _db.InitiativeOffices.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, Map(item));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<InitiativeOfficeDto>> Update(uint id, InitiativeOfficeUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var item = await _db.InitiativeOffices.Include(i => i.Translations).FirstOrDefaultAsync(i => i.Id == id && i.DeletedAt == null);
        if (item is null) return NotFound();

        item.ImageFileId = dto.ImageFileId;
        item.Status = status;
        item.UpdatedAt = DateTime.UtcNow;

        _db.InitiativeOfficeTranslations.RemoveRange(item.Translations);
        item.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            item.Translations.Add(new InitiativeOfficeTranslation
            {
                LanguageId = t.LanguageId,
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
        return Ok(Map(item));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var item = await _db.InitiativeOffices.FirstOrDefaultAsync(i => i.Id == id && i.DeletedAt == null);
        if (item is null) return NotFound();
        item.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static InitiativeOfficeDto Map(InitiativeOffice i) => new()
    {
        Id = i.Id,
        Uuid = i.Uuid,
        ImageFileId = i.ImageFileId,
        Status = i.Status.ToString(),
        Translations = i.Translations.Select(t => new InitiativeOfficeTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
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
