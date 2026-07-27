import { useEffect, useState } from "react";
import { getCompanies } from "../../api/endpoints";
import SectionTitle from "../common/SectionTitle";
import ShowMoreButton from "../common/ShowMoreButton";
import EmptyState from "../common/EmptyState";

const defaultCompanies = [
  { id: "c1", name: "TechNova Ar-Ge", logo: null },
  { id: "c2", name: "BioGen Sağlık Sistemleri", logo: null },
  { id: "c3", name: "AeroSpace TR", logo: null },
  { id: "c4", name: "SiberKalkan Güvenlik", logo: null },
  { id: "c5", name: "DataVision AI", logo: null },
  { id: "c6", name: "SmartAgri Tarım", logo: null },
  { id: "c7", name: "EnerjiTech Çözümleri", logo: null },
  { id: "c8", name: "OyunLab Stüdyoları", logo: null },
];

export default function CompaniesSection() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    getCompanies().then(res => {
      if (res && res.length > 0) setCompanies(res);
      else setCompanies(defaultCompanies);
    }).catch(() => setCompanies(defaultCompanies));
  }, []);

  // Duplicate the companies list multiple times to ensure the marquee fills the screen and scrolls seamlessly
  const marqueeItems = [...companies, ...companies, ...companies, ...companies];

  return (
    <section className="mt-20 w-full overflow-hidden bg-primary py-20 relative">
      {/* Decorative background shapes */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 mb-10 relative z-10 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Firmalarımız</h2>
        <ShowMoreButton to="/firmalar" className="text-white hover:text-gray-200" />
      </div>
      
      {companies.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 relative z-10"><EmptyState /></div>
      ) : (
        <div className="relative flex overflow-hidden group z-10">
          {/* Deep gradient fades on the edges for a seamless full-width look */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-24 bg-gradient-to-r from-primary to-transparent md:w-64" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-24 bg-gradient-to-l from-primary to-transparent md:w-64" />

          <div className="flex w-max animate-marquee-slow gap-8 py-4 group-hover:[animation-play-state:paused] px-4">
            {marqueeItems.map((company, index) => (
              <div
                key={`${company.id}-${index}`}
                className="flex h-28 w-64 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-white border border-gray-100/50 text-sm font-semibold text-primary shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20 hover:text-primary-light"
                title={company.name}
              >
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="max-h-16 max-w-[80%] object-contain" />
                ) : (
                  <span className="truncate px-6 text-center text-base">{company.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
