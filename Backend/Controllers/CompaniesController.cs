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
[Route("api/company-categories")]
public class CompanyCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CompanyCategoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<CompanyCategoryDto>>> GetAll()
    {
        var categories = await _db.CompanyCategories.Where(c => c.DeletedAt == null)
            .Include(c => c.Translations).ThenInclude(t => t.Language).ToListAsync();
        return Ok(categories.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<CompanyCategoryDto>> Create(CompanyCategoryUpsertDto dto)
    {
        var category = new CompanyCategory { Color = dto.Color, CreatedAt = DateTime.UtcNow };
        foreach (var t in dto.Translations)
        {
            category.Translations.Add(new CompanyCategoryTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        _db.CompanyCategories.Add(category);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = category.Id }, Map(category));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<CompanyCategoryDto>> Update(uint id, CompanyCategoryUpsertDto dto)
    {
        var category = await _db.CompanyCategories.Include(c => c.Translations)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (category is null) return NotFound();

        category.Color = dto.Color;
        category.UpdatedAt = DateTime.UtcNow;

        _db.CompanyCategoryTranslations.RemoveRange(category.Translations);
        category.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            category.Translations.Add(new CompanyCategoryTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(category));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var category = await _db.CompanyCategories.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (category is null) return NotFound();
        category.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static CompanyCategoryDto Map(CompanyCategory c) => new()
    {
        Id = c.Id,
        Color = c.Color,
        Translations = c.Translations.Select(t => new CompanyCategoryTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Name = t.Name
        }).ToList()
    };
}

[ApiController]
[Route("api/companies")]
public class CompaniesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CompaniesController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<CompanyDto>>> GetAll([FromQuery] uint? categoryId)
    {
        var query = _db.Companies.Where(c => c.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(c => c.Status != CompanyStatus.Pasif);
        }
        if (categoryId.HasValue)
        {
            query = query.Where(c => c.CategoryPivots.Any(p => p.CategoryId == categoryId));
        }

        var companies = await query
            .Include(c => c.Translations).ThenInclude(t => t.Language)
            .Include(c => c.CategoryPivots)
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(companies.Select(Map).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CompanyDto>> GetById(uint id)
    {
        var company = await _db.Companies
            .Include(c => c.Translations).ThenInclude(t => t.Language)
            .Include(c => c.CategoryPivots)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);

        if (company is null) return NotFound();
        if (!IsPrivileged && company.Status == CompanyStatus.Pasif) return NotFound();

        return Ok(Map(company));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<CompanyDto>> Create(CompanyUpsertDto dto)
    {
        if (!EnumParsing.TryParse<CompanyStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var company = new Company
        {
            Uuid = Guid.NewGuid(),
            Name = dto.Name,
            LogoFileId = dto.LogoFileId,
            Website = dto.Website,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            FoundedYear = dto.FoundedYear,
            EmployeeCount = dto.EmployeeCount,
            OfficeNo = dto.OfficeNo,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var t in dto.Translations)
        {
            company.Translations.Add(new CompanyTranslation { LanguageId = t.LanguageId, Description = t.Description });
        }
        foreach (var categoryId in dto.CategoryIds.Distinct())
        {
            company.CategoryPivots.Add(new CompanyCategoryPivot { CategoryId = categoryId });
        }

        _db.Companies.Add(company);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = company.Id }, Map(company));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<CompanyDto>> Update(uint id, CompanyUpsertDto dto)
    {
        if (!EnumParsing.TryParse<CompanyStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var company = await _db.Companies
            .Include(c => c.Translations)
            .Include(c => c.CategoryPivots)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (company is null) return NotFound();

        company.Name = dto.Name;
        company.LogoFileId = dto.LogoFileId;
        company.Website = dto.Website;
        company.Email = dto.Email;
        company.Phone = dto.Phone;
        company.Address = dto.Address;
        company.FoundedYear = dto.FoundedYear;
        company.EmployeeCount = dto.EmployeeCount;
        company.OfficeNo = dto.OfficeNo;
        company.Status = status;
        company.UpdatedAt = DateTime.UtcNow;

        _db.CompanyTranslations.RemoveRange(company.Translations);
        company.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            company.Translations.Add(new CompanyTranslation { LanguageId = t.LanguageId, Description = t.Description });
        }

        _db.CompanyCategoryPivots.RemoveRange(company.CategoryPivots);
        company.CategoryPivots.Clear();
        foreach (var categoryId in dto.CategoryIds.Distinct())
        {
            company.CategoryPivots.Add(new CompanyCategoryPivot { CategoryId = categoryId });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(company));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var company = await _db.Companies.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (company is null) return NotFound();
        company.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static CompanyDto Map(Company c) => new()
    {
        Id = c.Id,
        Uuid = c.Uuid,
        Name = c.Name,
        LogoFileId = c.LogoFileId,
        Website = c.Website,
        Email = c.Email,
        Phone = c.Phone,
        Address = c.Address,
        FoundedYear = c.FoundedYear,
        EmployeeCount = c.EmployeeCount,
        OfficeNo = c.OfficeNo,
        Status = c.Status.ToString(),
        CategoryIds = c.CategoryPivots.Select(p => p.CategoryId).ToList(),
        Translations = c.Translations.Select(t => new CompanyTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Description = t.Description
        }).ToList()
    };
}
