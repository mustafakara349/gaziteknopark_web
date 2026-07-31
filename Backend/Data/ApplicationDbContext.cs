using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Language> Languages => Set<Language>();
    public DbSet<FileAsset> Files => Set<FileAsset>();

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    public DbSet<CompanyCategory> CompanyCategories => Set<CompanyCategory>();
    public DbSet<CompanyCategoryTranslation> CompanyCategoryTranslations => Set<CompanyCategoryTranslation>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<CompanyTranslation> CompanyTranslations => Set<CompanyTranslation>();
    public DbSet<CompanyCategoryPivot> CompanyCategoryPivots => Set<CompanyCategoryPivot>();
    public DbSet<ActivityArea> ActivityAreas => Set<ActivityArea>();
    public DbSet<ActivityAreaTranslation> ActivityAreaTranslations => Set<ActivityAreaTranslation>();
    public DbSet<CompanyActivityAreaPivot> CompanyActivityAreaPivots => Set<CompanyActivityAreaPivot>();

    public DbSet<User> Users => Set<User>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

    public DbSet<Page> Pages => Set<Page>();
    public DbSet<PageTranslation> PageTranslations => Set<PageTranslation>();

    public DbSet<EntityGallery> EntityGalleries => Set<EntityGallery>();

    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<TeamMemberTranslation> TeamMemberTranslations => Set<TeamMemberTranslation>();

    public DbSet<DocumentCategory> DocumentCategories => Set<DocumentCategory>();
    public DbSet<DocumentCategoryTranslation> DocumentCategoryTranslations => Set<DocumentCategoryTranslation>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<DocumentTranslation> DocumentTranslations => Set<DocumentTranslation>();

    public DbSet<Service> Services => Set<Service>();
    public DbSet<ServiceTranslation> ServiceTranslations => Set<ServiceTranslation>();

    public DbSet<NewsCategory> NewsCategories => Set<NewsCategory>();
    public DbSet<NewsCategoryTranslation> NewsCategoryTranslations => Set<NewsCategoryTranslation>();
    public DbSet<News> News => Set<News>();
    public DbSet<NewsTranslation> NewsTranslations => Set<NewsTranslation>();

    public DbSet<FeaturedTechnology> FeaturedTechnologies => Set<FeaturedTechnology>();
    public DbSet<FeaturedTechnologyTranslation> FeaturedTechnologyTranslations => Set<FeaturedTechnologyTranslation>();

    public DbSet<MediaAlbum> MediaAlbums => Set<MediaAlbum>();
    public DbSet<MediaAlbumTranslation> MediaAlbumTranslations => Set<MediaAlbumTranslation>();
    public DbSet<MediaItem> Media => Set<MediaItem>();
    public DbSet<MediaTranslation> MediaTranslations => Set<MediaTranslation>();

    public DbSet<InitiativeOffice> InitiativeOffices => Set<InitiativeOffice>();
    public DbSet<InitiativeOfficeTranslation> InitiativeOfficeTranslations => Set<InitiativeOfficeTranslation>();
    public DbSet<InitiativeOfficeIncubator> InitiativeOfficeIncubators => Set<InitiativeOfficeIncubator>();
    public DbSet<InitiativeOfficeIncubatorTranslation> InitiativeOfficeIncubatorTranslations => Set<InitiativeOfficeIncubatorTranslation>();

    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventTranslation> EventTranslations => Set<EventTranslation>();

    public DbSet<SuccessStory> SuccessStories => Set<SuccessStory>();
    public DbSet<SuccessStoryTranslation> SuccessStoryTranslations => Set<SuccessStoryTranslation>();

    public DbSet<Faq> Faqs => Set<Faq>();
    public DbSet<FaqTranslation> FaqTranslations => Set<FaqTranslation>();

    public DbSet<Partner> Partners => Set<Partner>();
    public DbSet<PartnerTranslation> PartnerTranslations => Set<PartnerTranslation>();

    public DbSet<Statistic> Statistics => Set<Statistic>();
    public DbSet<StatisticTranslation> StatisticTranslations => Set<StatisticTranslation>();

    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<TagTranslation> TagTranslations => Set<TagTranslation>();
    public DbSet<Taggable> Taggables => Set<Taggable>();

    public DbSet<InternshipApplication> InternshipApplications => Set<InternshipApplication>();

    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<ContactInfo> ContactInfos => Set<ContactInfo>();
    public DbSet<ContactInfoTranslation> ContactInfoTranslations => Set<ContactInfoTranslation>();

    public DbSet<Setting> Settings => Set<Setting>();
    public DbSet<SettingTranslation> SettingTranslations => Set<SettingTranslation>();

    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();

    public DbSet<Slider> Sliders => Set<Slider>();
    public DbSet<SliderTranslation> SliderTranslations => Set<SliderTranslation>();

    public DbSet<Banner> Banners => Set<Banner>();
    public DbSet<BannerTranslation> BannerTranslations => Set<BannerTranslation>();

    public DbSet<PopupAnnouncement> PopupAnnouncements => Set<PopupAnnouncement>();
    public DbSet<PopupAnnouncementTranslation> PopupAnnouncementTranslations => Set<PopupAnnouncementTranslation>();

    public DbSet<AnnouncementCategory> AnnouncementCategories => Set<AnnouncementCategory>();
    public DbSet<AnnouncementCategoryTranslation> AnnouncementCategoryTranslations => Set<AnnouncementCategoryTranslation>();
    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<AnnouncementTranslation> AnnouncementTranslations => Set<AnnouncementTranslation>();
    public DbSet<AnnouncementAttachment> AnnouncementAttachments => Set<AnnouncementAttachment>();

    public DbSet<MenuItem> MenuItems => Set<MenuItem>();
    public DbSet<MenuItemTranslation> MenuItemTranslations => Set<MenuItemTranslation>();

    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();
    public DbSet<SearchLog> SearchLogs => Set<SearchLog>();
    public DbSet<LinkedInPost> LinkedInPosts => Set<LinkedInPost>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<ContentStatus>().HaveConversion<LowerCaseEnumConverter<ContentStatus>>();
        configurationBuilder.Properties<CompanyStatus>().HaveConversion<LowerCaseEnumConverter<CompanyStatus>>();
        configurationBuilder.Properties<MediaType>().HaveConversion<LowerCaseEnumConverter<MediaType>>();
        configurationBuilder.Properties<ApplicationStatus>().HaveConversion<LowerCaseEnumConverter<ApplicationStatus>>();
        configurationBuilder.Properties<SettingType>().HaveConversion<LowerCaseEnumConverter<SettingType>>();
        configurationBuilder.Properties<MenuLocation>().HaveConversion<LowerCaseEnumConverter<MenuLocation>>();
        configurationBuilder.Properties<UserType>().HaveConversion<UserTypeConverter>();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RolePermission>().HasKey(rp => new { rp.RoleId, rp.PermissionId });
        modelBuilder.Entity<CompanyCategoryPivot>().HasKey(cp => new { cp.CompanyId, cp.CategoryId });
        modelBuilder.Entity<CompanyActivityAreaPivot>().HasKey(ap => new { ap.CompanyId, ap.ActivityAreaId });

        modelBuilder.Entity<CompanyCategoryTranslation>().HasIndex(t => new { t.CompanyCategoryId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<ActivityAreaTranslation>().HasIndex(t => new { t.ActivityAreaId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<CompanyTranslation>().HasIndex(t => new { t.CompanyId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<PageTranslation>().HasIndex(t => new { t.PageId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<PageTranslation>().HasIndex(t => new { t.Slug, t.LanguageId }).IsUnique();
        modelBuilder.Entity<TeamMemberTranslation>().HasIndex(t => new { t.TeamMemberId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<TeamMember>()
            .HasOne(m => m.Parent)
            .WithMany(m => m.Children)
            .HasForeignKey(m => m.ParentId)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<DocumentCategoryTranslation>().HasIndex(t => new { t.DocumentCategoryId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<DocumentTranslation>().HasIndex(t => new { t.DocumentId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<ServiceTranslation>().HasIndex(t => new { t.ServiceId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<NewsCategoryTranslation>().HasIndex(t => new { t.NewsCategoryId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<NewsTranslation>().HasIndex(t => new { t.NewsId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<NewsTranslation>().HasIndex(t => new { t.Slug, t.LanguageId }).IsUnique();
        modelBuilder.Entity<News>().HasIndex(n => n.Slug).IsUnique();
        modelBuilder.Entity<FeaturedTechnologyTranslation>().HasIndex(t => new { t.FeaturedTechnologyId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<FeaturedTechnologyTranslation>().HasIndex(t => new { t.Slug, t.LanguageId }).IsUnique();
        modelBuilder.Entity<MediaAlbumTranslation>().HasIndex(t => new { t.MediaAlbumId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<MediaTranslation>().HasIndex(t => new { t.MediaId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<InitiativeOfficeTranslation>().HasIndex(t => new { t.InitiativeOfficeId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<EventTranslation>().HasIndex(t => new { t.EventId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<EventTranslation>().HasIndex(t => new { t.Slug, t.LanguageId }).IsUnique();
        modelBuilder.Entity<SuccessStoryTranslation>().HasIndex(t => new { t.SuccessStoryId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<SuccessStoryTranslation>().HasIndex(t => new { t.Slug, t.LanguageId }).IsUnique();
        modelBuilder.Entity<FaqTranslation>().HasIndex(t => new { t.FaqId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<PartnerTranslation>().HasIndex(t => new { t.PartnerId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<StatisticTranslation>().HasIndex(t => new { t.StatisticId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<TagTranslation>().HasIndex(t => new { t.TagId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<Taggable>().HasIndex(t => new { t.TagId, t.ModelType, t.ModelId }).IsUnique();
        modelBuilder.Entity<ContactInfoTranslation>().HasIndex(t => new { t.ContactInfoId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<SettingTranslation>().HasIndex(t => new { t.SettingId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<SliderTranslation>().HasIndex(t => new { t.SliderId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<BannerTranslation>().HasIndex(t => new { t.BannerId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<PopupAnnouncementTranslation>().HasIndex(t => new { t.PopupAnnouncementId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<MenuItemTranslation>().HasIndex(t => new { t.MenuItemId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<AnnouncementCategoryTranslation>().HasIndex(t => new { t.AnnouncementCategoryId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<AnnouncementTranslation>().HasIndex(t => new { t.AnnouncementId, t.LanguageId }).IsUnique();
        modelBuilder.Entity<AnnouncementTranslation>().HasIndex(t => new { t.Slug, t.LanguageId }).IsUnique();
        modelBuilder.Entity<Announcement>().HasIndex(a => a.Slug).IsUnique();
        modelBuilder.Entity<AnnouncementAttachment>().HasIndex(a => new { a.AnnouncementId, a.FileId }).IsUnique();
    }
}
