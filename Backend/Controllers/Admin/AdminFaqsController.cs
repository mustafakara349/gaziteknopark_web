using System.Security.Claims;
using Ganss.Xss;
using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Helpers;
using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers.Admin;

[ApiController]
[Route("api/admin/faqs")]
[Authorize(Roles = "Admin,Editor")]
public class AdminFaqsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminFaqsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet("tags")]
    public async Task<ActionResult<List<TagDto>>> GetTags()
    {
        var tags = await _db.Tags
            .Where(t => t.DeletedAt == null)
            .Select(t => new TagDto { Id = t.Id, Name = t.Name, Slug = t.Slug })
            .ToListAsync();
        return Ok(tags);
    }

    [HttpGet]
    public async Task<ActionResult<List<FaqDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] uint? categoryId,
        [FromQuery] uint? tagId,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _db.Faqs
            .Include(f => f.FaqCategory)
            .Include(f => f.Tags)
            .Where(f => f.DeletedAt == null);

        // Arama Filtresi (Soru ve cevapta ara)
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();
            query = query.Where(f => EF.Functions.Like(f.Question, $"%{search}%") || EF.Functions.Like(f.Answer, $"%{search}%"));
        }

        // Kategori Filtresi
        if (categoryId.HasValue)
        {
            query = query.Where(f => f.FaqCategoryId == categoryId.Value);
        }

        // Etiket Filtresi
        if (tagId.HasValue)
        {
            query = query.Where(f => f.Tags.Any(t => t.Id == tagId.Value));
        }

        // Aktiflik Durum Filtresi
        if (isActive.HasValue)
        {
            query = query.Where(f => f.IsActive == isActive.Value);
        }

        // Toplam Kayıt Sayısı (Pagination için)
        var totalCount = await query.CountAsync();
        Response.Headers.Append("X-Total-Count", totalCount.ToString());

        // Sayfalama ve Listeleme
        var faqs = await query
            .OrderBy(f => f.OrderNo)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(faqs.Select(Map).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<FaqDto>> Create(FaqUpsertDto dto)
    {
        var currentUserId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Rich Text HTML İçeriğini XSS Güvenliği için Temizleme
        var sanitizer = new HtmlSanitizer();
        var sanitizedAnswer = sanitizer.Sanitize(dto.Answer);

        var faq = new Faq
        {
            FaqCategoryId = dto.FaqCategoryId,
            Question = dto.Question.Trim(),
            Answer = sanitizedAnswer,
            ButtonLink = string.IsNullOrWhiteSpace(dto.ButtonLink) ? null : dto.ButtonLink.Trim(),
            ButtonText = string.IsNullOrWhiteSpace(dto.ButtonText) ? null : dto.ButtonText.Trim(),
            OrderNo = dto.OrderNo,
            IsActive = dto.IsActive,
            CreatedBy = currentUserId,
            CreatedAt = DateTime.UtcNow
        };

        // Dinamik Etiket Kayıt ve Bağlama (Creatable Tags)
        if (dto.Tags != null && dto.Tags.Count > 0)
        {
            foreach (var tagName in dto.Tags)
            {
                var cleanedTagName = tagName.Trim();
                if (string.IsNullOrWhiteSpace(cleanedTagName)) continue;

                var slug = TextHelper.Slugify(cleanedTagName);

                var tag = await _db.Tags
                    .FirstOrDefaultAsync(t => (t.Slug == slug || t.Name.ToLower() == cleanedTagName.ToLower()) && t.DeletedAt == null);

                if (tag == null)
                {
                    tag = new Tag
                    {
                        Name = cleanedTagName,
                        Slug = slug,
                        CreatedBy = currentUserId,
                        CreatedAt = DateTime.UtcNow
                    };
                    _db.Tags.Add(tag);
                    await _db.SaveChangesAsync(); // ID oluşması için
                }

                faq.Tags.Add(tag);
            }
        }

        _db.Faqs.Add(faq);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = faq.Id }, Map(faq));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<FaqDto>> Update(uint id, FaqUpsertDto dto)
    {
        var currentUserId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var faq = await _db.Faqs
            .Include(f => f.Tags)
            .Include(f => f.FaqCategory)
            .FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null);

        if (faq == null) return NotFound();

        // Rich Text HTML İçeriğini XSS Güvenliği için Temizleme
        var sanitizer = new HtmlSanitizer();
        var sanitizedAnswer = sanitizer.Sanitize(dto.Answer);

        faq.FaqCategoryId = dto.FaqCategoryId;
        faq.Question = dto.Question.Trim();
        faq.Answer = sanitizedAnswer;
        faq.ButtonLink = string.IsNullOrWhiteSpace(dto.ButtonLink) ? null : dto.ButtonLink.Trim();
        faq.ButtonText = string.IsNullOrWhiteSpace(dto.ButtonText) ? null : dto.ButtonText.Trim();
        faq.OrderNo = dto.OrderNo;
        faq.IsActive = dto.IsActive;
        faq.UpdatedBy = currentUserId;
        faq.UpdatedAt = DateTime.UtcNow;

        // Etiketleri Senkronize Etme (Clear and attach new)
        faq.Tags.Clear();

        if (dto.Tags != null && dto.Tags.Count > 0)
        {
            foreach (var tagName in dto.Tags)
            {
                var cleanedTagName = tagName.Trim();
                if (string.IsNullOrWhiteSpace(cleanedTagName)) continue;

                var slug = TextHelper.Slugify(cleanedTagName);

                var tag = await _db.Tags
                    .FirstOrDefaultAsync(t => (t.Slug == slug || t.Name.ToLower() == cleanedTagName.ToLower()) && t.DeletedAt == null);

                if (tag == null)
                {
                    tag = new Tag
                    {
                        Name = cleanedTagName,
                        Slug = slug,
                        CreatedBy = currentUserId,
                        CreatedAt = DateTime.UtcNow
                    };
                    _db.Tags.Add(tag);
                    await _db.SaveChangesAsync();
                }

                faq.Tags.Add(tag);
            }
        }

        await _db.SaveChangesAsync();
        return Ok(Map(faq));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var currentUserId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var faq = await _db.Faqs
            .FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null);

        if (faq == null) return NotFound();

        faq.DeletedAt = DateTime.UtcNow;
        faq.DeletedBy = currentUserId;

        // ON DELETE CASCADE gereksinimi: faq_tag pivot kayıtlarının temizlenmesi
        // EF Core, shadow table ya da pivot üzerinden çoka çok ilişkiyi kaydettiğinde,
        // silme işleminde ilgili pivot kayıtlarını otomatik kaldırır. 
        // Ancak bu Soft-Delete (DeletedAt güncelleme) olduğu için veri tabanı bazlı CASCADE tetiklenmez.
        // Bu yüzden soft silmede ilişkileri temizlememiz gerekir:
        faq.Tags.Clear();

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("reorder")]
    public async Task<IActionResult> Reorder(FaqReorderDto dto)
    {
        var currentUserId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (dto.Items == null || dto.Items.Count == 0)
        {
            return BadRequest("Sıralanacak soru öğeleri boş olamaz.");
        }

        var faqIds = dto.Items.Select(x => x.Id).ToList();
        var faqs = await _db.Faqs
            .Where(f => faqIds.Contains(f.Id) && f.DeletedAt == null)
            .ToListAsync();

        foreach (var faq in faqs)
        {
            var item = dto.Items.First(x => x.Id == faq.Id);
            faq.OrderNo = item.OrderNo;
            faq.UpdatedBy = currentUserId;
            faq.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/toggle-status")]
    public async Task<ActionResult<FaqDto>> ToggleStatus(uint id)
    {
        var currentUserId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var faq = await _db.Faqs
            .Include(f => f.Tags)
            .Include(f => f.FaqCategory)
            .FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null);

        if (faq == null) return NotFound();

        faq.IsActive = !faq.IsActive;
        faq.UpdatedBy = currentUserId;
        faq.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(Map(faq));
    }

    private static FaqDto Map(Faq f) => new()
    {
        Id = f.Id,
        Question = f.Question,
        Answer = f.Answer,
        ButtonLink = f.ButtonLink,
        ButtonText = f.ButtonText,
        OrderNo = f.OrderNo,
        IsActive = f.IsActive,
        FaqCategoryId = f.FaqCategoryId,
        FaqCategory = f.FaqCategory == null ? null : new FaqCategoryDto
        {
            Id = f.FaqCategory.Id,
            Name = f.FaqCategory.Name,
            Slug = f.FaqCategory.Slug,
            OrderNo = f.FaqCategory.OrderNo,
            IsActive = f.FaqCategory.IsActive
        },
        Tags = f.Tags.Select(t => new TagDto
        {
            Id = t.Id,
            Name = t.Name,
            Slug = t.Slug
        }).ToList()
    };
}
