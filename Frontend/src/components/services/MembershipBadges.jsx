import React from "react";

export default function MembershipBadges({ badges = [] }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="border-t border-gray-100 pt-10">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Başlık */}
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">
          Üyelikler ve Kurumsal İş Birlikleri
        </span>

        {/* Rozet Şeridi */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-12 px-4 rounded-xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100/50 transition-colors duration-300"
            >
              {badge.logo ? (
                <img
                  src={badge.logo}
                  alt={badge.name}
                  className="max-h-8 max-w-[120px] object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              ) : (
                <span className="text-xs sm:text-sm font-semibold text-primary/70">
                  {badge.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
