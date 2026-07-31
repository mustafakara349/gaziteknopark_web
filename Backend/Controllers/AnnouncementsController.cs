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
[Route("api/announcement-categories")]
public class AnnouncementCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AnnouncementCategoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<AnnouncementCategoryDto>>> GetAll()
    {
        var categories = await _db.AnnouncementCategories
            .Where(c => c.DeletedAt == null)
            .Include(c => c.Translations).ThenInclude(t => t.Language)
            .OrderBy(c => c.OrderNo)
            .ToListAsync();

        return Ok(categories.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<AnnouncementCategoryDto>> Create(AnnouncementCategoryUpsertDto dto)
    {
        var category = new AnnouncementCategory
        {
            Name = dto.Name,
            Slug = dto.Slug,
            OrderNo = dto.OrderNo,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var t in dto.Translations)
        {
            category.Translations.Add(new AnnouncementCategoryTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        _db.AnnouncementCategories.Add(category);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = category.Id }, Map(category));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<AnnouncementCategoryDto>> Update(uint id, AnnouncementCategoryUpsertDto dto)
    {
        var category = await _db.AnnouncementCategories.Include(c => c.Translations)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (category is null) return NotFound();

        category.Name = dto.Name;
        category.Slug = dto.Slug;
        category.OrderNo = dto.OrderNo;
        category.UpdatedAt = DateTime.UtcNow;

        _db.AnnouncementCategoryTranslations.RemoveRange(category.Translations);
        category.Translations.Clear();

        foreach (var t in dto.Translations)
        {
            category.Translations.Add(new AnnouncementCategoryTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(category));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var category = await _db.AnnouncementCategories.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (category is null) return NotFound();
        category.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static AnnouncementCategoryDto Map(AnnouncementCategory c) => new()
    {
        Id = c.Id,
        OrderNo = c.OrderNo,
        Name = c.Name,
        Slug = c.Slug,
        Translations = c.Translations.Select(t => new AnnouncementCategoryTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Name = t.Name
        }).ToList()
    };
}

[ApiController]
[Route("api/announcements")]
public class AnnouncementsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AnnouncementsController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<AnnouncementDto>>> GetAll(
        [FromQuery] uint? categoryId,
        [FromQuery] string? search,
        [FromQuery] string? sort,
        [FromQuery] DateTime? date,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] int? page,
        [FromQuery] int? pageSize)
    {
        var query = _db.Announcements
            .Include(a => a.Category)
            .Include(a => a.Translations).ThenInclude(t => t.Language)
            .Where(a => a.DeletedAt == null);

        if (!IsPrivileged)
        {
            query = query.Where(a => a.Status == ContentStatus.Published);
        }
        if (categoryId.HasValue && categoryId.Value > 0)
        {
            query = query.Where(a => a.CategoryId == categoryId.Value);
        }
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(a =>
                EF.Functions.Like(a.Title.ToLower(), $"%{term}%") ||
                (a.Summary != null && EF.Functions.Like(a.Summary.ToLower(), $"%{term}%")) ||
                (a.Content != null && EF.Functions.Like(a.Content.ToLower(), $"%{term}%"))
            );
        }
        if (date.HasValue)
        {
            var targetDate = date.Value.Date;
            query = query.Where(a => a.PublishedAt.HasValue && a.PublishedAt.Value.Date == targetDate);
        }
        if (startDate.HasValue)
        {
            query = query.Where(a => a.PublishedAt >= startDate.Value);
        }
        if (endDate.HasValue)
        {
            query = query.Where(a => a.PublishedAt <= endDate.Value);
        }

        // Pinned items first, then by date
        if (sort == "oldest")
        {
            query = query.OrderByDescending(a => a.IsPinned).ThenBy(a => a.PublishedAt ?? a.CreatedAt);
        }
        else
        {
            query = query.OrderByDescending(a => a.IsPinned).ThenByDescending(a => a.PublishedAt ?? a.CreatedAt);
        }

        var totalCount = await query.CountAsync();
        Response.Headers["X-Total-Count"] = totalCount.ToString();

        if (page.HasValue && page.Value > 0 && pageSize.HasValue && pageSize.Value > 0)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        var items = await query.ToListAsync();

        // Batch load cover image URLs
        var coverFileIds = items.Where(a => a.CoverImageFileId.HasValue).Select(a => a.CoverImageFileId!.Value).Distinct().ToList();
        var fileMap = coverFileIds.Any()
            ? await _db.Files.Where(f => coverFileIds.Contains(f.Id)).ToDictionaryAsync(f => f.Id, f => f.Path)
            : new Dictionary<uint, string>();

        var result = items.Select(a => new AnnouncementDto
        {
            Id = a.Id,
            Uuid = a.Uuid,
            CategoryId = a.CategoryId,
            CategoryName = a.Category?.Name ?? "Genel",
            CoverImageFileId = a.CoverImageFileId,
            CoverImageUrl = a.CoverImageFileId.HasValue && fileMap.TryGetValue(a.CoverImageFileId.Value, out var cPath) ? cPath : null,
            Status = a.Status.ToString(),
            PublishedAt = a.PublishedAt,
            Views = a.Views,
            CreatedAt = a.CreatedAt,
            IsPinned = a.IsPinned,
            Title = a.Title,
            Slug = a.Slug,
            Summary = a.Summary,
            ActionUrl = a.ActionUrl,
            ActionLabel = a.ActionLabel,
            Translations = a.Translations.Select(t => new AnnouncementTranslationDto
            {
                LanguageId = t.LanguageId,
                LanguageCode = t.Language?.Code,
                Title = t.Title,
                Slug = t.Slug,
                Summary = t.Summary,
                ActionLabel = t.ActionLabel
            }).ToList()
        }).ToList();

        return Ok(result);
    }

    [HttpGet("{idOrSlug}")]
    public async Task<ActionResult<AnnouncementDto>> GetByIdOrSlug(string idOrSlug)
    {
        Announcement? announcement = null;
        if (uint.TryParse(idOrSlug, out var id))
        {
            announcement = await _db.Announcements
                .Include(a => a.Category)
                .Include(a => a.Translations).ThenInclude(t => t.Language)
                .Include(a => a.Attachments).ThenInclude(att => att.File)
                .FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        }

        if (announcement == null)
        {
            announcement = await _db.Announcements
                .Include(a => a.Category)
                .Include(a => a.Translations).ThenInclude(t => t.Language)
                .Include(a => a.Attachments).ThenInclude(att => att.File)
                .FirstOrDefaultAsync(a => a.Slug == idOrSlug && a.DeletedAt == null);
        }

        if (announcement is null) return NotFound();
        if (!IsPrivileged && announcement.Status != ContentStatus.Published) return NotFound();

        announcement.Views++;
        await _db.SaveChangesAsync();

        var dto = await MapDetailAsync(announcement);
        return Ok(dto);
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<AnnouncementDto>> Create(AnnouncementUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var announcement = new Announcement
        {
            Uuid = Guid.NewGuid(),
            CategoryId = dto.CategoryId,
            CoverImageFileId = dto.CoverImageFileId,
            Status = status,
            PublishedAt = dto.PublishedAt,
            IsPinned = dto.IsPinned,
            Title = dto.Title,
            Slug = dto.Slug,
            Summary = dto.Summary,
            Content = dto.Content,
            ActionUrl = dto.ActionUrl,
            ActionLabel = dto.ActionLabel,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var t in dto.Translations)
        {
            announcement.Translations.Add(new AnnouncementTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Slug = t.Slug,
                Summary = t.Summary,
                Content = t.Content,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription,
                MetaKeywords = t.MetaKeywords,
                CanonicalUrl = t.CanonicalUrl,
                OgImageFileId = t.OgImageFileId,
                SearchKeywords = t.SearchKeywords,
                ActionLabel = t.ActionLabel
            });
        }

        _db.Announcements.Add(announcement);
        await _db.SaveChangesAsync();

        if (dto.AttachmentFileIds != null && dto.AttachmentFileIds.Any())
        {
            for (int i = 0; i < dto.AttachmentFileIds.Count; i++)
            {
                _db.AnnouncementAttachments.Add(new AnnouncementAttachment
                {
                    AnnouncementId = announcement.Id,
                    FileId = dto.AttachmentFileIds[i],
                    OrderNo = (uint)i,
                    CreatedAt = DateTime.UtcNow
                });
            }
            await _db.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetByIdOrSlug), new { idOrSlug = announcement.Slug }, await MapDetailAsync(announcement));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<AnnouncementDto>> Update(uint id, AnnouncementUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var announcement = await _db.Announcements.Include(a => a.Translations)
            .FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        if (announcement is null) return NotFound();

        announcement.CategoryId = dto.CategoryId;
        announcement.CoverImageFileId = dto.CoverImageFileId;
        announcement.Status = status;
        announcement.PublishedAt = dto.PublishedAt;
        announcement.IsPinned = dto.IsPinned;
        announcement.Title = dto.Title;
        announcement.Slug = dto.Slug;
        announcement.Summary = dto.Summary;
        announcement.Content = dto.Content;
        announcement.ActionUrl = dto.ActionUrl;
        announcement.ActionLabel = dto.ActionLabel;
        announcement.UpdatedAt = DateTime.UtcNow;

        _db.AnnouncementTranslations.RemoveRange(announcement.Translations);
        announcement.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            announcement.Translations.Add(new AnnouncementTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Slug = t.Slug,
                Summary = t.Summary,
                Content = t.Content,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription,
                MetaKeywords = t.MetaKeywords,
                CanonicalUrl = t.CanonicalUrl,
                OgImageFileId = t.OgImageFileId,
                SearchKeywords = t.SearchKeywords,
                ActionLabel = t.ActionLabel
            });
        }

        if (dto.AttachmentFileIds != null)
        {
            var existingAttachments = await _db.AnnouncementAttachments
                .Where(att => att.AnnouncementId == announcement.Id)
                .ToListAsync();
            _db.AnnouncementAttachments.RemoveRange(existingAttachments);

            for (int i = 0; i < dto.AttachmentFileIds.Count; i++)
            {
                _db.AnnouncementAttachments.Add(new AnnouncementAttachment
                {
                    AnnouncementId = announcement.Id,
                    FileId = dto.AttachmentFileIds[i],
                    OrderNo = (uint)i,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _db.SaveChangesAsync();
        return Ok(await MapDetailAsync(announcement));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var announcement = await _db.Announcements.FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        if (announcement is null) return NotFound();
        announcement.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<AnnouncementDto> MapDetailAsync(Announcement a)
    {
        var coverImageUrl = a.CoverImageFileId.HasValue
            ? await _db.Files.Where(f => f.Id == a.CoverImageFileId).Select(f => f.Path).FirstOrDefaultAsync()
            : null;

        // Load attachments if not already loaded
        var attachments = a.Attachments.Any()
            ? a.Attachments.Where(att => att.DeletedAt == null).OrderBy(att => att.OrderNo).ToList()
            : await _db.AnnouncementAttachments
                .Include(att => att.File)
                .Where(att => att.AnnouncementId == a.Id && att.DeletedAt == null)
                .OrderBy(att => att.OrderNo)
                .ToListAsync();

        return new AnnouncementDto
        {
            Id = a.Id,
            Uuid = a.Uuid,
            CategoryId = a.CategoryId,
            CategoryName = a.Category?.Name ?? "Genel",
            CoverImageFileId = a.CoverImageFileId,
            CoverImageUrl = coverImageUrl,
            Status = a.Status.ToString(),
            PublishedAt = a.PublishedAt,
            Views = a.Views,
            CreatedAt = a.CreatedAt,
            IsPinned = a.IsPinned,
            Title = a.Title,
            Slug = a.Slug,
            Summary = a.Summary,
            Content = a.Content,
            MetaTitle = a.MetaTitle,
            MetaDescription = a.MetaDescription,
            ActionUrl = a.ActionUrl,
            ActionLabel = a.ActionLabel,
            Attachments = attachments.Select(att => new AnnouncementAttachmentDto
            {
                Id = att.Id,
                FileId = att.FileId,
                FileName = att.File?.OriginalName ?? att.File?.Name ?? "dosya",
                FileUrl = att.File?.Path ?? "",
                FileMime = att.File?.Mime,
                FileSize = att.File?.Size,
                OrderNo = att.OrderNo
            }).ToList(),
            Translations = a.Translations.Select(t => new AnnouncementTranslationDto
            {
                LanguageId = t.LanguageId,
                LanguageCode = t.Language?.Code,
                Title = t.Title,
                Slug = t.Slug,
                Summary = t.Summary,
                Content = t.Content,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription,
                MetaKeywords = t.MetaKeywords,
                CanonicalUrl = t.CanonicalUrl,
                OgImageFileId = t.OgImageFileId,
                SearchKeywords = t.SearchKeywords,
                ActionLabel = t.ActionLabel
            }).ToList()
        };
    }
}
