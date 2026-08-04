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
[Route("api/activity-areas")]
public class ActivityAreasController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ActivityAreasController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<ActivityAreaDto>>> GetAll()
    {
        var areas = await _db.ActivityAreas.Where(a => a.DeletedAt == null)
            .Include(a => a.Translations).ThenInclude(t => t.Language).ToListAsync();
        return Ok(areas.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<ActivityAreaDto>> Create(ActivityAreaUpsertDto dto)
    {
        var area = new ActivityArea { CreatedAt = DateTime.UtcNow };
        foreach (var t in dto.Translations)
        {
            area.Translations.Add(new ActivityAreaTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        _db.ActivityAreas.Add(area);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = area.Id }, Map(area));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ActivityAreaDto>> Update(uint id, ActivityAreaUpsertDto dto)
    {
        var area = await _db.ActivityAreas.Include(a => a.Translations)
            .FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        if (area is null) return NotFound();

        area.UpdatedAt = DateTime.UtcNow;

        _db.ActivityAreaTranslations.RemoveRange(area.Translations);
        area.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            area.Translations.Add(new ActivityAreaTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(area));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var area = await _db.ActivityAreas.FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        if (area is null) return NotFound();
        area.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static ActivityAreaDto Map(ActivityArea a) => new()
    {
        Id = a.Id,
        Translations = a.Translations.Select(t => new ActivityAreaTranslationDto
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
    public async Task<ActionResult<List<CompanyDto>>> GetAll([FromQuery] uint? categoryId, [FromQuery] uint? activityAreaId)
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
        if (activityAreaId.HasValue)
        {
            query = query.Where(c => c.ActivityAreaPivots.Any(p => p.ActivityAreaId == activityAreaId));
        }

        var companies = await query
            .Include(c => c.Translations).ThenInclude(t => t.Language)
            .Include(c => c.CategoryPivots)
            .Include(c => c.ActivityAreaPivots)
            .Include(c => c.LogoFile)
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(companies.Select(c => Map(c)).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CompanyDto>> GetById(uint id)
    {
        var company = await _db.Companies
            .Include(c => c.Translations).ThenInclude(t => t.Language)
            .Include(c => c.CategoryPivots)
            .Include(c => c.ActivityAreaPivots)
            .Include(c => c.LogoFile)
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
            ShortName = dto.ShortName,
            LogoFileId = dto.LogoFileId,
            Website = dto.Website,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            FoundedYear = dto.FoundedYear,
            EmployeeCount = dto.EmployeeCount,
            OfficeNo = dto.OfficeNo,
            FacebookUrl = dto.FacebookUrl,
            InstagramUrl = dto.InstagramUrl,
            XUrl = dto.XUrl,
            LinkedInUrl = dto.LinkedInUrl,
            YoutubeUrl = dto.YoutubeUrl,
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
        foreach (var activityAreaId in dto.ActivityAreaIds.Distinct())
        {
            company.ActivityAreaPivots.Add(new CompanyActivityAreaPivot { ActivityAreaId = activityAreaId });
        }

        _db.Companies.Add(company);
        await _db.SaveChangesAsync();
        await _db.Entry(company).Reference(c => c.LogoFile).LoadAsync();
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
            .Include(c => c.ActivityAreaPivots)
            .Include(c => c.LogoFile)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (company is null) return NotFound();

        company.Name = dto.Name;
        company.ShortName = dto.ShortName;
        company.LogoFileId = dto.LogoFileId;
        company.Website = dto.Website;
        company.Email = dto.Email;
        company.Phone = dto.Phone;
        company.Address = dto.Address;
        company.FoundedYear = dto.FoundedYear;
        company.EmployeeCount = dto.EmployeeCount;
        company.OfficeNo = dto.OfficeNo;
        company.FacebookUrl = dto.FacebookUrl;
        company.InstagramUrl = dto.InstagramUrl;
        company.XUrl = dto.XUrl;
        company.LinkedInUrl = dto.LinkedInUrl;
        company.YoutubeUrl = dto.YoutubeUrl;
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

        _db.CompanyActivityAreaPivots.RemoveRange(company.ActivityAreaPivots);
        company.ActivityAreaPivots.Clear();
        foreach (var activityAreaId in dto.ActivityAreaIds.Distinct())
        {
            company.ActivityAreaPivots.Add(new CompanyActivityAreaPivot { ActivityAreaId = activityAreaId });
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

    private CompanyDto Map(Company c) => new()
    {
        Id = c.Id,
        Uuid = c.Uuid,
        Name = c.Name,
        ShortName = c.ShortName,
        LogoFileId = c.LogoFileId,
        LogoUrl = FileUrlHelper.ToAbsoluteUrl(Request, c.LogoFile),
        Website = c.Website,
        Email = c.Email,
        Phone = c.Phone,
        Address = c.Address,
        FoundedYear = c.FoundedYear,
        EmployeeCount = c.EmployeeCount,
        OfficeNo = c.OfficeNo,
        FacebookUrl = c.FacebookUrl,
        InstagramUrl = c.InstagramUrl,
        XUrl = c.XUrl,
        LinkedInUrl = c.LinkedInUrl,
        YoutubeUrl = c.YoutubeUrl,
        Status = c.Status.ToString(),
        CategoryIds = c.CategoryPivots.Select(p => p.CategoryId).ToList(),
        ActivityAreaIds = c.ActivityAreaPivots.Select(p => p.ActivityAreaId).ToList(),
        Translations = c.Translations.Select(t => new CompanyTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Description = t.Description
        }).ToList()
    };
}
