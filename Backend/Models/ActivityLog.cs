using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaziTeknoparkApi.Models;

[Table("activity_logs")]
public class ActivityLog
{
    [Key]
    public uint Id { get; set; }
    public uint? UserId { get; set; }
    [MaxLength(255)]
    public string? Action { get; set; }
    [MaxLength(100)]
    public string? TableName { get; set; }
    public uint? RecordId { get; set; }
    public DateTime? CreatedAt { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }
}
