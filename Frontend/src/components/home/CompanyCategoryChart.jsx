import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import SectionTitle from "../common/SectionTitle";

const CATEGORY_COLORS = ["#2E5C94", "#E30613", "#1F9E7C", "#C08A1E", "#7B4FA6"];

const MOCK_CATEGORIES = [
  {
    id: "yazilim",
    name: "Yazılım",
    percentage: 36,
    count: 30,
    color: "#2E5C94",
    description: "Yapay zeka, bulut bilişim, veritabanı yönetimi ve kurumsal yazılım çözümleri üreten Ar-Ge firmaları.",
    companies: [
      { name: "Simsoft Bilgisayar", tag: "Yapay Zeka & Simülasyon", logoText: "S" },
      { name: "Milsoft Yazılım Teknolojileri", tag: "Savunma & Bulut", logoText: "M" },
      { name: "Cybersoft Enformasyon", tag: "Fintek & Veri Analitiği", logoText: "C" },
      { name: "Havelsan Teknoloji Radar", tag: "Gömülü Yazılımlar", logoText: "H" },
      { name: "Akgün Yazılım Sağlık", tag: "Medikal Yazılım", logoText: "A" },
      { name: "VeriPark Bilgi Teknolojileri", tag: "Kurumsal Çözümler", logoText: "V" }
    ]
  },
  {
    id: "elektronik",
    name: "Elektronik",
    percentage: 24,
    count: 20,
    color: "#E30613",
    description: "Gömülü devre tasarımı, IoT sensör ağları, robotik kontrol ve mikroelektronik Ar-Ge odaklı firmalar.",
    companies: [
      { name: "Aselsan Elektronik Ar-Ge", tag: "Radar & Sensör Sistemleri", logoText: "A" },
      { name: "Meteksan Savunma Sanayii", tag: "Haberleşme Kartları", logoText: "M" },
      { name: "Profilo Elektronik Sistemler", tag: "Mikroişlemciler", logoText: "P" },
      { name: "Mikro-Tasarım San. Tic.", tag: "Entegre Devre Tasarımı", logoText: "M" }
    ]
  },
  {
    id: "saglik",
    name: "Sağlık",
    percentage: 18,
    count: 15,
    color: "#1F9E7C",
    description: "Biyomedikal cihazlar, teşhis kitleri, biyoteknoloji ve medikal teknoloji geliştiren yenilikçi şirketler.",
    companies: [
      { name: "Biosys Biyomedikal Mühendislik", tag: "Solunum Cihazları", logoText: "B" },
      { name: "Medikalsan Ar-Ge Hizmetleri", tag: "Cerrahi Ekipmanlar", logoText: "M" },
      { name: "GeneStems Biyoteknoloji", tag: "Kök Hücre & Genetik", logoText: "G" },
      { name: "TibbiCihaz İnovasyon A.Ş.", tag: "Görüntüleme Teknolojisi", logoText: "T" }
    ]
  },
  {
    id: "enerji",
    name: "Enerji",
    percentage: 12,
    count: 10,
    color: "#C08A1E",
    description: "Yenilenebilir enerji, batarya yönetim sistemleri, akıllı şebekeler ve enerji verimliliği Ar-Ge merkezleri.",
    companies: [
      { name: "EnerjiSa İnovasyon & Ar-Ge", tag: "Akıllı Şebeke Sistemleri", logoText: "E" },
      { name: "Solargon Enerji Teknolojileri", tag: "Güneş Hücreleri", logoText: "S" },
      { name: "Yeşil Güç Sistemleri", tag: "Batarya Yönetimi", logoText: "Y" },
      { name: "WindTech Türbin Ar-Ge", tag: "Rüzgar Enerjisi", logoText: "W" }
    ]
  },
  {
    id: "telekom",
    name: "Telekomünikasyon",
    percentage: 10,
    count: 8,
    color: "#7B4FA6",
    description: "5G/6G haberleşme altyapısı, fiber optik aktarım, geniş bant iletişim ve uydu teknolojileri üreten şirketler.",
    companies: [
      { name: "ULAK Haberleşme A.Ş.", tag: "5G Şebeke Altyapısı", logoText: "U" },
      { name: "Netmaster Ar-Ge Çözümleri", tag: "Ağ Donanımları", logoText: "N" },
      { name: "Komtek İletişim Sistemleri", tag: "Uydu İletişimi", logoText: "K" },
      { name: "FiberTech Optik Ağlar", tag: "Optik Aktarım", logoText: "F" }
    ]
  }
];

