import { useState, useEffect, useRef } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Plus, Edit2, Trash2, Check, Loader2, Upload, ImageOff } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

const emptyForm = { title: "", coverImageFileId: "", isActive: true };

export default function AdminMediaAlbumModal({ isOpen, onClose, onChanged }) {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchAlbums();
      resetForm();
    }
  }, [isOpen]);

  const fetchAlbums = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/media-albums", { params: { activeOnly: false } });
      setAlbums(response.data);
    } catch (error) {
      console.error("Error fetching media albums", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEditClick = (album) => {
    const tr = album.translations?.find((t) => t.languageId === 1) || album.translations?.[0];
    setEditingId(album.id);
    setForm({ title: tr?.title || "", coverImageFileId: album.coverImageFileId || "", isActive: album.isActive });
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
      setForm((prev) => ({ ...prev, coverImageFileId: response.data.id }));
    } catch (error) {
      console.error("Error uploading cover image", error);
      alert("Görsel yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setIsLoading(true);
    try {
      const payload = {
        coverImageFileId: form.coverImageFileId ? Number(form.coverImageFileId) : null,
        isActive: form.isActive,
        translations: [{ languageId: 1, title: form.title }],
      };
      if (editingId) {
        await adminAxios.put(`/media-albums/${editingId}`, payload);
      } else {
        await adminAxios.post("/media-albums", payload);
      }
      await fetchAlbums();
      resetForm();
      onChanged?.();
    } catch (error) {
      console.error("Error saving media album", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu albümü silmek istediğinize emin misiniz?")) return;
    setIsLoading(true);
    try {
      await adminAxios.delete(`/media-albums/${id}`);
      await fetchAlbums();
      onChanged?.();
    } catch (error) {
      console.error("Error deleting media album", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Albüm Yönetimi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              {editingId ? "Albümü Düzenle" : "Yeni Albüm Ekle"}
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-white flex items-center justify-center">
                {form.coverImageFileId ? (
                  <img src={`${baseUrl}/api/files/${form.coverImageFileId}`} alt="Kapak" className="w-full h-full object-cover" />
                ) : (
                  <ImageOff className="w-4 h-4 text-gray-300" />
                )}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" id="albumCoverUpload" />
              <label
                htmlFor="albumCoverUpload"
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Kapak Yükle
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Albüm başlığı"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center gap-1.5 text-xs text-gray-600 px-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded" />
                Aktif
              </label>
              <button
                onClick={handleSave}
                disabled={isLoading || !form.title.trim()}
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
                  <th className="px-4 py-3">Albüm</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading && albums.length === 0 ? (
                  <tr><td colSpan="3" className="px-4 py-8 text-center text-gray-500">Yükleniyor...</td></tr>
                ) : albums.length === 0 ? (
                  <tr><td colSpan="3" className="px-4 py-8 text-center text-gray-500">Henüz albüm bulunmuyor.</td></tr>
                ) : (
                  albums.map((album) => {
                    const tr = album.translations?.find((t) => t.languageId === 1) || album.translations?.[0];
                    return (
                      <tr key={album.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{tr?.title}</td>
                        <td className="px-4 py-3">
                          {album.isActive ? (
                            <span className="text-xs text-green-600 font-medium">Aktif</span>
                          ) : (
                            <span className="text-xs text-gray-400 font-medium">Pasif</span>
                          )}
                        </td>
                        <td className="px-4 py-3 flex justify-end gap-2">
                          <button onClick={() => handleEditClick(album)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(album.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
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
