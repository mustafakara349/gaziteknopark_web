import { useEffect, useState } from "react";
import { getStatistics } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import SectionTitle from "../common/SectionTitle";
import EmptyState from "../common/EmptyState";

export default function StatsCounter() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getStatistics().then(setStats).catch(() => setStats([]));
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <SectionTitle title="Sayılarla Gazi Teknopark" />
      {stats.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-4 rounded-3xl bg-primary p-8 md:grid-cols-4">
          {stats.map((stat) => {
            const t = pickTranslation(stat);
            return (
              <div key={stat.id} className="rounded-2xl bg-white/10 py-6 text-center">
                <p className="text-3xl font-bold text-white md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-white/70 md:text-sm">
                  {t.label}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
