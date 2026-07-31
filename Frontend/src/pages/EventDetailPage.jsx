import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEventBySlug } from "../api/endpoints";
import PageSection from "../components/common/PageSection";

function CalendarIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function MapPinIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function formatDateTime(startDate, endDate) {
  if (!startDate) return null;
  const start = new Date(startDate);
  if (isNaN(start)) return null;
  const opts = { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
  const startLabel = start.toLocaleDateString("tr-TR", opts);
  if (!endDate) return startLabel;
  const end = new Date(endDate);
  if (isNaN(end)) return startLabel;
  const sameDay = start.toDateString() === end.toDateString();
  const endLabel = sameDay
    ? end.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : end.toLocaleDateString("tr-TR", opts);
  return `${startLabel} - ${endLabel}`;
}

export default function EventDetailPage() {
  const { slug } = useParams();
  const [status, setStatus] = useState("loading");
  const [event, setEvent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

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

  if (status === "loading") {
    return (
      <PageSection className="pt-8 md:pt-14">
        <div className="mx-auto max-w-3xl animate-pulse space-y-4 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:p-12">
          <div className="h-6 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
        </div>
      </PageSection>
    );
  }

  if (status === "not-found" || !event) {
    return (
      <PageSection className="pt-8 md:pt-14">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-gray-300 bg-surface py-10 text-center text-sm text-gray-400">
          Bu etkinlik bulunamadı.
        </div>
        <div className="mt-6 text-center">
          <Link to="/etkinlikler" className="text-sm font-semibold text-primary hover:underline">
            Etkinliklere Geri Dön
          </Link>
        </div>
      </PageSection>
    );
  }

  if (status === "error") {
    return (
      <PageSection className="pt-8 md:pt-14">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-gray-300 bg-surface py-10 text-center text-sm text-gray-400">
          Etkinlik yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </div>
      </PageSection>
    );
  }

  const dateTimeLabel = formatDateTime(event.startDate, event.endDate);

  return (
    <PageSection className="pt-8 md:pt-14">
      <div className="mx-auto max-w-3xl">
        <Link to="/etkinlikler" className="text-sm font-semibold text-primary hover:underline">
          ← Etkinliklere Geri Dön
        </Link>

        <div className="mt-4 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-primary to-primary-light md:h-80">
            {event.coverImageUrl && (
              <img src={event.coverImageUrl} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
            )}
          </div>

          <div className="p-6 md:p-10">
            {event.category && (
              <span className="lowercase inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {event.category}
              </span>
            )}

            <h1 className="mt-3 text-2xl font-extrabold text-ink md:text-3xl">{event.title}</h1>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              {dateTimeLabel && (
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
                  {dateTimeLabel}
                </span>
              )}
              {event.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-primary" />
                  {event.location}
                </span>
              )}
            </div>

            {event.description && (
              <div
                className="prose prose-sm mt-6 max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            )}
          </div>
        </div>
      </div>
    </PageSection>
  );
}
