import { useState, useEffect, useRef } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Save, Loader2, Upload } from "lucide-react";

const emptyForm = {
  badge: "",
  title: "",
  description: "",
  buttonText: "",
  linkUrl: "",
  secondaryButtonText: "",
  secondaryButtonUrl: "",
  orderNo: 0,
  isActive: true,
  imageFileId: "",
};

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

export default function AdminSliderFormModal({ isOpen, onClose, editSlider, nextOrderNo, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (editSlider) {
        const tr = editSlider.translations?.find((t) => t.languageId === 1) || editSlider.translations?.[0] || {};
        setForm({
          badge: tr.badge || "",
          title: tr.title || "",
          description: tr.description || "",
          buttonText: tr.buttonText || "",
          linkUrl: editSlider.linkUrl || "",
          secondaryButtonText: tr.secondaryButtonText || "",
          secondaryButtonUrl: editSlider.secondaryButtonUrl || "",
          orderNo: editSlider.orderNo ?? 0,
          isActive: editSlider.isActive,
          imageFileId: editSlider.imageFileId || "",
        });
        setImageUrl(editSlider.imageFileId ? `${baseUrl}/api/files/${editSlider.imageFileId}` : null);
      } else {
        setForm({ ...emptyForm, orderNo: nextOrderNo ?? 0 });
        setImageUrl(null);
      }
    }
  }, [isOpen, editSlider, nextOrderNo]);

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
      setForm((prev) => ({ ...prev, imageFileId: response.data.id }));
      const url = response.data.url;
      setImageUrl(url.startsWith("http") ? url : `${baseUrl}${url}`);
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Görsel yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageFileId) {
      setError("Lütfen bir görsel yükleyin.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const payload = {
        imageFileId: Number(form.imageFileId),
        linkUrl: form.linkUrl || null,
        secondaryButtonUrl: form.secondaryButtonUrl || null,
        orderNo: Number(form.orderNo) || 0,
        isActive: form.isActive,
        translations: [
          {
            languageId: 1,
            badge: form.badge || null,
            title: form.title || null,
            description: form.description || null,
            buttonText: form.buttonText || null,
            secondaryButtonText: form.secondaryButtonText || null,
          },
        ],
      };

      if (editSlider) {
        await adminAxios.put(`/sliders/${editSlider.id}`, payload);
      } else {
        await adminAxios.post("/sliders", payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving slider", err);
      setError("Slayt kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editSlider ? "Slaytı Düzenle" : "Yeni Slayt Ekle"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="sliderForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Görsel *</label>
            <div className="flex items-center gap-4">
              {imageUrl && (
                <div className="w-32 h-20 rounded-xl border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                  <img src={imageUrl} alt="Slayt" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="sliderImageUpload"
                />
                <label
                  htmlFor="sliderImageUpload"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploading ? "Yükleniyor..." : "Görsel Seç / Değiştir"}
                </label>
                <p className="mt-2 text-xs text-gray-500">Önerilen boyut: 1920x1080px (geniş).</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rozet (küçük üst etiket)</label>
            <input
              type="text"
              value={form.badge}
              onChange={handleChange("badge")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Örn: GİRİŞİMCİLİK VE AR-GE"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Başlık</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Slayt başlığı (boş bırakılırsa sadece görsel gösterilir)"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Açıklama</label>
            <textarea
              rows="2"
              value={form.description}
              onChange={handleChange("description")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Buton Metni</label>
              <input
                type="text"
                value={form.buttonText}
                onChange={handleChange("buttonText")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Örn: Detaylı Bilgi"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bağlantı (URL)</label>
              <input
                type="text"
                value={form.linkUrl}
                onChange={handleChange("linkUrl")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="/duyurular veya https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">İkinci Buton Metni</label>
              <input
                type="text"
                value={form.secondaryButtonText}
                onChange={handleChange("secondaryButtonText")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Örn: Hizmetlerimizi İnceleyin"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">İkinci Buton Bağlantısı</label>
              <input
                type="text"
                value={form.secondaryButtonUrl}
                onChange={handleChange("secondaryButtonUrl")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="/kurumsal/hizmetlerimiz"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sıra No</label>
              <input
                type="number"
                value={form.orderNo}
                onChange={handleChange("orderNo")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 pb-2.5">
              <input type="checkbox" checked={form.isActive} onChange={handleChange("isActive")} className="rounded" />
              Sitede yayında
            </label>
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
            form="sliderForm"
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
