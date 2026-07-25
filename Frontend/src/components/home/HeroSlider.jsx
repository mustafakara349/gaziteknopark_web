import { useEffect, useState } from "react";
import { getSliders } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";

export default function HeroSlider() {
  const [sliders, setSliders] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    getSliders().then(setSliders).catch(() => setSliders([]));
  }, []);

  useEffect(() => {
    if (sliders.length < 2) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % sliders.length), 6000);
    return () => clearInterval(timer);
  }, [sliders.length]);

  const current = sliders[active];
  const translation = pickTranslation(current ?? {});

  return (
    <section className="mx-auto mt-8 max-w-7xl px-4">
      <div className="relative overflow-hidden rounded-3xl shadow-lg">
        {current?.imageFileId ? (
          <img
            src={`/api/files/${current.imageFileId}`}
            alt={translation.title ?? "Gazi Teknopark"}
            className="h-[420px] w-full object-cover md:h-[520px]"
          />
        ) : (
          <div className="flex h-[420px] w-full items-center justify-center bg-gradient-to-br from-primary via-primary-light to-primary-dark md:h-[520px]">
            <span className="text-3xl font-bold tracking-tight text-white/90 md:text-5xl">
              GAZ<span className="relative">i<span className="absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent" /></span>TEKNOPARK
            </span>
          </div>
        )}
        {(translation.title || translation.description) && (
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-8 md:p-12">
            {translation.title && (
              <h1 className="max-w-2xl text-3xl font-bold text-white md:text-4xl">{translation.title}</h1>
            )}
            {translation.description && (
              <p className="mt-3 max-w-xl text-sm text-white/90 md:text-base">{translation.description}</p>
            )}
            {translation.buttonText && current?.linkUrl && (
              <a
                href={current.linkUrl}
                className="mt-5 inline-flex w-fit items-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                {translation.buttonText}
              </a>
            )}
          </div>
        )}

        {sliders.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {sliders.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Slayt ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-2 bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
