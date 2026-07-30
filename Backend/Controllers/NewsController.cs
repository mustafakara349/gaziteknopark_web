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
[Route("api/news-categories")]
public class NewsCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public NewsCategoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<NewsCategoryDto>>> GetAll()
    {
        var categories = await _db.NewsCategories
            .Where(c => c.DeletedAt == null)
            .Include(c => c.Translations).ThenInclude(t => t.Language)
            .OrderBy(c => c.OrderNo)
            .ToListAsync();

        return Ok(categories.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<NewsCategoryDto>> Create(NewsCategoryUpsertDto dto)
    {
        var category = new NewsCategory 
        { 
            Name = dto.Name,
            Slug = dto.Slug,
            OrderNo = dto.OrderNo, 
            CreatedAt = DateTime.UtcNow 
        };

        foreach (var t in dto.Translations)
        {
            category.Translations.Add(new NewsCategoryTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        _db.NewsCategories.Add(category);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = category.Id }, Map(category));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<NewsCategoryDto>> Update(uint id, NewsCategoryUpsertDto dto)
    {
        var category = await _db.NewsCategories.Include(c => c.Translations)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (category is null) return NotFound();

        category.Name = dto.Name;
        category.Slug = dto.Slug;
        category.OrderNo = dto.OrderNo;
        category.UpdatedAt = DateTime.UtcNow;

        _db.NewsCategoryTranslations.RemoveRange(category.Translations);
        category.Translations.Clear();

        foreach (var t in dto.Translations)
        {
            category.Translations.Add(new NewsCategoryTranslation { LanguageId = t.LanguageId, Name = t.Name });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(category));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var category = await _db.NewsCategories.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null);
        if (category is null) return NotFound();
        category.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static NewsCategoryDto Map(NewsCategory c) => new()
    {
        Id = c.Id,
        OrderNo = c.OrderNo,
        Name = c.Name,
        Slug = c.Slug,
        Translations = c.Translations.Select(t => new NewsCategoryTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Name = t.Name
        }).ToList()
    };
}

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public NewsController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool IsPrivileged => User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.IsInRole("Editor"));

    [HttpGet]
    public async Task<ActionResult<List<NewsDto>>> GetAll(
        [FromQuery] uint? categoryId,
        [FromQuery] string? search,
        [FromQuery] string? sort,
        [FromQuery] DateTime? date,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] int? page,
        [FromQuery] int? pageSize)
    {
        var query = _db.News
            .Include(n => n.Category)
            .Include(n => n.Translations).ThenInclude(t => t.Language)
            .Where(n => n.DeletedAt == null);

        if (!IsPrivileged)
        {
            query = query.Where(n => n.Status == ContentStatus.Published);
        }
        if (categoryId.HasValue && categoryId.Value > 0)
        {
            query = query.Where(n => n.CategoryId == categoryId.Value);
        }
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(n =>
                EF.Functions.Like(n.Title.ToLower(), $"%{term}%") ||
                (n.Summary != null && EF.Functions.Like(n.Summary.ToLower(), $"%{term}%")) ||
                (n.Content != null && EF.Functions.Like(n.Content.ToLower(), $"%{term}%")) ||
                (n.AuthorName != null && EF.Functions.Like(n.AuthorName.ToLower(), $"%{term}%"))
            );
        }
        if (date.HasValue)
        {
            var targetDate = date.Value.Date;
            query = query.Where(n => n.PublishedAt.HasValue && n.PublishedAt.Value.Date == targetDate);
        }
        if (startDate.HasValue)
        {
            query = query.Where(n => n.PublishedAt >= startDate.Value);
        }
        if (endDate.HasValue)
        {
            query = query.Where(n => n.PublishedAt <= endDate.Value);
        }

        if (sort == "oldest")
        {
            query = query.OrderBy(n => n.PublishedAt ?? n.CreatedAt);
        }
        else
        {
            query = query.OrderByDescending(n => n.PublishedAt ?? n.CreatedAt);
        }

        var totalCount = await query.CountAsync();
        Response.Headers["X-Total-Count"] = totalCount.ToString();

        if (page.HasValue && page.Value > 0 && pageSize.HasValue && pageSize.Value > 0)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        var newsList = await query.ToListAsync();

        // Optimized Batch Mapping to eliminate N+1 queries
        var newsIds = newsList.Select(n => n.Id).ToList();
        var coverFileIds = newsList.Where(n => n.CoverImageFileId.HasValue).Select(n => n.CoverImageFileId!.Value).Distinct().ToList();

        var galleriesData = await _db.EntityGalleries
            .Where(eg => (eg.ModelType == "News" || eg.ModelType == "NewsAnnouncement") && newsIds.Contains(eg.ModelId) && eg.DeletedAt == null)
            .OrderBy(eg => eg.OrderNo)
            .ToListAsync();

        var galleryFileIds = galleriesData.Select(eg => eg.FileId).Distinct().ToList();
        var allFileIds = coverFileIds.Concat(galleryFileIds).Distinct().ToList();

        var fileMap = await _db.Files
            .Where(f => allFileIds.Contains(f.Id))
            .ToDictionaryAsync(f => f.Id, f => f.Path);

        var result = new List<NewsDto>();
        foreach (var n in newsList)
        {
            var coverImageUrl = n.CoverImageFileId.HasValue && fileMap.TryGetValue(n.CoverImageFileId.Value, out var cPath) ? cPath : null;
            var itemGalleries = galleriesData.Where(eg => eg.ModelId == n.Id).ToList();
            
            var additionalFileIds = itemGalleries.Select(eg => eg.FileId).ToList();
            var additionalUrls = itemGalleries
                .Select(eg => fileMap.TryGetValue(eg.FileId, out var gPath) ? gPath : null)
                .Where(p => !string.IsNullOrEmpty(p))
                .Cast<string>()
                .ToList();

            result.Add(new NewsDto
            {
                Id = n.Id,
                Uuid = n.Uuid,
                CategoryId = n.CategoryId,
                CategoryName = n.Category?.Name ?? "Genel",
                CoverImageFileId = n.CoverImageFileId,
                CoverImageUrl = coverImageUrl,
                Status = n.Status.ToString(),
                PublishedAt = n.PublishedAt,
                Views = n.Views,
                CreatedAt = n.CreatedAt,
                IsFeatured = n.IsFeatured,
                AuthorName = n.AuthorName,
                ReadTime = n.ReadTime,
                VideoUrl = n.VideoUrl,
                Title = n.Title,
                Slug = n.Slug,
                Summary = n.Summary,
                Content = n.Content,
                MetaTitle = n.MetaTitle,
                MetaDescription = n.MetaDescription,
                AdditionalImageFileIds = additionalFileIds,
                AdditionalImageUrls = additionalUrls,
                Translations = n.Translations.Select(t => new NewsTranslationDto
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
                    SearchKeywords = t.SearchKeywords
                }).ToList()
            });
        }

        return Ok(result);
    }

    [HttpGet("{idOrSlug}")]
    public async Task<ActionResult<NewsDto>> GetByIdOrSlug(string idOrSlug)
    {
        News? news = null;
        if (uint.TryParse(idOrSlug, out var id))
        {
            news = await _db.News
                .Include(n => n.Category)
                .Include(n => n.Translations).ThenInclude(t => t.Language)
                .FirstOrDefaultAsync(n => n.Id == id && n.DeletedAt == null);
        }

        if (news == null)
        {
            news = await _db.News
                .Include(n => n.Category)
                .Include(n => n.Translations).ThenInclude(t => t.Language)
                .FirstOrDefaultAsync(n => n.Slug == idOrSlug && n.DeletedAt == null);
        }

        if (news is null) return NotFound();
        if (!IsPrivileged && news.Status != ContentStatus.Published) return NotFound();

        news.Views++;
        await _db.SaveChangesAsync();

        var dto = await MapAsync(news, _db);
        return Ok(dto);
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<NewsDto>> Create(NewsUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var news = new News
        {
            Uuid = Guid.NewGuid(),
            CategoryId = dto.CategoryId,
            CoverImageFileId = dto.CoverImageFileId,
            Status = status,
            PublishedAt = dto.PublishedAt,
            IsFeatured = dto.IsFeatured,
            AuthorName = dto.AuthorName,
            ReadTime = dto.ReadTime,
            VideoUrl = dto.VideoUrl,
            Title = dto.Title,
            Slug = dto.Slug,
            Summary = dto.Summary,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var t in dto.Translations)
        {
            news.Translations.Add(new NewsTranslation
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
                SearchKeywords = t.SearchKeywords
            });
        }

        _db.News.Add(news);
        await _db.SaveChangesAsync();

        if (dto.AdditionalImageFileIds != null && dto.AdditionalImageFileIds.Any())
        {
            for (int i = 0; i < dto.AdditionalImageFileIds.Count; i++)
            {
                _db.EntityGalleries.Add(new EntityGallery
                {
                    ModelType = "News",
                    ModelId = news.Id,
                    FileId = dto.AdditionalImageFileIds[i],
                    OrderNo = (uint)i,
                    CreatedAt = DateTime.UtcNow
                });
            }
            await _db.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetByIdOrSlug), new { idOrSlug = news.Id }, await MapAsync(news, _db));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<NewsDto>> Update(uint id, NewsUpsertDto dto)
    {
        if (!EnumParsing.TryParse<ContentStatus>(dto.Status, out var status))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var news = await _db.News.Include(n => n.Translations)
            .FirstOrDefaultAsync(n => n.Id == id && n.DeletedAt == null);
        if (news is null) return NotFound();

        news.CategoryId = dto.CategoryId;
        news.CoverImageFileId = dto.CoverImageFileId;
        news.Status = status;
        news.PublishedAt = dto.PublishedAt;
        news.IsFeatured = dto.IsFeatured;
        news.AuthorName = dto.AuthorName;
        news.ReadTime = dto.ReadTime;
        news.VideoUrl = dto.VideoUrl;
        news.Title = dto.Title;
        news.Slug = dto.Slug;
        news.Summary = dto.Summary;
        news.Content = dto.Content;
        news.UpdatedAt = DateTime.UtcNow;

        _db.NewsTranslations.RemoveRange(news.Translations);
        news.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            news.Translations.Add(new NewsTranslation
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
                SearchKeywords = t.SearchKeywords
            });
        }

        if (dto.AdditionalImageFileIds != null)
        {
            var existingGalleries = await _db.EntityGalleries
                .Where(eg => eg.ModelType == "News" && eg.ModelId == news.Id)
                .ToListAsync();
            _db.EntityGalleries.RemoveRange(existingGalleries);

            for (int i = 0; i < dto.AdditionalImageFileIds.Count; i++)
            {
                _db.EntityGalleries.Add(new EntityGallery
                {
                    ModelType = "News",
                    ModelId = news.Id,
                    FileId = dto.AdditionalImageFileIds[i],
                    OrderNo = (uint)i,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _db.SaveChangesAsync();
        return Ok(await MapAsync(news, _db));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var news = await _db.News.FirstOrDefaultAsync(n => n.Id == id && n.DeletedAt == null);
        if (news is null) return NotFound();
        news.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static async Task<NewsDto> MapAsync(News n, ApplicationDbContext db)
    {
        var additionalImagesData = await db.EntityGalleries
            .Where(eg => (eg.ModelType == "News" || eg.ModelType == "NewsAnnouncement") && eg.ModelId == n.Id && eg.DeletedAt == null)
            .OrderBy(eg => eg.OrderNo)
            .Select(eg => new { eg.FileId, FilePath = db.Files.Where(f => f.Id == eg.FileId).Select(f => f.Path).FirstOrDefault() })
            .ToListAsync();

        var coverImageUrl = n.CoverImageFileId.HasValue ? await db.Files.Where(f => f.Id == n.CoverImageFileId).Select(f => f.Path).FirstOrDefaultAsync() : null;
        var categoryName = n.Category?.Name ?? "Genel";

        return new NewsDto
        {
            Id = n.Id,
            Uuid = n.Uuid,
            CategoryId = n.CategoryId,
            CategoryName = categoryName,
            CoverImageFileId = n.CoverImageFileId,
            CoverImageUrl = coverImageUrl,
            Status = n.Status.ToString(),
            PublishedAt = n.PublishedAt,
            Views = n.Views,
            CreatedAt = n.CreatedAt,
            IsFeatured = n.IsFeatured,
            AuthorName = n.AuthorName,
            ReadTime = n.ReadTime,
            VideoUrl = n.VideoUrl,
            Title = n.Title,
            Slug = n.Slug,
            Summary = n.Summary,
            Content = n.Content,
            MetaTitle = n.MetaTitle,
            MetaDescription = n.MetaDescription,
            AdditionalImageFileIds = additionalImagesData.Select(x => x.FileId).ToList(),
            AdditionalImageUrls = additionalImagesData.Where(x => !string.IsNullOrEmpty(x.FilePath)).Select(x => x.FilePath!).ToList(),
            Translations = n.Translations.Select(t => new NewsTranslationDto
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
                SearchKeywords = t.SearchKeywords
            }).ToList()
        };
    }
}
