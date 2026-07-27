import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, getNews } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";

const defaultAnnouncements = [
  {
    id: 1,
    day: "15",
    month: "EKİ",
    title: "2024 Yılı Ar-Ge Destek Programı Başvuruları Başladı",
    summary:
      "Yeni dönem destek programı kapsamında teknoloji odaklı projelere hibe desteği sağlanacaktır. Son başvuru tarihi...",
  },
  {
    id: 2,
    day: "08",
    month: "EKİ",
    title: "Teknopark Altyapı İyileştirme Çalışmaları Hakkında",
    summary:
      "A Blok sunucu odalarında yapılacak planlı bakım çalışmaları nedeniyle pazar günü kısa süreli kesintiler yaşanabilir.",
  },
];

const defaultEvents = [
  {
    id: 1,
    title: "Yapay Zeka ve Geleceğin Teknolojileri Zirvesi",
    dateStr: "22 Ekim 2024, 10:00",
    location: "Konferans Salonu A",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Girişimciler İçin Yatırımcı Sunumu Eğitimi",
    dateStr: "25 Ekim 2024, 14:00",
    location: "Eğitim Salonu 2",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&auto=format&fit=crop",
  },
];

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
  if (!dateStr) return { day: "15", month: "EKİ" };
  const d = new Date(dateStr);
  if (isNaN(d)) return { day: "15", month: "EKİ" };
  const day = d.getDate().toString().padStart(2, "0");
  const monthNames = ["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"];
  return { day, month: monthNames[d.getMonth()] };
}

function formatFullDate(dateStr) {
  if (!dateStr) return "22 Ekim 2024, 10:00";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function NewsEventsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getNews()
      .then((data) => setAnnouncements(data?.length ? data : defaultAnnouncements))
      .catch(() => setAnnouncements(defaultAnnouncements));

    getEvents()
      .then((data) => setEvents(data?.length ? data : defaultEvents))
      .catch(() => setEvents(defaultEvents));
  }, []);

  return (
    <section className="mx-auto max-w-[1360px] px-4 mt-24 md:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Duyurular Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-[#0066cc]">
                  <MegaphoneIcon className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-[#082b5c]">Duyurular</h2>
              </div>
              <Link
                to="/haberler"
                className="text-xs font-semibold text-[#0066cc] hover:underline"
              >
                Tümünü Gör
              </Link>
            </div>

            {/* Announcements List */}
            <div className="mt-5 space-y-5">
              {announcements.slice(0, 2).map((item) => {
                const t = pickTranslation(item);
                const { day, month } = item.day ? item : formatDayMonth(item.publishedAt);
                return (
                  <div key={item.id} className="flex gap-4">
                    {/* Circle Date Badge */}
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full bg-[#f0f6fc] text-center shadow-xs">
                      <span className="text-base font-extrabold text-[#0066cc] leading-none">{day}</span>
                      <span className="text-[10px] font-bold text-[#0066cc]/80 tracking-wider leading-tight">{month}</span>
                    </div>
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-1 hover:text-[#0066cc] transition-colors cursor-pointer">
                        {t.title || item.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {t.summary || item.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Action Button */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/haberler"
              className="inline-flex items-center justify-center rounded-full bg-[#eef5fc] px-10 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0066cc] transition-all hover:bg-[#deecf9] hover:shadow-xs active:scale-95"
            >
              GÖSTER
            </Link>
          </div>
        </div>

        {/* Etkinlikler Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-[#0066cc]">
                  <CalendarIcon className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-[#082b5c]">Etkinlikler</h2>
              </div>
              <Link
                to="/etkinlikler"
                className="text-xs font-semibold text-[#0066cc] hover:underline"
              >
                Tümünü Gör
              </Link>
            </div>

            {/* Events List */}
            <div className="mt-5 space-y-5">
              {events.slice(0, 2).map((item) => {
                const t = pickTranslation(item);
                const title = t.title || item.title;
                const img = item.imageFileId
                  ? `/api/files/${item.imageFileId}`
                  : item.imageUrl || defaultEvents[0].imageUrl;
                const dateStr = item.dateStr || formatFullDate(item.startDate);
                const location = item.location || t.location || "Gazi Teknopark Salonu";

                return (
                  <div key={item.id} className="flex items-center gap-4">
                    {/* Event Image Thumbnail */}
                    <img
                      src={img}
                      alt={title}
                      className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-xs"
                    />
                    {/* Event Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-1 hover:text-[#0066cc] transition-colors cursor-pointer">
                        {title}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          {dateStr}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPinIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          {location}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Action Button */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/etkinlikler"
              className="inline-flex items-center justify-center rounded-full bg-[#eef5fc] px-10 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0066cc] transition-all hover:bg-[#deecf9] hover:shadow-xs active:scale-95"
            >
              GÖSTER
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
