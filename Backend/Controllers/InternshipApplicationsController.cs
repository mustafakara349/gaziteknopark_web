using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Dtos;
using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/internship-applications")]
public class InternshipApplicationsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public InternshipApplicationsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<ActionResult<InternshipApplicationDto>> Create(InternshipApplicationCreateDto dto)
    {
        var application = new InternshipApplication
        {
            Uuid = Guid.NewGuid(),
            FullName = dto.FullName,
            IdentityNo = dto.IdentityNo,
            Email = dto.Email,
            Phone = dto.Phone,
            University = dto.University,
            Department = dto.Department,
            ClassYear = dto.ClassYear,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            CvFileId = dto.CvFileId,
            CoverLetter = dto.CoverLetter,
            Status = ApplicationStatus.Beklemede,
            AppliedAt = DateTime.UtcNow
        };

        _db.InternshipApplications.Add(application);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = application.Id }, Map(application));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpGet]
    public async Task<ActionResult<List<InternshipApplicationDto>>> GetAll()
    {
        var applications = await _db.InternshipApplications.Where(a => a.DeletedAt == null)
            .OrderByDescending(a => a.AppliedAt).ToListAsync();
        return Ok(applications.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpGet("{id}")]
    public async Task<ActionResult<InternshipApplicationDto>> GetById(uint id)
    {
        var application = await _db.InternshipApplications.FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        if (application is null) return NotFound();
        return Ok(Map(application));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var application = await _db.InternshipApplications.FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        if (application is null) return NotFound();
        application.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static InternshipApplicationDto Map(InternshipApplication a) => new()
    {
        Id = a.Id,
        Uuid = a.Uuid,
        FullName = a.FullName,
        Email = a.Email,
        Phone = a.Phone,
        University = a.University,
        Department = a.Department,
        ClassYear = a.ClassYear,
        StartDate = a.StartDate,
        EndDate = a.EndDate,
        Status = a.Status.ToString(),
        AppliedAt = a.AppliedAt
    };
}
