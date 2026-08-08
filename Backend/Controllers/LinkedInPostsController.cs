using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

public class LinkedInPostDto
{
    public uint Id { get; set; }
    public uint CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string? CompanyLogoUrl { get; set; }
    public string LinkedInPostUrn { get; set; } = string.Empty;
    public string? PostText { get; set; }
    public string? MediaType { get; set; }
    public string? MediaUrl { get; set; }
    public string? PostUrl { get; set; }
    public DateTime PublishedAt { get; set; }
    public bool IsFeatured { get; set; }
    public string Platform => "linkedin";
}

[ApiController]
[Route("api/linkedin-posts")]
public class LinkedInPostsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public LinkedInPostsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<LinkedInPostDto>>> GetAll(
        [FromQuery] uint? companyId,
        [FromQuery] bool? showOnHomepage,
        [FromQuery] bool? showOnStories,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        var query = _db.LinkedInPosts
            .Include(p => p.Company)
                .ThenInclude(c => c.LogoFile)
            .Where(p => p.IsVisible && p.Status == LinkedInPostStatus.Approved);

        if (companyId.HasValue)
            query = query.Where(p => p.CompanyId == companyId);

        if (showOnHomepage.HasValue)
            query = query.Where(p => p.ShowOnHomepage == showOnHomepage.Value);

        if (showOnStories.HasValue)
            query = query.Where(p => p.ShowOnStories == showOnStories.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p =>
                (p.PostText != null && p.PostText.ToLower().Contains(term)) ||
                (p.Company != null && p.Company.Name.ToLower().Contains(term)));
        }

        // Total count before pagination (for X-Total-Count header)
        var totalCount = await query.CountAsync();
        Response.Headers["X-Total-Count"] = totalCount.ToString();
        Response.Headers.Append("Access-Control-Expose-Headers", "X-Total-Count");

        // Clamp page to valid range
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 12;
        if (pageSize > 100) pageSize = 100;

        var posts = await query
            .OrderByDescending(p => p.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = posts.Select(p => new LinkedInPostDto
        {
            Id = p.Id,
            CompanyId = p.CompanyId,
            CompanyName = p.Company != null ? p.Company.Name : string.Empty,
            CompanyLogoUrl = p.Company != null && p.Company.LogoFile != null
                ? GaziTeknoparkApi.Helpers.FileUrlHelper.ToAbsoluteUrl(Request, p.Company.LogoFile)
                : null,
            LinkedInPostUrn = p.LinkedInPostUrn,
            PostText = p.PostText,
            MediaType = p.MediaType,
            MediaUrl = p.MediaUrl,
            PostUrl = p.PostUrl,
            PublishedAt = p.PublishedAt,
            IsFeatured = p.IsFeatured
        }).ToList();

        return Ok(dtos);
    }
}
