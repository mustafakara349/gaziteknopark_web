import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminAxios from "../../utils/adminAxios";
import { Plus, Edit2, Trash2, HelpCircle, Layers, Check, X } from "lucide-react";

export default function AdminFaqCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [orderNo, setOrderNo] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-slug generation from Name
  useEffect(() => {
    if (!editCategory && name) {
      setSlug(slugify(name));
    }
  }, [name, editCategory]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/admin/faq-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching faq categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-") // Replace spaces and underscores with -
      .replace(/[ğĞ]/g, "g")
      .replace(/[üÜ]/g, "u")
      .replace(/[şŞ]/g, "s")
      .replace(/[ıİ]/g, "i")
      .replace(/[öÖ]/g, "o")
      .replace(/[çÇ]/g, "c")
      .replace(/[^a-z0-9\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start
      .replace(/-+$/, ""); // Trim - from end
  };

  const openCreateModal = () => {
    setEditCategory(null);
    setName("");
    setSlug("");
    setOrderNo(categories.length > 0 ? Math.max(...categories.map(c => c.orderNo)) + 1 : 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setOrderNo(cat.orderNo);
    setIsActive(cat.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Kategori adı zorunludur.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      orderNo: parseInt(orderNo) || 0,
      isActive
    };

    try {
      if (editCategory) {
        await adminAxios.put(`/admin/faq-categories/${editCategory.id}`, payload);
      } else {
        await adminAxios.post("/admin/faq-categories", payload);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data ?? "Kategori kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`"${cat.name}" kategorisini silmek istediğinize emin misiniz?\nKategori altındaki sorular silinmeyecek fakat kategorisiz kalacaktır.`)) {
      return;
    }
    try {
      await adminAxios.delete(`/admin/faq-categories/${cat.id}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data ?? "Kategori silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Card */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Sıkça Sorulan Sorular</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            Sıkça sorulan soruları (SSS) ve kategori gruplamalarını buradan yönetebilirsiniz.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yeni Kategori Ekle
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <Link
          to="/admin/faqs"
          className="pb-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2 border-b-2 border-transparent"
        >
          <HelpCircle className="w-4 h-4" />
          Sorular
        </Link>
        <Link
          to="/admin/faq-categories"
          className="pb-4 px-1 text-sm font-semibold text-primary border-b-2 border-primary flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          Kategoriler
        </Link>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FAFC] text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium w-16">Sıra No</th>
                <th className="px-6 py-4 font-medium">Kategori Adı</th>
                <th className="px-6 py-4 font-medium">Slug (URL)</th>
                <th className="px-6 py-4 font-medium">Soru Sayısı</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    Yükleniyor...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Henüz kategori bulunmuyor.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.orderNo}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{c.slug}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold">
                        {c.faqCount} Soru
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {c.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[1.5rem] shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">
                {editCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Kategori Adı</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Kuluçka Merkezi Hizmetleri"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Slug (URL Dostu Metin)</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="kulucka-merkezi-hizmetleri"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono text-xs focus:outline-none focus:border-primary transition bg-gray-50/50"
                  />
                </div>

                {/* Order No & Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Sıra No</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={orderNo}
                      onChange={(e) => setOrderNo(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-end">
                    <div className="flex items-center h-11">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="w-4.5 h-4.5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">Kategori Aktif</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition shadow-sm"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] disabled:bg-gray-400 text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {isSubmitting ? "Kaydediliyor..." : editCategory ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
