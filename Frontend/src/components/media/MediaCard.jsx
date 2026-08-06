import { Play, Eye, Calendar, ArrowUpRight } from "lucide-react";

export default function MediaCard({ item, onClick }) {
  const displayDate = item.dateLabel || item.date || "2026";

  // 1. VIDEO KARTI (Etkinlik Kartı Stilinde Poster Görünümü + 1920x1080 HD Oynatma)
  if (item.type === "video") {
    return (
      <div
        onClick={() => onClick(item)}
        className="group/card relative flex aspect-[3/4] w-full self-start overflow-hidden rounded-[2rem] bg-slate-950 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] hover:-translate-y-1 cursor-pointer font-sans"
      >
        {/* Arka Plan Görseli */}
        <img
          src={item.coverImage}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover/card:scale-110 group-hover/card:opacity-100"
        />

        {/* Karartma Gradyanı */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Üst Rozetler (Sol Üst: Paylaşılma Tarihi, Sağ Üst: Süre) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          {/* Sol Üst: Paylaşılma Tarihi */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20 uppercase tracking-wide shadow-xs">
            <Calendar className="w-3 h-3 text-[#0066cc]" />
            {displayDate}
          </span>

          {/* Sağ Üst: Süre */}
          {item.duration && (
            <span className="text-[10px] text-white font-semibold px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full border border-white/10">
              {item.duration}
            </span>
          )}
        </div>

        {/* Orta Pulsing Play Butonu */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-14 h-14 rounded-full bg-[#e30613]/90 text-white flex items-center justify-center shadow-xl group-hover/card:scale-115 group-hover/card:bg-[#e30613] transition-all duration-300 ring-4 ring-white/30">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Sağ Üst Detay İkonu */}
        <span className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all group-hover/card:bg-[#e30613] group-hover/card:text-white">
          <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
        </span>

        {/* Alt İçerik Metinleri */}
        <div className="relative mt-auto flex w-full flex-col gap-1.5 p-5 sm:p-6 z-10">
          <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
            {item.category || "Video Galerisi"}
          </div>

          <h3 className="line-clamp-2 text-base sm:text-lg font-bold leading-snug text-white group-hover/card:text-red-200 transition-colors">
            {item.title}
          </h3>

          <div className="mt-2 flex items-center justify-end text-xs text-white/80 font-medium pt-2 border-t border-white/15">
            <span className="inline-flex items-center gap-1 text-[#0066cc] bg-white px-3 py-1 rounded-full text-[11px] font-bold shadow-xs">
              <Eye className="w-3.5 h-3.5" />
              İzle
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. FOTOĞRAF KARTI (Etkinlik Kartı Stilinde Poster Görünümü)
  return (
    <div
      onClick={() => onClick(item)}
      className="group/card relative flex aspect-[3/4] w-full self-start overflow-hidden rounded-[2rem] bg-slate-900 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] hover:-translate-y-1 cursor-pointer font-sans"
    >
      {/* Arka Plan Görseli */}
      <img
        src={item.coverImage || item.imageUrl}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
      />

      {/* Karartma Gradyanı */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

      {/* Üst Rozetler (Sol Üst: Paylaşılma Tarihi) */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md text-[#0B2558] text-[10px] font-bold rounded-full border border-gray-200 uppercase tracking-wide shadow-xs">
          <Calendar className="w-3 h-3 text-[#0066cc]" />
          {displayDate}
        </span>
      </div>

      {/* Sağ Üst Detay İkonu */}
      <span className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all group-hover/card:bg-white group-hover/card:text-[#0B2558]">
        <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
      </span>

      {/* Alt İçerik Metinleri */}
      <div className="relative mt-auto flex w-full flex-col gap-1.5 p-5 sm:p-6 z-10">
        <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
          {item.category || "Kampüs & Etkinlik"}
        </div>

        <h3 className="line-clamp-2 text-base sm:text-lg font-bold leading-snug text-white group-hover/card:text-blue-100 transition-colors">
          {item.title}
        </h3>

        <div className="mt-2 flex items-center justify-end text-xs text-white/80 font-medium pt-2 border-t border-white/15">
          <span className="inline-flex items-center gap-1 text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold">
            <Eye className="w-3.5 h-3.5" />
            İncele
          </span>
        </div>
      </div>
    </div>
  );
}
