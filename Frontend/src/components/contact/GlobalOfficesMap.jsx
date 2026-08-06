import { useState } from "react";

const OFFICES = [
  {
    id: "ankara",
    city: "Ankara",
    country: "Türkiye",
    title: "Gazi Teknopark Genel Merkez",
    badge: "Genel Merkez & Ar-Ge Kampüsü",
    flag: "🇹🇷",
    address: "Gazi Üniversitesi Gölbaşı Yerleşkesi, Bahçelievler Mah. 35. Cadde No: 9, 06830 Gölbaşı / ANKARA",
    email: "info@gaziteknopark.com.tr",
    kep: "gaziteknopark@hs01.kep.tr",
    coords: { x: 550, y: 220 }, // Map SVG position
    zoomLocation: "Gölbaşı Yerleşkesi / Harita Koordinatı: 39.7892° N, 32.8105° E",
  },
  {
    id: "london",
    city: "Londra",
    country: "İngiltere",
    title: "Londra İrtibat & Hızlandırma Ofisi",
    badge: "Avrupa İrtibat Ofisi",
    flag: "🇬🇧",
    address: "London Tech Hub, 100 Bishopsgate, EC2N 4AG, London / UNITED KINGDOM",
    email: "london@gaziteknopark.com.tr",
    coords: { x: 340, y: 140 },
    zoomLocation: "London Financial District / Harita Koordinatı: 51.5145° N, 0.0825° W",
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "Birleşik Arap Emirlikleri",
    title: "Dubai Teknoloji & Ticaret Ofisi",
    badge: "Orta Doğu İrtibat Ofisi",
    flag: "🇦🇪",
    address: "Dubai Future District, DIFC Gate Precinct 4, Level 5, Dubai / UAE",
    email: "dubai@gaziteknopark.com.tr",
    coords: { x: 680, y: 310 },
    zoomLocation: "Dubai Future District / Harita Koordinatı: 25.2048° N, 55.2708° E",
  },
];

export default function GlobalOfficesMap() {
  const [selectedOffice, setSelectedOffice] = useState("ankara");
  const [copied, setCopied] = useState(false);

  const current = OFFICES.find((o) => o.id === selectedOffice) || OFFICES[0];

  const handleCopyAddress = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Küresel Ağ</span>
          <h2 className="mt-1 text-2xl font-bold text-primary sm:text-3xl">Uluslararası İrtibat Ofislerimiz</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xl">
            Ankara Genel Merkezimiz ile Londra ve Dubai uluslararası irtibat ofislerimiz arasındaki teknoloji köprüsü.
          </p>
        </div>

        {/* Office Switcher Tabs */}
        <div className="flex gap-2 bg-surface p-1.5 rounded-full border border-gray-100">
          {OFFICES.map((office) => {
            const isActive = office.id === selectedOffice;
            return (
              <button
                key={office.id}
                type="button"
                onClick={() => setSelectedOffice(office.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive ? "bg-primary text-white shadow-xs" : "text-gray-600 hover:text-primary"
                }`}
              >
                <span>{office.flag}</span>
                <span>{office.city}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Interactive Map & Office Details */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Interactive SVG Map (7 Cols) */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-[#082b5c] p-4 lg:col-span-7 min-h-[340px] flex items-center justify-center">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

          <svg viewBox="0 0 900 450" className="w-full h-auto max-h-[380px] relative z-10">
            {/* World Land Mass Outlines */}
            <path
              d="M150,120 Q200,80 300,100 T450,110 T600,160 T750,200 T850,280 L800,380 L600,360 L450,320 L250,280 Z"
              fill="#0b3b7c"
              opacity="0.5"
            />
            {/* Europe / UK */}
            <path
              d="M320,110 Q350,90 380,120 T360,160 T310,140 Z"
              fill="#0f3d7a"
              opacity="0.8"
            />
            {/* Turkey / Middle East */}
            <path
              d="M520,190 Q580,180 620,220 T680,290 T600,320 T530,240 Z"
              fill="#0f3d7a"
              opacity="0.9"
            />

            {/* Red Connection Lines (Raptiyeleri Birleştiren Kırmızı İp Hatları) */}
            <g stroke="#e30613" strokeWidth="2" strokeDasharray="5,5" opacity="0.85">
              {/* Ankara to London */}
              <path d="M 550 220 Q 445 150 340 140" fill="none" className="animate-pulse" />
              {/* Ankara to Dubai */}
              <path d="M 550 220 Q 620 255 680 310" fill="none" className="animate-pulse" />
            </g>

            {/* Interactive Pins (Raptiyeler) */}
            {OFFICES.map((office) => {
              const isSelected = office.id === selectedOffice;
              return (
                <g
                  key={office.id}
                  transform={`translate(${office.coords.x}, ${office.coords.y})`}
                  className="cursor-pointer transition-transform duration-300"
                  onClick={() => setSelectedOffice(office.id)}
                >
                  {/* Pulse Ring if Selected */}
                  {isSelected && (
                    <circle r="22" fill="#e30613" opacity="0.25" className="animate-ping" />
                  )}

                  {/* Red Pin Body (Raptiye) */}
                  <circle
                    r={isSelected ? "11" : "7"}
                    fill={isSelected ? "#e30613" : "#ffffff"}
                    stroke="#e30613"
                    strokeWidth="3"
                    className="transition-all duration-300 hover:scale-125"
                  />

                  {/* Pin Center Dot */}
                  <circle r="3" fill={isSelected ? "#ffffff" : "#e30613"} />

                  {/* Location Label Badge */}
                  <g transform="translate(0, 24)">
                    <rect
                      x="-40"
                      y="-12"
                      width="80"
                      height="20"
                      rx="10"
                      fill={isSelected ? "#e30613" : "#051d40"}
                      opacity="0.9"
                    />
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="'Host Grotesk', sans-serif"
                    >
                      {office.flag} {office.city}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-lg bg-black/40 backdrop-blur-xs px-3 py-1.5 text-[11px] text-white/80 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Kırmızı Çizgiler: Uluslararası İrtibat Ağı</span>
          </div>
        </div>

        {/* Right Active Office Card (5 Cols) */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-surface p-6 sm:p-7 lg:col-span-5 space-y-5 animate-slide-down">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {current.flag} {current.country}
              </span>
              <span className="text-[11px] font-semibold text-gray-400">{current.badge}</span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-primary">{current.title}</h3>
            <p className="mt-1 text-xs text-gray-500">{current.zoomLocation}</p>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-200/60 text-xs">
            <div>
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Ofis Adresi</span>
              <p className="mt-0.5 font-medium text-ink leading-relaxed">{current.address}</p>
            </div>

            <div>
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">E-Posta Adresi</span>
              <p className="mt-0.5 font-bold text-primary">{current.email}</p>
            </div>

            {current.kep && (
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">KEP Adresi</span>
                <p className="mt-0.5 font-medium text-gray-600">{current.kep}</p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleCopyAddress(current.address)}
              className="w-full rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
            >
              {copied ? <span>✓ Adres Kopyalandı</span> : <span>Adresi Kopyala</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
