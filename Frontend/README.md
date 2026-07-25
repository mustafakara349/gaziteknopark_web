# Gazi Teknopark — Frontend

React 19 + Vite + Tailwind CSS ile geliştirilmiş Gazi Teknopark kurumsal web sitesi frontend'i.

## Teknolojiler

- **React 19** — UI kütüphanesi
- **Vite 8** — Build aracı ve geliştirme sunucusu
- **Tailwind CSS v4** — Stil
- **React Router v7** — Client-side routing
- **Axios** — HTTP istekleri
- **Recharts** — Grafik bileşenleri
- **Oxlint** — Linting

## Kurulum

```bash
# Ortam dosyasını oluştur
cp .env.example .env

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## Kullanılabilir Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusunu başlatır (http://localhost:5173) |
| `npm run build` | Production build oluşturur |
| `npm run preview` | Production build'i önizler |
| `npm run lint` | Kod kalitesi kontrolü (Oxlint) |

## Klasör Yapısı

```
src/
├── api/            → Axios client ve endpoint fonksiyonları
├── assets/         → Görseller ve statik dosyalar
├── components/
│   ├── common/     → Ortak UI bileşenleri (EmptyState, FormField, icons vs.)
│   ├── home/       → Ana sayfa bileşenleri
│   └── layout/     → Navbar, Footer
├── config/         → Uygulama konfigürasyonu (navConfig vs.)
├── pages/          → Sayfa bileşenleri
└── utils/          → Yardımcı fonksiyonlar (i18n vs.)
```

## Ortam Değişkenleri

`.env.example` dosyasını kopyalayarak `.env` oluşturun:

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `VITE_API_BASE_URL` | Backend API adresi | `http://localhost:5080/api` |
