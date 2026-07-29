import { ChevronLeft, ChevronRight } from "lucide-react";

function ArrowButton({ direction, onClick, className = "" }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const label = direction === "prev" ? "Önceki bölüm" : "Sonraki bölüm";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex items-center justify-center rounded-full bg-white text-primary shadow-md ring-1 ring-gray-100 transition-all duration-200 hover:scale-110 hover:bg-primary hover:text-white active:scale-95 ${className}`}
    >
      <Icon className="h-5 w-5" strokeWidth={2} />
    </button>
  );
}

// Masaüstü/tablet: kartın kenarına yaslanmış, mobilde gizli oklar.
export function CarouselArrows({ onPrev, onNext }) {
  return (
    <>
      <ArrowButton
        direction="prev"
        onClick={onPrev}
        className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 md:flex md:h-12 md:w-12 lg:-left-6"
      />
      <ArrowButton
        direction="next"
        onClick={onNext}
        className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 md:flex md:h-12 md:w-12 lg:-right-6"
      />
    </>
  );
}

// Kartın altında: dot pagination + (sadece mobilde) küçük ok butonları.
export function CarouselFooter({ total, activeIndex, onPrev, onNext, onSelect }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <ArrowButton direction="prev" onClick={onPrev} className="h-9 w-9 md:hidden" />

      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`${i + 1}. bölüme git`}
            aria-current={i === activeIndex}
            className={`h-2.5 rounded-full transition-all duration-200 ${
              i === activeIndex ? "w-6 bg-primary" : "w-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      <ArrowButton direction="next" onClick={onNext} className="h-9 w-9 md:hidden" />
    </div>
  );
}
