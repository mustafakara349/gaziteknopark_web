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
[Route("api/team-members")]
public class TeamMembersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public TeamMembersController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<TeamMemberDto>>> GetAll()
    {
        var query = _db.TeamMembers.Where(m => m.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(m => m.Status == ContentStatus.Published);
        }

        var members = await query.Include(m => m.Translations).ThenInclude(t => t.Language)
            .OrderBy(m => m.OrderNo).ToListAsync();
        return Ok(members.Select(Map).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeamMemberDto>> GetById(uint id)
    {
        var member = await _db.TeamMembers.Include(m => m.Translations).ThenInclude(t => t.Language)
            .FirstOrDefaultAsync(m => m.Id == id && m.DeletedAt == null);
        if (member is null) return NotFound();
        if (!IsPrivileged && member.Status != ContentStatus.Published) return NotFound();
        return Ok(Map(member));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<TeamMemberDto>> Create(TeamMemberUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var member = new TeamMember
        {
            Uuid = Guid.NewGuid(),
            FullName = dto.FullName,
            PhotoFileId = dto.PhotoFileId,
            LinkedinUrl = dto.LinkedinUrl,
            OrderNo = dto.OrderNo,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };
        foreach (var t in dto.Translations)
        {
            member.Translations.Add(new TeamMemberTranslation { LanguageId = t.LanguageId, Title = t.Title, Bio = t.Bio });
        }

        _db.TeamMembers.Add(member);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = member.Id }, Map(member));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<TeamMemberDto>> Update(uint id, TeamMemberUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var member = await _db.TeamMembers.Include(m => m.Translations).FirstOrDefaultAsync(m => m.Id == id && m.DeletedAt == null);
        if (member is null) return NotFound();

        member.FullName = dto.FullName;
        member.PhotoFileId = dto.PhotoFileId;
        member.LinkedinUrl = dto.LinkedinUrl;
        member.OrderNo = dto.OrderNo;
        member.Status = status;
        member.UpdatedAt = DateTime.UtcNow;

        _db.TeamMemberTranslations.RemoveRange(member.Translations);
        member.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            member.Translations.Add(new TeamMemberTranslation { LanguageId = t.LanguageId, Title = t.Title, Bio = t.Bio });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(member));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var member = await _db.TeamMembers.FirstOrDefaultAsync(m => m.Id == id && m.DeletedAt == null);
        if (member is null) return NotFound();
        member.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static TeamMemberDto Map(TeamMember m) => new()
    {
        Id = m.Id,
        Uuid = m.Uuid,
        FullName = m.FullName,
        PhotoFileId = m.PhotoFileId,
        LinkedinUrl = m.LinkedinUrl,
        OrderNo = m.OrderNo,
        Status = m.Status.ToString(),
        Translations = m.Translations.Select(t => new TeamMemberTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Title = t.Title,
            Bio = t.Bio
        }).ToList()
    };
}
