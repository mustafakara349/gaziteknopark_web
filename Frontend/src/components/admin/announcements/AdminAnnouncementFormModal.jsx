import { useEffect, useState, useRef } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Save, Loader2, Upload, Trash2, FileText, Link, Check } from "lucide-react";
import RichTextEditor from "../../admin/common/RichTextEditor";
import { formatContentLinks } from "../../../utils/htmlSanitizer";
import { getImageUrl } from "../../../utils/imageUrl";

export default function AdminAnnouncementFormModal({ isOpen, onClose, onSuccess, editId, categories }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAttachmentUploading, setIsAttachmentUploading] = useState(false);
  const fileInputRef = useRef(null);
  const attachmentInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    categoryId: "",
    isActive: true,
    isPinned: false,
    summary: "",
    content: "",
    publishedAt: "",
    unpublishedAt: "",
    actionUrl: "",
    actionLabel: "",
    coverImageFileId: "",
    attachmentFileIds: []
  });
  
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [attachments, setAttachments] = useState([]); // [{ id, fileName, fileUrl }]

  useEffect(() => {
    if (isOpen) {
      if (editId) {
        fetchAnnouncementDetails(editId);
      } else {
        resetForm();
      }
    }
  }, [isOpen, editId]);

  const safeFormatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const formattedInput = dateStr.endsWith("Z") || dateStr.includes("+") ? dateStr : dateStr + "Z";
      const d = new Date(formattedInput);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  const fetchAnnouncementDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get(`/announcements/${id}`);
      const data = response.data;
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        categoryId: data.categoryId || "",
        isActive: data.isActive !== undefined ? data.isActive : true,
        isPinned: data.isPinned || false,
        summary: data.summary || "",
        content: data.content || "",
        publishedAt: safeFormatDate(data.publishedAt),
        unpublishedAt: safeFormatDate(data.unpublishedAt),
        actionUrl: data.actionUrl || "",
        actionLabel: data.actionLabel || "",
        coverImageFileId: data.coverImageFileId || "",
        attachmentFileIds: data.attachments?.map(a => a.fileId) || []
      });
      setCoverImageUrl(data.coverImageUrl);
      setAttachments(data.attachments?.map(a => ({
        id: a.fileId,
        fileName: a.fileName,
        fileUrl: a.fileUrl
      })) || []);
    } catch (error) {
      console.error("Error fetching announcement details", error);
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
      isPinned: false,
      summary: "",
      content: "",
      publishedAt: "",
      unpublishedAt: "",
      actionUrl: "",
      actionLabel: "",
      coverImageFileId: "",
      attachmentFileIds: []
    });
    setCoverImageUrl(null);
    setAttachments([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let parsedValue = type === "checkbox" ? checked : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleCoverUpload = async (e) => {
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
      console.error("Error uploading cover image", error);
      alert("Kapak görseli yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveCoverImage = () => {
    setFormData(prev => ({ ...prev, coverImageFileId: "" }));
    setCoverImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAttachmentUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsAttachmentUploading(true);
    try {
      const newAttachments = [];
      
      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        
        const response = await adminAxios.post("/files/upload", formDataUpload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        newAttachments.push({
          id: response.data.id,
          fileName: response.data.originalName || file.name,
          fileUrl: response.data.url
        });
      }
      
      setFormData(prev => ({
        ...prev,
        attachmentFileIds: [...(prev.attachmentFileIds || []), ...newAttachments.map(a => a.id)]
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    } catch (error) {
      console.error("Error uploading attachments", error);
      alert("Dosyalar yüklenirken bir hata oluştu.");
    } finally {
      setIsAttachmentUploading(false);
      if (attachmentInputRef.current) attachmentInputRef.current.value = "";
    }
  };

  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachmentFileIds: (prev.attachmentFileIds || []).filter((_, i) => i !== index)
    }));
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.isActive && formData.unpublishedAt && new Date(formData.unpublishedAt) <= new Date()) {
      alert("Duyuruyu tekrar aktifleştirebilmek için lütfen yayından kaldırılma tarihini kontrol ediniz.");
      return;
    }

    setIsLoading(true);
    try {
      const formattedContent = formatContentLinks(formData.content);
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        status: "Published", // Geriye dönük uyumluluk için, artık pasif
        isActive: formData.isActive,
        isPinned: formData.isPinned,
        summary: formData.summary,
        content: formattedContent,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        unpublishedAt: formData.unpublishedAt ? new Date(formData.unpublishedAt).toISOString() : null,
        actionUrl: formData.actionUrl,
        actionLabel: formData.actionLabel,
        coverImageFileId: formData.coverImageFileId ? parseInt(formData.coverImageFileId) : null,
        attachmentFileIds: formData.attachmentFileIds || [],
        translations: [
          {
            languageId: 1, // Default TR
            title: formData.title,
            slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            summary: formData.summary,
            content: formattedContent,
            actionLabel: formData.actionLabel
          }
        ]
      };

      if (editId) {
        await adminAxios.put(`/announcements/${editId}`, payload);
      } else {
        await adminAxios.post("/announcements", payload);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving announcement", error);
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
            {editId ? "Duyuruyu Düzenle" : "Yeni Duyuru Ekle"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="announcementForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Top Row: Basic Info & Category */}
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
                  placeholder="Duyuru başlığını giriniz"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Genel (Kategorisiz)</option>
                  {(categories || []).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Second Row: Date & Active & Pin */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <label className="block text-sm font-medium text-gray-700">Yayından Kaldırılma</label>
                <input
                  type="datetime-local"
                  name="unpublishedAt"
                  value={formData.unpublishedAt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2 flex flex-col justify-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded-md group-hover:border-blue-500 transition-colors">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                    />
                    {formData.isActive && <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    Aktif
                  </span>
                </label>
              </div>

              <div className="space-y-2 flex flex-col justify-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded-md group-hover:border-blue-500 transition-colors">
                    <input
                      type="checkbox"
                      name="isPinned"
                      checked={formData.isPinned}
                      onChange={handleInputChange}
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                    />
                    {formData.isPinned && <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    Önemli / Üste Sabitle
                  </span>
                </label>
              </div>
            </div>

            {/* CTA Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Aksiyon Buton Metni</label>
                <input
                  type="text"
                  name="actionLabel"
                  value={formData.actionLabel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Örn: Başvur, Hemen İncele"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Aksiyon URL (Link)</label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="actionUrl"
                    value={formData.actionUrl}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="https://..."
                  />
                </div>
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
                placeholder="Duyurunun kısa bir özetini giriniz"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">İçerik</label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Duyuru detayını buraya giriniz..."
              />
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Kapak Görseli (Opsiyonel)</label>
              <div className="flex items-center gap-4">
                {coverImageUrl && (
                  <div className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden shrink-0 group">
                    <img src={getImageUrl(coverImageUrl)} alt="" className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 scale-110" />
                    <img src={getImageUrl(coverImageUrl)} alt="Kapak" className="relative w-full h-full object-contain" />
                  </div>
                )}
                
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleCoverUpload}
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

                  {coverImageUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveCoverImage}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Görseli Kaldır
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Önerilen boyut: 1200x800px. JPG, PNG veya WEBP.
              </p>
            </div>

            {/* Attachments Upload */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ek Dosyalar / Belgeler</label>
                  <p className="mt-1 text-xs text-gray-500">
                    Kullanıcıların indirebileceği PDF, Word vb. belgeleri buraya yükleyebilirsiniz.
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    multiple
                    ref={attachmentInputRef}
                    onChange={handleAttachmentUpload}
                    className="hidden"
                    id="attachmentUpload"
                  />
                  <label
                    htmlFor="attachmentUpload"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {isAttachmentUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isAttachmentUploading ? "Yükleniyor..." : "Dosya Ekle"}
                  </label>
                </div>
              </div>

              {attachments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium text-gray-900 truncate" title={file.fileName}>{file.fileName}</p>
                          <a href={getImageUrl(file.fileUrl)} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                            Görüntüle
                          </a>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        title="Dosyayı Sil"
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
            form="announcementForm"
            disabled={isLoading || isUploading || isAttachmentUploading}
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
