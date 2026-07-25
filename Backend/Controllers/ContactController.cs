using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ContactController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet("info")]
    public async Task<ActionResult<ContactInfoDto>> GetInfo()
    {
        var info = await _db.ContactInfos.Include(i => i.Translations).ThenInclude(t => t.Language).FirstOrDefaultAsync();
        if (info is null) return NotFound();
        return Ok(MapInfo(info));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("info")]
    public async Task<ActionResult<ContactInfoDto>> UpdateInfo(ContactInfoUpsertDto dto)
    {
        var info = await _db.ContactInfos.Include(i => i.Translations).FirstOrDefaultAsync();
        if (info is null)
        {
            info = new ContactInfo { CreatedAt = DateTime.UtcNow };
            _db.ContactInfos.Add(info);
        }

        info.Phone = dto.Phone;
        info.Email = dto.Email;
        info.MapEmbedUrl = dto.MapEmbedUrl;
        info.UpdatedAt = DateTime.UtcNow;

        _db.ContactInfoTranslations.RemoveRange(info.Translations);
        info.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            info.Translations.Add(new ContactInfoTranslation { LanguageId = t.LanguageId, Address = t.Address, WorkingHours = t.WorkingHours });
        }

        await _db.SaveChangesAsync();
        return Ok(MapInfo(info));
    }

    [HttpPost("messages")]
    public async Task<ActionResult<ContactMessageDto>> SubmitMessage(ContactMessageCreateDto dto)
    {
        var message = new ContactMessage
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            Subject = dto.Subject,
            Message = dto.Message,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _db.ContactMessages.Add(message);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, MapMessage(message));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpGet("messages")]
    public async Task<ActionResult<List<ContactMessageDto>>> GetMessages()
    {
        var messages = await _db.ContactMessages.Where(m => m.DeletedAt == null)
            .OrderByDescending(m => m.CreatedAt).ToListAsync();
        return Ok(messages.Select(MapMessage).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpGet("messages/{id}")]
    public async Task<ActionResult<ContactMessageDto>> GetMessage(uint id)
    {
        var message = await _db.ContactMessages.FirstOrDefaultAsync(m => m.Id == id && m.DeletedAt == null);
        if (message is null) return NotFound();
        return Ok(MapMessage(message));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPatch("messages/{id}/read")]
    public async Task<IActionResult> MarkAsRead(uint id)
    {
        var message = await _db.ContactMessages.FirstOrDefaultAsync(m => m.Id == id && m.DeletedAt == null);
        if (message is null) return NotFound();
        message.IsRead = true;
        message.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("messages/{id}")]
    public async Task<IActionResult> DeleteMessage(uint id)
    {
        var message = await _db.ContactMessages.FirstOrDefaultAsync(m => m.Id == id && m.DeletedAt == null);
        if (message is null) return NotFound();
        message.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static ContactInfoDto MapInfo(ContactInfo i) => new()
    {
        Id = i.Id,
        Phone = i.Phone,
        Email = i.Email,
        MapEmbedUrl = i.MapEmbedUrl,
        Translations = i.Translations.Select(t => new ContactInfoTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Address = t.Address,
            WorkingHours = t.WorkingHours
        }).ToList()
    };

    private static ContactMessageDto MapMessage(ContactMessage m) => new()
    {
        Id = m.Id,
        FullName = m.FullName,
        Email = m.Email,
        Phone = m.Phone,
        Subject = m.Subject,
        Message = m.Message,
        IsRead = m.IsRead,
        CreatedAt = m.CreatedAt
    };
}
