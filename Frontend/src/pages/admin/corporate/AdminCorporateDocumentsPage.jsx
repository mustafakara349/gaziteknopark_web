import { Link } from "react-router-dom";
import { ArrowLeft, FileText, FolderOpen } from "lucide-react";

export default function AdminCorporateDocumentsPage() {
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
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Mevzuat ve Belgeler
            </h1>
          </div>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            Kurumsal mevzuat metinleri, yönetmelikler ve indirilebilir belge bağlantılarını buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      {/* Default Module View */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <FolderOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Mevzuat ve Belgeler Modülü
        </h3>
        <p className="text-gray-500 text-sm max-w-md">
          Bu sayfa varsayılan mevzuat ve belgeler yönetim ekranıdır. İçerikler eklendiğinde burada listelenecektir.
        </p>
      </div>
    </div>
  );
}
