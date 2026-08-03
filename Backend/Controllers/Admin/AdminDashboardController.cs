using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Helpers;
using GaziTeknoparkApi.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Controllers.Admin;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize]
[AdminOnly]
public class AdminDashboardController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminDashboardController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalNews = await _db.News.CountAsync(n => n.Status == ContentStatus.Published);
        var totalAnnouncements = await _db.Announcements.CountAsync(a => a.Status == ContentStatus.Published);
        var totalCompanies = await _db.Companies.CountAsync(c => c.DeletedAt == null);
        var totalEvents = await _db.Events.CountAsync(e => e.Status == ContentStatus.Published);
        var totalMediaItems = await _db.Media.CountAsync();
        var totalSliders = await _db.Sliders.CountAsync(s => s.IsActive);
        var totalAdminUsers = await _db.Users.CountAsync(u => u.UserType == UserType.Admin && u.DeletedAt == null && u.IsActive);
        var pendingApplications = await _db.InternshipApplications.CountAsync(a => a.Status == ApplicationStatus.Beklemede);

        // Calculate storage size from files table (approximate)
        var totalFileCount = await _db.Files.CountAsync();

        return Ok(new
        {
            news = new { count = totalNews, label = "Aktif Haber" },
            companies = new { count = totalCompanies, label = "Kayıtlı Firma" },
            events = new { count = totalEvents, label = "Gelecek Etkinlik" },
            announcements = new { count = totalAnnouncements, label = "Önemli Duyuru" },
            media = new { count = totalMediaItems, label = "Medya İçeriği", storageLabel = $"{totalFileCount} Dosya" },
            sliders = new { count = totalSliders, label = "Aktif Slayt" },
            adminUsers = new { count = totalAdminUsers, label = "Yetkili Kullanıcı" },
            applications = new { count = pendingApplications, label = "Yeni Başvuru" },
            systemHealth = "Kararlı"
        });
    }
}
