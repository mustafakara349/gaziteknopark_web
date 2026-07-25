using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("events")]
public class Event
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public uint? CoverImageFileId { get; set; }
    public ContentStatus Status { get; set; } = ContentStatus.Draft;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? PublishedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey(nameof(CoverImageFileId))]
    public FileAsset? CoverImageFile { get; set; }

    public ICollection<EventTranslation> Translations { get; set; } = new List<EventTranslation>();
}

[Table("event_translations")]
public class EventTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint EventId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(255)]
    public string Slug { get; set; } = string.Empty;
    [MaxLength(255)]
    public string? Location { get; set; }
    public string? Description { get; set; }
    [MaxLength(255)]
    public string? MetaTitle { get; set; }
    [MaxLength(500)]
    public string? MetaDescription { get; set; }
    [MaxLength(500)]
    public string? MetaKeywords { get; set; }
    [MaxLength(255)]
    public string? CanonicalUrl { get; set; }
    public uint? OgImageFileId { get; set; }
    [MaxLength(500)]
    public string? SearchKeywords { get; set; }

    [ForeignKey(nameof(EventId))]
    public Event Event { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
    [ForeignKey(nameof(OgImageFileId))]
    public FileAsset? OgImageFile { get; set; }
}
