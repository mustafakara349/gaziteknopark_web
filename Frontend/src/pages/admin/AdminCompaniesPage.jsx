import { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import { Plus, Edit2, Trash2, Settings2, Layers, Building2 } from "lucide-react";
import AdminCompanyFormModal from "../../components/admin/companies/AdminCompanyFormModal";
import AdminCompanyCategoryModal from "../../components/admin/companies/AdminCompanyCategoryModal";
import AdminActivityAreaModal from "../../components/admin/companies/AdminActivityAreaModal";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activityAreas, setActivityAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCompanies();
    fetchCategories();
    fetchActivityAreas();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminAxios.get("/company-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching company categories", error);
    }
  };

  const fetchActivityAreas = async () => {
    try {
      const response = await adminAxios.get("/activity-areas");
      setActivityAreas(response.data);
    } catch (error) {
      console.error("Error fetching activity areas", error);
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setIsFormOpen(true);
  };

  const openEditModal = (id) => {
    setEditId(id);
    setIsFormOpen(true);
  };

  const handleDelete = async (company) => {
    if (!window.confirm(`"${company.name}" firmasını silmek istediğinize emin misiniz?`)) return;
    try {
      await adminAxios.delete(`/companies/${company.id}`);
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company", error);
      alert("Firma silinirken bir hata oluştu.");
    }
  };

  const findCategoryNames = (categoryIds) =>
    categoryIds
      .map((id) => {
        const cat = categories.find((c) => c.id === id);
        const tr = cat?.translations?.find((t) => t.languageId === 1) || cat?.translations?.[0];
        return tr?.name;
      })
      .filter(Boolean);

  const visibleCompanies = search
    ? companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : companies;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Firma Yönetimi</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            Teknoparkta yer alan firmaları, kategorilerini ve faaliyet alanlarını buradan yönetebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsActivityModalOpen(true)}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            Faaliyet Alanları
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Kategoriler
          </button>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Firma Ekle
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 bg-gray-50/50 border-b border-gray-100">
          <input
            type="text"
            placeholder="Firma adı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FAFC] text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium w-16">Logo</th>
                <th className="px-6 py-4 font-medium">Firma</th>
                <th className="px-6 py-4 font-medium">Kategoriler</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">Yükleniyor...</td></tr>
              ) : visibleCompanies.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Kriterlere uygun firma bulunamadı.</td></tr>
              ) : (
                visibleCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                        {company.logoUrl ? (
                          <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                        ) : (
                          <Building2 className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-xs">
                      {company.shortName || company.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                      {findCategoryNames(company.categoryIds).join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {company.status === "Aktif" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-medium">Aktif</span>
                      ) : company.status === "Mezun" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium">Mezun</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium">Pasif</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(company.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(company)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminCompanyFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editId={editId}
        categories={categories}
        activityAreas={activityAreas}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchCompanies();
        }}
      />

      <AdminCompanyCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onChanged={fetchCategories}
      />

      <AdminActivityAreaModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onChanged={fetchActivityAreas}
      />
    </div>
  );
}
