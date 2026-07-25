using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("menu_items")]
public class MenuItem
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(255)]
    public string? Url { get; set; }
    public uint? ParentId { get; set; }
    public MenuLocation Location { get; set; } = MenuLocation.Header;
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
    public uint? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    [ForeignKey(nameof(ParentId))]
    public MenuItem? Parent { get; set; }
    public ICollection<MenuItem> Children { get; set; } = new List<MenuItem>();

    public ICollection<MenuItemTranslation> Translations { get; set; } = new List<MenuItemTranslation>();
}

[Table("menu_item_translations")]
public class MenuItemTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint MenuItemId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [ForeignKey(nameof(MenuItemId))]
    public MenuItem MenuItem { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}
