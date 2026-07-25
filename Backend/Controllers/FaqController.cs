using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/faq")]
public class FaqController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public FaqController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<FaqDto>>> GetAll([FromQuery] bool activeOnly = true)
    {
        var query = _db.Faqs.Where(f => f.DeletedAt == null);
        if (activeOnly)
        {
            query = query.Where(f => f.IsActive);
        }

        var faqs = await query.Include(f => f.Translations).ThenInclude(t => t.Language)
            .OrderBy(f => f.OrderNo).ToListAsync();
        return Ok(faqs.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<FaqDto>> Create(FaqUpsertDto dto)
    {
        var faq = new Faq { OrderNo = dto.OrderNo, IsActive = dto.IsActive, CreatedAt = DateTime.UtcNow };
        foreach (var t in dto.Translations)
        {
            faq.Translations.Add(new FaqTranslation { LanguageId = t.LanguageId, Question = t.Question, Answer = t.Answer });
        }

        _db.Faqs.Add(faq);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = faq.Id }, Map(faq));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<FaqDto>> Update(uint id, FaqUpsertDto dto)
    {
        var faq = await _db.Faqs.Include(f => f.Translations).FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null);
        if (faq is null) return NotFound();

        faq.OrderNo = dto.OrderNo;
        faq.IsActive = dto.IsActive;
        faq.UpdatedAt = DateTime.UtcNow;

        _db.FaqTranslations.RemoveRange(faq.Translations);
        faq.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            faq.Translations.Add(new FaqTranslation { LanguageId = t.LanguageId, Question = t.Question, Answer = t.Answer });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(faq));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var faq = await _db.Faqs.FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null);
        if (faq is null) return NotFound();
        faq.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static FaqDto Map(Faq f) => new()
    {
        Id = f.Id,
        OrderNo = f.OrderNo,
        IsActive = f.IsActive,
        Translations = f.Translations.Select(t => new FaqTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Question = t.Question,
            Answer = t.Answer
        }).ToList()
    };
}
