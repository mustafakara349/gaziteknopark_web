import { useEffect, useState, useRef } from "react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

// Mock veriler
const COMPANY_GROWTH_DATA = [
  { year: "2022", value: 80 },
  { year: "2023", value: 105 },
  { year: "2024", value: 125 },
  { year: "2025", value: 140 },
  { year: "2026", value: 155 }
];

const EMPLOYEES_DIST_DATA = [
  { group: "A", value: 30 },
  { group: "B", value: 50 },
  { group: "C", value: 85 },
  { group: "D", value: 60 },
  { group: "E", value: 90 },
  { group: "F", value: 75 },
  { group: "G", value: 45 }
];

const SECTORS_PIE_DATA = [
  { name: "Yazılım", value: 45, color: "#2563eb" },
  { name: "Siber Güvenlik", value: 20, color: "#3b82f6" },
  { name: "Bilişim", value: 15, color: "#60a5fa" },
  { name: "Diğer", value: 20, color: "#93c5fd" }
];

// Dinamik İçerik Veri Haritası
const statData = {
  firma: {
    badge: "FİRMA GÜCÜMÜZ",
    title: "Büyüyen ve Gelişen Ekosistemimiz",
    description: "Gazi Teknopark çatısı altında 150'den fazla ileri teknoloji ve Ar-Ge firması geleceğin çözümlerini üretiyor.",
    detail: "Yazılım, donanım, savunma sanayii ve biyoteknoloji odaklı dinamik şirket yapısı."
  },
  calisan: {
    badge: "İNSAN KAYNAĞI",
    title: "Nitelikli Ar-Ge İnsan Gücü",
    description: "1.000'i aşkın mühendis, araştırmacı ve yazılımcı ile teknoloji ekosistemine yön veriyoruz.",
    detail: "%85'in üzerinde lisans ve lisansüstü mezuniyet oranına sahip uzman kadro."
  },
  proje: {
    badge: "AR-GE POTANSİYELİ",
    title: "Başarıyla Tamamlanan Projeler",
    description: "250'den fazla ulusal ve uluslararası Ar-Ge projesi başarıyla yürütülüyor ve ürüne dönüştürülüyor.",
    detail: "TÜBİTAK, KOSGEB ve AB fonlu desteklenen yüksek katma değerli projeler."
  },
  sektor: {
    badge: "SEKTÖREL ÇEŞİTLİLİK",
    title: "20'den Fazla Teknoloji Dikeyimiz",
    description: "Yapay zekadan otonom sistemlere, siber güvenlikten sağlığa kadar geniş bir yelpazede faaliyet gösteriyoruz.",
    detail: "Bölgesel ve küresel pazarlara yönelik multidisipliner teknoloji odağı."
  }
};

// SVG İkonlar (Lucide-react muadili inline SVG'ler)
const Building2Icon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.75A1.5 1.5 0 0 1 10.5 15.75h3a1.5 1.5 0 0 1 1.5 1.5V21" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const RocketIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 8.41a6 6 0 0 1 5.96 5.96ZM9.63 8.41A14.979 14.979 0 0 0 1.7 18.04a14.979 14.979 0 0 0 7.93-9.63Zm0 0V4.8A6 6 0 0 1 15.47 12m-5.84-3.59h.008v.008h-.008V8.41Zm0 0h.008v.008H9.63V8.41Z" />
  </svg>
);

const PieChartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
  </svg>
);

// Yardımcı Değer Ayrıştırma Fonksiyonu
function parseStatValue(str) {
  if (typeof str === "number") return { prefix: "", target: str, suffix: "" };
  const strVal = String(str || "0").trim();
  const match = strVal.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!match) return { prefix: "", target: 0, suffix: strVal };
  const prefix = match[1] || "";
  const numStr = match[2].replace(/,/g, "");
  const target = parseFloat(numStr) || 0;
  const suffix = match[3] || "";
  return { prefix, target, suffix };
}

