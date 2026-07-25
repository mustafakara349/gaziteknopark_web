using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("media_albums")]
public class MediaAlbum
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    public uint? CoverImageFileId { get; set; }
    public bool IsActive { get; set; } = true;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey(nameof(CoverImageFileId))]
    public FileAsset? CoverImageFile { get; set; }

    public ICollection<MediaAlbumTranslation> Translations { get; set; } = new List<MediaAlbumTranslation>();
    public ICollection<MediaItem> MediaItems { get; set; } = new List<MediaItem>();
}

[Table("media_album_translations")]
public class MediaAlbumTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint MediaAlbumId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [ForeignKey(nameof(MediaAlbumId))]
    public MediaAlbum MediaAlbum { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}

[Table("media")]
public class MediaItem
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    public MediaType Type { get; set; } = MediaType.Foto;
    public uint? FileId { get; set; }
    [MaxLength(255)]
    public string? VideoUrl { get; set; }
    public uint? AlbumId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? PublishedAt { get; set; }
    public uint? CreatedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime? CreatedAt { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }

    [ForeignKey(nameof(FileId))]
    public FileAsset? File { get; set; }
    [ForeignKey(nameof(AlbumId))]
    public MediaAlbum? Album { get; set; }

    public ICollection<MediaTranslation> Translations { get; set; } = new List<MediaTranslation>();
}

[Table("media_translations")]
public class MediaTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint MediaId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string? Title { get; set; }

    [ForeignKey(nameof(MediaId))]
    public MediaItem Media { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}
