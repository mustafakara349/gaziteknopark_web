using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("team_members")]
public class TeamMember
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;
    public uint? PhotoFileId { get; set; }
    [MaxLength(255)]
    public string? LinkedinUrl { get; set; }
    public uint OrderNo { get; set; }
    public ContentStatus Status { get; set; } = ContentStatus.Published;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    [ForeignKey(nameof(PhotoFileId))]
    public FileAsset? PhotoFile { get; set; }

    public ICollection<TeamMemberTranslation> Translations { get; set; } = new List<TeamMemberTranslation>();
}

[Table("team_member_translations")]
public class TeamMemberTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint TeamMemberId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(150)]
    public string? Title { get; set; }
    public string? Bio { get; set; }

    [ForeignKey(nameof(TeamMemberId))]
    public TeamMember TeamMember { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}
