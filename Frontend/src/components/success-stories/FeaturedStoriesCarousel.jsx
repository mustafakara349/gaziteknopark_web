import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const parsePostText = (text) => {
  if (!text) return { title: "", body: "" };
  const match = text.match(/^([\s\S]*?[.?!])(?:\s+|$)([\s\S]*)$/);
  if (match) {
    return {
      title: match[1].trim(),
      body: match[2].trim()
    };
  }
  return {
    title: text.length > 80 ? text.slice(0, 80) + "..." : text,
    body: text.length > 80 ? text : ""
  };
};

const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5080/api").replace("/api", "");
  return `${baseUrl}/${path.replace(/\\/g, "/").replace(/^\//, "")}`;
};

export default function FeaturedStoriesCarousel({ posts = [] }) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Get featured posts that have an image, fallback to first 3 posts with an image if none are featured
  const featuredPosts = posts.filter((post) => post.isFeatured && post.mediaUrl);
  const postsToUse = featuredPosts.length > 0 
    ? featuredPosts 
    : posts.filter((post) => post.mediaUrl).slice(0, 3);

  const slides = postsToUse.map((post) => {
    const { title, body } = parsePostText(post.postText);
    return {
      id: post.id,
      companyId: post.companyId,
      companyName: post.companyName || "Gazi Teknopark",
      companyLogoUrl: getFullImageUrl(post.companyLogoUrl),
      title,
      body,
      mediaUrl: post.mediaUrl,
      postUrl: post.postUrl || "#",
      publishedAt: post.publishedAt
    };
  });

  useEffect(() => {
    if (slides.length < 2 || isPaused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000); // auto-slide every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (slides.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setActive((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActive((prev) => (prev + 1) % slides.length);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return "";
    }
  };

  return (
    <div
      className="relative w-full h-[320px] sm:h-[380px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg bg-slate-900 select-none group/carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sliding track */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="relative h-full w-full flex-shrink-0">
            {/* Full-bleed background image */}
            <img
              src={slide.mediaUrl}
              alt={slide.title}
              className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40 md:bg-gradient-to-r md:from-slate-950/90 md:via-slate-900/70 md:to-transparent" />

            {/* Content area */}
            <div className="relative z-10 flex h-full w-full flex-col justify-between p-6 sm:p-10 md:p-14">
              {/* Top Left: Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-block rounded-md bg-[#0066cc]/90 px-3 py-1 text-xs font-bold tracking-wider text-white shadow-sm border border-blue-400/20 uppercase select-none animate-pulse">
                  Öne Çıkan Başarı
                </span>
              </div>

              {/* Middle: Title & Summary */}
              <div className="max-w-3xl mt-auto mb-auto">
                <div className="flex items-center gap-2 mb-3">
                  {slide.companyLogoUrl ? (
                    <img
                      src={slide.companyLogoUrl}
                      alt={slide.companyName}
                      className="h-8 w-8 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-bold text-white text-xs backdrop-blur-sm">
                      {slide.companyName.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-200">{slide.companyName}</span>
                  {slide.publishedAt && (
                    <>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs text-slate-300">{formatDate(slide.publishedAt)}</span>
                    </>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-white line-clamp-2">
                  {slide.title}
                </h2>
                
                {slide.body && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-3">
                    {slide.body}
                  </p>
                )}
              </div>

              {/* Bottom Right: Action Buttons */}
              <div className="flex flex-wrap justify-end gap-3 mt-2 md:mt-0">
                <Link
                  to={`/firmalar/${slide.companyId}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-100 transition-all hover:bg-white/20 hover:border-white/40 hover:shadow-md active:scale-95 cursor-pointer shadow-sm backdrop-blur-sm"
                >
                  Firmayı Görüntüle
                </Link>
                <a
                  href={slide.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-primary transition-all hover:bg-slate-100 hover:shadow-md active:scale-95 cursor-pointer shadow-sm"
                >
                  LinkedIn'de İncele ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Arrow Controls */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Önceki Slayt"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-black/50 hover:scale-105 cursor-pointer"
          >
            &#8249;
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Sonraki Slayt"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-black/50 hover:scale-105 cursor-pointer"
          >
            &#8250;
          </button>
        </>
      )}

      {/* Bottom Dots Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-sm">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slayt ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
