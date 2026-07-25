import { useEffect, useState } from "react";
import { getSuccessStories } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import SectionTitle from "../common/SectionTitle";
import ShowMoreButton from "../common/ShowMoreButton";
import EmptyState from "../common/EmptyState";

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    getSuccessStories().then(setStories).catch(() => setStories([]));
  }, []);

  const current = stories[active];
  const t = pickTranslation(current ?? {});

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <SectionTitle
        title="Başarı Öyküleri"
        action={<ShowMoreButton to="/basari-oykuleri" />}
      />

      {stories.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="h-56 w-full shrink-0 rounded-2xl bg-surface md:w-72" />
            <div>
              <h3 className="text-lg font-semibold text-[#333] md:text-xl">{t.title}</h3>
              {t.summary && <p className="mt-3 text-sm leading-relaxed text-gray-600">{t.summary}</p>}
            </div>
          </div>

          {stories.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {stories.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Öykü ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-primary" : "w-2 bg-gray-300"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
