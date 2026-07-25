import { useEffect, useState } from "react";
import { getFeaturedTechnologies } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageHeader from "../components/common/PageHeader";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";

export default function TechnologiesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getFeaturedTechnologies().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div>
      <PageHeader title="Öne Çıkan Teknolojiler" subtitle="Firmalarımızın geliştirdiği öne çıkan teknolojiler ve yenilikler." />
      <PageSection>
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const t = pickTranslation(item);
              return (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-36 w-full bg-surface" />
                  <div className="p-5">
                    <h3 className="line-clamp-2 text-sm font-semibold text-[#333]">{t.title}</h3>
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
