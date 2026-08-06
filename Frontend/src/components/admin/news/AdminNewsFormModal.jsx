import { useEffect, useState, useRef } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Save, Loader2, Upload, Trash2 } from "lucide-react";
import RichTextEditor from "../common/RichTextEditor";
import { formatContentLinks } from "../../../utils/htmlSanitizer";
import { getImageUrl } from "../../../utils/imageUrl";

export default function AdminNewsFormModal({ isOpen, onClose, onSuccess, editId, categories }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    categoryId: "",
    isActive: true,
    authorName: "",
    summary: "",
    content: "",
    publishedAt: "",
    unpublishedAt: "",
    readTime: "",
    coverImageFileId: "",
    additionalImageFileIds: []
  });
  
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [additionalImageUrls, setAdditionalImageUrls] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (editId) {
        fetchNewsDetails(editId);
      } else {
        resetForm();
      }
    }
  }, [isOpen, editId]);

  const safeFormatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const fetchNewsDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get(`/news/${id}?countView=false`);
      const data = response.data;
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        categoryId: data.categoryId || "",
        isActive: data.isActive !== undefined ? data.isActive : true,
        authorName: data.authorName || "",
        summary: data.summary || "",
        content: data.content || "",
        publishedAt: safeFormatDate(data.publishedAt),
        unpublishedAt: safeFormatDate(data.unpublishedAt),
        readTime: data.readTime || "",
        coverImageFileId: data.coverImageFileId || "",
        additionalImageFileIds: data.additionalImageFileIds || []
      });
      setCoverImageUrl(data.coverImageUrl);
      setAdditionalImageUrls(data.additionalImageUrls || []);
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
      isActive: true,
      authorName: "",
      summary: "",
      content: "",
      publishedAt: "",
      unpublishedAt: "",
      readTime: "",
      coverImageFileId: "",
      additionalImageFileIds: []
    });
    setCoverImageUrl(null);
    setAdditionalImageUrls([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    if (name === "isActive") {
      parsedValue = value === "true";
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
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
      setCoverImageUrl(fileUrl);
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

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsGalleryUploading(true);
    try {
      const newIds = [];
      const newUrls = [];
      
      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        
        const response = await adminAxios.post("/files/upload", formDataUpload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        newIds.push(response.data.id);
        newUrls.push(response.data.url);
      }
      
      setFormData(prev => ({
        ...prev,
        additionalImageFileIds: [...(prev.additionalImageFileIds || []), ...newIds]
      }));
      setAdditionalImageUrls(prev => [...prev, ...newUrls]);
    } catch (error) {
      console.error("Error uploading gallery files", error);
      alert("Galeri görselleri yüklenirken bir hata oluştu.");
    } finally {
      setIsGalleryUploading(false);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImageFileIds: (prev.additionalImageFileIds || []).filter((_, i) => i !== index)
    }));
    setAdditionalImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.isActive && formData.unpublishedAt) {
      const unpublishDate = new Date(formData.unpublishedAt);
      if (unpublishDate <= new Date()) {
        alert("Haberi tekrar aktifleştirebilmek için lütfen yayından kaldırılma tarihini kontrol ediniz.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const formattedContent = formatContentLinks(formData.content);
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        isActive: formData.isActive,
        authorName: formData.authorName ? formData.authorName.trim() : "Gazi Teknopark",
        summary: formData.summary,
        content: formattedContent,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        unpublishedAt: formData.unpublishedAt ? new Date(formData.unpublishedAt).toISOString() : null,
        readTime: formData.readTime ? parseInt(formData.readTime) : null,
        coverImageFileId: formData.coverImageFileId ? parseInt(formData.coverImageFileId) : null,
        additionalImageFileIds: formData.additionalImageFileIds || [],
        translations: [
          {
            languageId: 1, // Default TR
            title: formData.title,
            slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            summary: formData.summary,
            content: formattedContent,
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
      const serverMessage = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : null);
      alert(serverMessage || "Bir hata oluştu. Lütfen tüm zorunlu alanları kontrol edin.");
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
            
            {/* Top Row: Basic Info & Author */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
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

            {/* Second Row: Author & Status (Aktiflik) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Yazar Adı</label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Gazi Teknopark"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Aktiflik Durumu</label>
                <select
                  name="isActive"
                  value={formData.isActive.toString()}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Pasif</option>
                </select>
              </div>
            </div>

            {/* Third Row: Dates & Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden shrink-0 group">
                    <img src={getImageUrl(coverImageUrl)} alt="" className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 scale-110" />
                    <img src={getImageUrl(coverImageUrl)} alt="Kapak" className="relative w-full h-full object-contain" />
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

            {/* Gallery Upload */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Haber İçi Ekstra Görseller (Galeri)</label>
                  <p className="mt-1 text-xs text-gray-500">
                    Haber detayında gösterilecek ekstra fotoğrafları seçin. Birden fazla seçebilirsiniz.
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={galleryInputRef}
                    onChange={handleGalleryUpload}
                    className="hidden"
                    id="galleryImageUpload"
                  />
                  <label
                    htmlFor="galleryImageUpload"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {isGalleryUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isGalleryUploading ? "Yükleniyor..." : "Görsel Seç"}
                  </label>
                </div>
              </div>

              {additionalImageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {additionalImageUrls.map((url, index) => (
                    <div key={index} className="relative w-full aspect-square rounded-xl border border-gray-200 overflow-hidden group">
                      <img src={getImageUrl(url)} alt="" className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 scale-110" />
                      <img src={getImageUrl(url)} alt="Galeri" className="relative w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                        title="Görseli Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
