import { useEffect, useState } from "react";
import { getInternationalOffices } from "../../api/endpoints";
import GlobeScene from "./GlobeScene";
import OfficeSidePanel from "./OfficeSidePanel";

const DEFAULT_OFFICES = [
  {
    id: "ankara",
    city: "Ankara",
    country: "Türkiye",
    countryCode: "TR",
    flag: "🇹🇷",
    title: "Gazi Teknopark Genel Merkez & Ar-Ge Kampüsü",
    badge: "Genel Merkez & Ar-Ge Kampüsü",
    phone: "+90 312 212 90 00",
    email: "info@gaziteknopark.com.tr",
    address: "Gazi Üniversitesi Gölbaşı Yerleşkesi, Bahçelievler Mah. 35. Cadde No: 9, 06830 Gölbaşı / ANKARA",
    website: "https://www.gaziteknopark.com.tr",
    latitude: 39.9334,
    longitude: 32.8597,
  },
  {
    id: "london",
    city: "London",
    country: "İngiltere",
    countryCode: "GB",
    flag: "🇬🇧",
    title: "Londra İrtibat & Hızlandırma Ofisi",
    badge: "Avrupa İrtibat Ofisi",
    phone: "+44 20 7946 0912",
    email: "london@gaziteknopark.com.tr",
    address: "London Tech Hub, 100 Bishopsgate, EC2N 4AG, London / UNITED KINGDOM",
    website: "https://london.gaziteknopark.com.tr",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    id: "amsterdam",
    city: "Amsterdam",
    country: "Hollanda",
    countryCode: "NL",
    flag: "🇳🇱",
    title: "Amsterdam İnovasyon & Teknoloji Ofisi",
    badge: "Avrupa İnovasyon Ofisi",
    phone: "+31 20 794 8000",
    email: "amsterdam@gaziteknopark.com.tr",
    address: "Amsterdam Science Park 400, 1098 XH Amsterdam / NETHERLANDS",
    website: "https://amsterdam.gaziteknopark.com.tr",
    latitude: 52.3676,
    longitude: 4.9041,
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "Birleşik Arap Emirlikleri",
    countryCode: "AE",
    flag: "🇦🇪",
    title: "Dubai Teknoloji & Ticaret Ofisi",
    badge: "Orta Doğu İrtibat Ofisi",
    phone: "+971 4 312 8000",
    email: "dubai@gaziteknopark.com.tr",
    address: "Dubai Future District, DIFC Gate Precinct 4, Level 5, Dubai / UAE",
    website: "https://dubai.gaziteknopark.com.tr",
    latitude: 25.2048,
    longitude: 55.2708,
  },
];

export default function GlobeContainer() {
  const [offices, setOffices] = useState(DEFAULT_OFFICES);
  const [selectedOffice, setSelectedOffice] = useState(null);

  useEffect(() => {
    getInternationalOffices()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOffices(data);
        }
      })
      .catch((err) => {
        console.warn("[GlobeContainer] API verileri yüklendi:", err);
      });
  }, []);

  const handleSelectOffice = (office) => {
    setSelectedOffice(office);
  };

  const handleClosePanel = () => {
    setSelectedOffice(null);
  };

  return (
    <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      {/* Header & City Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h3 className="text-xl font-bold text-primary sm:text-2xl">Uluslararası İrtibat Ofislerimiz</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xl">
            Raptiyelere veya şehir sekmelerine tıklayarak 3D Dünya Küresi üzerinden merkezlerimize odaklanabilirsiniz.
          </p>
        </div>

        {/* Dynamic City Tabs & Reset View Button */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedOffice && (
            <button
              type="button"
              onClick={handleClosePanel}
              className="rounded-full bg-surface border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-gray-100 transition-colors cursor-pointer"
            >
              🔄 Tüm Dünya Görünümü
            </button>
          )}

          <div className="flex flex-wrap gap-1.5 bg-surface p-1.5 rounded-full border border-gray-100">
            {offices.map((office) => {
              const isActive = selectedOffice?.id === office.id;
              return (
                <button
                  key={office.id}
                  type="button"
                  onClick={() => handleSelectOffice(office)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive ? "bg-primary text-white shadow-xs" : "text-gray-600 hover:text-primary hover:bg-white/60"
                  }`}
                >
                  <span>{office.flag}</span>
                  <span>{office.city}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inline 2-Column Corporate Grid Layout */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left: R3F 3D Scene Viewport (7 Cols) */}
        <div className="lg:col-span-7">
          <GlobeScene
            offices={offices}
            selectedOffice={selectedOffice}
            onSelectOffice={handleSelectOffice}
          />
        </div>

        {/* Right: Office Info Panel OR Default Overview Card (5 Cols) */}
        <div className="lg:col-span-5 min-h-[380px] flex flex-col justify-center">
          {selectedOffice ? (
            <OfficeSidePanel
              office={selectedOffice}
              onClose={handleClosePanel}
            />
          ) : (
            <div className="rounded-2xl bg-surface p-6 border border-gray-100/80 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span>Küresel Hızlandırma & Ar-Ge Ağı</span>
              </div>
              <h4 className="text-lg font-bold text-primary">Dünya Genelinde Gazi Teknopark</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gazi Teknopark; Ankara Genel Merkezi'nin yanı sıra Avrupa (Londra, Amsterdam) ve Orta Doğu (Dubai) irtibat ve hızlandırma ofisleri ile girişimcilerimizi küresel pazarlara taşımaktadır.
              </p>
              <div className="pt-2 text-[11px] text-gray-500 font-medium border-t border-gray-200/60">
                💡 Bilgilerini görüntülemek istediğiniz merkezin 3D raptiyesine veya yukarıdaki sekmelere tıklayabilirsiniz.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
