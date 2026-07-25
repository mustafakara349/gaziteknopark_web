import { useEffect, useState } from "react";
import { getSuccessStories } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageHeader from "../components/common/PageHeader";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    getSuccessStories().then(setStories).catch(() => setStories([]));
  }, []);

  return (
    <div>
      <PageHeader title="Başarı Öyküleri" subtitle="Teknoparkımızdan çıkan ilham verici başarı hikayeleri." />
      <PageSection>
        {stories.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {stories.map((story) => {
              const t = pickTranslation(story);
              return (
                <div key={story.id} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-24 w-24 shrink-0 rounded-xl bg-surface" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#333]">{t.title}</h3>
                    {t.summary && <p className="mt-2 line-clamp-3 text-xs text-gray-500">{t.summary}</p>}
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
