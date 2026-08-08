using System.Security.Claims;
using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers.Admin;

public class AdminLinkedInPostDto
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
    public int Status { get; set; }
    public bool ShowOnHomepage { get; set; }
    public bool ShowOnStories { get; set; }
    public bool IsFeatured { get; set; }
    public string? ApprovedByName { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class LinkedInPostStatusUpdateDto
{
    public int? Status { get; set; }
    public bool? ShowOnHomepage { get; set; }
    public bool? ShowOnStories { get; set; }
    public bool? IsFeatured { get; set; }
}

public class LinkedInPostBulkStatusUpdateDto
{
    public List<uint> Ids { get; set; } = new();
    public int? Status { get; set; }
    public bool? ShowOnHomepage { get; set; }
    public bool? ShowOnStories { get; set; }
    public bool? IsFeatured { get; set; }
}

[ApiController]
[Route("api/admin/linkedin-posts")]
[Authorize(Roles = "Admin,Editor")]
public class AdminLinkedInPostsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminLinkedInPostsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<AdminLinkedInPostDto>>> GetAll(
        [FromQuery] int? status,
        [FromQuery] string? search,
        [FromQuery] uint? companyId,
        [FromQuery] bool? isFeatured,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _db.LinkedInPosts
            .Include(p => p.Company)
                .ThenInclude(c => c.LogoFile)
            .Include(p => p.ApprovedByUser)
            .AsQueryable();

        // Status Filter
        if (status.HasValue)
        {
            query = query.Where(p => (int)p.Status == status.Value);
        }

        // Company Filter
        if (companyId.HasValue)
        {
            query = query.Where(p => p.CompanyId == companyId.Value);
        }

        // IsFeatured Filter
        if (isFeatured.HasValue)
        {
            query = query.Where(p => p.IsFeatured == isFeatured.Value);
        }

        // Search Filter
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();
            query = query.Where(p => EF.Functions.Like(p.PostText ?? "", $"%{search}%") ||
                                     EF.Functions.Like(p.Company.Name, $"%{search}%"));
        }

        var totalCount = await query.CountAsync();
        Response.Headers.Append("X-Total-Count", totalCount.ToString());

        var posts = await query
            .OrderByDescending(p => p.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = posts.Select(p => new AdminLinkedInPostDto
        {
            Id = p.Id,
            CompanyId = p.CompanyId,
            CompanyName = p.Company != null ? p.Company.Name : string.Empty,
            CompanyLogoUrl = p.Company != null && p.Company.LogoFile != null ? GaziTeknoparkApi.Helpers.FileUrlHelper.ToAbsoluteUrl(Request, p.Company.LogoFile) : null,
            LinkedInPostUrn = p.LinkedInPostUrn,
            PostText = p.PostText,
            MediaType = p.MediaType,
            MediaUrl = p.MediaUrl,
            PostUrl = p.PostUrl,
            PublishedAt = p.PublishedAt,
            Status = (int)p.Status,
            ShowOnHomepage = p.ShowOnHomepage,
            ShowOnStories = p.ShowOnStories,
            IsFeatured = p.IsFeatured,
            ApprovedByName = p.ApprovedByUser != null ? p.ApprovedByUser.Name : null,
            ApprovedAt = p.ApprovedAt,
            UpdatedAt = p.UpdatedAt
        }).ToList();

        return Ok(dtos);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(uint id, [FromBody] LinkedInPostStatusUpdateDto dto)
    {
        var post = await _db.LinkedInPosts.FirstOrDefaultAsync(p => p.Id == id);
        if (post == null)
        {
            return NotFound("Gönderi bulunamadı.");
        }

        if (dto.Status.HasValue && !Enum.IsDefined(typeof(LinkedInPostStatus), dto.Status.Value))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var currentUserId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (dto.Status.HasValue) post.Status = (LinkedInPostStatus)dto.Status.Value;
        if (dto.ShowOnHomepage.HasValue) post.ShowOnHomepage = dto.ShowOnHomepage.Value;
        if (dto.ShowOnStories.HasValue) post.ShowOnStories = dto.ShowOnStories.Value;
        if (dto.IsFeatured.HasValue) post.IsFeatured = dto.IsFeatured.Value;

        post.ApprovedBy = currentUserId;
        post.ApprovedAt = DateTime.UtcNow;
        post.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Gönderi durumu başarıyla güncellendi." });
    }

    [HttpPost("bulk-status")]
    public async Task<IActionResult> BulkStatusUpdate([FromBody] LinkedInPostBulkStatusUpdateDto dto)
    {
        if (dto.Ids == null || !dto.Ids.Any())
        {
            return BadRequest("Herhangi bir gönderi ID'si belirtilmedi.");
        }

        if (dto.Ids.Count > 100)
        {
            return BadRequest("Tek seferde en fazla 100 gönderi güncellenebilir.");
        }

        if (dto.Status.HasValue && !Enum.IsDefined(typeof(LinkedInPostStatus), dto.Status.Value))
        {
            return BadRequest("Geçersiz durum değeri.");
        }

        var posts = await _db.LinkedInPosts.Where(p => dto.Ids.Contains(p.Id)).ToListAsync();
        if (!posts.Any())
        {
            return NotFound("Seçilen gönderiler bulunamadı.");
        }

        var currentUserId = uint.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        foreach (var post in posts)
        {
            if (dto.Status.HasValue) post.Status = (LinkedInPostStatus)dto.Status.Value;
            if (dto.ShowOnHomepage.HasValue) post.ShowOnHomepage = dto.ShowOnHomepage.Value;
            if (dto.ShowOnStories.HasValue) post.ShowOnStories = dto.ShowOnStories.Value;
            if (dto.IsFeatured.HasValue) post.IsFeatured = dto.IsFeatured.Value;

            post.ApprovedBy = currentUserId;
            post.ApprovedAt = DateTime.UtcNow;
            post.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        return Ok(new { message = $"{posts.Count} adet gönderi başarıyla güncellendi." });
    }
}
