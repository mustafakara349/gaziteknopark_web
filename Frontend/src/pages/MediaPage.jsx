import { useEffect, useState } from "react";
import { getMediaAlbums } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";

export default function MediaPage() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    getMediaAlbums().then(setAlbums).catch(() => setAlbums([]));
  }, []);

  return (
    <div>
      <PageSection>
        {albums.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {albums.map((album) => {
              const t = pickTranslation(album);
              return (
                <div key={album.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-32 w-full bg-surface" />
                  <div className="p-4">
                    <p className="line-clamp-2 text-sm font-medium text-[#333]">{t.title}</p>
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
