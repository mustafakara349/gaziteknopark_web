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
[Route("api/initiative-office")]
public class InitiativeOfficeController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public InitiativeOfficeController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<InitiativeOfficeDto>>> GetAll()
    {
        var query = _db.InitiativeOffices.AsNoTracking().Where(i => i.DeletedAt == null);
        if (!IsPrivileged)
        {
            query = query.Where(i => i.Status == ContentStatus.Published);
        }

        var items = await query
            .Include(i => i.ImageFile)
            .Include(i => i.Translations).ThenInclude(t => t.Language)
            .Include(i => i.Incubators.Where(x => IsPrivileged || x.Status == ContentStatus.Published).OrderBy(x => x.OrderIndex)).ThenInclude(x => x.Translations).ThenInclude(t => t.Language)
            .ToListAsync();
        return Ok(items.Select(Map).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InitiativeOfficeDto>> GetById(uint id)
    {
        var item = await _db.InitiativeOffices
            .AsNoTracking()
            .Include(i => i.ImageFile)
            .Include(i => i.Translations).ThenInclude(t => t.Language)
            .Include(i => i.Incubators.Where(x => IsPrivileged || x.Status == ContentStatus.Published).OrderBy(x => x.OrderIndex)).ThenInclude(x => x.Translations).ThenInclude(t => t.Language)
            .FirstOrDefaultAsync(i => i.Id == id && i.DeletedAt == null);
        if (item is null) return NotFound();
        if (!IsPrivileged && item.Status != ContentStatus.Published) return NotFound();
        return Ok(Map(item));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<InitiativeOfficeDto>> Create(InitiativeOfficeUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var item = new InitiativeOffice 
        { 
            Uuid = Guid.NewGuid(), 
            ImageFileId = dto.ImageFileId, 
            Status = status, 
            Title = dto.Title,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow 
        };
        foreach (var t in dto.Translations)
        {
            item.Translations.Add(new InitiativeOfficeTranslation
            {
                LanguageId = t.LanguageId,
                Title = t.Title,
                Content = t.Content,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription,
                MetaKeywords = t.MetaKeywords,
                CanonicalUrl = t.CanonicalUrl,
                OgImageFileId = t.OgImageFileId,
                SearchKeywords = t.SearchKeywords
            });
        }
        
        foreach (var inc in dto.Incubators)
        {
            if (!EnumParsing.TryParse<ContentStatus>(inc.Status, out var incStatus)) incStatus = ContentStatus.Published;
            var incubator = new InitiativeOfficeIncubator
            {
                Icon = inc.Icon,
                OrderIndex = inc.OrderIndex,
                Status = incStatus,
                Title = inc.Title,
                Subtitle = inc.Subtitle,
                Description = inc.Description,
                Features = inc.Features
            };
            foreach (var t in inc.Translations)
            {
                incubator.Translations.Add(new InitiativeOfficeIncubatorTranslation
                {
                    LanguageId = t.LanguageId,
                    Title = t.Title,
                    Subtitle = t.Subtitle,
                    Description = t.Description,
                    Features = t.Features
                });
            }
            item.Incubators.Add(incubator);
        }

        _db.InitiativeOffices.Add(item);
        await _db.SaveChangesAsync();
        if (item.ImageFileId.HasValue)
        {
            await _db.Entry(item).Reference(x => x.ImageFile).LoadAsync();
        }
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, Map(item));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<InitiativeOfficeDto>> Update(uint id, InitiativeOfficeUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var item = await _db.InitiativeOffices
            .Include(i => i.ImageFile)
            .Include(i => i.Translations)
            .Include(i => i.Incubators).ThenInclude(x => x.Translations)
            .FirstOrDefaultAsync(i => i.Id == id && i.DeletedAt == null);
            
        if (item is null) return NotFound();

        item.ImageFileId = dto.ImageFileId;
        item.Status = status;
        item.Title = dto.Title;
        item.Content = dto.Content;
        item.UpdatedAt = DateTime.UtcNow;

        // --- Çeviri Upsert (LanguageId ile eşleştir) ---
        var incomingTransLangIds = dto.Translations.Select(t => t.LanguageId).ToHashSet();
        var removedTranslations = item.Translations.Where(t => !incomingTransLangIds.Contains(t.LanguageId)).ToList();
        _db.InitiativeOfficeTranslations.RemoveRange(removedTranslations);

        foreach (var t in dto.Translations)
        {
            var existing = item.Translations.FirstOrDefault(x => x.LanguageId == t.LanguageId);
            if (existing is not null)
            {
                existing.Title = t.Title;
                existing.Content = t.Content;
                existing.MetaTitle = t.MetaTitle;
                existing.MetaDescription = t.MetaDescription;
                existing.MetaKeywords = t.MetaKeywords;
                existing.CanonicalUrl = t.CanonicalUrl;
                existing.OgImageFileId = t.OgImageFileId;
                existing.SearchKeywords = t.SearchKeywords;
            }
            else
            {
                item.Translations.Add(new InitiativeOfficeTranslation
                {
                    LanguageId = t.LanguageId,
                    Title = t.Title,
                    Content = t.Content,
                    MetaTitle = t.MetaTitle,
                    MetaDescription = t.MetaDescription,
                    MetaKeywords = t.MetaKeywords,
                    CanonicalUrl = t.CanonicalUrl,
                    OgImageFileId = t.OgImageFileId,
                    SearchKeywords = t.SearchKeywords
                });
            }
        }

        // --- Kuluçka Upsert (Id ile eşleştir) ---
        var incomingIncIds = dto.Incubators.Where(i => i.Id.HasValue).Select(i => i.Id!.Value).ToHashSet();
        var removedIncubators = item.Incubators.Where(i => !incomingIncIds.Contains(i.Id)).ToList();
        _db.InitiativeOfficeIncubators.RemoveRange(removedIncubators);

        foreach (var inc in dto.Incubators)
        {
            if (!EnumParsing.TryParse<ContentStatus>(inc.Status, out var incStatus)) incStatus = ContentStatus.Published;

            InitiativeOfficeIncubator incubator;
            if (inc.Id.HasValue && item.Incubators.FirstOrDefault(x => x.Id == inc.Id.Value) is { } existingInc)
            {
                incubator = existingInc;
                incubator.Icon = inc.Icon;
                incubator.OrderIndex = inc.OrderIndex;
                incubator.Status = incStatus;
                incubator.Title = inc.Title;
                incubator.Subtitle = inc.Subtitle;
                incubator.Description = inc.Description;
                incubator.Features = inc.Features;

                // Kuluçka çevirileri upsert (LanguageId ile eşleştir)
                var incTransLangIds = inc.Translations.Select(t => t.LanguageId).ToHashSet();
                var removedIncTrans = incubator.Translations.Where(t => !incTransLangIds.Contains(t.LanguageId)).ToList();
                _db.InitiativeOfficeIncubatorTranslations.RemoveRange(removedIncTrans);

                foreach (var t in inc.Translations)
                {
                    var existingT = incubator.Translations.FirstOrDefault(x => x.LanguageId == t.LanguageId);
                    if (existingT is not null)
                    {
                        existingT.Title = t.Title;
                        existingT.Subtitle = t.Subtitle;
                        existingT.Description = t.Description;
                        existingT.Features = t.Features;
                    }
                    else
                    {
                        incubator.Translations.Add(new InitiativeOfficeIncubatorTranslation
                        {
                            LanguageId = t.LanguageId,
                            Title = t.Title,
                            Subtitle = t.Subtitle,
                            Description = t.Description,
                            Features = t.Features
                        });
                    }
                }
            }
            else
            {
                incubator = new InitiativeOfficeIncubator
                {
                    Icon = inc.Icon,
                    OrderIndex = inc.OrderIndex,
                    Status = incStatus,
                    Title = inc.Title,
                    Subtitle = inc.Subtitle,
                    Description = inc.Description,
                    Features = inc.Features
                };
                foreach (var t in inc.Translations)
                {
                    incubator.Translations.Add(new InitiativeOfficeIncubatorTranslation
                    {
                        LanguageId = t.LanguageId,
                        Title = t.Title,
                        Subtitle = t.Subtitle,
                        Description = t.Description,
                        Features = t.Features
                    });
                }
                item.Incubators.Add(incubator);
            }
        }

        await _db.SaveChangesAsync();
        if (item.ImageFileId.HasValue)
        {
            await _db.Entry(item).Reference(x => x.ImageFile).LoadAsync();
        }
        return Ok(Map(item));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var item = await _db.InitiativeOffices.FirstOrDefaultAsync(i => i.Id == id && i.DeletedAt == null);
        if (item is null) return NotFound();
        item.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private InitiativeOfficeDto Map(InitiativeOffice i) => new()
    {
        Id = i.Id,
        Uuid = i.Uuid,
        ImageFileId = i.ImageFileId,
        ImageUrl = FileUrlHelper.ToAbsoluteUrl(Request, i.ImageFile),
        Status = i.Status.ToString(),
        Title = i.Title,
        Content = i.Content,
        Translations = i.Translations.Select(t => new InitiativeOfficeTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Title = t.Title,
            Content = t.Content,
            MetaTitle = t.MetaTitle,
            MetaDescription = t.MetaDescription,
            MetaKeywords = t.MetaKeywords,
            CanonicalUrl = t.CanonicalUrl,
            OgImageFileId = t.OgImageFileId,
            SearchKeywords = t.SearchKeywords
        }).ToList(),
        Incubators = i.Incubators?.Select(x => new InitiativeOfficeIncubatorDto
        {
            Id = x.Id,
            Icon = x.Icon,
            OrderIndex = x.OrderIndex,
            Status = x.Status.ToString(),
            Title = x.Title,
            Subtitle = x.Subtitle,
            Description = x.Description,
            Features = x.Features,
            Translations = x.Translations.Select(t => new InitiativeOfficeIncubatorTranslationDto
            {
                LanguageId = t.LanguageId,
                LanguageCode = t.Language?.Code,
                Title = t.Title,
                Subtitle = t.Subtitle,
                Description = t.Description,
                Features = t.Features
            }).ToList()
        }).ToList() ?? new List<InitiativeOfficeIncubatorDto>()
    };
}
