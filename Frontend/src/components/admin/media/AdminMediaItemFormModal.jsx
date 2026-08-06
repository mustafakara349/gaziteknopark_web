import { useState, useEffect, useRef } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Save, Loader2, Upload } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

const emptyForm = {
  type: "Foto",
  title: "",
  albumId: "",
  fileId: "",
  videoUrl: "",
  publishedAt: "",
  isActive: true,
};

export default function AdminMediaItemFormModal({ isOpen, onClose, editItem, albums, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (editItem) {
        const tr = editItem.translations?.find((t) => t.languageId === 1) || editItem.translations?.[0] || {};
        setForm({
          type: editItem.type || "Foto",
          title: tr.title || "",
          albumId: editItem.albumId || "",
          fileId: editItem.fileId || "",
          videoUrl: editItem.videoUrl || "",
          publishedAt: editItem.publishedAt ? editItem.publishedAt.slice(0, 10) : "",
          isActive: editItem.isActive,
        });
        setPreviewUrl(editItem.fileId ? `${baseUrl}/api/files/${editItem.fileId}` : null);
      } else {
        setForm(emptyForm);
        setPreviewUrl(null);
      }
    }
  }, [isOpen, editItem]);

  const handleChange = (field) => (e) => {
    const value = field === "isActive" ? e.target.checked : e.target.value;
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
      setForm((prev) => ({ ...prev, fileId: response.data.id }));
      const url = response.data.url;
      setPreviewUrl(url.startsWith("http") ? url : `${baseUrl}${url}`);
    } catch (error) {
      console.error("Error uploading media file", error);
      alert("Dosya yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.type === "Foto" && !form.fileId) {
      setError("Lütfen bir fotoğraf yükleyin.");
      return;
    }
    if (form.type === "Video" && !form.videoUrl) {
      setError("Lütfen bir video bağlantısı girin.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const payload = {
        type: form.type,
        fileId: form.type === "Foto" ? Number(form.fileId) : null,
        videoUrl: form.type === "Video" ? form.videoUrl : null,
        albumId: form.albumId ? Number(form.albumId) : null,
        isActive: form.isActive,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        translations: [{ languageId: 1, title: form.title || null }],
      };

      if (editItem) {
        await adminAxios.put(`/media/${editItem.id}`, payload);
      } else {
        await adminAxios.post("/media", payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving media item", err);
      setError("Kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editItem ? "Medyayı Düzenle" : "Yeni Medya Ekle"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="mediaItemForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: "Foto" }))}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                form.type === "Foto" ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              Fotoğraf
            </button>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: "Video" }))}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                form.type === "Video" ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              Video
            </button>
          </div>

          {form.type === "Foto" ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fotoğraf *</label>
              <div className="flex items-center gap-4">
                {previewUrl && (
                  <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden shrink-0">
                    <img src={previewUrl} alt="Önizleme" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" id="mediaFileUpload" />
                  <label
                    htmlFor="mediaFileUpload"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? "Yükleniyor..." : "Görsel Seç"}
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Video Bağlantısı (YouTube vb.) *</label>
              <input
                type="text"
                value={form.videoUrl}
                onChange={handleChange("videoUrl")}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Başlık</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Albüm</label>
              <select
                value={form.albumId}
                onChange={handleChange("albumId")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Albümsüz</option>
                {albums.map((album) => {
                  const tr = album.translations?.find((t) => t.languageId === 1) || album.translations?.[0];
                  return <option key={album.id} value={album.id}>{tr?.title}</option>;
                })}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Yayın Tarihi</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={handleChange("publishedAt")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isActive} onChange={handleChange("isActive")} className="rounded" />
            Sitede yayında
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors">
            İptal
          </button>
          <button
            type="submit"
            form="mediaItemForm"
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
