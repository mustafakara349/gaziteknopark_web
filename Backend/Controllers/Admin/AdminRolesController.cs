using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Helpers;
using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers.Admin;

[ApiController]
[Route("api/admin/roles")]
[Authorize]
[AdminOnly]
public class AdminRolesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminRolesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<AdminRoleDto>>> GetAll()
    {
        var roles = await _db.Roles.Where(r => r.DeletedAt == null).OrderBy(r => r.Name).ToListAsync();
        var counts = await _db.Users
            .Where(u => u.RoleId != null && u.DeletedAt == null)
            .GroupBy(u => u.RoleId!.Value)
            .Select(g => new { RoleId = g.Key, Count = g.Count() })
            .ToListAsync();

        return Ok(roles.Select(r => new AdminRoleDto
        {
            Id = r.Id,
            Name = r.Name,
            UserCount = counts.FirstOrDefault(c => c.RoleId == r.Id)?.Count ?? 0
        }).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<AdminRoleDto>> Create(AdminRoleUpsertDto dto)
    {
        if (await _db.Roles.AnyAsync(r => r.Name == dto.Name && r.DeletedAt == null))
        {
            return Conflict("Bu isimde bir rol zaten var.");
        }

        var role = new Role { Name = dto.Name, CreatedAt = DateTime.UtcNow };
        _db.Roles.Add(role);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new AdminRoleDto { Id = role.Id, Name = role.Name, UserCount = 0 });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AdminRoleDto>> Update(uint id, AdminRoleUpsertDto dto)
    {
        var role = await _db.Roles.FirstOrDefaultAsync(r => r.Id == id && r.DeletedAt == null);
        if (role is null) return NotFound();

        if (await _db.Roles.AnyAsync(r => r.Name == dto.Name && r.Id != id && r.DeletedAt == null))
        {
            return Conflict("Bu isimde bir rol zaten var.");
        }

        role.Name = dto.Name;
        role.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var count = await _db.Users.CountAsync(u => u.RoleId == id && u.DeletedAt == null);
        return Ok(new AdminRoleDto { Id = role.Id, Name = role.Name, UserCount = count });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var role = await _db.Roles.FirstOrDefaultAsync(r => r.Id == id && r.DeletedAt == null);
        if (role is null) return NotFound();

        var inUse = await _db.Users.AnyAsync(u => u.RoleId == id && u.DeletedAt == null);
        if (inUse)
        {
            return BadRequest("Bu role atanmış kullanıcılar var, önce onları başka bir role taşıyın.");
        }

        role.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
