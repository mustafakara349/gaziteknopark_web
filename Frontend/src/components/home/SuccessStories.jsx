import { useEffect, useState, useRef } from "react";
import { getSuccessStories } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import SectionTitle from "../common/SectionTitle";
import ShowMoreButton from "../common/ShowMoreButton";
import EmptyState from "../common/EmptyState";

const defaultStories = [
  {
    id: "mock1",
    title: "Gazi Teknopark Firması 10 Milyon TL Yatırım Aldı!",
    summary: "Bünyemizde yer alan TechNova, yapay zeka tabanlı sağlık çözümleriyle A serisi yatırım turunu başarıyla tamamladı. Bu yatırım ile global pazara açılmayı hedefliyorlar.",
    image: null,
    link: "#"
  },
  {
    id: "mock2",
    title: "TÜBİTAK 1507 Başarısı: AeroSpace TR",
    summary: "AeroSpace TR'nin geliştirdiği yerli ve milli insansız hava aracı yazılımı, TÜBİTAK 1507 KOBİ Ar-Ge Başlangıç Destek Programı kapsamında hibe desteği almaya hak kazandı.",
    image: null,
    link: "#"
  },
  {
    id: "mock3",
    title: "BioGen Sağlık'tan Devrim Niteliğinde Ürün",
    summary: "BioGen Sağlık, erken teşhis koyabilen yeni nesil biyosensörlerini tanıttı. Ürün Avrupa İnovasyon Ödülleri'nde finale kalma başarısı gösterdi.",
    image: null,
    link: "#"
  }
];

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getSuccessStories().then(res => {
      if (res && res.length > 0) setStories(res);
      else setStories(defaultStories);
    }).catch(() => setStories(defaultStories));
  }, []);

  useEffect(() => {
    if (stories.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [stories.length, isPaused]);

  return (
    <section className="mt-20 w-full bg-slate-50 py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">Başarı Öyküleri</h2>
          <ShowMoreButton to="/basari-oykuleri" />
        </div>

      {stories.length === 0 ? (
        <EmptyState />
      ) : (
        <div 
          className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle background gradient pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-red-50/50 pointer-events-none" />

          <div 
            className="relative z-10 flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {stories.map((story) => {
              const t = pickTranslation(story);
              return (
                <div key={story.id} className="w-full shrink-0 p-6 md:p-10">
                  <div className="flex flex-col gap-8 md:flex-row md:items-center">
                    {/* Image / Graphic Area */}
                    <div className="group relative flex h-64 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 md:w-96 shadow-inner">
                      {story.image ? (
                        <img src={story.image} alt={t.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-3 text-primary/40 transition-transform duration-500 group-hover:scale-110">
                          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="font-semibold tracking-wider">BAŞARI ÖYKÜSÜ</span>
                        </div>
                      )}
                      
                      {/* LinkedIn Badge */}
                      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-sm">
                         <svg className="h-5 w-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold leading-tight text-primary md:text-3xl">{t.title}</h3>
                      {t.summary && (
                        <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
                          {t.summary}
                        </p>
                      )}
                      <a href={story.link || "#"} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-light hover:shadow-lg hover:shadow-primary/30">
                        Haberi İncele
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Indicators */}
          {stories.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
              {stories.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Öykü ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400 hover:scale-110"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
