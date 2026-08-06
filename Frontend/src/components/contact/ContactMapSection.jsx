import { MapPin, Navigation } from "lucide-react";

export default function ContactMapSection({ mapEmbedUrl }) {
  const defaultEmbed =
    mapEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3063.847743952136!2d32.8105!3d39.7892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34789ab29f957%3A0x7fa2897aa1cfa04a!2sGazi%20Teknopark!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str";

  const googleMapsDirectionsUrl = "https://maps.google.com/?q=Gazi+Teknopark+Gölbaşı+Ankara";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary/70">Yerleşke & Konum</span>
          <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">Harita ve Yol Tarifi</h2>
          <p className="mt-1 text-xs text-gray-500">
            Gazi Üniversitesi Gölbaşı Yerleşkesi içerisindeki Teknopark binamızın konumu.
          </p>
        </div>

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-primary-dark shrink-0"
        >
          <Navigation className="h-4 w-4" />
          <span>Google Maps'te Yol Tarifi Al</span>
        </a>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span>Gazi Üniversitesi Gölbaşı Yerleşkesi, Bahçelievler Mah. 35. Cadde No: 9, 06830 Gölbaşı / ANKARA</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-xs h-[360px] w-full">
          <iframe
            src={defaultEmbed}
            title="Gazi Teknopark Konumu"
            className="h-full w-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
