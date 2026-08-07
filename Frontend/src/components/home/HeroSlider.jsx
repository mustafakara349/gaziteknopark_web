import { useEffect, useState } from "react";
import { getSliders } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

const defaultSlides = [

  {
    id: "default-1",
    type: "image_only",
    title: "Gazi Teknopark",
    imageUrl: "/slider-1.jpeg",
  },

  {
    id: "default-2",
    type: "button_hero",
    badge: "GİRİŞİMCİLİK VE AR-GE",
    title: "Gazi Teknopark'ta Yeriniz Hazır",
    description:
      "Girişimciler ve teknoloji firmaları için gelişmiş laboratuvar altyapısı, vergi muafiyetleri ve nitelikli iş ağı sunuyoruz.",
    primaryButtonText: "Firma Başvurusu Yap",
    primaryButtonUrl: "https://argeportal.gaziteknopark.com.tr/onbasvuruformu",
    secondaryButtonText: "Hizmetlerimizi İnceleyin",
    secondaryButtonUrl: "/hakkinda/hizmetlerimiz",
    imageUrl: "/slider-1.jpeg",
  },
  {
    id: "default-3",
    type: "announcement",
    badge: "DUYURU & BİGG",
    title: "TÜBİTAK BİGG 2026 Çağrı Başvuruları Devam Ediyor",
    description:
      "Yenilikçi teknoloji fikirlerine 900.000 TL %100 hibe desteği ve birebir mentörlük sağlayan BİGG programına son başvuru tarihi yaklaşmaktadır.",
    linkText: "Duyuru Detaylarını Okuyun →",
    linkUrl: "/girisimcilik",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "default-4",
    type: "pure_visual",
    badge: "KAMPÜS & AR-GE MERKEZİ",
    title: "Teknolojinin ve İnovasyonun Merkezi",
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function HeroSlider() {
  const [sliders, setSliders] = useState(defaultSlides);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getSliders()
      .then((data) => {
        if (data && data.length >= 3) {
          setSliders(data);
        } else if (data && data.length > 0) {
          const combined = [...data, ...defaultSlides.slice(data.length)];
          setSliders(combined);
        } else {
          setSliders(defaultSlides);
        }
      })
      .catch(() => setSliders(defaultSlides));
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (sliders.length < 2 || isPaused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % sliders.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sliders.length, isPaused]);

  const handlePrev = () => {
    setActive((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % sliders.length);
  };

  return (
    <section className="relative w-full h-[100vh] h-[100dvh] min-h-[600px] overflow-hidden -mt-[68px]">
      <div
        className="relative h-full w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Horizontal Sliding Track */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {sliders.map((slide, index) => {
            // Gerçek (DB'den gelen) slaytların sayısal id'si olur; placeholder'ların
            // "default-N" gibi string id'si vardır. Gerçek slaytlar için başlık/açıklama/
            // buton dışında hiçbir alan (badge, ikinci buton, tip vb.) index'e göre
            // rastgele bir varsayılana denk gelip içerikle uyuşmayan metin göstermesin
            // diye "fallback" sadece placeholder'lar için kullanılır.
            const isRealSlide = typeof slide.id === "number";
            const fallback = defaultSlides[index % 3];
            const translation = pickTranslation(slide);

            const title = translation.title || slide.title || (!isRealSlide && fallback.title);
            const description =
              translation.description || slide.description || (!isRealSlide && fallback.description);
            const bgImage = slide.imageFileId
              ? `${apiBaseUrl}/api/files/${slide.imageFileId}`
              : slide.imageUrl || fallback.imageUrl;
            const badge = isRealSlide
              ? translation.badge || slide.badge
              : slide.badge || fallback.badge;

            const primaryText =
              translation.buttonText ||
              slide.primaryButtonText ||
              (!isRealSlide && fallback.primaryButtonText);
            const primaryUrl =
              slide.linkUrl || slide.primaryButtonUrl || (!isRealSlide && fallback.primaryButtonUrl);
            const secondaryText = isRealSlide
              ? translation.secondaryButtonText || slide.secondaryButtonText
              : slide.secondaryButtonText || fallback.secondaryButtonText;
            const secondaryUrl = isRealSlide
              ? slide.secondaryButtonUrl
              : slide.secondaryButtonUrl || fallback.secondaryButtonUrl;
            const linkText = !isRealSlide && (slide.linkText || fallback.linkText);
            const linkUrl = slide.linkUrl || (!isRealSlide && fallback.linkUrl);

            // Gerçek slaytlar, DB'de "tip" kavramı olmadığı için kendi içeriğine göre
            // (rozet/başlık/açıklama/buton var mı) tek bir düzenle gösterilir —
            // placeholder'lar ise orijinal 3 görsel tipini kullanmaya devam eder.
            const hasCmsContent = badge || title || description || (primaryText && primaryUrl);
            const slideType = isRealSlide
              ? (hasCmsContent ? "cms" : "cms_image_only")
              : slide.type || fallback.type;

            return (
              <div
                key={slide.id || index}
                className="relative h-full w-full flex-shrink-0"
              >
                {/* Background Image */}
                <img
                  src={bgImage}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />

                {/* SLIDE TYPE 1: STANDARD DUAL BUTTON HERO */}
                {slideType === "button_hero" && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />
                    <div className="relative z-10 flex h-full w-full flex-col justify-center px-8 pt-[120px] pb-12 md:px-16 lg:px-24">
                      <div
                        className={`max-w-2xl transition-all duration-500 delay-100 transform ${index === active
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                          }`}
                      >
                        {badge && (
                          <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">
                            {badge}
                          </span>
                        )}
                        <h1 className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                          {title}
                        </h1>
                        <p className="mt-4 text-sm leading-relaxed text-slate-200 md:text-base md:leading-normal">
                          {description}
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                          {primaryText && (
                            <a
                              href={primaryUrl}
                              target={primaryUrl?.startsWith("http") ? "_blank" : undefined}
                              rel={primaryUrl?.startsWith("http") ? "noreferrer" : undefined}
                              className="inline-flex items-center justify-center rounded-xl bg-[#0066cc] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0052a3] active:scale-95"
                            >
                              {primaryText}
                            </a>
                          )}
                          {secondaryText && (
                            <a
                              href={secondaryUrl}
                              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/20 active:scale-95"
                            >
                              {secondaryText}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* SLIDE TYPE 2: BUTTONLESS ANNOUNCEMENT & TEXT SHOWCASE */}
                {slideType === "announcement" && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-950/30" />
                    <div className="relative z-10 flex h-full w-full flex-col justify-center px-8 pt-[120px] pb-12 md:px-16 lg:px-24">
                      <div
                        className={`max-w-xl transition-all duration-500 delay-100 transform ${index === active
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                          }`}
                      >
                        {badge && (
                          <div className="inline-block rounded-md bg-blue-600/30 px-3 py-1 text-xs font-bold tracking-wider text-blue-300 border border-blue-400/20">
                            {badge}
                          </div>
                        )}
                        <h2 className="mt-4 text-2xl font-bold leading-tight text-white md:text-4xl">
                          {title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                          {description}
                        </p>
                        {linkText && (
                          <div className="mt-6">
                            <a
                              href={linkUrl}
                              className="inline-flex items-center text-sm font-bold text-blue-400 hover:text-white transition-colors"
                            >
                              {linkText}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* SLIDE TYPE 3: PURE VISUAL / BANNER SHOWCASE */}
                {slideType === "pure_visual" && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="relative z-10 flex h-full w-full flex-col justify-end px-8 pb-20 pt-[120px] md:px-16 lg:px-24">
                      <div
                        className={`transition-all duration-500 delay-100 transform ${index === active
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                          }`}
                      >
                        {badge && (
                          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                            {badge}
                          </span>
                        )}
                        <h2 className="mt-1 text-xl font-bold text-white md:text-3xl">
                          {title}
                        </h2>
                      </div>
                    </div>
                  </>
                )}

                {/* CMS SLIDE: admin panelinden eklenen slaytlar — rozet/başlık/açıklama/butonlar
                    yalnızca gerçekten girilmişse gösterilir, konuma göre rastgele metin eklenmez. */}
                {slideType === "cms" && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />
                    <div className="relative z-10 flex h-full w-full flex-col justify-center px-8 pt-[120px] pb-12 md:px-16 lg:px-24">
                      <div
                        className={`max-w-2xl transition-all duration-500 delay-100 transform ${index === active
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                          }`}
                      >
                        {badge && (
                          <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">
                            {badge}
                          </span>
                        )}
                        {title && (
                          <h1 className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                            {title}
                          </h1>
                        )}
                        {description && (
                          <p className="mt-4 text-sm leading-relaxed text-slate-200 md:text-base md:leading-normal">
                            {description}
                          </p>
                        )}
                        {(primaryText || secondaryText) && (
                          <div className="mt-8 flex flex-wrap items-center gap-4">
                            {primaryText && primaryUrl && (
                              <a
                                href={primaryUrl}
                                target={primaryUrl?.startsWith("http") ? "_blank" : undefined}
                                rel={primaryUrl?.startsWith("http") ? "noreferrer" : undefined}
                                className="inline-flex items-center justify-center rounded-xl bg-[#0066cc] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0052a3] active:scale-95"
                              >
                                {primaryText}
                              </a>
                            )}
                            {secondaryText && secondaryUrl && (
                              <a
                                href={secondaryUrl}
                                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/20 active:scale-95"
                              >
                                {secondaryText}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {sliders.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Önceki Slayt"
              className="absolute left-4 md:left-6 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center p-2 text-white/70 drop-shadow-md transition-all hover:text-white hover:scale-110 active:scale-95 cursor-pointer"
            >
              <svg
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Sonraki Slayt"
              className="absolute right-4 md:right-6 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center p-2 text-white/70 drop-shadow-md transition-all hover:text-white hover:scale-110 active:scale-95 cursor-pointer"
            >
              <svg
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Bottom Slide Dots */}
        {sliders.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 py-1.5 backdrop-blur-sm">
            {sliders.map((s, i) => (
              <button
                key={s.id || i}
                type="button"
                aria-label={`Slayt ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}