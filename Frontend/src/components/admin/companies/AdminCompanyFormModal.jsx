import { useState, useEffect, useRef } from "react";
import adminAxios from "../../../utils/adminAxios";
import { X, Save, Loader2, Upload } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

const emptyForm = {
  name: "",
  shortName: "",
  logoFileId: "",
  website: "",
  email: "",
  phone: "",
  address: "",
  foundedYear: "",
  employeeCount: "",
  officeNo: "",
  facebookUrl: "",
  instagramUrl: "",
  xUrl: "",
  linkedInUrl: "",
  youtubeUrl: "",
  status: "aktif",
  description: "",
  categoryIds: [],
  activityAreaIds: [],
};

export default function AdminCompanyFormModal({ isOpen, onClose, onSuccess, editId, categories, activityAreas }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(emptyForm);
  const [logoUrl, setLogoUrl] = useState(null);

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
      const response = await adminAxios.get(`/companies/${id}`);
      const data = response.data;
      const tr = data.translations?.find((t) => t.languageId === 1) || data.translations?.[0] || {};
      setFormData({
        name: data.name || "",
        shortName: data.shortName || "",
        logoFileId: data.logoFileId || "",
        website: data.website || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        foundedYear: data.foundedYear || "",
        employeeCount: data.employeeCount || "",
        officeNo: data.officeNo || "",
        facebookUrl: data.facebookUrl || "",
        instagramUrl: data.instagramUrl || "",
        xUrl: data.xUrl || "",
        linkedInUrl: data.linkedInUrl || "",
        youtubeUrl: data.youtubeUrl || "",
        status: (data.status || "aktif").toLowerCase(),
        description: tr.description || "",
        categoryIds: data.categoryIds || [],
        activityAreaIds: data.activityAreaIds || [],
      });
      setLogoUrl(data.logoUrl || (data.logoFileId ? `${baseUrl}/api/files/${data.logoFileId}` : null));
    } catch (error) {
      console.error("Error fetching company details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setLogoUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (id) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const toggleActivityArea = (id) => {
    setFormData((prev) => ({
      ...prev,
      activityAreaIds: prev.activityAreaIds.includes(id)
        ? prev.activityAreaIds.filter((a) => a !== id)
        : [...prev.activityAreaIds, id],
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    setIsUploading(true);
    try {
      const response = await adminAxios.post("/files/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, logoFileId: response.data.id }));
      const fileUrl = response.data.url;
      setLogoUrl(fileUrl.startsWith("http") ? fileUrl : `${baseUrl}${fileUrl}`);
    } catch (error) {
      console.error("Error uploading logo", error);
      alert("Logo yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        shortName: formData.shortName || null,
        logoFileId: formData.logoFileId ? parseInt(formData.logoFileId) : null,
        website: formData.website || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : null,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : null,
        officeNo: formData.officeNo || null,
        facebookUrl: formData.facebookUrl || null,
        instagramUrl: formData.instagramUrl || null,
        xUrl: formData.xUrl || null,
        linkedInUrl: formData.linkedInUrl || null,
        youtubeUrl: formData.youtubeUrl || null,
        status: formData.status,
        categoryIds: formData.categoryIds,
        activityAreaIds: formData.activityAreaIds,
        translations: [{ languageId: 1, description: formData.description || null }],
      };

      if (editId) {
        await adminAxios.put(`/companies/${editId}`, payload);
      } else {
        await adminAxios.post("/companies", payload);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving company", error);
      alert("Bir hata oluştu. Lütfen tüm zorunlu alanları kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editId ? "Firmayı Düzenle" : "Yeni Firma Ekle"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="companyForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border border-gray-200 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                  {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" /> : <span className="text-xs text-gray-400">Logo</span>}
                </div>
                <div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" id="companyLogoUpload" />
                  <label
                    htmlFor="companyLogoUpload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? "Yükleniyor..." : "Logo Yükle"}
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Firma Adı *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Kısa Ad</label>
                <input type="text" name="shortName" value={formData.shortName} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Web Sitesi</label>
                <input type="text" name="website" value={formData.website} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">E-posta</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Telefon</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Adres / Ofis</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Ofis No</label>
                <input type="text" name="officeNo" value={formData.officeNo} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Durum</label>
                <select name="status" value={formData.status} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                  <option value="aktif">Aktif</option>
                  <option value="mezun">Mezun</option>
                  <option value="pasif">Pasif</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Kuruluş Yılı</label>
                <input type="number" name="foundedYear" value={formData.foundedYear} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Çalışan Sayısı</label>
                <input type="number" name="employeeCount" value={formData.employeeCount} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                <input type="text" name="facebookUrl" value={formData.facebookUrl} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                <input type="text" name="instagramUrl" value={formData.instagramUrl} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">X (Twitter)</label>
                <input type="text" name="xUrl" value={formData.xUrl} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input type="text" name="linkedInUrl" value={formData.linkedInUrl} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">YouTube</label>
                <input type="text" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Açıklama</label>
              <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Kategoriler</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[46px]">
                  {categories.length === 0 ? (
                    <span className="text-xs text-gray-400">Henüz kategori yok.</span>
                  ) : (
                    categories.map((cat) => {
                      const tr = cat.translations?.find((t) => t.languageId === 1) || cat.translations?.[0];
                      const active = formData.categoryIds.includes(cat.id);
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            active ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {tr?.name}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Faaliyet Alanları</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[46px]">
                  {activityAreas.length === 0 ? (
                    <span className="text-xs text-gray-400">Henüz faaliyet alanı yok.</span>
                  ) : (
                    activityAreas.map((area) => {
                      const tr = area.translations?.find((t) => t.languageId === 1) || area.translations?.[0];
                      const active = formData.activityAreaIds.includes(area.id);
                      return (
                        <button
                          type="button"
                          key={area.id}
                          onClick={() => toggleActivityArea(area.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            active ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {tr?.name}
                        </button>
                      );
                    })
                  )}
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
            form="companyForm"
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
