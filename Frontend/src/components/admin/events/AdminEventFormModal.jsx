import { useState, useEffect, useRef } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Save, Loader2, Upload } from "lucide-react";
import RichTextEditor from "../common/RichTextEditor";

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

const emptyForm = {
  title: "",
  slug: "",
  location: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "draft",
  coverImageFileId: "",
};

export default function AdminEventFormModal({ isOpen, onClose, onSuccess, editId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(emptyForm);
  const [coverImageUrl, setCoverImageUrl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (editId) {
        fetchDetails(editId);
      } else {
        resetForm();
      }
    }
  }, [isOpen, editId]);

  const fetchDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get(`/events/${id}`);
      const data = response.data;
      const tr = data.translations?.find((t) => t.languageId === 1) || data.translations?.[0] || {};
      setFormData({
        title: tr.title || "",
        slug: tr.slug || "",
        location: tr.location || "",
        description: tr.description || "",
        startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : "",
        endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : "",
        status: (data.status || "draft").toLowerCase(),
        coverImageFileId: data.coverImageFileId || "",
      });
      setCoverImageUrl(data.coverImageFileId ? `${baseUrl}/api/files/${data.coverImageFileId}` : null);
    } catch (error) {
      console.error("Error fetching event details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setCoverImageUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    setIsUploading(true);
    try {
      const response = await adminAxios.post("/files/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, coverImageFileId: response.data.id }));
      const fileUrl = response.data.url;
      setCoverImageUrl(fileUrl.startsWith("http") ? fileUrl : `${baseUrl}${fileUrl}`);
    } catch (error) {
      console.error("Error uploading cover image", error);
      alert("Görsel yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const slug = formData.slug || formData.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      const payload = {
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        coverImageFileId: formData.coverImageFileId ? parseInt(formData.coverImageFileId) : null,
        status: formData.status,
        translations: [
          {
            languageId: 1,
            title: formData.title,
            slug,
            location: formData.location || null,
            description: formData.description || null,
          },
        ],
      };

      if (editId) {
        await adminAxios.put(`/events/${editId}`, payload);
      } else {
        await adminAxios.post("/events", payload);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving event", error);
      alert("Bir hata oluştu. Lütfen tüm zorunlu alanları kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editId ? "Etkinliği Düzenle" : "Yeni Etkinlik Ekle"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="eventForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Başlık *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Konum</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Örn: Gazi Teknopark Konferans Salonu"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Durum</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                  <option value="archived">Arşiv</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Açıklama</label>
              <RichTextEditor value={formData.description} onChange={handleDescriptionChange} placeholder="Etkinlik detayını buraya giriniz..." />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Kapak Görseli (Afiş)</label>
              <div className="flex items-center gap-4">
                {coverImageUrl && (
                  <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden shrink-0">
                    <img src={coverImageUrl} alt="Kapak" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" id="eventCoverUpload" />
                  <label
                    htmlFor="eventCoverUpload"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? "Yükleniyor..." : "Görsel Seç / Değiştir"}
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors">
            İptal
          </button>
          <button
            type="submit"
            form="eventForm"
            disabled={isLoading || isUploading}
            className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
