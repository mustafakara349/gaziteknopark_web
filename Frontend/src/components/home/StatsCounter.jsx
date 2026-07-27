import { useEffect, useState, useRef } from "react";
import { getStatistics } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";

const defaultStats = [
  { id: 1, value: "150+", label: "Ar-Ge Firması" },
  { id: 2, value: "1200+", label: "Nitelikli İstihdam" },
  { id: 3, value: "350+", label: "Tamamlanan Proje" },
  { id: 4, value: "$50M+", label: "İhracat Hacmi" },
];

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
    const duration = 2000; // 2 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic formula for smooth deceleration
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
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  const [stats, setStats] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    getStatistics()
      .then((data) => setStats(data?.length ? data : defaultStats))
      .catch(() => setStats(defaultStats));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const displayList = stats.length ? stats : defaultStats;

  return (
    <section ref={sectionRef} className="mt-24 bg-[#082b5c] py-20 text-white">
      <div className="mx-auto max-w-[1360px] px-4 md:px-6">
        <h2 className="text-center text-sm font-bold uppercase tracking-widest text-white/90 md:text-base">
          GAZİ TEKNOPARK SAYILARLA
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-8 text-center md:grid-cols-4 lg:gap-12">
          {displayList.map((stat, idx) => {
            const t = pickTranslation(stat);
            const value = stat.value || "100+";
            const label = t.label || stat.label || "İstatistik";

            return (
              <div
                key={stat.id || label || idx}
                className={`flex flex-col items-center transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <span className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
                  <AnimatedNumber rawValue={value} isVisible={isVisible} />
                </span>
                <span className="mt-2 text-xs font-medium text-white/80 md:text-sm">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

