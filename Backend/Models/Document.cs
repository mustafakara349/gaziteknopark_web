using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GaziTeknoparkApi.Models.Enums;

namespace GaziTeknoparkApi.Models;

[Table("document_categories")]
public class DocumentCategory
{
    [Key]
    public uint Id { get; set; }
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<DocumentCategoryTranslation> Translations { get; set; } = new List<DocumentCategoryTranslation>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
}

[Table("document_category_translations")]
public class DocumentCategoryTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint DocumentCategoryId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [ForeignKey(nameof(DocumentCategoryId))]
    public DocumentCategory DocumentCategory { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
}

[Table("documents")]
public class Document
{
    [Key]
    public uint Id { get; set; }
    [Column(TypeName = "char(36)")]
    public Guid? Uuid { get; set; }
    public uint? CategoryId { get; set; }
    public DateTime? PublishedDate { get; set; }
    public uint OrderNo { get; set; }
    public ContentStatus Status { get; set; } = ContentStatus.Published;
    public uint? CreatedBy { get; set; }
    public uint? UpdatedBy { get; set; }
    public uint? PublishedBy { get; set; }
    public uint? DeletedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey(nameof(CategoryId))]
    public DocumentCategory? Category { get; set; }

    public ICollection<DocumentTranslation> Translations { get; set; } = new List<DocumentTranslation>();
}

[Table("document_translations")]
public class DocumentTranslation
{
    [Key]
    public uint Id { get; set; }
    public uint DocumentId { get; set; }
    public uint LanguageId { get; set; }
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;
    public uint FileId { get; set; }

    [ForeignKey(nameof(DocumentId))]
    public Document Document { get; set; } = null!;
    [ForeignKey(nameof(LanguageId))]
    public Language Language { get; set; } = null!;
    [ForeignKey(nameof(FileId))]
    public FileAsset File { get; set; } = null!;
}
