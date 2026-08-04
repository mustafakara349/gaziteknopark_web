export default function ContactMapSection({ mapEmbedUrl }) {
  const defaultEmbed =
    mapEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3063.847743952136!2d32.8105!3d39.7892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34789ab29f957%3A0x7fa2897aa1cfa04a!2sGazi%20Teknopark!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str";

  const googleMapsDirectionsUrl = "https://maps.google.com/?q=Gazi+Teknopark+Gölbaşı+Ankara";

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-10">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Yerleşke & Konum</span>
          <h2 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">Ulaşım Rehberi & Harita</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
            Gazi Üniversitesi Gölbaşı Yerleşkesi içerisinde yer alan teknopark binamıza toplu taşıma araçları veya özel aracınızla ulaşım imkanları.
          </p>
        </div>

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
        >
          <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Google Maps'te Yol Tarifi Al</span>
        </a>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-stretch">
        {/* Left Column: Transportation Options (5 cols) */}
        <div className="space-y-4 lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-surface p-4 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold shadow-xs">
                EGO
              </div>
              <div>
                <h4 className="text-xs font-bold text-primary">Otobüs Hatları</h4>
                <p className="mt-0.5 text-xs font-semibold text-ink">105-1, 106-1, 195, 114</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Gölbaşı Kampüs Ana Giriş Durağı</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-surface p-4 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white text-xs font-bold shadow-xs">
                DOL
              </div>
              <div>
                <h4 className="text-xs font-bold text-primary">Dolmuş Hatları</h4>
                <p className="mt-0.5 text-xs font-semibold text-ink">Ulus - Gölbaşı & Kızılay - Gölbaşı</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Kampüs nizamiye kapısında inebilirsiniz.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-surface p-4 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-white text-xs font-bold shadow-xs">
                OTO
              </div>
              <div>
                <h4 className="text-xs font-bold text-primary">Özel Araç & Otopark</h4>
                <p className="mt-0.5 text-xs font-semibold text-ink">Ankara - Konya Yolu Güzergahı</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Ziyaretçiler için açık otopark mevcuttur.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100 text-xs text-primary leading-relaxed">
            🛡️ <strong>Güvenlik Notu:</strong> Ziyaretçi girişlerinde güvenlik noktasından kimlik kaydı yapılmaktadır.
          </div>
        </div>

        {/* Right Column: Google Maps Embed (7 cols) */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm lg:col-span-7 min-h-[360px]">
          <iframe
            src={defaultEmbed}
            title="Gazi Teknopark Konumu"
            className="h-full min-h-[360px] w-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
