import { useEffect, useState } from "react";
import { getStatistics } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";

const defaultStats = [
  { id: 1, value: "150+", label: "Ar-Ge Firması" },
  { id: 2, value: "1200+", label: "Nitelikli İstihdam" },
  { id: 3, value: "350+", label: "Tamamlanan Proje" },
  { id: 4, value: "$50M+", label: "İhracat Hacmi" },
];

export default function StatsCounter() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getStatistics()
      .then((data) => setStats(data?.length ? data : defaultStats))
      .catch(() => setStats(defaultStats));
  }, []);

  const displayList = stats.length ? stats : defaultStats;

  return (
    <section className="mt-12 bg-[#082b5c] py-14 text-white">
      <div className="mx-auto max-w-[1360px] px-4 md:px-6">
        <h2 className="text-center text-sm font-bold uppercase tracking-widest text-white/90 md:text-base">
          GAZİ TEKNOPARK SAYILARLA
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-8 text-center md:grid-cols-4 lg:gap-12">
          {displayList.map((stat) => {
            const t = pickTranslation(stat);
            const value = stat.value || "100+";
            const label = t.label || stat.label || "İstatistik";

            return (
              <div key={stat.id || label} className="flex flex-col items-center">
                <span className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
                  {value}
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
