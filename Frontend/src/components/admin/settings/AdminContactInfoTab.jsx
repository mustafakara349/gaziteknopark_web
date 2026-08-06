import { useState, useEffect } from "react";
import adminAxios from "../../../utils/adminAxios";
import { Save, Loader2 } from "lucide-react";

export default function AdminContactInfoTab() {
  const [form, setForm] = useState({ phone: "", email: "", mapEmbedUrl: "", address: "", workingHours: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/contact/info");
      const data = response.data;
      const tr = data.translations?.find((t) => t.languageId === 1) || data.translations?.[0] || {};
      setForm({
        phone: data.phone || "",
        email: data.email || "",
        mapEmbedUrl: data.mapEmbedUrl || "",
        address: tr.address || "",
        workingHours: tr.workingHours || "",
      });
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error fetching contact info", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      await adminAxios.put("/contact/info", {
        phone: form.phone || null,
        email: form.email || null,
        mapEmbedUrl: form.mapEmbedUrl || null,
        translations: [{ languageId: 1, address: form.address || null, workingHours: form.workingHours || null }],
      });
      setMessage("Kaydedildi.");
    } catch (error) {
      console.error("Error saving contact info", error);
      setMessage("Kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-5 p-6">
      <p className="text-sm text-gray-500 max-w-xl">
        Bu bilgiler sitedeki İletişim sayfasında (/iletisim) gösterilir.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Telefon</label>
          <input type="text" value={form.phone} onChange={handleChange("phone")}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">E-posta</label>
          <input type="email" value={form.email} onChange={handleChange("email")}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Adres</label>
        <textarea rows="2" value={form.address} onChange={handleChange("address")}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Çalışma Saatleri</label>
        <textarea rows="2" value={form.workingHours} onChange={handleChange("workingHours")}
          placeholder="Örn: Pazartesi - Cuma, 08:30 - 17:30"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Google Harita Embed URL</label>
        <input type="text" value={form.mapEmbedUrl} onChange={handleChange("mapEmbedUrl")}
          placeholder="https://www.google.com/maps/embed?..."
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {message && <span className="text-sm text-gray-500">{message}</span>}
      </div>
    </div>
  );
}
