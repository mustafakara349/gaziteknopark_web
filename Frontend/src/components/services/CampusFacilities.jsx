import React from "react";
import * as LucideIcons from "lucide-react";

export default function CampusFacilities({ facilities = [], facilityImages = [] }) {
  if (!facilities || facilities.length === 0) return null;

  // İlk kart büyük featured kart, geri kalanı küçük kartlar
  const featuredFacility = facilities[0];
  const smallFacilities = facilities.slice(1);

  // Küçük kartları ikiye böl: sol 4, sağ 4
  const leftCards = smallFacilities.slice(0, 4);
  const rightCards = smallFacilities.slice(4, 8);

  const FeaturedIcon = LucideIcons[featuredFacility?.icon] || LucideIcons.Building;

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="text-center md:text-left">
        <span
          className="text-xs font-bold uppercase tracking-widest text-accent-blue"
          style={{ letterSpacing: "1.5px" }}
        >
          Fiziki Altyapı
        </span>
        <h2 className="mt-2 text-2xl font-bold text-[#0B3E75] sm:text-3xl">
          Kampüs İmkanları
        </h2>
      </div>

      {/* Ana Grid: 1 büyük kart + 4 + 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-4 items-stretch">

        {/* ─── Sol: Büyük Featured Kart ─── */}
        <div className="relative flex flex-col justify-end overflow-hidden rounded-3xl min-h-[340px] bg-[#0B3E75] border border-[#0B3E75]/20 shadow-lg group">
          {/* Arka plan görseli varsa göster, yoksa dekoratif gradient */}
          {facilityImages?.[0] ? (
            <img
              src={facilityImages[0]}
              alt={featuredFacility.label}
              className="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B3E75] via-[#0a3568] to-[#071f45]" />
          )}

          {/* Dekoratif daireler */}
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute top-16 -right-6 h-24 w-24 rounded-full bg-white/5" />
          <div className="absolute bottom-16 -left-8 h-32 w-32 rounded-full bg-[#E54B3B]/10" />

          {/* Üst kısım: ikon */}
          <div className="relative z-10 p-7 pb-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm border border-white/15">
              <FeaturedIcon className="h-7 w-7" strokeWidth={1.8} />
            </div>
          </div>

          {/* Alt kısım: metin */}
          <div className="relative z-10 p-7 pt-5 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
              Öne Çıkan İmkan
            </span>
            <h3 className="text-xl font-bold text-white leading-snug">
              {featuredFacility.label}
            </h3>
            {featuredFacility.description && (
              <p className="text-sm text-blue-100/80 leading-relaxed">
                {featuredFacility.description}
              </p>
            )}
          </div>

          {/* Alt gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071f45]/80 via-transparent to-transparent z-[1] pointer-events-none" />
        </div>

        {/* ─── Orta: 4 küçük kart ─── */}
        <div className="grid grid-rows-4 gap-4">
          {leftCards.map((fac, index) => {
            const IconComponent = LucideIcons[fac.icon] || LucideIcons.Building;
            return (
              <SmallCard key={index} fac={fac} IconComponent={IconComponent} />
            );
          })}
        </div>

        {/* ─── Sağ: 4 küçük kart ─── */}
        <div className="grid grid-rows-4 gap-4">
          {rightCards.map((fac, index) => {
            const IconComponent = LucideIcons[fac.icon] || LucideIcons.Building;
            return (
              <SmallCard key={index} fac={fac} IconComponent={IconComponent} />
            );
          })}
        </div>

      </div>
    </div>
  );
}

function SmallCard({ fac, IconComponent }) {
  return (
    <div className="relative flex items-center gap-4 text-left rounded-2xl border border-[#0B3E75]/[0.08] bg-[#fafaf9] p-5 hover:bg-[#0B3E75] hover:border-[#0B3E75] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(11,62,117,0.2)] transition-all duration-300 ease-in-out cursor-pointer group">
      {/* İkon */}
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B3E75]/[0.08] text-[#0B3E75] border border-transparent group-hover:bg-white/10 group-hover:text-white group-hover:border-white/15 transition-all duration-300">
        <IconComponent className="h-5 w-5" strokeWidth={2} />
      </div>
      {/* Metin */}
      <span className="text-xs sm:text-sm font-bold text-[#0B3E75] leading-snug group-hover:text-white transition-colors duration-300 relative z-10">
        {fac.label}
      </span>
    </div>
  );
}
