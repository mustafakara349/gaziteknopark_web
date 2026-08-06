import { useState } from "react";
import { pickTranslation } from "../../utils/i18n";

export default function CampusTransportSection({ contactInfo }) {
  const [copied, setCopied] = useState(false);
  const t = pickTranslation(contactInfo ?? {});
  const email = contactInfo?.email || "info@gaziteknopark.com.tr";
  const address =
    t.address || "Gazi Üniversitesi Gölbaşı Yerleşkesi, Bahçelievler Mah. 323/1. Cadde No: 10, 06830 Gölbaşı / ANKARA";
  const workingHours = t.workingHours || "Pazartesi - Cuma: 08:30 - 17:30";

  // Official Google Maps Embed for Gazi Teknopark (Gölbaşı Yerleşkesi) with exact Place Pin Marker
  const defaultEmbed =
    "https://maps.google.com/maps?q=Gazi+Teknopark,+Gölbaşı,+Ankara&t=&z=16&ie=UTF8&iwloc=B&output=embed";

  // Official Google Maps direct place URL with red pin marker
  const googleMapsDirectionsUrl =
    "https://www.google.com/maps/search/?api=1&query=Gazi+Teknopark+Gölbaşı+Ankara";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
      <div>
        <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wide mb-3">
          Genel Yerleşke Bilgileri
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#0B2558]">Ankara Yerleşkesi & Adres Bilgileri</h2>
        <p className="mt-1 text-sm text-gray-500 max-w-2xl leading-relaxed">
          Gazi Üniversitesi Gölbaşı Yerleşkesi içerisinde yer alan teknopark alanımız ve adres bilgilerimiz.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Sol Taraf: Adres, E-Posta & Mesai Saatleri (7 Sütun) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-[1.5rem] bg-[#fcfcfd] p-6 border border-gray-200 text-sm space-y-5">
            {/* Açık Adres */}
            <div>
              <div className="text-xs font-bold text-[#0B2558] uppercase tracking-wider mb-1.5">
                Açık Adres
              </div>
              <p className="font-medium text-gray-700 leading-relaxed text-sm">{address}</p>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="mt-3 inline-block text-xs font-semibold text-[#0066cc] hover:underline cursor-pointer"
              >
                {copied ? (
                  <span className="text-emerald-600">Adres Kopyalandı</span>
                ) : (
                  <span>Adresi Kopyala</span>
                )}
              </button>
            </div>

            {/* E-Posta & Mesai Saatleri */}
            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-gray-200/80">
              <div>
                <div className="text-xs font-bold text-[#0B2558] uppercase tracking-wider mb-1">
                  E-Posta & KEP
                </div>
                <p className="font-bold text-[#0B2558] text-sm">{email}</p>
                <p className="text-xs text-gray-500 mt-0.5">KEP: gaziteknopark@hs01.kep.tr</p>
              </div>

              <div>
                <div className="text-xs font-bold text-[#0B2558] uppercase tracking-wider mb-1">
                  Mesai Saatleri
                </div>
                <p className="font-semibold text-gray-800 text-sm">{workingHours}</p>
                <p className="text-xs text-gray-500 mt-0.5">Hafta Sonu: Kapalı</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Harita ve Yol Tarifi (5 Sütun) */}
        <div className="flex flex-col space-y-3 lg:col-span-5">
          <div className="overflow-hidden rounded-[1.5rem] border border-gray-200 shadow-sm h-[250px] sm:h-[260px] w-full">
            <iframe
              src={defaultEmbed}
              title="Gazi Teknopark Ankara Konumu"
              className="h-full w-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#1E3A8A] px-6 py-3 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#152e6e] w-full cursor-pointer text-center"
          >
            Haritada Görüntüle
          </a>
        </div>
      </div>
    </div>
  );
}
