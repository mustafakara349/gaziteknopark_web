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
    title: "Gazi Teknopark Genel Merkez & Ar-Ge Kampüsü",
    badge: "Genel Merkez & Ar-Ge Kampüsü",
    email: "info@gaziteknopark.com.tr",
    kepEmail: "gaziteknopark@hs01.kep.tr",
    address: "Gazi Üniversitesi Gölbaşı Yerleşkesi, Bahçelievler Mah. 323/1. Cadde No: 10, 06830 Gölbaşı / ANKARA",
    website: "https://www.gaziteknopark.com.tr",
    latitude: 39.7788,
    longitude: 32.8085,
  },
  {
    id: "london",
    city: "London",
    country: "İngiltere",
    countryCode: "GB",
    title: "Londra İrtibat & Hızlandırma Ofisi",
    badge: "Avrupa İrtibat Ofisi",
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
    title: "Amsterdam İnovasyon & Teknoloji Ofisi",
    badge: "Avrupa İnovasyon Ofisi",
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
    title: "Dubai Teknoloji & Ticaret Ofisi",
    badge: "Orta Doğu İrtibat Ofisi",
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
    <div className="mt-8 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header & City Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0B2558]">Uluslararası İrtibat Ofislerimiz</h2>
          <p className="mt-1 text-sm text-gray-500 max-w-xl leading-relaxed">
            Şehir sekmelerine veya haritadaki noktalara tıklayarak 3D Dünya Küresi üzerinden merkezlerimizi detaylı inceleyebilirsiniz.
          </p>
        </div>

        {/* City Tabs Bar */}
        <div className="flex flex-wrap gap-1.5 bg-gray-50 p-1.5 rounded-full border border-gray-200 shrink-0">
          {offices.map((office) => {
            const isActive = selectedOffice?.id === office.id;
            return (
              <button
                key={office.id}
                type="button"
                onClick={() => handleSelectOffice(office)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#e30613] text-white shadow-xs"
                    : "text-gray-600 hover:text-[#0B2558] hover:bg-white"
                }`}
              >
                <span className="text-[10px] font-bold opacity-80">{office.countryCode || "TR"}</span>
                <span>{office.city}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Height 2-Column Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left: 3D Scene Viewport (7 Cols - Fixed Height 440px) */}
        <div className="lg:col-span-7 h-[440px]">
          <GlobeScene
            offices={offices}
            selectedOffice={selectedOffice}
            onSelectOffice={handleSelectOffice}
          />
        </div>

        {/* Right: Office Info Panel OR Default Overview Card (5 Cols - Fixed Height 440px) */}
        <div className="lg:col-span-5 h-[440px] relative">
          {/* Default World Overview State */}
          <div
            className={`absolute inset-0 rounded-[1.5rem] bg-[#fcfcfd] p-6 sm:p-7 border border-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out ${
              !selectedOffice ? "opacity-100 z-10 pointer-events-auto scale-100" : "opacity-0 z-0 pointer-events-none scale-98"
            }`}
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-[#0B2558] leading-tight mb-3">
                Dünya Genelinde Gazi Teknopark
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Gazi Teknopark; Ankara Genel Merkezi'nin yanı sıra Avrupa (Londra, Amsterdam) ve Orta Doğu (Dubai) irtibat mekezleri ile girişimcilerimizi küresel pazarlara taşımaktadır.
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 border border-gray-200 text-xs text-gray-600 leading-relaxed">
              Bilgilerini görüntülemek istediğiniz merkezin noktasını veya yukarıdaki sekmeleri seçebilirsiniz.
            </div>
          </div>

          {/* Selected Office Details State */}
          <div
            className={`absolute inset-0 transition-all duration-300 ease-in-out ${
              selectedOffice ? "opacity-100 z-10 pointer-events-auto scale-100" : "opacity-0 z-0 pointer-events-none scale-98"
            }`}
          >
            {selectedOffice && (
              <OfficeSidePanel
                office={selectedOffice}
                onClose={handleClosePanel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
