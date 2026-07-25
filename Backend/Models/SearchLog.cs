using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("search_logs")]
public class SearchLog
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(255)]
    public string Keyword { get; set; } = string.Empty;
    public uint ResultsCount { get; set; }
    [MaxLength(45)]
    public string? IpAddress { get; set; }
    public DateTime? CreatedAt { get; set; }
}
