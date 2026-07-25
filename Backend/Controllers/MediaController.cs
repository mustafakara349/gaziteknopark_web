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
[Route("api/media-albums")]
public class MediaAlbumsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public MediaAlbumsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<MediaAlbumDto>>> GetAll([FromQuery] bool activeOnly = true)
    {
        var query = _db.MediaAlbums.Where(a => a.DeletedAt == null);
        if (activeOnly)
        {
            query = query.Where(a => a.IsActive);
        }

        var albums = await query.Include(a => a.Translations).ThenInclude(t => t.Language).ToListAsync();
        return Ok(albums.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<MediaAlbumDto>> Create(MediaAlbumUpsertDto dto)
    {
        var album = new MediaAlbum { Uuid = Guid.NewGuid(), CoverImageFileId = dto.CoverImageFileId, IsActive = dto.IsActive, CreatedAt = DateTime.UtcNow };
        foreach (var t in dto.Translations)
        {
            album.Translations.Add(new MediaAlbumTranslation { LanguageId = t.LanguageId, Title = t.Title });
        }

        _db.MediaAlbums.Add(album);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = album.Id }, Map(album));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<MediaAlbumDto>> Update(uint id, MediaAlbumUpsertDto dto)
    {
        var album = await _db.MediaAlbums.Include(a => a.Translations).FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        if (album is null) return NotFound();

        album.CoverImageFileId = dto.CoverImageFileId;
        album.IsActive = dto.IsActive;
        album.UpdatedAt = DateTime.UtcNow;

        _db.MediaAlbumTranslations.RemoveRange(album.Translations);
        album.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            album.Translations.Add(new MediaAlbumTranslation { LanguageId = t.LanguageId, Title = t.Title });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(album));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var album = await _db.MediaAlbums.FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
        if (album is null) return NotFound();
        album.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static MediaAlbumDto Map(MediaAlbum a) => new()
    {
        Id = a.Id,
        Uuid = a.Uuid,
        CoverImageFileId = a.CoverImageFileId,
        IsActive = a.IsActive,
        Translations = a.Translations.Select(t => new MediaAlbumTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Title = t.Title
        }).ToList()
    };
}

[ApiController]
[Route("api/media")]
public class MediaItemsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public MediaItemsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<MediaItemDto>>> GetAll([FromQuery] uint? albumId, [FromQuery] bool activeOnly = true)
    {
        var query = _db.Media.Where(m => m.DeletedAt == null);
        if (activeOnly)
        {
            query = query.Where(m => m.IsActive);
        }
        if (albumId.HasValue)
        {
            query = query.Where(m => m.AlbumId == albumId);
        }

        var items = await query.Include(m => m.Translations).ThenInclude(t => t.Language)
            .OrderByDescending(m => m.PublishedAt).ToListAsync();
        return Ok(items.Select(Map).ToList());
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<ActionResult<MediaItemDto>> Create(MediaItemUpsertDto dto)
    {
        if (!EnumParsing.TryParse<MediaType>(dto.Type, out var type))
        {
            return BadRequest("Geçersiz medya tipi.");
        }

        var media = new MediaItem
        {
            Uuid = Guid.NewGuid(),
            Type = type,
            FileId = dto.FileId,
            VideoUrl = dto.VideoUrl,
            AlbumId = dto.AlbumId,
            IsActive = dto.IsActive,
            PublishedAt = dto.PublishedAt,
            CreatedAt = DateTime.UtcNow
        };
        foreach (var t in dto.Translations)
        {
            media.Translations.Add(new MediaTranslation { LanguageId = t.LanguageId, Title = t.Title });
        }

        _db.Media.Add(media);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = media.Id }, Map(media));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<ActionResult<MediaItemDto>> Update(uint id, MediaItemUpsertDto dto)
    {
        if (!EnumParsing.TryParse<MediaType>(dto.Type, out var type))
        {
            return BadRequest("Geçersiz medya tipi.");
        }

        var media = await _db.Media.Include(m => m.Translations).FirstOrDefaultAsync(m => m.Id == id && m.DeletedAt == null);
        if (media is null) return NotFound();

        media.Type = type;
        media.FileId = dto.FileId;
        media.VideoUrl = dto.VideoUrl;
        media.AlbumId = dto.AlbumId;
        media.IsActive = dto.IsActive;
        media.PublishedAt = dto.PublishedAt;
        media.UpdatedAt = DateTime.UtcNow;

        _db.MediaTranslations.RemoveRange(media.Translations);
        media.Translations.Clear();
        foreach (var t in dto.Translations)
        {
            media.Translations.Add(new MediaTranslation { LanguageId = t.LanguageId, Title = t.Title });
        }

        await _db.SaveChangesAsync();
        return Ok(Map(media));
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(uint id)
    {
        var media = await _db.Media.FirstOrDefaultAsync(m => m.Id == id && m.DeletedAt == null);
        if (media is null) return NotFound();
        media.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static MediaItemDto Map(MediaItem m) => new()
    {
        Id = m.Id,
        Uuid = m.Uuid,
        Type = m.Type.ToString(),
        FileId = m.FileId,
        VideoUrl = m.VideoUrl,
        AlbumId = m.AlbumId,
        IsActive = m.IsActive,
        PublishedAt = m.PublishedAt,
        Translations = m.Translations.Select(t => new MediaTranslationDto
        {
            LanguageId = t.LanguageId,
            LanguageCode = t.Language?.Code,
            Title = t.Title
        }).ToList()
    };
}
