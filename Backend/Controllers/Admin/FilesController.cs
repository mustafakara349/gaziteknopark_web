using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GaziTeknoparkApi.Controllers.Admin;

[Authorize(Roles = "Admin,Editor")]
[ApiController]
[Route("api/files")]
public class FilesController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IWebHostEnvironment _env;

    public FilesController(ApplicationDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    [HttpPost("upload")]
    public async Task<ActionResult<object>> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Dosya bulunamadı.");

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploadsFolder = Path.Combine(webRoot, "uploads", "general");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileAsset = new FileAsset
        {
            Uuid = Guid.NewGuid(),
            Name = uniqueFileName,
            OriginalName = file.FileName,
            Path = $"/uploads/general/{uniqueFileName}",
            Size = (uint)file.Length,
            Mime = file.ContentType,
            UploadedBy = GetUserId(),
            CreatedAt = DateTime.UtcNow
        };

        _db.Files.Add(fileAsset);
        await _db.SaveChangesAsync();

        return Ok(new { 
            id = fileAsset.Id, 
            url = fileAsset.Path, 
            originalName = fileAsset.OriginalName 
        });
    }

    private uint? GetUserId()
    {
        var idClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
        if (idClaim != null && uint.TryParse(idClaim.Value, out var id))
            return id;
        return null;
    }
}
