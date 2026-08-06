import React, { useState } from "react";
import * as LucideIcons from "lucide-react";

export default function IncentivesSection({ incentives }) {
  const [activeTab, setActiveTab] = useState("entrepreneur"); // "entrepreneur" | "academician"

  if (!incentives) return null;

  const activeData = activeTab === "entrepreneur" ? incentives.entrepreneur : incentives.academician;

  return (
    <div className="space-y-8">
      {/* Üst Kısım: Başlık ve Sekmeler (Dışarıda) */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">
            Yasal Avantajlar
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-primary sm:text-3xl">
            Teşvik ve Muafiyetler
          </h2>
        </div>

        {/* Sekmeler */}
        <div className="inline-flex rounded-full bg-blue-100/30 p-1 border border-blue-100/50 shrink-0 self-center md:self-end">
          <button
            onClick={() => setActiveTab("entrepreneur")}
            className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === "entrepreneur"
                ? "bg-primary text-white shadow-sm"
                : "text-primary/70 hover:text-primary"
            }`}
          >
            Firmalar / Girişimciler
          </button>
          <button
            onClick={() => setActiveTab("academician")}
            className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === "academician"
                ? "bg-primary text-white shadow-sm"
                : "text-primary/70 hover:text-primary"
            }`}
          >
            Akademisyenler
          </button>
        </div>
      </div>

      {/* Alt Kısım: Seçili Sekmenin İçeriği (Kart Yapısı) */}
      <div 
        key={activeTab} 
        className="rounded-3xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-down"
      >
        <h4 className="text-lg font-bold text-primary flex items-center gap-2 mb-6">
          <span className="h-2 w-2 rounded-full bg-accent" />
          {activeData.title}
        </h4>

        {/* Maddeler - 2 Sütunlu Grid */}
        {activeData.items?.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeData.items.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-2xl bg-surface/40 p-4 border border-gray-100/30 hover:bg-surface hover:border-gray-100 transition-all duration-300"
              >
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
                  <LucideIcons.Percent className="h-3 w-3" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium text-gray-700 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Mevzuat Dipnotu */}
        {activeData.note && (
          <div className="mt-8 rounded-2xl bg-blue-50/30 p-4 border border-blue-50/50 w-full">
            <div className="flex items-start gap-2.5">
              <LucideIcons.Info className="h-4.5 w-4.5 text-accent-blue shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-primary/70 leading-relaxed">
                {activeData.note}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
