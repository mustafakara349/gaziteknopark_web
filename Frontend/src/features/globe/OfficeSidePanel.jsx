import { useState } from "react";

export default function OfficeSidePanel({ office, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!office) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(office.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col justify-between rounded-[1.5rem] border border-gray-200 bg-[#fcfcfd] p-5 sm:p-6 shadow-xs font-sans">
      <div>
        {/* Top Header with Badge & Close Button */}
        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wide">
              {office.countryCode || office.country}
            </span>
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-[#0066cc] text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wide">
                {office.country}
              </span>
              <span className="block text-[11px] text-gray-500 font-medium mt-0.5">{office.badge}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-gray-400 hover:text-[#0B2558] hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            title="Kapat"
          >
            Kapat
          </button>
        </div>

        {/* Office Title & Coordinates */}
        <h3 className="mt-2.5 text-base md:text-lg font-bold text-[#0B2558] leading-tight">{office.title}</h3>
        <p className="mt-0.5 text-[11px] text-gray-500 font-medium">
          Koordinat: {office.latitude}° N, {office.longitude}° E
        </p>

        {/* Contact Details List */}
        <div className="mt-3 space-y-2 text-xs">
          <div className="rounded-xl bg-white p-3 border border-gray-200 shadow-xs">
            <div className="text-[10px] font-bold text-[#0B2558] uppercase tracking-wider mb-0.5">
              Açık Adres
            </div>
            <p className="font-medium text-gray-700 leading-relaxed text-xs">{office.address}</p>
          </div>

          <div className="rounded-xl bg-white p-3 border border-gray-200 shadow-xs">
            <div className="text-[10px] font-bold text-[#0B2558] uppercase tracking-wider mb-0.5">
              E-Posta & KEP
            </div>
            <p className="font-bold text-[#0B2558] text-xs truncate">{office.email}</p>
            {office.kepEmail && (
              <p className="text-[11px] text-gray-500 mt-0.5">KEP: {office.kepEmail}</p>
            )}
          </div>

          {office.website && (
            <div className="rounded-xl bg-white p-3 border border-gray-200 shadow-xs">
              <div className="text-[10px] font-bold text-[#0B2558] uppercase tracking-wider mb-0.5">
                Resmi Web Sitesi
              </div>
              <a
                href={office.website}
                target="_blank"
                rel="noreferrer"
                className="block font-semibold text-[#0066cc] hover:underline truncate text-xs"
              >
                {office.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Single Clean Action Button */}
      <div className="pt-2 border-t border-gray-200/60">
        <button
          type="button"
          onClick={handleCopyAddress}
          className="w-full rounded-full bg-[#1E3A8A] px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#152e6e] cursor-pointer shadow-xs text-center"
        >
          {copied ? "Adres Kopyalandı" : "Adresi Kopyala"}
        </button>
      </div>
    </div>
  );
}
