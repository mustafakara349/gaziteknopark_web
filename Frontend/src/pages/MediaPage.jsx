import { useEffect, useState, useMemo } from "react";
import { getMediaAlbums } from "../api/endpoints";
import MediaFilter from "../components/media/MediaFilter";
import MediaCard from "../components/media/MediaCard";
import MediaModal from "../components/media/MediaModal";

// Curated high-resolution static media dataset with ISO dates
const STATIC_MEDIA_ITEMS = [
  // --- FOTOĞRAF GALERİSİ ---
  {
    id: "photo-1",
    type: "photo",
    category: "Kampüs & Ar-Ge",
    title: "Gazi Teknopark Gölbaşı Ana Binası ve Ar-Ge Kompleksi",
    description: "Gazi Üniversitesi Gölbaşı Yerleşkesi'nde yer alan teknopark binamız ve teknoloji laboratuvarlarımız.",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    photoCount: 14,
    date: "2026-08-01",
    dateLabel: "Ağustos 2026",
    downloadUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: "photo-2",
    type: "photo",
    category: "Lansman & Etkinlik",
    title: "Teknoloji Transferi ve İnovasyon Zirvesi",
    description: "Akademisyenler, sanayiciler ve teknoloji girişimcilerinin bir araya geldiği yıllık inovasyon buluşması.",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    photoCount: 22,
    date: "2026-07-15",
    dateLabel: "Temmuz 2026",
    downloadUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: "photo-3",
    type: "photo",
    category: "Laboratuvar & Prototipleme",
    title: "Kuluçka Merkezi ve Prototipleme Atölyesi",
    description: "Donanım ve yazılım girişimcilerimizin kullanımına açık olan 3D yazıcı ve prototip test laboratuvarı.",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    photoCount: 18,
    date: "2026-06-10",
    dateLabel: "Haziran 2026",
    downloadUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: "photo-4",
    type: "photo",
    category: "Küresel Ağ",
    title: "Londra ve Amsterdam İrtibat Ofisleri Açılış Töreni",
    description: "Gazi Teknopark girişimcilerini Avrupa pazarına taşıyan küresel hızlandırma merkezlerimiz.",
    coverImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop",
    photoCount: 10,
    date: "2026-05-20",
    dateLabel: "Mayıs 2026",
    downloadUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop",
  },

  // --- VIDEO GALERİSİ (Fixed 1920x1080 Aspect Ratio) ---
  {
    id: "video-1",
    type: "video",
    category: "Kurumsal Tanıtım Filmi",
    title: "Gazi Teknopark Kurumsal Tanıtım Filmi (1920x1080 Full HD)",
    description: "Türkiye'nin öncü teknoparklarından Gazi Teknopark'ın vizyonu, başarıları ve sunduğu imkanlar.",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    duration: "03:45",
    date: "2026-08-05",
    dateLabel: "Ağustos 2026",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "video-2",
    type: "video",
    category: "Girişimci Röportajları",
    title: "Başarı Hikayeleri: Kuluçkadan Küresel Pazara Yolculuk",
    description: "Gazi Teknopark bünyesinde büyüyüp uluslararası yatırım alan yazılım girişimcilerimizin hikayeleri.",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    duration: "05:12",
    date: "2026-07-28",
    dateLabel: "Temmuz 2026",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "video-3",
    type: "video",
    category: "Akademi & Sanayi İş Birliği",
    title: "Üniversite-Sanayi İş Birliği Proje Sergisi",
    description: "Gazi Üniversitesi akademisyenleri ile teknopark firmalarının ortak geliştirdiği yerli teknoloji projeleri.",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    duration: "04:30",
    date: "2026-06-25",
    dateLabel: "Haziran 2026",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState(STATIC_MEDIA_ITEMS);
  const [activeCategory, setActiveCategory] = useState("all");
  const [dateSort, setDateSort] = useState("newest"); // "newest" | "oldest"
  const [periodFilter, setPeriodFilter] = useState("all"); // "all" | "1month" | "3months" | "6months" | "thisYear"
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch API media albums if available
  useEffect(() => {
    getMediaAlbums()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const apiMapped = data.map((album) => ({
            id: `api-${album.id}`,
            type: "photo",
            category: "Fotoğraf Albümü",
            title: album.translations?.[0]?.title || "Gazi Teknopark Albümü",
            description: "Gazi Teknopark güncel medya albümü görselleri.",
            coverImage: album.coverImageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
            photoCount: 12,
            date: "2026-08-01",
            dateLabel: "Ağustos 2026",
          }));
          setMediaItems([...STATIC_MEDIA_ITEMS, ...apiMapped]);
        }
      })
      .catch(() => {
        // Fallback to static items
        setMediaItems(STATIC_MEDIA_ITEMS);
      });
  }, []);

  // Filter Counts
  const counts = useMemo(() => {
    return {
      all: mediaItems.length,
      photo: mediaItems.filter((i) => i.type === "photo").length,
      video: mediaItems.filter((i) => i.type === "video").length,
    };
  }, [mediaItems]);

  // Filtered & Sorted List
  const filteredItems = useMemo(() => {
    let result = activeCategory === "all" ? mediaItems : mediaItems.filter((item) => item.type === activeCategory);

    // Period Filter Logic
    if (periodFilter !== "all") {
      const now = new Date("2026-08-06").getTime();
      result = result.filter((item) => {
        const itemTime = new Date(item.date || "2026-01-01").getTime();
        const diffDays = (now - itemTime) / (1000 * 3600 * 24);

        if (periodFilter === "1month") return diffDays <= 30;
        if (periodFilter === "3months") return diffDays <= 90;
        if (periodFilter === "6months") return diffDays <= 180;
        if (periodFilter === "thisYear") {
          return new Date(item.date || "2026-01-01").getFullYear() === 2026;
        }
        return true;
      });
    }

    // Sort by Date
    return [...result].sort((a, b) => {
      const dateA = new Date(a.date || "2026-01-01").getTime();
      const dateB = new Date(b.date || "2026-01-01").getTime();
      return dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [mediaItems, activeCategory, periodFilter, dateSort]);

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Gallery Container Card */}
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8 space-y-8">
          {/* Category Filter Tabs, Period Range & Date Sort Dropdowns */}
          <MediaFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            counts={counts}
            dateSort={dateSort}
            onDateSortChange={setDateSort}
            periodFilter={periodFilter}
            onPeriodFilterChange={setPeriodFilter}
          />

          {/* Media Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onClick={(selected) => setSelectedItem(selected)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox / Video Modal */}
      {selectedItem && (
        <MediaModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
