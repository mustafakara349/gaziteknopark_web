import { useState, useEffect } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Plus, Edit2, Trash2, Check, Loader2 } from "lucide-react";

export default function AdminRoleModal({ isOpen, onClose, onChanged }) {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      resetForm();
    }
  }, [isOpen]);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/admin/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setError("");
  };

  const handleEditClick = (role) => {
    setEditingId(role.id);
    setName(role.name);
    setError("");
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      if (editingId) {
        await adminAxios.put(`/admin/roles/${editingId}`, { name });
      } else {
        await adminAxios.post("/admin/roles", { name });
      }
      await fetchRoles();
      resetForm();
      onChanged?.();
    } catch (err) {
      setError(err.response?.data ?? "Rol kaydedilirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu rolü silmek istediğinize emin misiniz?")) return;
    setIsLoading(true);
    try {
      await adminAxios.delete(`/admin/roles/${id}`);
      await fetchRoles();
      onChanged?.();
    } catch (err) {
      alert(err.response?.data ?? "Rol silinirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Rol Yönetimi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              {editingId ? "Rolü Düzenle" : "Yeni Rol Ekle"}
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Rol adı (ör. Editör)"
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
                <button
                  onClick={resetForm}
                  className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-4 py-3">Rol Adı</th>
                  <th className="px-4 py-3">Kullanıcı Sayısı</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading && roles.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500">Yükleniyor...</td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500">Henüz rol bulunmuyor.</td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{role.name}</td>
                      <td className="px-4 py-3 text-gray-400">{role.userCount}</td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(role)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(role.id)}
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
          <p className="text-xs text-gray-400">
            "Admin" rolü sistemde varsayılan olarak tanımlıdır ve tam yetkiye sahiptir (kullanıcı ataması
            gerekmez). Şu anda yalnızca tam olarak <span className="font-mono font-semibold text-gray-600">Editor</span> (İngilizce
            yazımla) adlı rol, sistemde içerik yönetimi (haber, duyuru, etkinlik, firma vb.) yetkisi taşıyor —
            bu rolü oluşturup kullanıcılara atayarak onları kullanıcı/ayar yönetimine giremeyen ama içerik
            düzenleyebilen bir "editör" hesabına dönüştürebilirsiniz. Farklı bir isimle oluşturduğunuz roller
            şu an sadece panele giriş hakkı verir, içerik yetkisi taşımaz.
          </p>
        </div>
      </div>
    </div>
  );
}
