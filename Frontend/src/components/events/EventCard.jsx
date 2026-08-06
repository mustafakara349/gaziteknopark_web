import { Link } from "react-router-dom";
import { Clock, MapPin, ChevronRight, CalendarDays } from "lucide-react";

function formatDateLabel(startDate) {
  if (!startDate) return null;
  const d = new Date(startDate);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function EventCard({ event }) {
  const dateLabel = formatDateLabel(event.startDate);
  const dateTimeLabel = [dateLabel, event.startTime].filter(Boolean).join(", ");

  return (
    <Link
      to={`/etkinlikler/${event.slug}`}
      className="group/card relative flex aspect-[3/4] w-full self-start overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-light shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
    >
      {/* Afiş - kartın tamamı görsel */}
      {event.coverImageUrl ? (
        <img
          src={event.coverImageUrl}
          alt={event.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/15">
          <CalendarDays className="h-28 w-28" strokeWidth={1.2} />
        </div>
      )}

      {/* Okunabilirlik için alttan üste karartma */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      {/* Detayına git - sağ üstte küçük ikon */}
      <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all group-hover/card:bg-white group-hover/card:text-[#0B2558]">
        <ChevronRight size={18} strokeWidth={2.5} className="transition-transform group-hover/card:translate-x-0.5" />
      </span>

      {/* Alt bilgi - minimal tarih ve başlık */}
      <div className="relative mt-auto flex w-full flex-col gap-1.5 p-5">
        <div className="flex items-center gap-1.5 text-[0.75rem] font-medium text-white/80">
          <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <span className="truncate">{dateTimeLabel}</span>
        </div>

        <h3 className="line-clamp-2 text-[1.05rem] font-bold leading-snug text-white">
          {event.title}
        </h3>

        {event.location && (
          <div className="flex items-center gap-1.5 text-[0.75rem] text-white/70">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">{event.location}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
