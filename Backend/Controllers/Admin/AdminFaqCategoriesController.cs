using System.Security.Claims;
using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Helpers;
using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers.Admin;

[ApiController]
[Route("api/admin/faq-categories")]
[Authorize(Roles = "Admin,Editor")]
public class AdminFaqCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminFaqCategoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<FaqCategoryDto>>> GetAll()
    {
        var categories = await _db.FaqCategories
            .Where(c => c.DeletedAt == null)
            .OrderBy(c => c.OrderNo)
            .Select(c => new FaqCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                OrderNo = c.OrderNo,
                IsActive = c.IsActive,
                FaqCount = c.Faqs.Count(f => f.DeletedAt == null) // Soft-delete filtresi uygulandı
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<ActionResult<FaqCategoryDto>> Create(FaqCategoryUpsertDto dto)
    {
        var currentUserId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var slug = string.IsNullOrWhiteSpace(dto.Slug) ? TextHelper.Slugify(dto.Name) : TextHelper.Slugify(dto.Slug);

        if (await _db.FaqCategories.AnyAsync(c => c.Slug == slug && c.DeletedAt == null))
        {
            return BadRequest("Bu slug değerine sahip başka bir kategori zaten mevcut.");
        }

        var category = new FaqCategory
        {
            Name = dto.Name.Trim(),
            Slug = slug,
            OrderNo = dto.OrderNo,
            IsActive = dto.IsActive,
            CreatedBy = currentUserId,
            CreatedAt = DateTime.UtcNow
        };

        _db.FaqCategories.Add(category);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = category.Id }, new FaqCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            OrderNo = category.OrderNo,
            IsActive = category.IsActive,
            FaqCount = 0
        });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<FaqCategoryDto>> Update(uint id, FaqCategoryUpsertDto dto)
    {
        var currentUserId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var category = await _db.FaqCategories
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);

        if (category == null) return NotFound();

        var slug = string.IsNullOrWhiteSpace(dto.Slug) ? TextHelper.Slugify(dto.Name) : TextHelper.Slugify(dto.Slug);

        if (await _db.FaqCategories.AnyAsync(c => c.Slug == slug && c.Id != id && c.DeletedAt == null))
        {
            return BadRequest("Bu slug değerine sahip başka bir kategori zaten mevcut.");
        }

        category.Name = dto.Name.Trim();
        category.Slug = slug;
        category.OrderNo = dto.OrderNo;
        category.IsActive = dto.IsActive;
        category.UpdatedBy = currentUserId;
        category.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var count = await _db.Faqs.CountAsync(f => f.FaqCategoryId == id && f.DeletedAt == null);

        return Ok(new FaqCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            OrderNo = category.OrderNo,
            IsActive = category.IsActive,
            FaqCount = count
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var currentUserId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var category = await _db.FaqCategories
            .Include(c => c.Faqs)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);

        if (category == null) return NotFound();

        category.DeletedAt = DateTime.UtcNow;
        category.DeletedBy = currentUserId;

        // Kategori silindiğinde ona bağlı sorular silinmemeli, ilişkisi kesilmelidir. (Soft-Delete Uyumlu SET NULL)
        foreach (var faq in category.Faqs)
        {
            faq.FaqCategoryId = null;
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }
}
