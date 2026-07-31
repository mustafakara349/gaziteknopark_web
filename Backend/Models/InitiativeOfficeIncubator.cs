using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("initiative_office_incubators")]
public class InitiativeOfficeIncubator
{
    [Key]
    public uint Id { get; set; }
    public uint InitiativeOfficeId { get; set; }
    [MaxLength(50)]
    public string Icon { get; set; } = string.Empty;
    public int OrderIndex { get; set; } = 0;
    public ContentStatus Status { get; set; } = ContentStatus.Published;

    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(255)]
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? Features { get; set; }

    [ForeignKey(nameof(InitiativeOfficeId))]
    public InitiativeOffice InitiativeOffice { get; set; } = null!;

    public ICollection<InitiativeOfficeIncubatorTranslation> Translations { get; set; } = new List<InitiativeOfficeIncubatorTranslation>();
}

[Table("initiative_office_incubator_translations")]
public class InitiativeOfficeIncubatorTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint IncubatorId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(255)]
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? Features { get; set; } // Stored as newline separated string for simplicity in admin panel

    [ForeignKey(nameof(IncubatorId))]
    public InitiativeOfficeIncubator Incubator { get; set; } = null!;
    
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}
