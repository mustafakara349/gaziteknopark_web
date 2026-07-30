import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, RotateCcw, X, ChevronLeft, ChevronRight, LogIn, FileText, X as CloseIcon, Info } from "lucide-react";

export default function AnnouncementsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Mock Announcements Data (representing corporate announcements)
  const initialAnnouncements = [
    {
      id: 1,
      day: "28",
      month: "TEMMUZ",
      dateYear: "2026",
      dateBg: "bg-[#0B2558]",
      dateText: "text-white",
      category: "Ar-Ge Proje Başvurusu",
      title: "2026 Yılı 2. Dönem Ar-Ge Proje Başvuruları Başladı",
      summary: "Gazi Teknopark bünyesinde yer almak veya mevcut projelerini genişletmek isteyen firmalar için 2. dönem Ar-Ge proje başvuru süreci açılmıştır.",
      content: "<p class='mb-4'>Gazi Teknopark bünyesinde yer almak veya mevcut projelerini genişletmek isteyen girişimcilerimiz ve teknoloji firmalarımız için 2. dönem Ar-Ge proje başvuru süreci resmi olarak başlamıştır.</p><p class='mb-4'>Başvurular portal üzerinden çevrimiçi olarak kabul edilmekte olup, son başvuru tarihi <strong>31 Ağustos 2026</strong> saat 17:00'dir.</p><p>Sorularınız ve detaylı rehber için Girişimcilik Ofisi ile iletişime geçebilirsiniz.</p>",
      buttonText: "Başvuru Yap",
      buttonIcon: <LogIn size={16} className="ml-2" />,
      buttonBg: "bg-[#0B2558]",
      publishedAt: "2026-07-28"
    },
    {
      id: 2,
      day: "22",
      month: "TEMMUZ",
      dateYear: "2026",
      dateBg: "bg-[#0066cc]",
      dateText: "text-white",
      category: "Altyapı Bilgilendirme",
      title: "Teknopark Altyapı ve Sunucu Bakım Çalışması Hakkında",
      summary: "Gölbaşı Yerleşkesi A ve B Blok veri merkezlerimizde gerçekleştirilecek planlı altyapı güncellemesi hakkında önemli duyuru.",
      content: "<p class='mb-4'>Değerli Teknopark Sakinleri,</p><p class='mb-4'>Veri merkezi altyapımızın kesintisiz ve yüksek performansla çalışmaya devam etmesi amacıyla <strong>25 Temmuz Cumartesi 00:00 - 06:00</strong> saatleri arasında planlı bakım çalışması yapılacaktır.</p><p>Çalışma süresince kısa süreli internet ve yerel ağ kesintileri yaşanabilir. Anlayışınız için teşekkür ederiz.</p>",
      buttonText: "Detay",
      buttonIcon: <FileText size={16} className="ml-2" />,
      buttonBg: "bg-[#0B2558]",
      publishedAt: "2026-07-22"
    },
    {
      id: 3,
      day: "15",
      month: "TEMMUZ",
      dateYear: "2026",
      dateBg: "bg-[#DCE7F7]",
      dateText: "text-[#0B2558]",
      category: "Etkinlik Daveti",
      title: "Uluslararası Biyoteknoloji Zirvesi Katılım Formu",
      summary: "Gazi Üniversitesi ve Teknopark işbirliğinde düzenlenen Biyoteknoloji Zirvesi kayıtları ve detaylı programı yayınlandı.",
      content: "<p class='mb-4'>Sağlık ve biyoteknoloji alanında dünya çapındaki akademisyenler ve sektör liderlerinin bir araya geleceği <strong>Uluslararası Biyoteknoloji Zirvesi 2026</strong> etkinliğimize davetlisiniz.</p><p class='mb-4'>Etkinlik ücretsiz olup sınırlı kontenjan nedeniyle ön kayıt yaptırmanız rica olunur.</p>",
      buttonText: "Detay",
      buttonIcon: <FileText size={16} className="ml-2" />,
      buttonBg: "bg-[#0B2558]",
      publishedAt: "2026-07-15"
    },
    {
      id: 4,
      day: "08",
      month: "TEMMUZ",
      dateYear: "2026",
      dateBg: "bg-[#0B2558]",
      dateText: "text-white",
      category: "Mevzuat & Hukuk",
      title: "4691 Sayılı Teknoloji Geliştirme Bölgeleri Kanunu Muafiyet Güncellemesi",
      summary: "Gelir vergisi stopaj teşviki ve damga vergisi istisnası uygulamalarında dikkat edilmesi gereken yeni düzenlemeler.",
      content: "<p class='mb-4'>Hazine ve Maliye Bakanlığı tarafından yayınlanan son tebliğ uyarınca 4691 sayılı kanun kapsamındaki uzaktan çalışma ve vergi muafiyeti bildirim formlarında yapılan güncellemeler sisteme entegre edilmiştir.</p><p>Firmalarımızın aylık muafiyet bildirimlerini yeni formata uygun yapmaları önemle rica olunur.</p>",
      buttonText: "Incele",
      buttonIcon: <Info size={16} className="ml-2" />,
      buttonBg: "bg-[#0B2558]",
      publishedAt: "2026-07-08"
    },
    {
      id: 5,
      day: "01",
      month: "TEMMUZ",
      dateYear: "2026",
      dateBg: "bg-[#0066cc]",
      dateText: "text-white",
      category: "Kuluçka & Mentorluk",
      title: "Girişimci Mentorluk Destek Programı 3. Çağrı Sonuçları",
      summary: "Ön kuluçka ve kuluçka aşamasındaki girişimlerimiz arasından mentörlük desteği almaya hak kazanan 12 ekibimiz açıklandı.",
      content: "<p class='mb-4'>Gazi Teknopark Kuluçka Merkezi tarafından yürütülen 3. Çağrı Dönemi Mentorluk Programı değerlendirme süreci tamamlanmıştır.</p><p>Hak kazanan girişimcilerimizle eşleşen mentör listesi ve toplantı takvimleri e-posta adreslerine iletilmiştir.</p>",
      buttonText: "Detay",
      buttonIcon: <FileText size={16} className="ml-2" />,
      buttonBg: "bg-[#0B2558]",
      publishedAt: "2026-07-01"
    },
    {
      id: 6,
      day: "24",
      month: "HAZİRAN",
      dateYear: "2026",
      dateBg: "bg-[#DCE7F7]",
      dateText: "text-[#0B2558]",
      category: "İhracat & Pazarlama",
      title: "Yurtdışı Pazara Giriş ve Küreselleşme Desteği Başvuruları",
      summary: "Teknoloji firmalarımızın küresel pazarlara açılmasına yönelik verilen reklam, fuar ve danışmanlık hibe destekleri.",
      content: "<p class='mb-4'>Ticaret Bakanlığı ve Teknopark yönetimimiz işbirliğinde yürütülen <strong>HİZER (Hizmet İhracatı Destekleri)</strong> projesi kapsamında yeni başvuru dönemi açılmıştır.</p><p>Detaylı bilgi için İhracat Destek Masası ile görüşebilirsiniz.</p>",
      buttonText: "Detay",
      buttonIcon: <FileText size={16} className="ml-2" />,
      buttonBg: "bg-[#0B2558]",
      publishedAt: "2026-06-24"
    }
  ];

  const categories = [
    "Ar-Ge Proje Başvurusu",
    "Altyapı Bilgilendirme",
    "Etkinlik Daveti",
    "Mevzuat & Hukuk",
    "Kuluçka & Mentorluk",
    "İhracat & Pazarlama"
  ];

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedDate, sort]);

  // Filtering
  const filteredAnnouncements = initialAnnouncements.filter((item) => {
    const matchesSearch =
      search.trim() === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || item.category === selectedCategory;

    const matchesDate =
      selectedDate === "" || item.publishedAt === selectedDate;

    return matchesSearch && matchesCategory && matchesDate;
  }).sort((a, b) => {
    if (sort === "oldest") {
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    }
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  const hasActiveFilters = search.trim() !== "" || selectedCategory !== "" || selectedDate !== "" || sort !== "newest";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedDate("");
    setSort("newest");
  };

  // Pagination
  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredAnnouncements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-[1.5rem] p-4 mb-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-wrap lg:flex-nowrap items-center gap-3">

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[220px] w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Duyuru başlığı veya içerik ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-10 py-3 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-transparent focus:border-[#0066cc] rounded-xl text-sm text-[#0B2558] placeholder-gray-400 focus:outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full sm:w-auto flex-1 min-w-[180px]">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-8 py-3 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-transparent focus:border-[#0066cc] rounded-xl text-sm text-[#0B2558] font-medium appearance-none focus:outline-none cursor-pointer transition-all"
            >
              <option value="">Tüm Duyurular</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="relative w-full sm:w-auto flex-1 min-w-[160px]">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-3 py-3 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-transparent focus:border-[#0066cc] rounded-xl text-xs text-[#0B2558] font-medium focus:outline-none cursor-pointer transition-all"
              title="Tarihe Göre Filtrele"
            />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto px-4 py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
              title="Filtreleri Temizle"
            >
              <RotateCcw size={14} />
              <span>Temizle</span>
            </button>
          )}

        </div>

        {/* Announcements List / Skeleton */}
        {loading ? (
          <div className="flex flex-col gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-[2rem] p-6 border border-gray-100 animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between"
              >
                <div className="flex items-center gap-6 w-full">
                  <div className="w-[72px] h-[72px] rounded-full bg-gray-100 shrink-0" />
                  <div className="space-y-3 w-full">
                    <div className="h-4 bg-gray-100 rounded-md w-32" />
                    <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm my-4">
            <p className="text-lg font-bold text-[#0B2558] mb-2">Aramanıza Uyan Duyuru Bulunamadı</p>
            <p className="text-gray-500 text-sm mb-6">Seçtiğiniz filtreleme kriterlerine uygun duyuru kaydı bulunmuyor.</p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#0066cc] text-white rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Tüm Duyuruları Göster
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[2rem] p-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-[#f0f4f9] hover:border-gray-200 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center gap-6 mb-4 md:mb-0 px-2">
                  <div
                    className={`w-[72px] h-[72px] rounded-full flex flex-col items-center justify-center shrink-0 shadow-sm ${item.dateBg} ${item.dateText}`}
                  >
                    <span className="text-[1.6rem] font-bold leading-none tracking-tight">
                      {item.day}
                    </span>
                    <span className="text-[0.55rem] font-bold mt-1 tracking-widest uppercase">
                      {item.month}
                    </span>
                  </div>
                  <div>
                    <div className="text-[#0066cc] text-[0.85rem] font-medium mb-1.5 flex items-center gap-2">
                      <span>{item.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400 text-xs">{item.dateYear}</span>
                    </div>
                    <h3 className="text-[1.2rem] font-bold text-[#0B2558] hover:text-[#0066cc] cursor-pointer transition-colors" onClick={() => setSelectedAnnouncement(item)}>
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAnnouncement(item)}
                  className={`${item.buttonBg} text-white px-7 py-3 rounded-full text-[0.85rem] font-semibold flex items-center hover:opacity-90 transition-opacity shrink-0 ml-auto md:ml-0 mt-3 md:mt-0`}
                >
                  {item.buttonText}
                  {item.buttonIcon}
                </button>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Önceki Sayfa"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${currentPage === pageNum
                        ? "bg-[#0066cc] text-white shadow-sm"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Sonraki Sayfa"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] max-w-2xl w-full p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">

            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
            >
              <CloseIcon size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#E6F0FA] text-[#0066cc] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {selectedAnnouncement.category}
              </span>
              <span className="text-gray-400 text-xs font-medium">
                {selectedAnnouncement.day} {selectedAnnouncement.month} {selectedAnnouncement.dateYear}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#0B2558] mb-6 leading-tight">
              {selectedAnnouncement.title}
            </h2>

            <div
              className="prose prose-blue max-w-none text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-6"
              dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
            />

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-6 py-2.5 bg-[#0B2558] text-white rounded-full text-xs font-semibold hover:bg-[#0066cc] transition-colors"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
