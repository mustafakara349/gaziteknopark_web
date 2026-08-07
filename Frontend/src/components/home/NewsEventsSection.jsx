import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, getNews, getAnnouncements } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

function MegaphoneIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  );
}

function CalendarIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function NewspaperIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );
}

function ClockIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function MapPinIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function formatDayMonth(dateStr) {
  if (!dateStr) return { day: "-", month: "-" };
  const d = new Date(dateStr);
  if (isNaN(d)) return { day: "-", month: "-" };
  const day = d.getDate().toString().padStart(2, "0");
  const monthNames = ["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"];
  return { day, month: monthNames[d.getMonth()] };
}

function formatFullDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function resolveImageUrl(item, baseUrl) {
  if (item.coverImageFileId) return `${baseUrl}/api/files/${item.coverImageFileId}`;
  if (item.imageFileId) return `${baseUrl}/api/files/${item.imageFileId}`;
  if (item.coverImageUrl) return item.coverImageUrl.startsWith('http') ? item.coverImageUrl : `${baseUrl}${item.coverImageUrl}`;
  if (item.imageUrl) return item.imageUrl.startsWith('http') ? item.imageUrl : `${baseUrl}${item.imageUrl}`;
  return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&auto=format&fit=crop";
}

export default function NewsEventsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getAnnouncements()
      .then((res) => {
        const data = res?.items || res?.data || (Array.isArray(res) ? res : []);
        setAnnouncements(data);
      })
      .catch(() => setAnnouncements([]));

    getNews()
      .then((res) => {
        const data = res?.data || (Array.isArray(res) ? res : []);
        setNews(data);
      })
      .catch(() => setNews([]));

    getEvents()
      .then((res) => {
        const data = res?.items || res?.data || (Array.isArray(res) ? res : []);
        const now = new Date();
        now.setHours(0,0,0,0);
        const upcomingEvents = data
          .filter(e => {
             const eventDate = new Date(e.startDate || e.dateStr || Date.now());
             return eventDate >= now;
          })
          .sort((a, b) => new Date(a.startDate || a.dateStr) - new Date(b.startDate || b.dateStr));
        setEvents(upcomingEvents);
      })
      .catch(() => setEvents([]));
  }, []);

  return (
    <section className="mx-auto max-w-[1360px] px-4 mt-24 md:px-6">
      <div className="flex flex-col gap-6">
        
        {/* DUYURULAR (Üstte Tam Genişlik - 2 Sütunda 6 Duyuru) */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-[#0066cc]">
                  <MegaphoneIcon className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-[#082b5c]">Duyurular</h2>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {announcements.length > 0 ? announcements.slice(0, 6).map((item) => {
                const t = pickTranslation(item);
                const { day, month } = formatDayMonth(item.publishedAt || item.createdAt);
                return (
                  <Link 
                    key={item.id}
                    to={`/duyurular/${t.slug || item.slug || item.id}`}
                    className="flex gap-4 items-center p-3 rounded-2xl transition-all duration-200 hover:bg-[#f0f6fc] group"
                  >
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full bg-[#f0f6fc] group-hover:bg-white group-hover:shadow-sm text-center transition-all">
                      <span className="text-base font-extrabold text-[#0066cc] leading-none">{day}</span>
                      <span className="text-[10px] font-bold text-[#0066cc]/80 tracking-wider leading-tight">{month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-[#0066cc] transition-colors">
                        {t.title || item.title}
                      </h3>
                    </div>
                  </Link>
                );
              }) : (
                <p className="text-sm text-slate-500 py-4 col-span-2">Güncel duyuru bulunmamaktadır.</p>
              )}
            </div>
          </div>
          
          {announcements.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Link
                to="/duyurular"
                className="inline-flex items-center justify-center rounded-full bg-[#eef5fc] px-10 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0066cc] transition-all hover:bg-[#deecf9] hover:shadow-xs active:scale-95"
              >
                TÜMÜNÜ GÖR
              </Link>
            </div>
          )}
        </div>

        {/* ALT KISIM: HABERLER VE ETKİNLİKLER (Yan Yana) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* HABERLER */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#0066cc]">
                    <NewspaperIcon className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold text-[#082b5c]">Haberler</h2>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {news.length > 0 ? news.slice(0, 5).map((item) => {
                  const t = pickTranslation(item);
                  const img = resolveImageUrl(item, apiBaseUrl);
                  return (
                    <Link 
                      key={item.id}
                      to={`/haberler/${t.slug || item.slug || item.id}`}
                      className="flex gap-4 items-center p-3 -mx-3 rounded-2xl transition-all duration-200 hover:bg-[#f0f6fc] group"
                    >
                      <img
                        src={img}
                        alt={t.title || item.title}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&auto=format&fit=crop"; }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-[#0066cc] transition-colors">
                          {t.title || item.title}
                        </h3>
                      </div>
                    </Link>
                  );
                }) : (
                  <p className="text-sm text-slate-500 py-4">Güncel haber bulunmamaktadır.</p>
                )}
              </div>
            </div>

            {news.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Link
                  to="/haberler"
                  className="inline-flex items-center justify-center rounded-full bg-[#eef5fc] px-10 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0066cc] transition-all hover:bg-[#deecf9] hover:shadow-xs active:scale-95"
                >
                  TÜMÜNÜ GÖR
                </Link>
              </div>
            )}
          </div>

          {/* ETKİNLİKLER */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#0066cc]">
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold text-[#082b5c]">Etkinlikler</h2>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {events.length > 0 ? events.slice(0, 5).map((item) => {
                  const t = pickTranslation(item);
                  const title = t.title || item.title;
                  const img = resolveImageUrl(item, apiBaseUrl);
                  const dateStr = item.dateStr || formatFullDate(item.startDate);
                  const location = item.location || t.location || "Gazi Teknopark";

                  return (
                    <Link 
                      key={item.id}
                      to={`/etkinlikler/${t.slug || item.slug || item.id}`}
                      className="flex items-center gap-4 p-3 -mx-3 rounded-2xl transition-all duration-200 hover:bg-[#f0f6fc] group"
                    >
                      <img
                        src={img}
                        alt={title}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&auto=format&fit=crop"; }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-[#0066cc] transition-colors">
                          {title}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 group-hover:text-[#0066cc]/80 transition-colors">
                          <span className="inline-flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                            {dateStr}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                            {location}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                }) : (
                  <p className="text-sm text-slate-500 py-4">Yaklaşan etkinlik bulunmamaktadır.</p>
                )}
              </div>
            </div>

            {events.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Link
                  to="/etkinlikler"
                  className="inline-flex items-center justify-center rounded-full bg-[#eef5fc] px-10 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0066cc] transition-all hover:bg-[#deecf9] hover:shadow-xs active:scale-95"
                >
                  TÜMÜNÜ GÖR
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