// Sayı Animasyon Bileşeni
function AnimatedNumber({ rawValue, isVisible }) {
  const [current, setCurrent] = useState(0);
  const { prefix, target, suffix } = parseStatValue(rawValue);

  useEffect(() => {
    if (!isVisible) {
      setCurrent(0);
      return;
    }

    let startTimestamp = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(easedProgress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, target]);

  return (
    <span>
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

// Spark Area Grafik Bileşeni
function SparkAreaChart() {
  return (
    <div className="w-full h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={COMPANY_GROWTH_DATA} margin={{ top: 1, right: 1, left: 1, bottom: 1 }}>
          <defs>
            <linearGradient id="areaGradientLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#areaGradientLight)"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Spark Bar Grafik Bileşeni
function SparkBarChart() {
  return (
    <div className="w-full h-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={EMPLOYEES_DIST_DATA} margin={{ top: 1, right: 1, left: 1, bottom: 1 }}>
          <Bar
            dataKey="value"
            fill="#2563eb"
            radius={[1.5, 1.5, 0, 0]}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Dairesel Progress Ring Bileşeni
function ProgressRing({ percentage = 70, size = 36, strokeWidth = 3.5 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-slate-100"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-[#2563eb] transition-all duration-1000 ease-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-[9px] font-bold text-slate-800">%{percentage}</span>
    </div>
  );
}

// Spark Pie/Donut Grafik Bileşeni
function SparkPieChart() {
  return (
    <div className="w-full h-8 flex justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={SECTORS_PIE_DATA}
            cx="50%"
            cy="50%"
            innerRadius={8}
            outerRadius={15}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={true}
          >
            {SECTORS_PIE_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function CompanyStatistics({ onScrollToFilter }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("firma");
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

  return (
    <section
      ref={sectionRef}
      className="my-14 w-full px-4"
    >
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm transition-shadow hover:shadow-md max-w-6xl mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* SOL TARAF: Açıklama ve Aksiyon Alanı */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left min-h-[300px]">
            <div>
              {/* Başlık */}
              <h2 className="text-2xl font-extrabold text-[#0B2545] mb-3 min-h-[64px] flex items-center transition-all duration-300">
                {statData[activeTab].title}
              </h2>

              {/* Açıklama */}
              <p className="text-slate-500 text-sm leading-relaxed mb-4 min-h-[60px] transition-all duration-300">
                {statData[activeTab].description}
              </p>

              {/* Ekstra Detaylar */}
              <div className="flex items-start gap-2 bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 mb-6 transition-all duration-300">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span className="text-xs text-slate-500 font-medium leading-relaxed">
                  {statData[activeTab].detail}
                </span>
              </div>
            </div>

            {/* Aksiyon Butonu */}
            <button
              type="button"
              onClick={onScrollToFilter}
              className="bg-[#EFF6FF] text-[#2563EB] font-bold px-8 py-2.5 rounded-full text-xs hover:bg-blue-100 transition-all cursor-pointer"
            >
              Firmalarımızı İncele
            </button>
          </div>

          {/* SAĞ TARAF: Grafikli Sayı Matrisi */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">

            {/* Metrik 1: Aktif Firma */}
            <button
              type="button"
              onClick={() => setActiveTab("firma")}
              className={`text-left w-full rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 cursor-pointer ${activeTab === "firma"
                ? "bg-[#EFF6FF] border-blue-200/80 shadow-xs"
                : "bg-slate-50/70 border-slate-100/80 hover:-translate-y-1 hover:shadow-xs"
                }`}
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-xs">
                  <Building2Icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-extrabold text-[#0B2545] mt-2">
                  <AnimatedNumber rawValue="150+" isVisible={isVisible} />
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Aktif Firma
                </div>
              </div>
              <div className="w-full mt-3 h-8 flex justify-center items-center">
                <SparkAreaChart />
              </div>
            </button>

            {/* Metrik 2: Toplam Çalışan */}
            <button
              type="button"
              onClick={() => setActiveTab("calisan")}
              className={`text-left w-full rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 cursor-pointer ${activeTab === "calisan"
                ? "bg-[#EFF6FF] border-blue-200/80 shadow-xs"
                : "bg-slate-50/70 border-slate-100/80 hover:-translate-y-1 hover:shadow-xs"
                }`}
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-xs">
                  <UsersIcon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-extrabold text-[#0B2545] mt-2">
                  <AnimatedNumber rawValue="1000+" isVisible={isVisible} />
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Toplam Çalışan
                </div>
              </div>
              <div className="w-full mt-3 h-8 flex justify-center items-center">
                <SparkBarChart />
              </div>
            </button>

            {/* Metrik 3: Ar-Ge Projesi */}
            <button
              type="button"
              onClick={() => setActiveTab("proje")}
              className={`text-left w-full rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 cursor-pointer ${activeTab === "proje"
                ? "bg-[#EFF6FF] border-blue-200/80 shadow-xs"
                : "bg-slate-50/70 border-slate-100/80 hover:-translate-y-1 hover:shadow-xs"
                }`}
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-xs">
                  <RocketIcon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-extrabold text-[#0B2545] mt-2">
                  <AnimatedNumber rawValue="250+" isVisible={isVisible} />
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Ar-Ge Projesi
                </div>
              </div>
              <div className="w-full mt-3 h-8 flex justify-center items-center">
                <ProgressRing percentage={70} />
              </div>
            </button>

            {/* Metrik 4: Sektör Dağılımı */}
            <button
              type="button"
              onClick={() => setActiveTab("sektor")}
              className={`text-left w-full rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 cursor-pointer ${activeTab === "sektor"
                ? "bg-[#EFF6FF] border-blue-200/80 shadow-xs"
                : "bg-slate-50/70 border-slate-100/80 hover:-translate-y-1 hover:shadow-xs"
                }`}
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-xs">
                  <PieChartIcon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-extrabold text-[#0B2545] mt-2">
                  <AnimatedNumber rawValue="20+" isVisible={isVisible} />
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Sektör
                </div>
              </div>
              <div className="w-full mt-3 h-8 flex justify-center items-center">
                <SparkPieChart />
              </div>
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}
