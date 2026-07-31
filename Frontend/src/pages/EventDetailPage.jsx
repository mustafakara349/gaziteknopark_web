import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Share2, CalendarPlus, CalendarDays } from "lucide-react";
import { getEventBySlug, getEventsList } from "../api/endpoints";
import PageSection from "../components/common/PageSection";
import EventCard from "../components/events/EventCard";

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
    <div className="mx-auto max-w-5xl animate-pulse">
      <div className="mb-8 h-4 w-32 rounded-md bg-gray-100" />
      <div className="mb-4 h-6 w-40 rounded-full bg-gray-100" />
      <div className="mb-2.5 h-10 w-4/5 rounded-xl bg-gray-100" />
      <div className="mb-8 h-10 w-3/5 rounded-xl bg-gray-100" />
      <div className="mb-10 h-[320px] w-full rounded-[2rem] bg-gray-100 md:h-[420px]" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <div className="h-4 w-full rounded-md bg-gray-100" />
          <div className="h-4 w-11/12 rounded-md bg-gray-100" />
          <div className="h-4 w-4/5 rounded-md bg-gray-100" />
        </div>
        <div className="h-52 rounded-3xl bg-gray-100 md:col-span-1" />
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const { slug } = useParams();
  const [status, setStatus] = useState("loading");
  const [event, setEvent] = useState(null);
  const [related, setRelated] = useState([]);

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

  return (
    <PageSection className="pt-8 pb-16 md:pt-14">
      <div className="mx-auto max-w-5xl">
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

        {/* Kapak görseli - 1080x1080 kapak görselleriyle birebir uyumlu kare (1:1) alan; afiş formatı korunuyor */}
        <div className="relative mx-auto mb-10 aspect-square w-full max-w-xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-light shadow-sm">
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

        {/* İçerik + bilgi kartı */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            {event.description ? (
              <div
                className="prose prose-sm md:prose-base max-w-none text-gray-600 prose-headings:text-[#0B2558] prose-a:text-[#0066cc] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            ) : (
              <p className="text-sm text-gray-400">Bu etkinlik için henüz açıklama eklenmedi.</p>
            )}
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">Etkinlik Bilgileri</h2>

              <dl className="space-y-4">
                {dateLabel && (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E6F0FA] text-[#0066cc]">
                      <Calendar size={15} />
                    </span>
                    <div>
                      <dt className="text-xs font-semibold text-gray-400">Tarih</dt>
                      <dd className="text-sm font-medium text-[#0B2558]">{dateLabel}</dd>
                    </div>
                  </div>
                )}

                {timeLabel && (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E6F0FA] text-[#0066cc]">
                      <Clock size={15} />
                    </span>
                    <div>
                      <dt className="text-xs font-semibold text-gray-400">Saat</dt>
                      <dd className="text-sm font-medium text-[#0B2558]">{timeLabel}</dd>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E6F0FA] text-[#0066cc]">
                      <MapPin size={15} />
                    </span>
                    <div>
                      <dt className="text-xs font-semibold text-gray-400">Konum</dt>
                      <dd className="text-sm font-medium text-[#0B2558]">{event.location}</dd>
                    </div>
                  </div>
                )}
              </dl>

              {calendarUrl && (
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0066cc] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0055b8]"
                >
                  <CalendarPlus size={16} />
                  Takvime Ekle
                </a>
              )}
            </div>
          </aside>
        </div>

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
