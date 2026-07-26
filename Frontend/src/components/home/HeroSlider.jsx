import { useEffect, useState } from "react";
import { getSliders } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";

const defaultSlide = {
  title: "Geleceği Birlikte İnşa Ediyoruz",
  description:
    "Gazi Teknopark, inovasyon ve Ar-Ge ekosisteminin kalbinde, girişimciler ve teknoloji firmaları için dünya standartlarında altyapı ve destek sunar.",
  primaryButtonText: "Hemen Başvur",
  primaryButtonUrl: "/basvuru/firma",
  secondaryButtonText: "Daha Fazla Bilgi",
  secondaryButtonUrl: "/hakkinda/hizmetlerimiz",
  imageUrl:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
};

export default function HeroSlider() {
  const [sliders, setSliders] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    getSliders()
      .then((data) => setSliders(data?.length ? data : [defaultSlide]))
      .catch(() => setSliders([defaultSlide]));
  }, []);

  useEffect(() => {
    if (sliders.length < 2) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % sliders.length), 6000);
    return () => clearInterval(timer);
  }, [sliders.length]);

  const current = sliders[active] ?? defaultSlide;
  const translation = pickTranslation(current);

  const title = translation.title || defaultSlide.title;
  const description = translation.description || defaultSlide.description;
  const bgImage = current.imageFileId
    ? `/api/files/${current.imageFileId}`
    : current.imageUrl || defaultSlide.imageUrl;

  return (
    <section className="mx-auto max-w-[1360px] px-4 pt-2 md:px-6">
      <div className="relative min-h-[480px] w-full overflow-hidden rounded-3xl shadow-xl md:min-h-[540px]">
        {/* Background Image */}
        <img
          src={bgImage}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 flex h-full min-h-[480px] flex-col justify-center px-8 py-16 md:min-h-[540px] md:px-14">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-tight text-white md:text-5xl lg:text-[52px]">
              {title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-gray-200 md:text-base md:leading-normal">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={current.linkUrl || defaultSlide.primaryButtonUrl}
                className="inline-flex items-center justify-center rounded-full bg-[#0066cc] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0052a3] hover:shadow-lg active:scale-95"
              >
                {translation.buttonText || defaultSlide.primaryButtonText}
              </a>
              <a
                href={defaultSlide.secondaryButtonUrl}
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/15 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/70 hover:bg-white/25 active:scale-95"
              >
                {defaultSlide.secondaryButtonText}
              </a>
            </div>
          </div>
        </div>

        {/* Slide Dots Indicator */}
        {sliders.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {sliders.map((s, i) => (
              <button
                key={s.id || i}
                type="button"
                aria-label={`Slayt ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === active ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
