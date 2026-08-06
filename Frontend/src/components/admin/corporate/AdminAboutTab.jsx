import { useState, useEffect } from "react";
import adminAxios from "../../../utils/adminAxios";
import { Save, Loader2 } from "lucide-react";
import RichTextEditor from "../common/RichTextEditor";

const SLUG = "hakkimizda";

export default function AdminAboutTab() {
  const [pageId, setPageId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/pages");
      const page = response.data.find((p) =>
        p.translations.some((t) => t.slug === SLUG)
      );
      if (page) {
        const tr = page.translations.find((t) => t.slug === SLUG);
        setPageId(page.id);
        setTitle(tr.title || "");
        setContent(tr.content || "");
        setStatus((page.status || "draft").toLowerCase());
      }
    } catch (error) {
      console.error("Error fetching about page", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const payload = {
        imageFileId: null,
        status,
        translations: [
          {
            languageId: 1,
            slug: SLUG,
            title,
            content,
          },
        ],
      };

      if (pageId) {
        await adminAxios.put(`/pages/${pageId}`, payload);
      } else {
        const response = await adminAxios.post("/pages", payload);
        setPageId(response.data.id);
      }
      setMessage("Kaydedildi.");
    } catch (error) {
      console.error("Error saving about page", error);
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 max-w-xl">
          Bu içerik, sitedeki "Hakkımızda" sayfasında (/kurumsal/hakkimizda) doğrudan gösterilir.
          Her paragraf otomatik olarak ayrı bir bölüm kartı haline gelir.
        </p>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="draft">Taslak</option>
          <option value="published">Yayında</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Başlık (SEO amaçlı, sayfada görünmez)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          placeholder="Hakkımızda"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">İçerik</label>
        <RichTextEditor value={content} onChange={setContent} placeholder="Hakkımızda metnini buraya yazın..." />
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
