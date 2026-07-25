using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/social-links")]
public class SocialLinksController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public SocialLinksController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<SocialLinkDto>>> GetAll([FromQuery] bool activeOnly = true)
    {
        var query = _db.SocialLinks.Where(s => s.DeletedAt == null);
        if (activeOnly)
        {
            query = query.Where(s => s.IsActive);
        }

        var links = await query.OrderBy(s => s.OrderNo).ToListAsync();
        return Ok(links.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<SocialLinkDto>> Create(SocialLinkUpsertDto dto)
    {
        var link = new SocialLink { Icon = dto.Icon, Url = dto.Url, OrderNo = dto.OrderNo, IsActive = dto.IsActive, CreatedAt = DateTime.UtcNow };
        _db.SocialLinks.Add(link);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = link.Id }, Map(link));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<SocialLinkDto>> Update(uint id, SocialLinkUpsertDto dto)
    {
        var link = await _db.SocialLinks.FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (link is null) return NotFound();

        link.Icon = dto.Icon;
        link.Url = dto.Url;
        link.OrderNo = dto.OrderNo;
        link.IsActive = dto.IsActive;
        link.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(Map(link));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var link = await _db.SocialLinks.FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);
        if (link is null) return NotFound();
        link.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static SocialLinkDto Map(SocialLink s) => new()
    {
        Id = s.Id,
        Icon = s.Icon,
        Url = s.Url,
        OrderNo = s.OrderNo,
        IsActive = s.IsActive
    };
}
