import { useState, useEffect } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Plus, Edit2, Trash2, Check, Loader2 } from "lucide-react";

export default function AdminCompanyCategoryModal({ isOpen, onClose, onChanged }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0F172A");

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      resetForm();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/company-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching company categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setColor("#0F172A");
  };

  const handleEditClick = (cat) => {
    const tr = cat.translations?.find((t) => t.languageId === 1) || cat.translations?.[0];
    setEditingId(cat.id);
    setName(tr?.name || "");
    setColor(cat.color || "#0F172A");
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      const payload = { color, translations: [{ languageId: 1, name }] };
      if (editingId) {
        await adminAxios.put(`/company-categories/${editingId}`, payload);
      } else {
        await adminAxios.post("/company-categories", payload);
      }
      await fetchCategories();
      resetForm();
      onChanged?.();
    } catch (error) {
      console.error("Error saving company category", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    setIsLoading(true);
    try {
      await adminAxios.delete(`/company-categories/${id}`);
      await fetchCategories();
      onChanged?.();
    } catch (error) {
      console.error("Error deleting company category", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Firma Kategorileri</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              {editingId ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
            </h3>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer shrink-0"
              />
              <input
                type="text"
                placeholder="Kategori adı (ör. Yazılım)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSave}
                disabled={isLoading || !name.trim()}
                className="px-4 bg-[#0F172A] hover:bg-[#1E293B] text-white flex items-center justify-center rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
              </button>
              {editingId && (
                <button onClick={resetForm} className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-4 py-3">Kategori Adı</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading && categories.length === 0 ? (
                  <tr><td colSpan="2" className="px-4 py-8 text-center text-gray-500">Yükleniyor...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan="2" className="px-4 py-8 text-center text-gray-500">Henüz kategori bulunmuyor.</td></tr>
                ) : (
                  categories.map((cat) => {
                    const tr = cat.translations?.find((t) => t.languageId === 1) || cat.translations?.[0];
                    return (
                      <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color || "#999" }} />
                          {tr?.name}
                        </td>
                        <td className="px-4 py-3 flex justify-end gap-2">
                          <button onClick={() => handleEditClick(cat)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
