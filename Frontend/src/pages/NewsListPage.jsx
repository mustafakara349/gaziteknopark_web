import { useEffect, useState } from "react";
import { getNews, getNewsCategories } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function NewsListPage() {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    getNews().then(setNews).catch(() => setNews([]));
    getNewsCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const filtered = activeCategory ? news.filter((n) => n.categoryId === activeCategory) : news;

  return (
    <div>
      <PageSection>
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === null ? "bg-primary text-white" : "bg-surface text-[#333]"}`}
            >
              Tümü
            </button>
            {categories.map((cat) => {
              const t = pickTranslation(cat);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === cat.id ? "bg-primary text-white" : "bg-surface text-[#333]"}`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const t = pickTranslation(item);
              return (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-40 w-full bg-surface" />
                  <div className="p-5">
                    <p className="text-xs font-medium text-gray-400">{formatDate(item.publishedAt)}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#333]">{t.title}</h3>
                    {t.summary && <p className="mt-2 line-clamp-2 text-xs text-gray-500">{t.summary}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageSection>
    </div>
  );
}
