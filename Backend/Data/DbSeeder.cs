using GaziTeknoparkApi.Models;
using GaziTeknoparkApi.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace GaziTeknoparkApi.Data;

public static class DbSeeder
{
    public static void Seed(ApplicationDbContext db)
    {
        // ── Default Admin User ───────────────────────────────────────────
        if (!db.Users.Any(u => u.UserType == UserType.Admin))
        {
            db.Users.Add(new User
            {
                Uuid = Guid.NewGuid(),
                Name = "Admin",
                Email = "admin@gaziteknopark.com.tr",
                Password = BCrypt.Net.BCrypt.HashPassword("Admin@123456"),
                UserType = UserType.Admin,
                IsActive = true,
                LastPasswordChangeAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            });
            db.SaveChanges();
        }

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
                    IsActive = true,
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

        // ── Announcement Categories ──────────────────────────────────────
        if (!db.AnnouncementCategories.Any())
        {
            var catGenel = new AnnouncementCategory { Name = "Genel", Slug = "genel", OrderNo = 1, CreatedAt = DateTime.UtcNow };
            var catProjeCagri = new AnnouncementCategory { Name = "Proje Çağrıları", Slug = "proje-cagrilari", OrderNo = 2, CreatedAt = DateTime.UtcNow };
            var catEtkinlik = new AnnouncementCategory { Name = "Etkinlikler", Slug = "etkinlikler", OrderNo = 3, CreatedAt = DateTime.UtcNow };
            var catMevzuat = new AnnouncementCategory { Name = "Mevzuat & Hukuk", Slug = "mevzuat-hukuk", OrderNo = 4, CreatedAt = DateTime.UtcNow };
            var catAltyapi = new AnnouncementCategory { Name = "Altyapı Bilgilendirme", Slug = "altyapi-bilgilendirme", OrderNo = 5, CreatedAt = DateTime.UtcNow };

            db.AnnouncementCategories.AddRange(catGenel, catProjeCagri, catEtkinlik, catMevzuat, catAltyapi);
            db.SaveChanges();
        }

        // ── Announcements ────────────────────────────────────────────────
        if (!db.Announcements.Any())
        {
            var annCategories = db.AnnouncementCategories.ToList();
            var getCat = (string name) => annCategories.FirstOrDefault(c => c.Name == name);

            // CTA linkleri olan proje çağrısı duyurusu (kapak görselli)
            var coverFile1 = new FileAsset
            {
                Name = "ann_cover_arge.jpg",
                Path = "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
                Mime = "image/jpeg",
                CreatedAt = DateTime.UtcNow
            };
            db.Files.Add(coverFile1);
            db.SaveChanges();

            db.Announcements.Add(new Announcement
            {
                Uuid = Guid.NewGuid(),
                CategoryId = getCat("Proje Çağrıları")?.Id,
                CoverImageFileId = coverFile1.Id,
                Status = ContentStatus.Published,
                PublishedAt = DateTime.UtcNow.AddDays(-3),
                IsPinned = true,
                Title = "2026 Yılı 2. Dönem Ar-Ge Proje Başvuruları Başladı",
                Slug = "2026-yili-2-donem-ar-ge-proje-basvurulari-basladi",
                Summary = "Gazi Teknopark bünyesinde yer almak veya mevcut projelerini genişletmek isteyen firmalar için 2. dönem Ar-Ge proje başvuru süreci açılmıştır.",
                Content = "<p class='mb-6 text-lg'>Gazi Teknopark bünyesinde yer almak veya yeni Ar-Ge projeleri geliştirmek isteyen firmalar ve girişimciler için 2026 Yılı 2. Dönem başvuru süreci resmi olarak başlamıştır.</p><h3 class='text-xl font-bold text-[#0B2558] mb-3'>Başvuru Koşulları</h3><ul class='list-disc pl-6 mb-6 space-y-2'><li>Projelerin nitelikli Ar-Ge ve yenilik potansiyeli taşıması gerekmektedir.</li><li>Başvurular sadece portal üzerinden online olarak kabul edilecektir.</li><li>Akademisyen, öğrenci ve şirket kurulumu aşamasındaki girişimciler de başvurabilir.</li></ul><p>Değerlendirme süreci bağımsız hakem heyetleri tarafından yürütülecek olup, sonuçlar portal üzerinden duyurulacaktır.</p>",
                ActionUrl = "https://basvuru.gaziteknopark.com.tr",
                ActionLabel = "Hemen Başvur",
                CreatedAt = DateTime.UtcNow
            });

            // Salt metin duyurusu (görsel yok, CTA yok)
            db.Announcements.Add(new Announcement
            {
                Uuid = Guid.NewGuid(),
                CategoryId = getCat("Altyapı Bilgilendirme")?.Id,
                Status = ContentStatus.Published,
                PublishedAt = DateTime.UtcNow.AddDays(-10),
                Title = "Teknopark Altyapı ve Sunucu Bakım Çalışması Hakkında",
                Slug = "teknopark-altyapi-sunucu-bakim-calismasi",
                Summary = "Gölbaşı Yerleşkesi A ve B Blok veri merkezlerimizde gerçekleştirilecek planlı altyapı güncellemesi hakkında önemli duyuru.",
                Content = "<p class='mb-4'>Değerli Teknopark Sakinleri,</p><p class='mb-4'>Veri merkezi altyapımızın kesintisiz ve yüksek performansla çalışmaya devam etmesi amacıyla <strong>25 Temmuz Cumartesi 00:00 - 06:00</strong> saatleri arasında planlı bakım çalışması yapılacaktır.</p><p>Çalışma süresince kısa süreli internet ve yerel ağ kesintileri yaşanabilir. Anlayışınız için teşekkür ederiz.</p>",
                CreatedAt = DateTime.UtcNow
            });

            // Etkinlik duyurusu (kapak görselli)
            var coverFile2 = new FileAsset
            {
                Name = "ann_cover_zirve.jpg",
                Path = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
                Mime = "image/jpeg",
                CreatedAt = DateTime.UtcNow
            };
            db.Files.Add(coverFile2);
            db.SaveChanges();

            db.Announcements.Add(new Announcement
            {
                Uuid = Guid.NewGuid(),
                CategoryId = getCat("Etkinlikler")?.Id,
                CoverImageFileId = coverFile2.Id,
                Status = ContentStatus.Published,
                PublishedAt = DateTime.UtcNow.AddDays(-17),
                Title = "Uluslararası Biyoteknoloji Zirvesi Katılım Formu",
                Slug = "uluslararasi-biyoteknoloji-zirvesi-katilim",
                Summary = "Gazi Üniversitesi ve Teknopark işbirliğinde düzenlenen Biyoteknoloji Zirvesi kayıtları ve detaylı programı yayınlandı.",
                Content = "<p class='mb-6'>Sağlık ve biyoteknoloji alanında dünya çapındaki akademisyenler ve sektör liderlerinin bir araya geleceği <strong>Uluslararası Biyoteknoloji Zirvesi 2026</strong> etkinliğimize davetlisiniz.</p><p>Etkinlik ücretsiz olup sınırlı kontenjan nedeniyle ön kayıt yaptırmanız rica olunur.</p>",
                ActionUrl = "https://etkinlik.gaziteknopark.com.tr/biyoteknoloji-zirvesi",
                ActionLabel = "Kayıt Ol",
                CreatedAt = DateTime.UtcNow
            });

            // Mevzuat duyurusu (salt metin)
            db.Announcements.Add(new Announcement
            {
                Uuid = Guid.NewGuid(),
                CategoryId = getCat("Mevzuat & Hukuk")?.Id,
                Status = ContentStatus.Published,
                PublishedAt = DateTime.UtcNow.AddDays(-24),
                Title = "4691 Sayılı Kanun Muafiyet Güncellemesi",
                Slug = "4691-sayili-kanun-muafiyet-guncellemesi",
                Summary = "Gelir vergisi stopaj teşviki ve damga vergisi istisnası uygulamalarında dikkat edilmesi gereken yeni düzenlemeler.",
                Content = "<p class='mb-4'>Hazine ve Maliye Bakanlığı tarafından yayınlanan son tebliğ uyarınca 4691 sayılı kanun kapsamındaki uzaktan çalışma ve vergi muafiyeti bildirim formlarında yapılan güncellemeler sisteme entegre edilmiştir.</p><p>Firmalarımızın aylık muafiyet bildirimlerini yeni formata uygun yapmaları önemle rica olunur.</p>",
                CreatedAt = DateTime.UtcNow
            });

            // Genel duyuru (kapak görselli)
            var coverFile3 = new FileAsset
            {
                Name = "ann_cover_mentor.jpg",
                Path = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
                Mime = "image/jpeg",
                CreatedAt = DateTime.UtcNow
            };
            db.Files.Add(coverFile3);
            db.SaveChanges();

            db.Announcements.Add(new Announcement
            {
                Uuid = Guid.NewGuid(),
                CategoryId = getCat("Genel")?.Id,
                CoverImageFileId = coverFile3.Id,
                Status = ContentStatus.Published,
                PublishedAt = DateTime.UtcNow.AddDays(-31),
                Title = "Girişimci Mentorluk Destek Programı 3. Çağrı Sonuçları",
                Slug = "girisimci-mentorluk-destek-programi-3-cagri-sonuclari",
                Summary = "Ön kuluçka ve kuluçka aşamasındaki girişimlerimiz arasından mentörlük desteği almaya hak kazanan 12 ekibimiz açıklandı.",
                Content = "<p class='mb-4'>Gazi Teknopark Kuluçka Merkezi tarafından yürütülen 3. Çağrı Dönemi Mentorluk Programı değerlendirme süreci tamamlanmıştır.</p><p>Hak kazanan girişimcilerimizle eşleşen mentör listesi ve toplantı takvimleri e-posta adreslerine iletilmiştir.</p>",
                CreatedAt = DateTime.UtcNow
            });

            db.SaveChanges();
        }

        // ── Initiative Office (Girişim Ofisi) ────────────────────────────
        if (!db.InitiativeOffices.Any())
        {
            var initOffice = new InitiativeOffice
            {
                Uuid = Guid.NewGuid(),
            Status = ContentStatus.Published,
            Title = "Girişim Ofisi (GO)",
            Content = "<p>03 Şubat 2021 tarihli ve 31384 sayılı Resmî Gazete’de yayımlanarak yürürlüğe giren 7263 sayılı Kanun ile 4691 sayılı Teknoloji Geliştirme Bölgeleri Kanunu’nun 5’inci maddesinde yapılan değişiklik doğrultusunda, Teknoloji Geliştirme Bölgesi yönetici şirketlerine, Bölge alanı dışında da kuluçka merkezi kurma yetkisi tanımlanmıştır. Bu düzenleme kapsamında yalnızca kuluçka statüsündeki girişimcilerin faaliyet gösterebileceği bu merkezler için gerekli usul ve esaslar T.C. Sanayi ve Teknoloji Bakanlığı tarafından belirlenmektedir.</p><p>17 Ocak 2025 tarihinde Bakanlık tarafından yapılan yeni düzenleme ile, söz konusu merkezlerin “Girişim Ofisi (GO)” olarak adlandırılmasına karar verilmiştir.</p><p>Bu kapsamda, Gazi Teknopark bünyesindeki Anahtar Kuluçka Merkezi ve Akademisyen Kuluçka Merkezi, <strong>Gazi Teknopark Girişim Ofisi</strong> adıyla faaliyet göstermektedir.</p>",
            CreatedAt = DateTime.UtcNow,
            Translations = new List<InitiativeOfficeTranslation>
            {
                new InitiativeOfficeTranslation
                {
                    LanguageId = 1,
                    Title = "Girişim Ofisi (GO)",
                    Content = "<p>03 Şubat 2021 tarihli ve 31384 sayılı Resmî Gazete’de yayımlanarak yürürlüğe giren 7263 sayılı Kanun ile 4691 sayılı Teknoloji Geliştirme Bölgeleri Kanunu’nun 5’inci maddesinde yapılan değişiklik doğrultusunda, Teknoloji Geliştirme Bölgesi yönetici şirketlerine, Bölge alanı dışında da kuluçka merkezi kurma yetkisi tanımlanmıştır. Bu düzenleme kapsamında yalnızca kuluçka statüsündeki girişimcilerin faaliyet gösterebileceği bu merkezler için gerekli usul ve esaslar T.C. Sanayi ve Teknoloji Bakanlığı tarafından belirlenmektedir.</p><p>17 Ocak 2025 tarihinde Bakanlık tarafından yapılan yeni düzenleme ile, söz konusu merkezlerin “Girişim Ofisi (GO)” olarak adlandırılmasına karar verilmiştir.</p><p>Bu kapsamda, Gazi Teknopark bünyesindeki Anahtar Kuluçka Merkezi ve Akademisyen Kuluçka Merkezi, <strong>Gazi Teknopark Girişim Ofisi</strong> adıyla faaliyet göstermektedir.</p>"
                }
            },
            Incubators = new List<InitiativeOfficeIncubator>
            {
                new InitiativeOfficeIncubator
                {
                    Icon = "Rocket",
                    OrderIndex = 1,
                    Status = ContentStatus.Published,
                    Title = "Anahtar Kuluçka Merkezi",
                    Subtitle = "Girişimciler & Yenilikçi Projeler",
                    Description = "Erken aşama teknoloji girişimcilerine, öğrencilere ve yenilikçi iş fikri sahiplerine özel fiziksel çalışma alanları, iş modeli geliştirme ve mentörlük imkanları sunulmaktadır.",
                    Features = "Prototipleme ve altyapı kullanım desteği\nTÜBİTAK BİGG %100 hibe başvuru rehberliği\nBirebir mentörlük ve iş modeli doğrulama",
                    Translations = new List<InitiativeOfficeIncubatorTranslation>
                    {
                        new InitiativeOfficeIncubatorTranslation
                        {
                            LanguageId = 1,
                            Title = "Anahtar Kuluçka Merkezi",
                            Subtitle = "Girişimciler & Yenilikçi Projeler",
                            Description = "Erken aşama teknoloji girişimcilerine, öğrencilere ve yenilikçi iş fikri sahiplerine özel fiziksel çalışma alanları, iş modeli geliştirme ve mentörlük imkanları sunulmaktadır.",
                            Features = "Prototipleme ve altyapı kullanım desteği\nTÜBİTAK BİGG %100 hibe başvuru rehberliği\nBirebir mentörlük ve iş modeli doğrulama"
                        }
                    }
                },
                new InitiativeOfficeIncubator
                {
                    Icon = "GraduationCap",
                    OrderIndex = 2,
                    Status = ContentStatus.Published,
                    Title = "Akademisyen Kuluçka Merkezi",
                    Subtitle = "Akademik Bilgi & Spin-Off Şirketler",
                    Description = "Üniversite-Sanayi iş birliği vizyonu doğrultusunda, akademisyenlerin Ar-Ge çıktılarının ve fikri mülkiyet haklarının ticarileştirilmesi ile şirketleşme (Spin-Off) süreçlerine rehberlik edilir.",
                    Features = "Akademik buluşların ticarileştirilmesi ve patent desteği\nŞirketleşme (Spin-off) mevzuat ve muafiyet Danışmanlığı\nSanayi ortaklı Ar-Ge projelendirme ve fonlama imkanları",
                    Translations = new List<InitiativeOfficeIncubatorTranslation>
                    {
                        new InitiativeOfficeIncubatorTranslation
                        {
                            LanguageId = 1,
                            Title = "Akademisyen Kuluçka Merkezi",
                            Subtitle = "Akademik Çıktılar & Spin-off",
                            Description = "Üniversitedeki akademik bilgi birikiminin ticari değere ve spin-off şirketlere dönüşmesini sağlayan özel program.",
                            Features = "Akademik buluşların patent ve ticarileşme yönetimi\nAkademisyenlere özel şirketleşme hukuku\nSanayi odaklı Ar-Ge projesi eşleştirmeleri"
                        }
                    }
                }
            }
        };
        db.InitiativeOffices.Add(initOffice);
        db.SaveChanges();
        }

        // Ensure at least 25 announcements for testing category filtering and pagination
        var existingAnnCount = db.Announcements.Count();
        if (existingAnnCount < 25)
        {
            var annCategories = db.AnnouncementCategories.ToList();
            var sampleTitles = new[]
            {
                "Gazi Teknopark Ar-Ge Projeleri 2. Dönem Başvuruları Açıldı",
                "TÜBİTAK 1507 KOBİ Ar-Ge Başlangıç Destek Programı Duyurusu",
                "Siber Güvenlik Kümelenmesi Eğitim ve Sertifikasyon Programı",
                "Yapay Zeka Hızlandırma Programı Katılım Çağrısı",
                "Gazi Üniversitesi Teknoloji Transfer Ofisi Patent Destekleri",
                "Avrupa Ufuk 2020 Proje Konsorsiyumu Ortak Arama Çağrısı",
                "Yerleşke İçi Veri Merkezi ve Fiber Altyapı İyileştirmesi",
                "Kuluçka Firmaları İçin Hukuki Danışmanlık ve Fikri Mülkiyet Eğitimi",
                "2026 Yılı İhrakat Destekleri ve HİSER Projesi Bilgilendirmesi",
                "Gazi Teknopark Girişimcilik ve İnovasyon Ödülleri Başvuruları",
                "Yıl Sonu Vergi ve Muafiyet Beyannameleri Bildirim Süreci",
                "Uluslararası Biyoteknoloji Zirvesi Katılımcı Kaydı",
                "Derin Teknoloji Girişimleri İçin Risk Sermayesi Yatırım Fonu",
                "Sanayi Odası İşbirliğinde Üniversite-Sanayi Buluşması",
                "Bölgesel İnovasyon ve Kuluçka Merkezi Altyapı Destekleri",
                "Gazi Teknopark Firmalarına Özel Bulut Sunucu Hibesi",
                "Yurtdışı Fuar ve Fikri Haklar Desteği Açıklandı",
                "Yeşil Dönüşüm ve Karbon Ayak İzi Danışmanlık Çağrısı",
                "Yazılım ve Bilişim Şirketleri İçin Siber Güvenlik Testleri",
                "Girişimci Kadınlar Mentorluk Programı 4. Dönem Kayıtları"
            };

            var coverUrls = new[]
            {
                "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            };

            for (int i = existingAnnCount; i < 25; i++)
            {
                var idx = i - existingAnnCount;
                var rawTitle = sampleTitles[idx % sampleTitles.Length];
                var title = idx >= sampleTitles.Length ? $"{rawTitle} #{idx + 1}" : rawTitle;
                var category = annCategories[i % annCategories.Count];
                var publishDate = DateTime.UtcNow.AddDays(-((i + 1) * 2)); // Spread out dates every 2 days

                uint? coverId = null;
                if (i % 3 != 0) // Give 2 out of 3 announcements a cover image
                {
                    var file = new FileAsset
                    {
                        Name = $"ann_seed_cover_{i}.jpg",
                        Path = coverUrls[i % coverUrls.Length],
                        Mime = "image/jpeg",
                        CreatedAt = DateTime.UtcNow
                    };
                    db.Files.Add(file);
                    db.SaveChanges();
                    coverId = file.Id;
                }

                var cleanSlug = title.ToLower()
                    .Replace("ı", "i").Replace("ğ", "g").Replace("ü", "u").Replace("ş", "s").Replace("ö", "o").Replace("ç", "c")
                    .Replace("İ", "i").Replace("Ğ", "g").Replace("Ü", "u").Replace("Ş", "s").Replace("Ö", "o").Replace("Ç", "c")
                    .Replace(" ", "-").Replace("&", "ve");

                db.Announcements.Add(new Announcement
                {
                    Uuid = Guid.NewGuid(),
                    CategoryId = category.Id,
                    CoverImageFileId = coverId,
                    Status = ContentStatus.Published,
                    PublishedAt = publishDate,
                    IsPinned = i % 8 == 0,
                    Title = title,
                    Slug = $"{cleanSlug}-{i + 1}",
                    Summary = $"{title} kapsamında firmalarımız ve girişimcilerimiz için belirlenen başvuru süreci ve detaylar açıklanmıştır.",
                    Content = $"<p class='mb-6 text-lg'>{title} ile ilgili süreçler resmi olarak yürütülmektedir.</p><h3 class='text-xl font-bold text-[#0B2558] mb-3'>Detaylar ve Şartlar</h3><ul class='list-disc pl-6 mb-6 space-y-2'><li>Başvurular online portal üzerinden alınacaktır.</li><li>Değerlendirmeler bağımsız komite tarafından yapılacaktır.</li><li>Detaylı bilgi için yönetim birimimizle iletişime geçebilirsiniz.</li></ul>",
                    ActionUrl = i % 2 == 0 ? "https://basvuru.gaziteknopark.com.tr" : null,
                    ActionLabel = i % 2 == 0 ? "Detaylı Bilgi ve Başvuru" : null,
                    CreatedAt = DateTime.UtcNow
                });
            }
            db.SaveChanges();
        }

        // ── Document Categories & Documents ────────────────────────────────
        if (!db.DocumentCategories.Any())
        {
            var catMevzuat = new DocumentCategory { CreatedAt = DateTime.UtcNow };
            catMevzuat.Translations.Add(new DocumentCategoryTranslation { LanguageId = 1, Name = "Teknoloji Geliştirme Bölgeleri Hakkında Mevzuat" });

            var catArge = new DocumentCategory { CreatedAt = DateTime.UtcNow };
            catArge.Translations.Add(new DocumentCategoryTranslation { LanguageId = 1, Name = "Ar-Ge Faaliyetleri Hakkında Mevzuat" });

            var catDiger = new DocumentCategory { CreatedAt = DateTime.UtcNow };
            catDiger.Translations.Add(new DocumentCategoryTranslation { LanguageId = 1, Name = "Diğer Belgeler" });

            db.DocumentCategories.AddRange(catMevzuat, catArge, catDiger);
            db.SaveChanges();

            var file1 = new FileAsset
            {
                Uuid = Guid.NewGuid(),
                Name = "4691_sayili_kanun.pdf",
                OriginalName = "4691_sayili_kanun.pdf",
                Path = "/uploads/documents/4691_sayili_kanun.pdf",
                Mime = "application/pdf",
                Size = 2516582, // ~2.4 MB
                CreatedAt = DateTime.UtcNow
            };
            var file2 = new FileAsset
            {
                Uuid = Guid.NewGuid(),
                Name = "uygulama_yonetmeligi.pdf",
                OriginalName = "uygulama_yonetmeligi.pdf",
                Path = "/uploads/documents/uygulama_yonetmeligi.pdf",
                Mime = "application/pdf",
                Size = 1887436, // ~1.8 MB
                CreatedAt = DateTime.UtcNow
            };
            var file3 = new FileAsset
            {
                Uuid = Guid.NewGuid(),
                Name = "5746_sayili_kanun.pdf",
                OriginalName = "5746_sayili_kanun.pdf",
                Path = "/uploads/documents/5746_sayili_kanun.pdf",
                Mime = "application/pdf",
                Size = 1048576, // ~1.0 MB
                CreatedAt = DateTime.UtcNow
            };

            db.Files.AddRange(file1, file2, file3);
            db.SaveChanges();

            db.Documents.Add(new Document
            {
                Uuid = Guid.NewGuid(),
                CategoryId = catMevzuat.Id,
                PublishedDate = new DateTime(2001, 7, 6),
                OrderNo = 1,
                Status = ContentStatus.Published,
                CreatedAt = DateTime.UtcNow,
                Translations = new List<DocumentTranslation>
                {
                    new DocumentTranslation { LanguageId = 1, Title = "06.07.2001 - 4691 Sayılı Teknoloji Geliştirme Bölgeleri Kanunu", FileId = file1.Id }
                }
            });

            db.Documents.Add(new Document
            {
                Uuid = Guid.NewGuid(),
                CategoryId = catMevzuat.Id,
                PublishedDate = new DateTime(2016, 8, 10),
                OrderNo = 2,
                Status = ContentStatus.Published,
                CreatedAt = DateTime.UtcNow,
                Translations = new List<DocumentTranslation>
                {
                    new DocumentTranslation { LanguageId = 1, Title = "10.08.2016 - Teknoloji Geliştirme Bölgeleri Uygulama Yönetmeliği", FileId = file2.Id }
                }
            });

            db.Documents.Add(new Document
            {
                Uuid = Guid.NewGuid(),
                CategoryId = catArge.Id,
                PublishedDate = new DateTime(2008, 3, 12),
                OrderNo = 3,
                Status = ContentStatus.Published,
                CreatedAt = DateTime.UtcNow,
                Translations = new List<DocumentTranslation>
                {
                    new DocumentTranslation { LanguageId = 1, Title = "12.03.2008 - 5746 Sayılı Araştırma, Geliştirme ve Tasarım Faaliyetlerinin Desteklenmesi Hakkında Kanun", FileId = file3.Id }
                }
            });

            db.SaveChanges();
        }

        // Update existing files with size if null
        var seededFiles = db.Files.Where(f => f.Size == null).ToList();
        if (seededFiles.Any())
        {
            foreach (var file in seededFiles)
            {
                if (file.Name == "4691_sayili_kanun.pdf") file.Size = 2516582;
                else if (file.Name == "uygulama_yonetmeligi.pdf") file.Size = 1887436;
                else if (file.Name == "5746_sayili_kanun.pdf") file.Size = 1048576;
            }
            db.SaveChanges();
        }
    }
}
