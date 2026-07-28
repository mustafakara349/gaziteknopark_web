using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Models;
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
    public async Task<ActionResult<List<LinkedInPostDto>>> GetAll([FromQuery] uint? companyId)
    {
        var query = _db.LinkedInPosts
            .Include(p => p.Company)
                .ThenInclude(c => c.LogoFile)
            .Where(p => p.IsVisible);

        if (companyId.HasValue)
        {
            query = query.Where(p => p.CompanyId == companyId);
        }

        var posts = await query
            .OrderByDescending(p => p.PublishedAt)
            .Select(p => new LinkedInPostDto
            {
                Id = p.Id,
                CompanyId = p.CompanyId,
                CompanyName = p.Company != null ? p.Company.Name : string.Empty,
                CompanyLogoUrl = p.Company != null && p.Company.LogoFile != null ? p.Company.LogoFile.Path : null,
                LinkedInPostUrn = p.LinkedInPostUrn,
                PostText = p.PostText,
                MediaType = p.MediaType,
                MediaUrl = p.MediaUrl,
                PostUrl = p.PostUrl,
                PublishedAt = p.PublishedAt
            })
            .ToListAsync();

        return Ok(posts);
    }
}
