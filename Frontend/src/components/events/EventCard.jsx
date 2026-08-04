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
      className="group/card flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
    >
      {/* Banner alanı - haberler sayfasındaki kartlarla aynı 900x500 (9:5) oranı */}
      <div className="relative aspect-[9/5] w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary to-primary-light">
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
      </div>

      {/* Kart gövdesi - haberler sayfasındaki kart tipografisi ve düzeniyle aynı */}
      <div className="flex flex-1 flex-col p-8">
        <div className="mb-3 flex items-center gap-1.5 text-[0.85rem] font-medium text-[#0066cc]">
          <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <span className="truncate">{dateTimeLabel}</span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-[1.3rem] font-bold leading-snug text-[#0B2558] transition-colors group-hover/card:text-[#0066cc]">
          {event.title}
        </h3>

        {event.location && (
          <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        <p className="mb-8 line-clamp-2 text-[0.9rem] leading-relaxed text-gray-500">
          {event.summary || ""}
        </p>

        <div className="mt-auto">
          <span className="group/btn inline-flex items-center text-[0.85rem] font-bold text-[#0B2558]">
            Detayına Git
            <ChevronRight
              size={16}
              strokeWidth={2.5}
              className="ml-1 text-[#0066cc] transition-transform group-hover/card:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
