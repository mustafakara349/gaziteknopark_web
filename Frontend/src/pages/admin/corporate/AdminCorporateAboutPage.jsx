import AdminAboutTab from "../../../components/admin/corporate/AdminAboutTab";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";

export default function AdminCorporateAboutPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/kurumsal"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
              title="Kurumsal Bilgiler Ana Sayfasına Dön"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Hakkımızda Yönetimi
            </h1>
          </div>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            Gazi Teknopark kurumsal tanıtım metnini ve vizyon/misyon bilgilerini buradan güncelleyebilirsiniz.
          </p>
        </div>
      </div>

      {/* Main Tab Component */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <AdminAboutTab />
      </div>
    </div>
  );
}
