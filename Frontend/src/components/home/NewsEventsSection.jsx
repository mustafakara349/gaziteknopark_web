import { useEffect, useState } from "react";
import { getEvents, getNews } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import ShowMoreButton from "../common/ShowMoreButton";
import EmptyState from "../common/EmptyState";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

function ContentCard({ item, dateValue }) {
  const t = pickTranslation(item);
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-20 w-20 shrink-0 rounded-xl bg-surface" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400">{formatDate(dateValue)}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#333]">{t.title ?? "Başlıksız"}</h3>
        {t.summary && <p className="mt-1 line-clamp-1 text-xs text-gray-500">{t.summary}</p>}
      </div>
    </div>
  );
}

function Column({ title, items, dateKey, showMoreTo }) {
  return (
    <div className="flex-1">
      <h3 className="mb-4 text-center text-xl font-bold text-primary md:text-left">{title}</h3>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {items.slice(0, 3).map((item) => (
            <ContentCard key={item.id} item={item} dateValue={item[dateKey]} />
          ))}
        </div>
      )}
      <div className="mt-5 flex justify-center md:justify-start">
        <ShowMoreButton to={showMoreTo}>Göster</ShowMoreButton>
      </div>
    </div>
  );
}

export default function NewsEventsSection() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getNews().then(setNews).catch(() => setNews([]));
    getEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        <Column title="DUYURULAR" items={news} dateKey="publishedAt" showMoreTo="/haberler" />
        <Column title="ETKİNLİKLER" items={events} dateKey="startDate" showMoreTo="/etkinlikler" />
      </div>
    </section>
  );
}
