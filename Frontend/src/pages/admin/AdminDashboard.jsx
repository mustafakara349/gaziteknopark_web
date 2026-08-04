import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminAxios from "../../utils/adminAxios";
import {
  Newspaper,
  Building2,
  CalendarDays,
  Megaphone,
  Image,
  SlidersHorizontal,
  Users,
  Settings,
  RefreshCw,
  Plus,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Static weekly traffic data (mock)
const trafficData = [
  { day: "Pzt", visits: 120 },
  { day: "Sal", visits: 98 },
  { day: "Çar", visits: 145 },
  { day: "Per", visits: 210 },
  { day: "Cum", visits: 320 },
  { day: "Cmt", visits: 185 },
  { day: "Paz", visits: 95 },
];

const CustomBar = (props) => {
  const { x, y, width, height } = props;
  const radius = 8;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={radius}
      ry={radius}
      fill="#0B2558"
      opacity={0.85}
    />
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStats = async () => {
    try {
      const { data } = await adminAxios.get("/admin/dashboard/stats");
      setStats(data);
    } catch {
      // silently fail — interceptor handles auth
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await fetchStats();
    setTimeout(() => setSyncing(false), 600);
  };

  const moduleCards = [
    {
      title: "Haber Yönetimi",
      description: "En son haberleri ekleyin, güncelleyin veya yayınlananları arşivleyin.",
      icon: Newspaper,
      statLabel: "AKTİF HABER",
      statValue: stats?.news?.count ?? 0,
      path: "/admin/haberler",
    },
    {
      title: "Firma Yönetimi",
      description: "Teknopark bünyesindeki firmaların bilgilerini ve logolarını düzenleyin.",
      icon: Building2,
      statLabel: "KAYITLI FİRMA",
      statValue: stats?.companies?.count ?? 0,
      path: "/admin/firmalar",
    },
    {
      title: "Etkinlik Takvimi",
      description: "Yaklaşan konferans, seminer ve meetup etkinliklerini planlayın.",
      icon: CalendarDays,
      statLabel: "GELECEK ETKİNLİK",
      statValue: stats?.events?.count ?? 0,
      path: "/admin/etkinlikler",
    },
    {
      title: "Duyurular",
      description: "Önemli duyuruları yayınlayarak firmaları ve girişimcileri bilgilendirin.",
      icon: Megaphone,
      statLabel: "ÖNEMLİ DUYURU",
      statValue: stats?.announcements?.count ?? 0,
      path: "/admin/duyurular",
    },
    {
      title: "Medya Galerisi",
      description: "Fotoğraf ve video içeriklerini, albümleri ve dökümanları organize edin.",
      icon: Image,
      statLabel: stats?.media?.storageLabel ?? "DEPOLAMA",
      statValue: stats?.media?.count ?? 0,
      path: "/admin/medya",
    },
    {
      title: "Vitrin Yönetimi",
      description: "Anasayfa slider görsellerini, manşet yazılarını ve butonları düzenleyin.",
      icon: SlidersHorizontal,
      statLabel: "AKTİF SLAYT",
      statValue: stats?.sliders?.count ?? 0,
      path: "/admin/anasayfa",
    },
    {
      title: "Admin Yönetimi",
      description: "Panel erişimine sahip yöneticileri ve yetki seviyelerini belirleyin.",
      icon: Users,
      statLabel: "YETKİLİ KULLANICI",
      statValue: stats?.adminUsers?.count ?? 0,
      path: "/admin/kullanicilar",
    },
    {
      title: "Genel Ayarlar",
      description: "Sistem tercihlerini, iletişim bilgilerini ve KVKK metinlerini güncelleyin.",
      icon: Settings,
      statLabel: "SON GÜNCELLEME",
      statValue: "DÜN",
      path: "/admin/ayarlar",
      isDashed: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#0B2558] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gazi Teknopark dijital varlıklarını buradan yönetebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium
                       text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            Veri Eşitle
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0B2558] rounded-xl text-sm font-medium
                       text-white hover:bg-[#0a1f48] active:scale-[0.98] transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yeni İçerik
          </button>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {moduleCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-white rounded-2xl p-5 flex flex-col justify-between transition-all duration-200
                hover:shadow-lg hover:-translate-y-0.5 group
                ${card.isDashed ? "border-2 border-dashed border-gray-300" : "border border-gray-100 shadow-sm"}`}
            >
              {/* Icon */}
              <div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#0B2558]/5 transition">
                  <Icon className="w-5 h-5 text-[#0B2558]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom Stats + Button */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div>
                  <span className="text-sm font-bold text-[#0B2558]">
                    {card.statValue}{" "}
                  </span>
                  <span className="text-[10px] font-semibold text-[#0B2558]/60 uppercase tracking-wider">
                    {card.statLabel}
                  </span>
                </div>
                <button
                  onClick={() => navigate(card.path)}
                  className="px-4 py-1.5 bg-[#0B2558] text-white text-xs font-semibold rounded-lg
                             hover:bg-[#0a1f48] active:scale-95 transition"
                >
                  Yönet
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Traffic Chart + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Web Sitesi Trafik Özeti
            </h2>
            <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
              Son 7 Gün
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} barCategoryGap="25%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B2558",
                    border: "none",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "12px",
                    padding: "8px 14px",
                  }}
                  itemStyle={{ color: "white" }}
                  cursor={{ fill: "rgba(11,37,88,0.05)" }}
                  formatter={(value) => [`${value} ziyaret`, "Trafik"]}
                />
                <Bar
                  dataKey="visits"
                  shape={<CustomBar />}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-[#0B2558] rounded-2xl p-6 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-1">Hızlı İstatistik</h2>
            <p className="text-blue-200/70 text-sm mb-6">
              Sistem genelindeki güncel firma ve kullanıcı durumları.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-sm text-blue-100/80">Aktif Firma</span>
                <span className="text-2xl font-bold">
                  {stats?.companies?.count ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-sm text-blue-100/80">Yeni Başvuru</span>
                <span className="text-2xl font-bold">
                  {stats?.applications?.count ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-blue-100/80">Sistem Sağlığı</span>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  {stats?.systemHealth ?? "Kararlı"}
                </span>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full py-2.5 bg-white text-[#0B2558] rounded-xl text-sm font-semibold
                             hover:bg-blue-50 active:scale-[0.98] transition flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Raporu İndir
          </button>
        </div>
      </div>
    </div>
  );
}
