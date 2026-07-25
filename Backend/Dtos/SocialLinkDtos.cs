using System.ComponentModel.DataAnnotations;

namespace GaziTeknoparkApi.Dtos;

public class SocialLinkDto
{
    public uint Id { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; }
}

public class SocialLinkUpsertDto
{
    [Required, MaxLength(100)]
    public string Icon { get; set; } = string.Empty;
    [Required, MaxLength(255)]
    public string Url { get; set; } = string.Empty;
    public uint OrderNo { get; set; }
    public bool IsActive { get; set; } = true;
}
