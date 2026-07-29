import { Building2 } from "lucide-react";

// Carousel'in solunda sabit duran görsel/ikon kartı (artık sticky değil —
// sayfa scroll ile değil carousel'in ok/nokta kontrolleriyle ilerliyor).
export default function AboutVisualCard({ stats, aboutImage }) {
  return (
    <div className="flex h-[300px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm md:h-[480px]">
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary via-primary-light to-primary-dark">
        {aboutImage ? (
          // TODO: aboutImage prop'u geldiğinde gerçek görsel burada render edilir; gradient placeholder devre dışı kalır.
          <img src={aboutImage} alt="Gazi Teknopark" className="h-full w-full object-cover" />
        ) : (
          <Building2 className="h-16 w-16 text-white/70 md:h-20 md:w-20" strokeWidth={1.5} />
        )}
      </div>

      {stats?.length > 0 && (
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
          {stats.map((stat) => (
            <div key={stat.label} className="px-2 py-4 text-center">
              <p className="text-base font-bold text-primary md:text-xl">{stat.value}</p>
              <p className="mt-1 text-[9px] font-medium uppercase tracking-wide text-gray-500 md:text-[11px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
