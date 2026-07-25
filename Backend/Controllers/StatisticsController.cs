using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/statistics")]
public class StatisticsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public StatisticsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<StatisticDto>>> GetAll([FromQuery] bool activeOnly = true)
    {
        var query = _db.Statistics.Where(s => s.DeletedAt == null);
        if (activeOnly)
        {
            query = query.Where(s => s.IsActive);
        }

        var stats = await query.Include(s => s.Translations).ThenInclude(t => t.Language)
            .OrderBy(s => s.OrderNo).ToListAsync();
        return Ok(stats.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<StatisticDto>> Create(StatisticUpsertDto dto)
    {
        var stat = new Statistic { Value = dto.Value, Icon = dto.Icon, OrderNo = dto.OrderNo, IsActive = dto.IsActive, CreatedAt = DateTime.UtcNow };
        foreach (var t in dto.Translations)
        {
            stat.Translations.Add(new StatisticTranslation { LanguageId = t.LanguageId, Label = t.Label });
        }

        _db.Statistics.Add(stat);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = stat.Id }, Map(stat));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<StatisticDto>> Update(uint id, StatisticUpsertDto dto)
    {
        var stat = await _db.Statistics.Include(s => s.Translations).FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (stat is null) return NotFound();

        stat.Value = dto.Value;
        stat.Icon = dto.Icon;
        stat.OrderNo = dto.OrderNo;
        stat.IsActive = dto.IsActive;
        stat.UpdatedAt = DateTime.UtcNow;

        _db.StatisticTranslations.RemoveRange(stat.Translations);
        stat.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            stat.Translations.Add(new StatisticTranslation { LanguageId = t.LanguageId, Label = t.Label });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(stat));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var stat = await _db.Statistics.FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (stat is null) return NotFound();
        stat.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static StatisticDto Map(Statistic s) => new()
    {
        Id = s.Id,
        Value = s.Value,
        Icon = s.Icon,
        OrderNo = s.OrderNo,
        IsActive = s.IsActive,
        Translations = s.Translations.Select(t => new StatisticTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Label = t.Label
        }).ToList()
    };
}
