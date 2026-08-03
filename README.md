# Gazi Teknopark Web Projesi

Gazi Teknopark kurumsal web sitesi. .NET Web API backend ve React (Vite) frontend'den oluşan bir monorepo yapısıdır.

## Proje Yapısı

```
GaziTeknoparkWeb/
├── Backend/        → .NET 10 Web API (C#) + EF Core Migrations
└── Frontend/       → React 19 + Vite + Tailwind CSS
```

## Hızlı Başlangıç

### Gereksinimler

| Araç | Sürüm |
|------|-------|
| .NET SDK | 10.0+ |
| Node.js | 20+ |
| MySQL | 8.0+ |

---

### Backend & Veritabanı Kurulumu

```bash
cd Backend

# Bağımlılıkları ve araçları yükle
dotnet restore
dotnet tool restore

# Ortam konfigürasyonunu oluştur
# appsettings.Development.json dosyasına DB bağlantı bilgilerinizi girin

# Veritabanını EF Core migration ile otomatik oluşturun
dotnet ef database update

# Uygulamayı başlatın
dotnet run
# API → http://localhost:5080
```

---

### Frontend Kurulumu

```bash
cd Frontend

# Ortam dosyasını oluşturun
cp .env.example .env

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
---

## 🔑 Admin Paneli & Giriş Bilgileri

Admin paneli JWT (Access + Refresh Token) tabanlı yetkilendirme altyapısı ile çalışır.

- **Admin Login URL:** `http://localhost:5173/admin/login`
- **Dashboard URL:** `http://localhost:5173/admin/dashboard`
- **Varsayılan Admin E-posta:** `admin@gaziteknopark.com.tr`
- **Varsayılan Admin Şifre:** `Admin@123456`

> **Not:** Veritabanı `dotnet ef database update` ile güncellendiğinde veya `DbSeeder` çalıştığında admin kullanıcısı otomatik olarak veritabanına eklenir.

---

## 🔒 Ekip Geliştirme ve Branch Kuralları

> **ÖNEMLİ:** `main` dalına (branch) doğrudan `git push` yapmak kesinlikle yasaktır! Tüm geliştirmeler dal (branch) üzerinde yapılarak Pull Request (PR) ile birleştirilmelidir.

### Geliştirici İş Akışı (Git Workflow)

1. `main` dalını güncelleyin:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Yapacağınız iş için yeni bir dal açın:
   ```bash
   git checkout -b feature/kullanici-girisi
   # veya hata düzeltimi için:
   git checkout -b fix/footer-link-hatasi
   ```

3. Değişikliklerinizi yapın, commit edin ve remote'a gönderin:
   ```bash
   git add .
   git commit -m "feat: kullanıcı giriş ekranı eklendi"
   git push -u origin feature/kullanici-girisi
   ```

4. **GitHub / GitLab** üzerinden `main` dalına **Pull Request (PR)** açın.
5. Proje yöneticisi veya ekip arkadaşınız kodunuzu inceleyip (Code Review) onayladıktan sonra `main` dalına birleştirilir (Merge).
