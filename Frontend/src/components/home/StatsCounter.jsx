import { useEffect, useState, useRef } from "react";
import { getArgePortalIstatistikler } from "../../api/endpoints";

function parseStatValue(str) {
  if (typeof str === "number") return { prefix: "", target: str, suffix: "" };
  const strVal = String(str || "0").trim();
  const match = strVal.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!match) return { prefix: "", target: 0, suffix: strVal };
  const prefix = match[1] || "";
  const numStr = match[2].replace(/,/g, "");
  const target = parseFloat(numStr) || 0;
  const suffix = match[3] || "";
  return { prefix, target, suffix };
}

function AnimatedNumber({ rawValue, isVisible }) {
  const [current, setCurrent] = useState(0);
  const { prefix, target, suffix } = parseStatValue(rawValue);

  useEffect(() => {
    if (!isVisible) {
      setCurrent(0);
      return;
    }

    let startTimestamp = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(easedProgress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, target]);

  return (
    <span>
      {prefix}
      {current.toLocaleString("tr-TR")}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem("argePortalStats");
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // ignore
    }
    return [];
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    getArgePortalIstatistikler()
      .then((data) => {
        if (!data) return;
        const firma = data.toplamFirma ?? data.ToplamFirma;
        const calisan = data.toplamPersonel ?? data.ToplamPersonel;
        const proje = data.toplamProje ?? data.ToplamProje;

        if (firma != null && calisan != null && proje != null) {
          const newStats = [
            { id: "firma", value: firma, suffix: "+", label: "Ar-Ge Firması" },
            { id: "calisan", value: calisan, suffix: "+", label: "Çalışan Personel" },
            { id: "proje", value: proje, suffix: "+", label: "Geliştirilen Proje" },
          ];
          setStats(newStats);
          localStorage.setItem("argePortalStats", JSON.stringify(newStats));
        }
      })
      .catch(() => {/* fallback veya cache kullanılıyor */ });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!stats || stats.length === 0) return null;

  return (
    <section ref={sectionRef} className="mt-24 bg-[#082b5c] py-20 text-white">
      <div className="mx-auto max-w-[1360px] px-4 md:px-6">
        <h2 className="text-center text-sm font-bold uppercase tracking-widest text-white/90 md:text-base">
          GAZİ TEKNOPARK SAYILARLA
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 text-center sm:grid-cols-3 lg:gap-12">
          {stats.map((stat, idx) => {
            const rawValue =
              typeof stat.value === "number"
                ? `${stat.value}${stat.suffix ?? "+"}`
                : stat.value;

            return (
              <div
                key={stat.id}
                className={`flex flex-col items-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <span className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
                  <AnimatedNumber rawValue={rawValue} isVisible={isVisible} />
                </span>
                <span className="mt-2 text-xs font-medium text-white/80 md:text-sm">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
