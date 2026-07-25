using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("popup_announcements")]
public class PopupAnnouncement
{
    [Key]
    public uint Id { get; set; }
    public uint? ImageFileId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    [ForeignKey(nameof(ImageFileId))]
    public FileAsset? ImageFile { get; set; }

    public ICollection<PopupAnnouncementTranslation> Translations { get; set; } = new List<PopupAnnouncementTranslation>();
}

[Table("popup_announcement_translations")]
public class PopupAnnouncementTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint PopupAnnouncementId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string? Title { get; set; }
    public string? Content { get; set; }
    [MaxLength(100)]
    public string? ButtonText { get; set; }
    [MaxLength(255)]
    public string? ButtonUrl { get; set; }

    [ForeignKey(nameof(PopupAnnouncementId))]
    public PopupAnnouncement PopupAnnouncement { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}
