import { useEffect, useState } from "react";
import { getMediaAlbums } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import SectionTitle from "../common/SectionTitle";
import EmptyState from "../common/EmptyState";

const defaultNewsletters = [
  { id: "n1", title: "Ocak 2024 - E-Bülten Sayı 45", coverImage: null, date: "Ocak 2024" },
  { id: "n2", title: "Şubat 2024 - E-Bülten Sayı 46", coverImage: null, date: "Şubat 2024" },
  { id: "n3", title: "Mart 2024 - E-Bülten Sayı 47", coverImage: null, date: "Mart 2024" },
  { id: "n4", title: "Nisan 2024 - E-Bülten Sayı 48", coverImage: null, date: "Nisan 2024" }
];

export default function NewsletterGallery() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    getMediaAlbums().then(res => {
      if (res && res.length > 0) setAlbums(res);
      else setAlbums(defaultNewsletters);
    }).catch(() => setAlbums(defaultNewsletters));
  }, []);

  return (
    <section className="mx-auto mt-24 max-w-7xl px-4">
      <SectionTitle title="E-Bülten" action={<span className="text-sm font-semibold text-primary cursor-pointer hover:underline">Tümünü Gör</span>} />
      {albums.length === 0 ? (
        <EmptyState message="Henüz e-bülten sayısı eklenmedi." />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Featured Latest Newsletter */}
          {albums[0] && (
            <div className="group relative flex h-96 cursor-pointer flex-col overflow-hidden rounded-3xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 lg:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light">
                {albums[0].coverImage ? (
                  <img src={albums[0].coverImage} alt={pickTranslation(albums[0]).title} className="h-full w-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <svg className="h-48 w-48 rotate-6 transform text-white transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                  </div>
                )}
              </div>
              <div className="relative z-10 flex h-full flex-col justify-between p-8">
                <div className="flex justify-between items-start">
                  <span className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold tracking-wide text-white backdrop-blur-md border border-white/30">
                    En Yeni Sayı · {albums[0].date || "E-Bülten"}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-primary">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold leading-tight text-white drop-shadow-md md:text-4xl">{pickTranslation(albums[0]).title}</h3>
                  <p className="mt-4 text-base font-medium text-white/90">Hemen İndir & Oku</p>
                </div>
              </div>
            </div>
          )}

          {/* Previous Newsletters List */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            {albums.slice(1, 4).map((album, idx) => {
              const t = pickTranslation(album);
              return (
                <div
                  key={album.id}
                  className="group relative flex flex-1 cursor-pointer items-center gap-4 overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-primary transition-transform duration-300 group-hover:scale-105 group-hover:from-primary group-hover:to-primary-light group-hover:text-white">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{album.date || "E-Bülten"}</span>
                    <h3 className="line-clamp-2 text-sm font-bold text-[#333] transition-colors group-hover:text-primary">{t.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
