using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("settings")]
public class Setting
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(100)]
    public string SettingKey { get; set; } = string.Empty;
    public SettingType Type { get; set; } = SettingType.Text;
    public bool IsTranslatable { get; set; } = true;
    public uint? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }

    public ICollection<SettingTranslation> Translations { get; set; } = new List<SettingTranslation>();
}

[Table("setting_translations")]
public class SettingTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint SettingId { get; set; }
    public uint LanguageId { get; set; }
    public string? Value { get; set; }
    public uint? FileId { get; set; }

    [ForeignKey(nameof(SettingId))]
    public Setting Setting { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
    [ForeignKey(nameof(FileId))]
    public FileAsset? File { get; set; }
}
