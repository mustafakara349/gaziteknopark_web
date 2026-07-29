import { useCallback, useRef, useState } from "react";
import AboutCarouselCard from "./AboutCarouselCard";
import { CarouselArrows, CarouselFooter } from "./CarouselControls";

const SWIPE_THRESHOLD_PX = 50;

export default function AboutCarousel({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const total = slides.length;

  const goTo = useCallback(
    (index) => setActiveIndex(((index % total) + total) % total),
    [total]
  );
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      if (deltaX > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  };

  if (total === 0) return null;

  const active = slides[activeIndex];

  return (
    <div className="w-full min-w-0">
      {/*
        Dış sarmalayıcı `overflow-hidden` İÇERMEZ: lg breakpoint'te ok butonları
        kartın kenarından dışarı taşabiliyor (lg:-left-6 / lg:-right-6), bu yüzden
        kırpılan bir üst öğe içine konursa görünmez olurlar. Kart görünümü ve
        slide kırpma (overflow-hidden) yalnızca alttaki iç sarmalayıcıda.
      */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Hakkımızda içerik bölümleri"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, i) => (
              <div key={i} className="h-[420px] w-full shrink-0 md:h-[480px]">
                <AboutCarouselCard icon={slide.icon} label={slide.label} text={slide.text} />
              </div>
            ))}
          </div>
        </div>

        <CarouselArrows onPrev={goPrev} onNext={goNext} />

        <span className="sr-only" aria-live="polite">
          {`${activeIndex + 1}. bölüm: ${active.label}`}
        </span>
      </div>

      <CarouselFooter total={total} activeIndex={activeIndex} onPrev={goPrev} onNext={goNext} onSelect={goTo} />
    </div>
  );
}
