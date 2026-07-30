using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Data;

public static class DbSeeder
{
    public static void Seed(ApplicationDbContext db)
    {
        // Fix any existing category names if empty
        var emptyNameCats = db.NewsCategories.Include(c => c.Translations).Where(c => c.Name == "").ToList();
        if (emptyNameCats.Any())
        {
            foreach (var cat in emptyNameCats)
            {
                var trName = cat.Translations.FirstOrDefault()?.Name;
                if (!string.IsNullOrWhiteSpace(trName))
                {
                    cat.Name = trName;
                }
            }
            db.SaveChanges();
        }

        // Language
        if (!db.Languages.Any(l => l.Id == 1))
        {
            db.Languages.Add(new Language { Id = 1, Code = "tr", Name = "Türkçe", IsDefault = true, IsActive = true, CreatedAt = DateTime.UtcNow });
            db.SaveChanges();
        }

        // Add Fixed Corporate Categories directly with Name if none exist
        if (!db.NewsCategories.Any())
        {
            var catProje = new NewsCategory { Name = "Proje & Ar-Ge Haberleri", Slug = "proje-ar-ge-haberleri", OrderNo = 1, CreatedAt = DateTime.UtcNow };
            var catZiyaret = new NewsCategory { Name = "Ziyaret & Protokol Haberleri", Slug = "ziyaret-protokol-haberleri", OrderNo = 2, CreatedAt = DateTime.UtcNow };
            var catAnlasma = new NewsCategory { Name = "Anlaşma & İşbirliği Haberleri", Slug = "anlasma-isbirligi-haberleri", OrderNo = 3, CreatedAt = DateTime.UtcNow };
            var catBasari = new NewsCategory { Name = "Başarı & Ödül Haberleri", Slug = "basari-odul-haberleri", OrderNo = 4, CreatedAt = DateTime.UtcNow };
            var catEtkinlik = new NewsCategory { Name = "Etkinlik & Zirve Haberleri", Slug = "etkinlik-zirve-haberleri", OrderNo = 5, CreatedAt = DateTime.UtcNow };

            db.NewsCategories.AddRange(catProje, catZiyaret, catAnlasma, catBasari, catEtkinlik);
            db.SaveChanges();
        }

        // Ensure we have at least 25 news items for testing 15-item (3x5) pagination
        var existingCount = db.News.Count();
        if (existingCount < 25)
        {
            var categoriesList = db.NewsCategories.ToList();

            var imageUrls = new[]
            {
                "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800",
                "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800",
                "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800",
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800"
            };

            var sampleTitles = new[]
            {
                "Gazi Teknopark Ar-Ge Projeleri Hibesi Destekleniyor",
                "Yapay Zeka ve Veri Bilimi Çalıştayı Tamamlandı",
                "TÜBİTAK BİGG Programı Başvuruları Başladı",
                "Bölgesel İnovasyon Zirvesi Katılımcılarını Bekliyor",
                "Uluslararası Teknoloji Transferi Protokolü İmzalandı",
                "Yerli Yazılım Şirketimiz Avrupa Piyasasına Açıldı",
                "Siber Güvenlik ve Kuluçka Merkezi Yenilendi",
                "Gazi Teknopark Firmaları İhracat Rekoru Kırdı",
                "Üniversite Sanayi İşbirliği Yeni Dönem Lansmanı",
                "Girişimci Kadınlar Teknolojiyle Büyüyor Paneli",
                "Biyoteknoloji Laboratuvarı Hizmete Açıldı",
                "Gazi Teknopark Yılın En Başarılı Kuluçkası Seçildi",
                "Yeşil Mutabakat ve Sürdürülebilir Teknoloji Forumu",
                "Otonom Araçlar ve Mobilite Teknolojileri Testi",
                "Gazi Teknopark Demo Day Etkinliği Gerçekleştirildi",
                "Derin Teknoloji Girişimleri İçin Yatırım Fonu",
                "Gazi Üniversitesi Mühendislik Fakültesi Ortak Projesi",
                "Savunma Sanayii Yerlileştirme Çalıştayı",
                "Girişimciler İçin Fikri Mülkiyet Eğitimi",
                "Gazi Teknopark 2026 Vizyon ve Strateji Toplantısı",
                "Bilişim ve Donanım Alanında Yeni Kulvarlar",
                "TUSAŞ ve Gazi Teknopark Stratejik Ortaklığı"
            };

            var toCreate = 25 - existingCount;
            for (int i = 0; i < toCreate; i++)
            {
                var titleIndex = (existingCount + i) % sampleTitles.Length;
                var catIndex = (existingCount + i) % categoriesList.Count;
                var imgIndex = (existingCount + i) % imageUrls.Length;
                var title = $"{sampleTitles[titleIndex]} #{existingCount + i + 1}";
                var slug = title.ToLower()
                    .Replace(" ", "-")
                    .Replace("ğ", "g")
                    .Replace("ü", "u")
                    .Replace("ş", "s")
                    .Replace("ı", "i")
                    .Replace("ö", "o")
                    .Replace("ç", "c")
                    .Replace("#", "")
                    .Replace("&", "ve");

                var coverFile = new FileAsset
                {
                    Name = $"mock_cover_{existingCount + i + 1}.jpg",
                    Path = imageUrls[imgIndex],
                    Mime = "image/jpeg",
                    CreatedAt = DateTime.UtcNow
                };
                db.Files.Add(coverFile);
                db.SaveChanges();

                var newsItem = new News
                {
                    Uuid = Guid.NewGuid(),
                    CategoryId = categoriesList[catIndex].Id,
                    CoverImageFileId = coverFile.Id,
                    Status = ContentStatus.Published,
                    PublishedAt = DateTime.UtcNow.AddDays(-(i * 2 + 1)),
                    IsFeatured = i % 4 == 0,
                    AuthorName = i % 2 == 0 ? "Gazi Teknopark Basın Ofisi" : "Teknoloji Transfer Ofisi",
                    ReadTime = (i % 5) + 2,
                    Title = title,
                    Slug = $"{slug}-{existingCount + i + 1}",
                    Summary = $"{title} hakkında detaylı bilgiler, Ar-Ge ve inovasyon ekosistemine katkıları ile ilgili haber özet metni...",
                    Content = $"<p class=\"mb-6 text-[1.1rem] text-gray-700 leading-relaxed font-medium\">{title} kapsamında geliştirilen yerli teknolojiler ve projeler teknopark bünyesinde tanıtıldı.</p><p class=\"mb-6 text-gray-600 leading-relaxed\">Detaylar ve gelecek dönem takvimi web sitemiz üzerinden duyurulacaktır.</p>",
                    CreatedAt = DateTime.UtcNow
                };
                db.News.Add(newsItem);
            }
            db.SaveChanges();
        }
    }
}
