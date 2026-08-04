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
[Route("api/document-categories")]
public class DocumentCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public DocumentCategoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<DocumentCategoryDto>>> GetAll()
    {
        var categories = await _db.DocumentCategories.Where(c => c.DeletedAt == null)
            .Include(c => c.Translations).ThenInclude(t => t.Language).ToListAsync();
        return Ok(categories.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<DocumentCategoryDto>> Create(DocumentCategoryUpsertDto dto)
    {
        var category = new DocumentCategory { CreatedAt = DateTime.UtcNow };
        foreach (var t in dto.Translations)
        {
            category.Translations.Add(new DocumentCategoryTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        _db.DocumentCategories.Add(category);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = category.Id }, Map(category));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<DocumentCategoryDto>> Update(uint id, DocumentCategoryUpsertDto dto)
    {
        var category = await _db.DocumentCategories.Include(c => c.Translations)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (category is null) return NotFound();

        category.UpdatedAt = DateTime.UtcNow;
        _db.DocumentCategoryTranslations.RemoveRange(category.Translations);
        category.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            category.Translations.Add(new DocumentCategoryTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(category));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var category = await _db.DocumentCategories.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (category is null) return NotFound();
        category.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static DocumentCategoryDto Map(DocumentCategory c) => new()
    {
        Id = c.Id,
        Translations = c.Translations.Select(t => new DocumentCategoryTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Name = t.Name
        }).ToList()
    };
}

[ApiController]
[Route("api/documents")]
public class DocumentsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public DocumentsController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<DocumentDto>>> GetAll([FromQuery] uint? categoryId)
    {
        var query = _db.Documents.Where(d => d.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(d => d.Status == ContentStatus.Published);
        }
        if (categoryId.HasValue)
        {
            query = query.Where(d => d.CategoryId == categoryId);
        }

        var documents = await query.Include(d => d.Translations).ThenInclude(t => t.Language)
            .Include(d => d.Translations).ThenInclude(t => t.File)
            .OrderBy(d => d.OrderNo).ToListAsync();
        return Ok(documents.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<DocumentDto>> Create(DocumentUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var document = new Document
        {
            Uuid = Guid.NewGuid(),
            CategoryId = dto.CategoryId,
            PublishedDate = dto.PublishedDate,
            OrderNo = dto.OrderNo,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };
        foreach (var t in dto.Translations)
        {
            document.Translations.Add(new DocumentTranslation { LanguageId = t.LanguageId, Title = t.Title, FileId = t.FileId });
        }

        _db.Documents.Add(document);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = document.Id }, Map(document));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<DocumentDto>> Update(uint id, DocumentUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var document = await _db.Documents.Include(d => d.Translations).FirstOrDefaultAsync(d => d.Id == id && d.DeletedAt == null);
        if (document is null) return NotFound();

        document.CategoryId = dto.CategoryId;
        document.PublishedDate = dto.PublishedDate;
        document.OrderNo = dto.OrderNo;
        document.Status = status;
        document.UpdatedAt = DateTime.UtcNow;

        _db.DocumentTranslations.RemoveRange(document.Translations);
        document.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            document.Translations.Add(new DocumentTranslation { LanguageId = t.LanguageId, Title = t.Title, FileId = t.FileId });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(document));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var document = await _db.Documents.FirstOrDefaultAsync(d => d.Id == id && d.DeletedAt == null);
        if (document is null) return NotFound();
        document.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private DocumentDto Map(Document d) => new()
    {
        Id = d.Id,
        Uuid = d.Uuid,
        CategoryId = d.CategoryId,
        PublishedDate = d.PublishedDate,
        OrderNo = d.OrderNo,
        Status = d.Status.ToString(),
        Translations = d.Translations.Select(t => new DocumentTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Title = t.Title,
            FileId = t.FileId,
            FileUrl = FileUrlHelper.ToAbsoluteUrl(Request, t.File),
            FilePath = t.File?.Path,
            FileSize = t.File?.Size
        }).ToList()
    };
}
