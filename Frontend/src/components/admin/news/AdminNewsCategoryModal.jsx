import { useState, useEffect } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Plus, Edit2, Trash2, Check, Loader2 } from "lucide-react";

export default function AdminNewsCategoryModal({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form states for new/edit
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [orderNo, setOrderNo] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      resetForm();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/news-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setOrderNo(0);
  };

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug || "");
    setOrderNo(cat.orderNo);
  };

  const handleSave = async () => {
    if (!name) return;
    
    // Check for duplicate orderNo
    const isDuplicateOrder = categories.some(
      (cat) => cat.orderNo === orderNo && cat.id !== editingId
    );
    if (isDuplicateOrder) {
      alert("Bu sıra numarası (orderNo) zaten mevcut. Lütfen başka bir sıra numarası giriniz.");
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = {
        name,
        slug,
        orderNo,
        translations: [
          {
            languageId: 1, // Default TR
            name
          }
        ]
      };

      if (editingId) {
        await adminAxios.put(`/news-categories/${editingId}`, payload);
      } else {
        await adminAxios.post("/news-categories", payload);
      }
      
      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Error saving category", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

    setIsLoading(true);
    try {
      await adminAxios.delete(`/news-categories/${id}`);
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Kategori Yönetimi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add / Edit Form */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">
              {editingId ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Kategori Adı"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Slug (Opsiyonel)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  placeholder="Sıra"
                  value={orderNo}
                  onChange={(e) => setOrderNo(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading || !name}
                  className="flex-1 bg-[#0F172A] hover:bg-[#1E293B] text-white flex items-center justify-center rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                </button>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-4 py-3">Sıra</th>
                  <th className="px-4 py-3">Kategori Adı</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading && categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      Yükleniyor...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      Henüz kategori bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">{cat.orderNo}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                      <td className="px-4 py-3 text-gray-400">{cat.slug || '-'}</td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
