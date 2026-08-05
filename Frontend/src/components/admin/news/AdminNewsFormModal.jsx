import { useState, useEffect, useRef } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Save, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import RichTextEditor from "../common/RichTextEditor";

export default function AdminNewsFormModal({ isOpen, onClose, onSuccess, editId, categories }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    categoryId: "",
    status: "draft",
    summary: "",
    content: "",
    publishedAt: "",
    unpublishedAt: "",
    readTime: "",
    coverImageFileId: ""
  });
  
  const [coverImageUrl, setCoverImageUrl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (editId) {
        fetchNewsDetails(editId);
      } else {
        resetForm();
      }
    }
  }, [isOpen, editId]);

  const fetchNewsDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get(`/news/${id}`);
      const data = response.data;
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        categoryId: data.categoryId || "",
        status: data.status || "draft",
        summary: data.summary || "",
        content: data.content || "",
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : "",
        unpublishedAt: data.unpublishedAt ? new Date(data.unpublishedAt).toISOString().slice(0, 16) : "",
        readTime: data.readTime || "",
        coverImageFileId: data.coverImageFileId || ""
      });
      setCoverImageUrl(data.coverImageUrl || null);
    } catch (error) {
      console.error("Error fetching news details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      categoryId: "",
      status: "draft",
      summary: "",
      content: "",
      publishedAt: "",
      unpublishedAt: "",
      readTime: "",
      coverImageFileId: ""
    });
    setCoverImageUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    setIsUploading(true);
    try {
      const response = await adminAxios.post("/files/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const fileId = response.data.id;
      const fileUrl = response.data.url;
      setFormData(prev => ({ ...prev, coverImageFileId: fileId }));
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:5080';
      setCoverImageUrl(fileUrl.startsWith('http') ? fileUrl : `${baseUrl}${fileUrl}`);
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Dosya yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        status: formData.status,
        summary: formData.summary,
        content: formData.content,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        unpublishedAt: formData.unpublishedAt ? new Date(formData.unpublishedAt).toISOString() : null,
        readTime: formData.readTime ? parseInt(formData.readTime) : null,
        coverImageFileId: formData.coverImageFileId ? parseInt(formData.coverImageFileId) : null,
        translations: [
          {
            languageId: 1, // Default TR
            title: formData.title,
            slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            summary: formData.summary,
            content: formData.content,
          }
        ]
      };

      if (editId) {
        await adminAxios.put(`/news/${editId}`, payload);
      } else {
        await adminAxios.post("/news", payload);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving news", error);
      alert("Bir hata oluştu. Lütfen tüm zorunlu alanları kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editId ? "Haberi Düzenle" : "Yeni Haber Ekle"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="newsForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Top Row: Basic Info */}
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
                  placeholder="Haber başlığını giriniz"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Kategori *</label>
                <select
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Seçiniz</option>
                  {(categories || []).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Second Row: Status, Dates, ReadTime */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Okuma Süresi (dk)</label>
                <input
                  type="number"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Örn: 5"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Yayınlanma Tarihi</label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  value={formData.publishedAt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Kaldırılma Tarihi</label>
                <input
                  type="datetime-local"
                  name="unpublishedAt"
                  value={formData.unpublishedAt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Content area */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Özet</label>
              <textarea
                name="summary"
                rows="2"
                value={formData.summary}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Haberin kısa bir özetini giriniz"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">İçerik</label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Haber detayını buraya giriniz..."
              />
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Kapak Görseli</label>
              <div className="flex items-center gap-4">
                {coverImageUrl && (
                  <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden shrink-0">
                    <img src={coverImageUrl} alt="Kapak" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    id="coverImageUpload"
                  />
                  <label
                    htmlFor="coverImageUpload"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? "Yükleniyor..." : "Görsel Seç / Değiştir"}
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    Önerilen boyut: 1200x800px. JPG, PNG veya WEBP.
                  </p>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
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
            form="newsForm"
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