export default function CompanyCategoryChart() {
  const [selectedId, setSelectedId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const activeCategory = MOCK_CATEGORIES.find((c) => c.id === selectedId) || MOCK_CATEGORIES[0];
  const totalCompanies = MOCK_CATEGORIES.reduce((acc, curr) => acc + curr.count, 0);
  const isExpanded = selectedId !== null;

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <section ref={sectionRef} className="mt-24 w-full px-4">
      <div className="mx-auto max-w-6xl">
      <SectionTitle title="Firma Kategorileri" center />

      <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm overflow-hidden transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 w-full">

          {/* LEFT CHART COLUMN - Continuous DOM Element (Wider & Slower) */}
          <div
            className={`transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center shrink-0 ${isExpanded
                ? "w-full lg:w-[480px] border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-10"
                : "w-full mx-auto py-2"
              }`}
          >
            {/* Header when centered */}
            <div
              className={`transition-all duration-700 text-center ${isExpanded ? "h-0 opacity-0 overflow-hidden mb-0" : "opacity-100 mb-6"
                }`}
            >
              <h3 className="text-xl font-bold text-gray-800">Sektörel Dağılım</h3>
              <p className="mt-1 text-xs text-gray-400">
                Detaylı firma listesini görmek için grafik dilimlerine veya sektör butonlarına tıklayınız.
              </p>
            </div>

            {/* Donut Chart (Slightly Larger) */}
            <div className="relative h-80 w-80 flex items-center justify-center transition-transform duration-700 hover:scale-105">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    key={isVisible ? "visible" : "hidden"}
                    data={MOCK_CATEGORIES}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="95%"
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                    isAnimationActive={isVisible}
                    animationDuration={1400}
                    animationBegin={100}
                    onMouseEnter={(_, index) => isExpanded && handleSelect(MOCK_CATEGORIES[index].id)}
                    onClick={(_, index) => handleSelect(MOCK_CATEGORIES[index].id)}
                  >
                    {MOCK_CATEGORIES.map((entry, index) => (
                      <Cell
                        key={entry.id}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        className="cursor-pointer outline-none transition-opacity hover:opacity-90"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Donut Center Display */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="text-3xl md:text-4xl font-extrabold text-primary leading-none">
                  {isExpanded ? `%${activeCategory.percentage}` : totalCompanies}
                </span>
                <span className="mt-1 text-xs font-bold text-gray-800 block">
                  {isExpanded ? activeCategory.name : "Toplam Firma"}
                </span>
                {isExpanded && (
                  <span className="text-[11px] font-semibold text-gray-400 block mt-0.5">
                    {activeCategory.count} Firma
                  </span>
                )}
              </div>
            </div>

            {/* Sector Selector Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-2.5 w-full max-w-xl">
              {MOCK_CATEGORIES.map((cat, index) => {
                const isSelected = cat.id === activeCategory.id && isExpanded;
                return (
                  <button
                    key={cat.id}
                    onMouseEnter={() => isExpanded && handleSelect(cat.id)}
                    onClick={() => handleSelect(cat.id)}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-300 ${isSelected
                        ? "bg-primary text-white shadow-xs"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100"
                      }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: isSelected ? "#fff" : CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                    />
                    {cat.name}
                    <span className={`ml-1 text-[10px] font-extrabold ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                      %{cat.percentage}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT DETAILS COLUMN - Smooth Width & Opacity Expansion */}
          {isExpanded && (
            <div className="flex-1 min-w-0 flex flex-col justify-between animate-slide-right-heavy w-full">
              <div>
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="h-4 w-4 rounded-full" style={{ backgroundColor: activeCategory.color }} />
                      <h3 className="text-2xl font-bold tracking-tight text-primary">
                        {activeCategory.name} Sektörü
                      </h3>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed max-w-xl">
                      {activeCategory.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-gray-100 px-3.5 py-1.5 text-xs font-bold text-gray-700">
                      Toplam {activeCategory.count} Firma
                    </span>
                  </div>
                </div>

                {/* Companies Showcase Grid */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                    {activeCategory.name} Bünyesindeki Öne Çıkan Firmalar
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activeCategory.companies.slice(0, 4).map((company, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-slate-50/60 p-3.5 transition-all hover:bg-white hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-xs text-sm"
                          style={{ backgroundColor: activeCategory.color }}
                        >
                          {company.logoText}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-sm font-bold text-gray-800 truncate group-hover:text-primary transition-colors">
                            {company.name}
                          </h5>
                          <span className="text-[11px] font-semibold text-gray-400 truncate block">
                            {company.tag}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-end">
                <a
                  href="/firmalar"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors group"
                >
                  Tümünü Gör
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}
