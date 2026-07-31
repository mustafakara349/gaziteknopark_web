import { Link } from "react-router-dom";

function ClockIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function BigCalendarIcon({ className = "h-16 w-16" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Banner alanı - 1080x1080 kapak görselleriyle birebir uyumlu kare (1:1) alan; başlık/açıklama/tarih burada tekrar edilmez, tek kaynak alttaki beyaz gövdedir */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary to-primary-light">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/15">
            <BigCalendarIcon className="h-28 w-28" />
          </div>
        )}

        {event.category && (
          <span className="lowercase absolute left-4 top-4 inline-block w-fit rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
            {event.category}
          </span>
        )}

        <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-black/30 text-[10px] font-extrabold tracking-tight text-white backdrop-blur-sm">
          GTP
        </div>
      </div>

      {/* Beyaz kart gövdesi - kartın tüm metin içeriği tek noktada burada */}
      <div className="flex flex-1 flex-col p-5">
        <h4 className="truncate text-sm font-bold text-ink">{event.title}</h4>

        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs text-gray-500 leading-relaxed">
          {event.summary || ""}
        </p>

        {dateTimeLabel && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
            <ClockIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{dateTimeLabel}</span>
          </div>
        )}

        <Link
          to={`/etkinlikler/${event.slug}`}
          className="mt-auto inline-flex w-full items-center justify-center rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Detayına Git
        </Link>
      </div>
    </div>
  );
}
