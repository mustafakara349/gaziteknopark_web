import { useState, useEffect } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Loader2 } from "lucide-react";

const emptyForm = { name: "", email: "", password: "", roleId: "", isActive: true };

export default function AdminUserFormModal({ isOpen, onClose, editUser, roles, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setForm(
        editUser
          ? {
              name: editUser.name,
              email: editUser.email,
              password: "",
              roleId: editUser.roleId ?? "",
              isActive: editUser.isActive,
            }
          : emptyForm
      );
    }
  }, [isOpen, editUser]);

  const handleChange = (field) => (e) => {
    const value = field === "isActive" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        email: form.email,
        roleId: form.roleId ? Number(form.roleId) : null,
        isActive: form.isActive,
        ...(form.password ? { password: form.password } : {}),
      };

      if (editUser) {
        await adminAxios.put(`/admin/users/${editUser.id}`, payload);
      } else {
        await adminAxios.post("/admin/users", { ...payload, password: form.password });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data ?? "Kullanıcı kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editUser ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ad Soyad</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={handleChange("name")}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">E-posta</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange("email")}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              {editUser ? "Yeni Şifre (opsiyonel)" : "Şifre"}
            </label>
            <input
              type="password"
              required={!editUser}
              minLength={6}
              placeholder={editUser ? "Değiştirmek istemiyorsanız boş bırakın" : ""}
              value={form.password}
              onChange={handleChange("password")}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Rol</label>
            <select
              value={form.roleId}
              onChange={handleChange("roleId")}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Admin (Tam Yetki)</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isActive} onChange={handleChange("isActive")} className="rounded" />
            Hesap aktif
          </label>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
