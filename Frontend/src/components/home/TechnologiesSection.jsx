import { useEffect, useState } from "react";
import { getFeaturedTechnologies } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import SectionTitle from "../common/SectionTitle";
import ShowMoreButton from "../common/ShowMoreButton";
import EmptyState from "../common/EmptyState";

export default function TechnologiesSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getFeaturedTechnologies().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <SectionTitle title="Öne Çıkan Teknolojiler" action={<ShowMoreButton to="/girisimler/teknolojiler" />} />
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.slice(0, 4).map((item) => {
            const t = pickTranslation(item);
            return (
              <div key={item.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-28 w-full rounded-xl bg-surface" />
                <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-[#333]">{t.title}</h3>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
