import { useEffect, useState } from "react";
import { getMediaAlbums } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import SectionTitle from "../common/SectionTitle";
import EmptyState from "../common/EmptyState";

export default function NewsletterGallery() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    getMediaAlbums().then(setAlbums).catch(() => setAlbums([]));
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <SectionTitle title="E-Bülten" />
      {albums.length === 0 ? (
        <EmptyState message="Henüz e-bülten sayısı eklenmedi." />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {albums.slice(0, 4).map((album) => {
            const t = pickTranslation(album);
            return (
              <div
                key={album.id}
                className="flex h-40 flex-col items-center justify-end rounded-2xl bg-surface p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="line-clamp-2 text-sm font-medium text-[#333]">{t.title}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
