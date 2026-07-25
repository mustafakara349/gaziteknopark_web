using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class MediaAlbumTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string Title { get; set; } = string.Empty;
}

public class MediaAlbumTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;
}

public class MediaAlbumDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public uint? CoverImageFileId { get; set; }
    public bool IsActive { get; set; }
    public List<MediaAlbumTranslationDto> Translations { get; set; } = new();
}

public class MediaAlbumUpsertDto
{
    public uint? CoverImageFileId { get; set; }
    public bool IsActive { get; set; } = true;
    [MinLength(1)]
    public List<MediaAlbumTranslationUpsertDto> Translations { get; set; } = new();
}

public class MediaTranslationDto
{
    public uint LanguageId { get; set; }
    public string? LanguageCode { get; set; }
    public string? Title { get; set; }
}

public class MediaTranslationUpsertDto
{
    [Required]
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string? Title { get; set; }
}

public class MediaItemDto
{
    public uint Id { get; set; }
    public Guid? Uuid { get; set; }
    public string Type { get; set; } = string.Empty;
    public uint? FileId { get; set; }
    public string? VideoUrl { get; set; }
    public uint? AlbumId { get; set; }
    public bool IsActive { get; set; }
    public DateTime? PublishedAt { get; set; }
    public List<MediaTranslationDto> Translations { get; set; } = new();
}

public class MediaItemUpsertDto
{
    [Required]
    public string Type { get; set; } = "foto";
    public uint? FileId { get; set; }
    [MaxLength(255)]
    public string? VideoUrl { get; set; }
    public uint? AlbumId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? PublishedAt { get; set; }
    public List<MediaTranslationUpsertDto> Translations { get; set; } = new();
}
