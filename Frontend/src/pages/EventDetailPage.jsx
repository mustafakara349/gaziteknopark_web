import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Share2, CalendarPlus, CalendarDays } from "lucide-react";
import { getEventBySlug, getEventsList } from "../api/endpoints";
import PageSection from "../components/common/PageSection";
import EventCard from "../components/events/EventCard";

const INFO_GRID_COLS = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" };

const STATUS_META = {
  upcoming: { label: "Yaklaşan Etkinlik", className: "bg-[#E6F0FA] text-[#0066cc]" },
  ongoing: { label: "Şu An Devam Ediyor", className: "bg-green-50 text-green-600" },
  past: { label: "Sona Erdi", className: "bg-gray-100 text-gray-500" }
};

function formatDateLabel(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatTimeLabel(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d)) return null;
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateTimeRange(startDate, endDate) {
  const startLabel = formatDateLabel(startDate);
  if (!startLabel) return null;
  const start = new Date(startDate);
  const timeLabel = formatTimeLabel(startDate);
  const withTime = timeLabel ? `${startLabel}, ${timeLabel}` : startLabel;
  if (!endDate) return withTime;
  const end = new Date(endDate);
  if (isNaN(end)) return withTime;
  const sameDay = start.toDateString() === end.toDateString();
  const endLabel = sameDay ? formatTimeLabel(endDate) : formatDateLabel(endDate);
  return endLabel ? `${withTime} - ${endLabel}` : withTime;
}

function getEventStatus(startDate, endDate) {
  const start = startDate ? new Date(startDate) : null;
  if (!start || isNaN(start)) return null;
  const end = endDate ? new Date(endDate) : null;
  const now = new Date();
  if (now < start) return "upcoming";
  if (end && !isNaN(end)) return now <= end ? "ongoing" : "past";
  return now.toDateString() === start.toDateString() ? "ongoing" : "past";
}

