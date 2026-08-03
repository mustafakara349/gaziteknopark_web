import { pickTranslation } from "../../utils/i18n";

export default function CampusTransportSection({ contactInfo }) {
  const t = pickTranslation(contactInfo ?? {});
  const email = contactInfo?.email || "info@gaziteknopark.com.tr";
  const address =
    t.address || "Gazi Üniversitesi Gölbaşı Yerleşkesi, Bahçelievler Mah. 35. Cadde No: 9, 06830 Gölbaşı / ANKARA";
  const workingHours = t.workingHours || "Pazartesi - Cuma: 08:30 - 17:30";

  const defaultEmbed =
    contactInfo?.mapEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3063.847743952136!2d32.8105!3d39.7892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34789ab29f957%3A0x7fa2897aa1cfa04a!2sGazi%20Teknopark!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str";

  const googleMapsDirectionsUrl = "https://maps.google.com/?q=Gazi+Teknopark+Gölbaşı+Ankara";

  return (
    <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h3 className="text-xl font-bold text-primary sm:text-2xl">Ankara Yerleşkesi & Ulaşım Bilgileri</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-2xl">
          Gazi Üniversitesi Gölbaşı Yerleşkesi içerisinde yer alan teknopark alanımıza ulaşım rehberi.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Address, Email & Transport Options (7 Cols) */}
        <div className="space-y-4 lg:col-span-7">
          {/* Adres & E-Posta Card */}
          <div className="grid gap-4 sm:grid-cols-2 rounded-2xl bg-surface p-4 border border-gray-100/80 text-xs">
            <div>
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Açık Adres</span>
              <p className="mt-0.5 font-medium text-ink leading-relaxed">{address}</p>
            </div>

            <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-gray-200/60 pt-2 sm:pt-0 sm:pl-4">
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">E-Posta & KEP</span>
                <p className="mt-0.5 font-bold text-primary">{email}</p>
                <p className="text-[11px] text-gray-500">KEP: gaziteknopark@hs01.kep.tr</p>
              </div>

              <div className="pt-1.5 border-t border-gray-200/60">
                <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Mesai Saatleri</span>
                <p className="mt-0.5 font-semibold text-ink">{workingHours}</p>
              </div>
            </div>
          </div>

          {/* Minimal Ulaşım Seçenekleri */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] block mb-1">
              Ulaşım Seçenekleri
            </span>

            <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-2.5 border border-gray-100/80">
              <span className="font-bold text-primary">EGO Otobüs Hatları</span>
              <span className="font-semibold text-gray-600">105-2, 106-2, 195-2, 114-2</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-2.5 border border-gray-100/80">
              <span className="font-bold text-primary">Dolmuş Hatları</span>
              <span className="font-semibold text-gray-600">Ulus - Gölbaşı / Kızılay - Gölbaşı</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-2.5 border border-gray-100/80">
              <span className="font-bold text-primary">Özel Araç</span>
              <span className="font-semibold text-gray-600">Konya Yolu (Ücretsiz Otopark)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Compact Google Maps Frame (5 Cols) */}
        <div className="flex flex-col space-y-3 lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xs h-[230px] sm:h-[240px] w-full">
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
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90 w-full"
          >
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Google Maps'te Yol Tarifi Al</span>
          </a>
        </div>
      </div>
    </div>
  );
}
