import { useState, useRef, useEffect } from "react";
import { Image, Video, LayoutGrid, ChevronDown, Check, SlidersHorizontal, ArrowUpDown, Clock } from "lucide-react";

export default function MediaFilter({
  activeCategory,
  onCategoryChange,
  counts,
  dateSort,
  onDateSortChange,
  periodFilter,
  onPeriodFilterChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    { id: "all", label: "Tüm Medya", icon: LayoutGrid, count: counts.all },
    { id: "photo", label: "Fotoğraf Galerisi", icon: Image, count: counts.photo },
    { id: "video", label: "Video Galerisi", icon: Video, count: counts.video },
  ];

  const sortOptions = [
    { id: "newest", label: "En Yeni Tarih" },
    { id: "oldest", label: "En Eski Tarih" },
  ];

  const periodOptions = [
    { id: "all", label: "Tüm Zamanlar" },
    { id: "1month", label: "Son 1 Ay" },
    { id: "3months", label: "Son 3 Ay" },
    { id: "6months", label: "Son 6 Ay" },
    { id: "thisYear", label: "Bu Yıl (2026)" },
  ];

  // Outside Click Listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFilterActive = dateSort !== "newest" || periodFilter !== "all";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 pb-6 font-sans">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-gray-100/80 p-1.5 rounded-full border border-gray-200">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#0B2558] text-white shadow-xs"
                  : "text-gray-600 hover:text-[#0B2558] hover:bg-white/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-500"}`} />
              <span>{cat.label}</span>
              <span
                className={`ml-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-200/80 text-gray-600"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Side: Single Unified "Sırala & Filtrele" Custom Dropdown */}
      <div className="flex items-center gap-3">
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer border shadow-xs ${
              isOpen || isFilterActive
                ? "bg-white text-[#0066cc] border-[#0066cc] ring-2 ring-[#0066cc]/20"
                : "bg-white text-[#0B2558] border-gray-200 hover:border-[#0066cc] hover:text-[#0066cc]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0066cc]" />
            <span>Sırala & Filtrele</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#0066cc]" : ""}`} />
          </button>

          {/* Unified Floating Modern Popup Menu */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white border border-gray-200/90 shadow-2xl p-3 z-40 animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
              {/* Bölüm 1: Tarih Sıralaması */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1.5">
                  <ArrowUpDown className="w-3 h-3 text-[#0066cc]" />
                  Tarih Sıralaması
                </div>
                <div className="space-y-0.5">
                  {sortOptions.map((option) => {
                    const isSelected = dateSort === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => onDateSortChange(option.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/90 text-[#0066cc] font-bold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#0B2558]"
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0066cc]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ayırıcı Çizgi */}
              <div className="border-t border-gray-100" />

              {/* Bölüm 2: Zaman Aralığı (Dönem) */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1.5">
                  <Clock className="w-3 h-3 text-[#0066cc]" />
                  Zaman Aralığı
                </div>
                <div className="space-y-0.5">
                  {periodOptions.map((option) => {
                    const isSelected = periodFilter === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => onPeriodFilterChange(option.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/90 text-[#0066cc] font-bold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#0B2558]"
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0066cc]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sıfırla Butonu (Filtre Aktifse Görünür) */}
              {isFilterActive && (
                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      onDateSortChange("newest");
                      onPeriodFilterChange("all");
                    }}
                    className="w-full text-center py-1.5 text-[11px] font-bold text-[#e30613] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  >
                    Filtreleri Sıfırla
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:block text-xs text-gray-500 font-medium">
          <span className="font-bold text-[#0B2558]">{counts.all}</span> içerik
        </div>
      </div>
    </div>
  );
}
