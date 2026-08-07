using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/faq")]
public class FaqController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public FaqController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [HttpGet("/api/faqs")]
    public async Task<ActionResult<List<FaqDto>>> GetAll()
    {
        var faqs = await _db.Faqs
            .Include(f => f.FaqCategory)
            .Include(f => f.Tags)
            .Where(f => f.IsActive && f.DeletedAt == null)
            .OrderBy(f => f.OrderNo)
            .ToListAsync();

        return Ok(faqs.Select(Map).ToList());
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
