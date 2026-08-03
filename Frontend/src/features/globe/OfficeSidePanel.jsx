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
    <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-surface p-6 sm:p-7 space-y-5 animate-fade-in shadow-xs">
      <div>
        <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{office.flag}</span>
            <div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                {office.country}
              </span>
              <span className="block text-[10px] text-gray-400 font-medium mt-0.5">{office.badge}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-ink transition-colors cursor-pointer border border-gray-200/80"
            title="Kapat & Haritaya Dön"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <h3 className="mt-4 text-xl font-extrabold text-primary">{office.title}</h3>
        <p className="mt-1 text-xs text-gray-500 font-mono">
          Koordinat: {office.latitude}° N, {office.longitude}° E
        </p>

        {/* Contact Details List */}
        <div className="mt-5 space-y-3 text-xs">
          <div className="rounded-xl bg-white p-3.5 border border-gray-100 shadow-xs">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Açık Adres</span>
            <p className="mt-1 font-medium text-ink leading-relaxed">{office.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white p-3 border border-gray-100 shadow-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Telefon</span>
              <p className="mt-0.5 font-bold text-primary text-xs truncate">{office.phone}</p>
            </div>

            <div className="rounded-xl bg-white p-3 border border-gray-100 shadow-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">E-Posta</span>
              <p className="mt-0.5 font-bold text-primary text-xs truncate">{office.email}</p>
            </div>
          </div>

          {office.website && (
            <div className="rounded-xl bg-white p-3.5 border border-gray-100 shadow-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Resmi Web Sitesi</span>
              <a
                href={office.website}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 block font-semibold text-accent hover:underline truncate"
              >
                {office.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-gray-200/60">
        <button
          type="button"
          onClick={handleCopyAddress}
          className="w-full rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
        >
          {copied ? <span>✓ Adres Kopyalandı</span> : <span>Adresi Kopyala</span>}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-white transition-colors cursor-pointer"
        >
          🔄 Haritaya Dön & Dönüşü Başlat
        </button>
      </div>
    </div>
  );
}