function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function buildGoogleCalendarUrl(event) {
  if (!event.startDate) return null;
  const start = new Date(event.startDate);
  if (isNaN(start)) return null;
  const parsedEnd = event.endDate ? new Date(event.endDate) : null;
  const end = parsedEnd && !isNaN(parsedEnd) ? parsedEnd : new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: event.location || "",
    details: stripHtml(event.description).slice(0, 400)
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="mb-8 h-4 w-32 rounded-md bg-gray-100" />
      <div className="mb-4 h-6 w-40 rounded-full bg-gray-100" />
      <div className="mb-2.5 h-10 w-4/5 rounded-xl bg-gray-100" />
      <div className="mb-8 h-10 w-3/5 rounded-xl bg-gray-100" />
      <div className="mb-10 aspect-[9/5] w-full rounded-[2rem] bg-gray-100" />
      <div className="space-y-4">
        <div className="h-4 w-full rounded-md bg-gray-100" />
        <div className="h-4 w-11/12 rounded-md bg-gray-100" />
        <div className="h-4 w-4/5 rounded-md bg-gray-100" />
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const { slug } = useParams();
  const [status, setStatus] = useState("loading");
  const [event, setEvent] = useState(null);
  const [related, setRelated] = useState([]);
  const [prevEvent, setPrevEvent] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setEvent(null);
    window.scrollTo({ top: 0 });

    getEventBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setEvent(data);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus(err.response?.status === 404 ? "not-found" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (status !== "success" || !event) return;
    let cancelled = false;

    getEventsList({ when: "upcoming", pageSize: 4, sort: "date_asc" })
      .then((data) => {
        if (cancelled) return;
        setRelated((data.items || []).filter((item) => item.slug !== event.slug).slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });

    return () => {
      cancelled = true;
    };
  }, [status, event]);

  useEffect(() => {
    if (status !== "success" || !event) return;
    let cancelled = false;

    getEventsList({ when: "all", sort: "date_asc", pageSize: 100 })
      .then((data) => {
        if (cancelled) return;
        const items = data.items || [];
        const index = items.findIndex((item) => item.slug === event.slug);
        setPrevEvent(index > 0 ? items[index - 1] : null);
        setNextEvent(index >= 0 && index < items.length - 1 ? items[index + 1] : null);
      })
      .catch(() => {
        if (!cancelled) {
          setPrevEvent(null);
          setNextEvent(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status, event]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event?.title, url: window.location.href }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (status === "loading") {
    return (
      <PageSection className="pt-8 pb-16 md:pt-14">
        <DetailSkeleton />
      </PageSection>
    );
  }

  if (status === "not-found" || !event) {
    return (
      <PageSection className="pt-8 pb-16 md:pt-14">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-gray-300 bg-white py-10 text-center text-sm text-gray-400">
          Bu etkinlik bulunamadı.
        </div>
        <div className="mt-6 text-center">
          <Link to="/etkinlikler" className="text-sm font-semibold text-[#0066cc] hover:underline">
            Etkinliklere Geri Dön
          </Link>
        </div>
      </PageSection>
    );
  }

  if (status === "error") {
    return (
      <PageSection className="pt-8 pb-16 md:pt-14">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-gray-300 bg-white py-10 text-center text-sm text-gray-400">
          Etkinlik yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </div>
      </PageSection>
    );
  }

  const eventStatus = getEventStatus(event.startDate, event.endDate);
  const statusMeta = eventStatus ? STATUS_META[eventStatus] : null;
  const dateTimeLabel = formatDateTimeRange(event.startDate, event.endDate);
  const dateLabel = formatDateLabel(event.startDate);
  const timeLabel = formatTimeLabel(event.startDate);
  const calendarUrl = buildGoogleCalendarUrl(event);

  const infoStats = [
    dateLabel && { icon: Calendar, value: dateLabel, label: "Tarih" },
    timeLabel && { icon: Clock, value: timeLabel, label: "Saat" },
    event.location && { icon: MapPin, value: event.location, label: "Konum" }
  ].filter(Boolean);

  return (
    <PageSection className="pt-8 pb-16 md:pt-14">
      {/* Haberler detay sayfasıyla aynı içerik genişliği için aynı padding şeması (px-4 sm:px-6 lg:px-8) */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Üst gezinme: geri dön + paylaş */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/etkinlikler"
            className="group inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-[#0066cc]"
          >
            <ArrowLeft size={18} strokeWidth={2} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Etkinliklere Dön
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="group/share flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-500 shadow-sm transition-all hover:bg-[#0066cc] hover:text-white"
            title="Etkinliği Paylaş"
          >
            <Share2 size={16} className="transition-transform group-hover/share:scale-110" />
          </button>
        </div>

        {/* Başlık bölgesi */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {statusMeta && (
            <span className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${statusMeta.className}`}>
              {statusMeta.label}
            </span>
          )}
          {dateTimeLabel && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500">
              <Calendar size={15} className="opacity-70" />
              {dateTimeLabel}
            </span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500">
              <MapPin size={15} className="opacity-70" />
              {event.location}
            </span>
          )}
        </div>

        <h1 className="mb-8 text-[2rem] font-extrabold leading-[1.15] tracking-tight text-[#0B2558] md:text-[2.6rem]">
          {event.title}
        </h1>

        {/* Kapak görseli - detay sayfasında 2:1 oranında, ortalanmış afiş */}
        <div className="mb-10 overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
          <div className="relative aspect-[2/1] w-full overflow-hidden bg-gradient-to-br from-primary to-primary-light">
            {event.coverImageUrl ? (
              <img
                src={event.coverImageUrl}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/15">
                <CalendarDays className="h-24 w-24" strokeWidth={1.2} />
              </div>
            )}
          </div>

          {/* Etkinlik bilgileri - hakkımızda sayfasındaki görsel altı bilgi şeridiyle aynı düzen */}
          {infoStats.length > 0 && (
            <div className={`grid divide-x divide-gray-100 border-t border-gray-100 ${INFO_GRID_COLS[infoStats.length] || "grid-cols-3"}`}>
              {infoStats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1.5 px-3 py-5 text-center">
                  <stat.icon size={16} className="text-[#0066cc]" strokeWidth={2} />
                  <p className="text-sm font-bold text-[#0B2558] md:text-base">{stat.value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 md:text-[11px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {calendarUrl && (
            <div className="border-t border-gray-100 p-4">
              <a
                href={calendarUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0066cc] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0055b8]"
              >
                <CalendarPlus size={16} />
                Takvime Ekle
              </a>
            </div>
          )}
        </div>

        {/* Açıklama */}
        <div>
          {event.description ? (
            <div
              className="prose prose-sm md:prose-base max-w-none text-gray-600 prose-headings:text-[#0B2558] prose-a:text-[#0066cc] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          ) : (
            <p className="text-sm text-gray-400">Bu etkinlik için henüz açıklama eklenmedi.</p>
          )}
        </div>

        {/* Önceki / Sonraki Etkinlik */}
        {(prevEvent || nextEvent) && (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {prevEvent ? (
              <Link
                to={`/etkinlikler/${prevEvent.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-[#0066cc]/20 hover:bg-[#E6F0FA] hover:shadow-md"
              >
                <ArrowLeft size={18} className="shrink-0 text-[#0066cc] transition-transform group-hover:-translate-x-1" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 group-hover:text-[#0066cc]/70">Önceki Etkinlik</p>
                  <p className="truncate font-bold text-[#0B2558] group-hover:text-[#0066cc]">{prevEvent.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextEvent ? (
              <Link
                to={`/etkinlikler/${nextEvent.slug}`}
                className="group flex items-center justify-end gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-right shadow-sm transition-colors hover:border-[#0066cc]/20 hover:bg-[#E6F0FA] hover:shadow-md"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 group-hover:text-[#0066cc]/70">Sonraki Etkinlik</p>
                  <p className="truncate font-bold text-[#0B2558] group-hover:text-[#0066cc]">{nextEvent.title}</p>
                </div>
                <ArrowRight size={18} className="shrink-0 text-[#0066cc] transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

        {/* Diğer Etkinlikler */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-6 text-2xl font-bold text-[#0B2558]">Diğer Etkinlikler</h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <EventCard key={item.id} event={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageSection>
  );
}
