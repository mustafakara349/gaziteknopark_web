import { Link } from "react-router-dom";
import {
  Building2,
  Briefcase,
  Users,
  FileText,
  Rocket,
  HelpCircle,
  ArrowRight
} from "lucide-react";

const corporateCards = [
  {
    title: "Hakkımızda",
    description: "Kurum vizyonu, misyonu ve kurumsal tanıtım metinlerinin yönetimi.",
    icon: Building2,
    path: "/admin/kurumsal/hakkimizda",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    title: "Hizmet ve İmkanlarımız",
    description: "Teknopark bünyesinde sunulan Ar-Ge altyapı, hizmet ve imkanların yönetimi.",
    icon: Briefcase,
    path: "/admin/kurumsal/hizmetlerimiz",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    title: "Yönetim ve Ekip",
    description: "Yönetim kurulu üyeleri, birim yöneticileri ve organizasyon şeması yönetimi.",
    icon: Users,
    path: "/admin/kurumsal/yonetim-ve-ekip",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    title: "Mevzuat ve Belgeler",
    description: "Yönetmelikler, mevzuatlar ve indirilebilir belge bağlantılarının yönetimi.",
    icon: FileText,
    path: "/admin/kurumsal/mevzuat-ve-belgeler",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    title: "Girişim Ofisi",
    description: "Girişim ofisi, kuluçka merkezi ve ön kuluçka program içeriklerinin yönetimi.",
    icon: Rocket,
    path: "/admin/kurumsal/girisim-ofisi",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    title: "SSS (Sıkça Sorulan Sorular)",
    description: "Sıkça sorulan sorular ve yanıtlarının yönetimi.",
    icon: HelpCircle,
    path: "/admin/kurumsal/sss",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
];

export default function AdminCorporatePage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100/60">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Kurumsal Bilgiler Yönetimi
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Kurumsal tanıtım metinlerini, hizmetleri, ekibi, mevzuat belgelerini ve girişim ofisi sayfalarını buradan yönetebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Overview Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {corporateCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.path}
              to={card.path}
              className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xs hover:shadow-md hover:border-gray-200 transition-all p-6 sm:p-8 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl border ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="p-2 text-gray-300 group-hover:text-gray-700 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-600 group-hover:text-blue-600 transition-colors">
                <span>Sayfayı Yönet</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
