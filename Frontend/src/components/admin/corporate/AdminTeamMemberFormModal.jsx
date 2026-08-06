import { useState, useEffect, useRef } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Save, Loader2, Upload } from "lucide-react";

const emptyForm = {
  fullName: "",
  title: "",
  bio: "",
  email: "",
  linkedinUrl: "",
  parentId: "",
  isUnit: false,
  orderNo: 0,
  status: "published",
  photoFileId: "",
};

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

export default function AdminTeamMemberFormModal({ isOpen, onClose, editMember, members, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (editMember) {
        const tr = editMember.translations?.find((t) => t.languageId === 1) || editMember.translations?.[0] || {};
        setForm({
          fullName: editMember.fullName || "",
          title: tr.title || "",
          bio: tr.bio || "",
          email: editMember.email || "",
          linkedinUrl: editMember.linkedinUrl || "",
          parentId: editMember.parentId || "",
          isUnit: editMember.isUnit,
          orderNo: editMember.orderNo ?? 0,
          status: (editMember.status || "published").toLowerCase(),
          photoFileId: editMember.photoFileId || "",
        });
        setPhotoUrl(editMember.photoFileId ? `${baseUrl}/api/files/${editMember.photoFileId}` : null);
      } else {
        setForm(emptyForm);
        setPhotoUrl(null);
      }
    }
  }, [isOpen, editMember]);

  const handleChange = (field) => (e) => {
    const value = field === "isUnit" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    try {
      const response = await adminAxios.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, photoFileId: response.data.id }));
      const url = response.data.url;
      setPhotoUrl(url.startsWith("http") ? url : `${baseUrl}${url}`);
    } catch (error) {
      console.error("Error uploading photo", error);
      alert("Fotoğraf yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const payload = {
        fullName: form.fullName,
        photoFileId: form.photoFileId ? Number(form.photoFileId) : null,
        email: form.email || null,
        linkedinUrl: form.linkedinUrl || null,
        orderNo: Number(form.orderNo) || 0,
        parentId: form.parentId ? Number(form.parentId) : null,
        isUnit: form.isUnit,
        status: form.status,
        translations: [{ languageId: 1, title: form.title || null, bio: form.bio || null }],
      };

      if (editMember) {
        await adminAxios.put(`/team-members/${editMember.id}`, payload);
      } else {
        await adminAxios.post("/team-members", payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving team member", err);
      setError(err.response?.data ?? "Kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const selectableParents = members.filter((m) => m.id !== editMember?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editMember ? "Kişi/Birimi Düzenle" : "Yeni Kişi/Birim Ekle"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="teamMemberForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
              {photoUrl ? (
                <img src={photoUrl} alt="Fotoğraf" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400">Foto</span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                id="memberPhotoUpload"
              />
              <label
                htmlFor="memberPhotoUpload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? "Yükleniyor..." : "Fotoğraf Yükle"}
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isUnit} onChange={handleChange("isUnit")} className="rounded" />
            Bu bir birim/departman (kişi değil)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {form.isUnit ? "Birim Adı *" : "Ad Soyad *"}
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={handleChange("fullName")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Unvan</label>
              <input
                type="text"
                value={form.title}
                onChange={handleChange("title")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Örn: Genel Müdür"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">E-posta</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
              <input
                type="text"
                value={form.linkedinUrl}
                onChange={handleChange("linkedinUrl")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Kısa Biyografi</label>
            <textarea
              rows="3"
              value={form.bio}
              onChange={handleChange("bio")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Üst Birim/Kişi</label>
              <select
                value={form.parentId}
                onChange={handleChange("parentId")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Yok (En üst seviye)</option>
                {selectableParents.map((m) => (
                  <option key={m.id} value={m.id}>{m.fullName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sıra No</label>
              <input
                type="number"
                value={form.orderNo}
                onChange={handleChange("orderNo")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Durum</label>
              <select
                value={form.status}
                onChange={handleChange("status")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            form="teamMemberForm"
            disabled={isSaving || isUploading}
            className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
