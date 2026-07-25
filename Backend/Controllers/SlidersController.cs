using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/sliders")]
public class SlidersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public SlidersController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<SliderDto>>> GetAll([FromQuery] bool activeOnly = true)
    {
        var query = _db.Sliders.Where(s => s.DeletedAt == null);
        if (activeOnly)
        {
            query = query.Where(s => s.IsActive);
        }

        var sliders = await query.Include(s => s.Translations).ThenInclude(t => t.Language)
            .OrderBy(s => s.OrderNo).ToListAsync();
        return Ok(sliders.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<SliderDto>> Create(SliderUpsertDto dto)
    {
        var slider = new Slider
        {
            ImageFileId = dto.ImageFileId,
            LinkUrl = dto.LinkUrl,
            OrderNo = dto.OrderNo,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };
        foreach (var t in dto.Translations)
        {
            slider.Translations.Add(new SliderTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Description = t.Description,
                ButtonText = t.ButtonText
            });
        }

        _db.Sliders.Add(slider);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = slider.Id }, Map(slider));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<SliderDto>> Update(uint id, SliderUpsertDto dto)
    {
        var slider = await _db.Sliders.Include(s => s.Translations).FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (slider is null) return NotFound();

        slider.ImageFileId = dto.ImageFileId;
        slider.LinkUrl = dto.LinkUrl;
        slider.OrderNo = dto.OrderNo;
        slider.IsActive = dto.IsActive;
        slider.UpdatedAt = DateTime.UtcNow;

        _db.SliderTranslations.RemoveRange(slider.Translations);
        slider.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            slider.Translations.Add(new SliderTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Description = t.Description,
                ButtonText = t.ButtonText
            });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(slider));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var slider = await _db.Sliders.FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (slider is null) return NotFound();
        slider.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static SliderDto Map(Slider s) => new()
    {
        Id = s.Id,
        ImageFileId = s.ImageFileId,
        LinkUrl = s.LinkUrl,
        OrderNo = s.OrderNo,
        IsActive = s.IsActive,
        Translations = s.Translations.Select(t => new SliderTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Title = t.Title,
            Description = t.Description,
            ButtonText = t.ButtonText
        }).ToList()
    };
}
