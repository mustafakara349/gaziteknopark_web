using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("company_categories")]
public class CompanyCategory
{
    [Key]
    public uint Id { get; set; }
    [MaxLength(20)]
    public string? Color { get; set; }
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<CompanyCategoryTranslation> Translations { get; set; } = new List<CompanyCategoryTranslation>();
    public ICollection<CompanyCategoryPivot> CompanyPivots { get; set; } = new List<CompanyCategoryPivot>();
}

[Table("company_category_translations")]
public class CompanyCategoryTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint CompanyCategoryId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [ForeignKey(nameof(CompanyCategoryId))]
    public CompanyCategory CompanyCategory { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}

[Table("activity_areas")]
public class ActivityArea
{
    [Key]
    public uint Id { get; set; }
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<ActivityAreaTranslation> Translations { get; set; } = new List<ActivityAreaTranslation>();
    public ICollection<CompanyActivityAreaPivot> CompanyPivots { get; set; } = new List<CompanyActivityAreaPivot>();
}

[Table("activity_area_translations")]
public class ActivityAreaTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint ActivityAreaId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [ForeignKey(nameof(ActivityAreaId))]
    public ActivityArea ActivityArea { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}

[Table("companies")]
public class Company
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    public uint? LogoFileId { get; set; }
    [MaxLength(255)]
    public string? Website { get; set; }
    [MaxLength(150)]
    public string? Email { get; set; }
    [MaxLength(30)]
    public string? Phone { get; set; }
    [MaxLength(255)]
    public string? Address { get; set; }
    public int? FoundedYear { get; set; }
    public uint? EmployeeCount { get; set; }
    [MaxLength(50)]
    public string? OfficeNo { get; set; }
    public CompanyStatus Status { get; set; } = CompanyStatus.Aktif;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    [ForeignKey(nameof(LogoFileId))]
    public FileAsset? LogoFile { get; set; }

    public ICollection<CompanyTranslation> Translations { get; set; } = new List<CompanyTranslation>();
    public ICollection<CompanyCategoryPivot> CategoryPivots { get; set; } = new List<CompanyCategoryPivot>();
    public ICollection<CompanyActivityAreaPivot> ActivityAreaPivots { get; set; } = new List<CompanyActivityAreaPivot>();
    public ICollection<User> Users { get; set; } = new List<User>();
}

[Table("company_translations")]
public class CompanyTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint CompanyId { get; set; }
    public uint LanguageId { get; set; }
    public string? Description { get; set; }

    [ForeignKey(nameof(CompanyId))]
    public Company Company { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}

[Table("company_category_pivot")]
public class CompanyCategoryPivot
{
    public uint CompanyId { get; set; }
    public uint CategoryId { get; set; }

    [ForeignKey(nameof(CompanyId))]
    public Company Company { get; set; } = null!;
    [ForeignKey(nameof(CategoryId))]
    public CompanyCategory Category { get; set; } = null!;
}

[Table("company_activity_area_pivot")]
public class CompanyActivityAreaPivot
{
    public uint CompanyId { get; set; }
    public uint ActivityAreaId { get; set; }

    [ForeignKey(nameof(CompanyId))]
    public Company Company { get; set; } = null!;
    [ForeignKey(nameof(ActivityAreaId))]
    public ActivityArea ActivityArea { get; set; } = null!;
}
