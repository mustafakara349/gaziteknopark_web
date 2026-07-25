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
[Route("api/settings")]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public SettingsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<SettingDto>>> GetAll()
    {
        var settings = await _db.Settings.Include(s => s.Translations).ThenInclude(t => t.Language).ToListAsync();
        return Ok(settings.Select(Map).ToList());
    }

    [HttpGet("{key}")]
    public async Task<ActionResult<SettingDto>> GetByKey(string key)
    {
        var setting = await _db.Settings.Include(s => s.Translations).ThenInclude(t => t.Language)
            .FirstOrDefaultAsync(s => s.SettingKey == key);
        if (setting is null) return NotFound();
        return Ok(Map(setting));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<SettingDto>> Create(SettingUpsertDto dto)
    {
        if (!EnumParsing.TryParse<SettingType>(dto.Type, out var type))
        {
            return BadRequest("Geçersiz ayar tipi.");
        }

        if (await _db.Settings.AnyAsync(s => s.SettingKey == dto.SettingKey))
        {
            return Conflict("Bu ayar anahtarı zaten mevcut.");
        }

        var setting = new Setting
        {
            SettingKey = dto.SettingKey,
            Type = type,
            IsTranslatable = dto.IsTranslatable,
            CreatedAt = DateTime.UtcNow
        };
        foreach (var t in dto.Translations)
        {
            setting.Translations.Add(new SettingTranslation { LanguageId = t.LanguageId, Value = t.Value, FileId = t.FileId });
        }

        _db.Settings.Add(setting);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetByKey), new { key = setting.SettingKey }, Map(setting));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{key}")]
    public async Task<ActionResult<SettingDto>> Update(string key, SettingUpsertDto dto)
    {
        if (!EnumParsing.TryParse<SettingType>(dto.Type, out var type))
        {
            return BadRequest("Geçersiz ayar tipi.");
        }

        var setting = await _db.Settings.Include(s => s.Translations).FirstOrDefaultAsync(s => s.SettingKey == key);
        if (setting is null) return NotFound();

        setting.Type = type;
        setting.IsTranslatable = dto.IsTranslatable;
        setting.UpdatedAt = DateTime.UtcNow;

        _db.SettingTranslations.RemoveRange(setting.Translations);
        setting.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            setting.Translations.Add(new SettingTranslation { LanguageId = t.LanguageId, Value = t.Value, FileId = t.FileId });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(setting));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{key}")]
    public async Task<IActionResult> Delete(string key)
    {
        var setting = await _db.Settings.FirstOrDefaultAsync(s => s.SettingKey == key);
        if (setting is null) return NotFound();
        _db.Settings.Remove(setting);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static SettingDto Map(Setting s) => new()
    {
        Id = s.Id,
        SettingKey = s.SettingKey,
        Type = s.Type.ToString(),
        IsTranslatable = s.IsTranslatable,
        Translations = s.Translations.Select(t => new SettingTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Value = t.Value,
            FileId = t.FileId
        }).ToList()
    };
}
