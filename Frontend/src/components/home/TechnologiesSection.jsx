import { useEffect, useState } from "react";
import { getFeaturedTechnologies } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import SectionTitle from "../common/SectionTitle";
import ShowMoreButton from "../common/ShowMoreButton";
import EmptyState from "../common/EmptyState";

const defaultTechnologies = [
  { id: "t1", title: "Yapay Zeka Destekli Görüntü İşleme Platformu", category: "Yazılım" },
  { id: "t2", title: "Akıllı Tarım ve İlaçlama İHA'sı", category: "Donanım" },
  { id: "t3", title: "Yeni Nesil Siber Güvenlik Kalkanı", category: "Siber Güvenlik" },
  { id: "t4", title: "Giyilebilir Sağlık Sensörleri", category: "Biyomedikal" }
];

export default function TechnologiesSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getFeaturedTechnologies().then(res => {
      if (res && res.length > 0) setItems(res);
      else setItems(defaultTechnologies);
    }).catch(() => setItems(defaultTechnologies));
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <SectionTitle title="Öne Çıkan Teknolojiler" action={<ShowMoreButton to="/girisimler/teknolojiler" />} />
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:grid-rows-[auto_auto]">
          {/* Featured Large Card (Left) */}
          {items[0] && (
            <div className="group relative flex h-full min-h-[400px] cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 lg:row-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800">
                {items[0].image && <img src={items[0].image} alt={pickTranslation(items[0]).title} className="h-full w-full object-cover opacity-50 mix-blend-overlay transition-transform duration-700 group-hover:scale-110" />}
                {!items[0].image && (
                   <div className="absolute inset-0 flex items-center justify-center opacity-30 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                      <svg className="h-48 w-48 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                   </div>
                )}
              </div>
              
              <div className="relative z-10 flex h-full flex-col justify-end p-8">
                {items[0].category && (
                  <span className="mb-4 w-max rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold tracking-wide text-white backdrop-blur-md border border-white/30">
                    {items[0].category}
                  </span>
                )}
                <h3 className="text-3xl font-bold leading-tight text-white drop-shadow-md">{pickTranslation(items[0]).title}</h3>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors">
                    Hemen İncele
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Smaller Cards Grid (Right) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {items.slice(1, 4).map((item, idx) => {
              const t = pickTranslation(item);
              // Make the third small card span 2 columns on small screens and up for a perfect bento look
              const isWide = idx === 2;
              return (
                <div key={item.id} className={`group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60 ${isWide ? 'sm:col-span-2' : ''}`}>
                  <div className={`relative h-40 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${
                    idx === 0 ? 'from-emerald-400 to-teal-500' :
                    idx === 1 ? 'from-orange-400 to-red-500' :
                    'from-purple-500 to-pink-600'
                  } shadow-inner`}>
                    {item.image && <img src={item.image} alt={t.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                    {/* Glassmorphism Category Badge */}
                    {item.category && (
                      <div className="absolute left-3 top-3 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md border border-white/30">
                        {item.category}
                      </div>
                    )}
                    {/* Decorative Icon Fallback */}
                    {!item.image && (
                      <div className="absolute inset-0 flex items-center justify-center text-white/40 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex flex-col flex-1">
                    <h3 className="line-clamp-2 text-base font-bold text-[#222] transition-colors group-hover:text-primary">{t.title}</h3>
                    <div className="mt-auto pt-4">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Detayları Gör
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
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
