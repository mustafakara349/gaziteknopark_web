import { useEffect, useState } from "react";
import { getDocumentCategories, getDocuments } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageHeader from "../components/common/PageHeader";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    getDocuments().then(setDocuments).catch(() => setDocuments([]));
    getDocumentCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const filtered = activeCategory ? documents.filter((d) => d.categoryId === activeCategory) : documents;

  return (
    <div>
      <PageHeader title="Mevzuat ve Belgeler" subtitle="Teknoparkımıza ait yönetmelik, form ve resmi belgelere buradan ulaşabilirsiniz." />
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
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm">
            {filtered.map((doc) => {
              const t = pickTranslation(doc);
              return (
                <div key={doc.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      PDF
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#333]">{t.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(doc.publishedDate)}</p>
                    </div>
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
