import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminAxios from "../../utils/adminAxios";
import { 
  Plus, Edit2, Trash2, HelpCircle, Layers, ArrowUp, ArrowDown, 
  Search, Check, X, Tag as TagIcon, ExternalLink 
} from "lucide-react";
import RichTextEditor from "../../components/admin/common/RichTextEditor";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Modal / Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFaq, setEditFaq] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [faqCategoryId, setFaqCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Debounce Search Input (300-500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Arama değiştiğinde ilk sayfaya dön
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch data on filters/pagination changes
  useEffect(() => {
    fetchFaqs();
  }, [debouncedSearchQuery, selectedCategory, selectedStatus, currentPage]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const params = {
        search: debouncedSearchQuery || undefined,
        categoryId: selectedCategory || undefined,
        isActive: selectedStatus === "" ? undefined : selectedStatus === "active",
        page: currentPage,
        pageSize
      };

      const response = await adminAxios.get("/admin/faqs", { params });
      setFaqs(response.data);

      // Pagination headers
      const totalHeader = response.headers["x-total-count"] || response.headers["X-Total-Count"];
      if (totalHeader) {
        const count = parseInt(totalHeader);
        setTotalCount(count);
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (error) {
      console.error("Error fetching FAQs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminAxios.get("/admin/faq-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await adminAxios.get("/admin/faqs/tags");
      setAllTags(response.data);
    } catch (error) {
      console.error("Error fetching tags", error);
    }
  };

  const handleToggleStatus = async (faq) => {
    try {
      const response = await adminAxios.patch(`/admin/faqs/${faq.id}/toggle-status`);
      setFaqs(faqs.map(f => f.id === faq.id ? { ...f, isActive: response.data.isActive } : f));
    } catch (error) {
      alert("Durum güncellenirken bir hata oluştu.");
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;

    const updatedItems = newFaqs.map((f, idx) => ({
      id: f.id,
      orderNo: idx + 1 + (currentPage - 1) * pageSize
    }));

    try {
      await adminAxios.patch("/admin/faqs/reorder", { items: updatedItems });
      setFaqs(newFaqs);
    } catch (error) {
      alert("Sıralama güncellenirken hata oluştu.");
    }
  };

  const openCreateModal = () => {
    setEditFaq(null);
    setQuestion("");
    setAnswer("");
    setButtonLink("");
    setButtonText("");
    setFaqCategoryId(categories.length > 0 ? categories[0].id.toString() : "");
    setSelectedTags([]);
    setTagInput("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setButtonLink(faq.buttonLink || "");
    setButtonText(faq.buttonText || "");
    setFaqCategoryId(faq.faqCategoryId ? faq.faqCategoryId.toString() : "");
    setSelectedTags(faq.tags.map(t => t.name));
    setTagInput("");
    setIsActive(faq.isActive);
    setIsModalOpen(true);
  };

  const handleAddTag = (tagName) => {
    const cleaned = tagName.trim();
    if (cleaned && !selectedTags.includes(cleaned)) {
      setSelectedTags([...selectedTags, cleaned]);
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = (tagName) => {
    setSelectedTags(selectedTags.filter(t => t !== tagName));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim()) {
        handleAddTag(tagInput);
      }
    } else if (e.key === "Backspace" && !tagInput && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      alert("Soru alanı zorunludur.");
      return;
    }
    if (!answer.trim()) {
      alert("Cevap alanı zorunludur.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      question: question.trim(),
      answer: answer,
      buttonLink: buttonLink.trim() || null,
      buttonText: buttonText.trim() || null,
      faqCategoryId: faqCategoryId ? parseInt(faqCategoryId) : null,
      tags: selectedTags,
      isActive,
      orderNo: editFaq ? editFaq.orderNo : (totalCount + 1)
    };

    try {
      if (editFaq) {
        await adminAxios.put(`/admin/faqs/${editFaq.id}`, payload);
      } else {
        await adminAxios.post("/admin/faqs", payload);
      }
      setIsModalOpen(false);
      fetchFaqs();
      fetchTags(); // Yeni eklenen etiketleri listeye dahil et
    } catch (error) {
      alert(error.response?.data ?? "Soru kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (faq) => {
    if (!window.confirm(`"${faq.question.substring(0, 40)}..." sorusunu silmek istediğinize emin misiniz?`)) return;

    try {
      await adminAxios.delete(`/admin/faqs/${faq.id}`);
      fetchFaqs();
    } catch (error) {
      alert("Soru silinirken bir hata oluştu.");
    }
  };

  // Filter tag suggestions
  const tagSuggestions = allTags.filter(t => 
    t.name.toLowerCase().includes(tagInput.toLowerCase()) && 
    !selectedTags.includes(t.name)
  );

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
          Yeni Soru Ekle
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <Link
          to="/admin/faqs"
          className="pb-4 px-1 text-sm font-semibold text-primary border-b-2 border-primary flex items-center gap-2"
        >
          <HelpCircle className="w-4 h-4" />
          Sorular
        </Link>
        <Link
          to="/admin/faq-categories"
          className="pb-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2 border-b-2 border-transparent"
        >
          <Layers className="w-4 h-4" />
          Kategoriler
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-[1.25rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Soru veya cevap içinde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition bg-gray-50/50"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition bg-white"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition bg-white"
          >
            <option value="">Tüm Durumlar</option>
            <option value="active">Aktifler</option>
            <option value="passive">Pasifler</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FAFC] text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium w-24">Sıralama</th>
                <th className="px-6 py-4 font-medium max-w-sm">Soru</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Etiketler</th>
                <th className="px-6 py-4 font-medium">Link</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    Yükleniyor...
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Kriterlere uygun soru bulunamadı.
                  </td>
                </tr>
              ) : (
                faqs.map((f, index) => (
                  <tr key={f.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0 && currentPage === 1}
                          onClick={() => handleMove(index, "up")}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded hover:bg-gray-100 transition"
                          title="Yukarı Taşı"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === faqs.length - 1 && currentPage === totalPages}
                          onClick={() => handleMove(index, "down")}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded hover:bg-gray-100 transition"
                          title="Aşağı Taşı"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-sm overflow-hidden text-ellipsis whitespace-nowrap font-medium text-gray-900" title={f.question}>
                      {f.question}
                    </td>
                    <td className="px-6 py-4">
                      {f.faqCategory ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium">
                          {f.faqCategory.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Kategorisiz</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {f.tags.length > 0 ? (
                          f.tags.map(t => (
                            <span key={t.id} className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-[10px] font-medium">
                              {t.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {f.buttonLink ? (
                        <a
                          href={f.buttonLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title={f.buttonText || f.buttonLink}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {/* Toggle Switch */}
                      <button
                        onClick={() => handleToggleStatus(f)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          f.isActive ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            f.isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(f)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(f)}
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Toplam {totalCount} kayıttan {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)} arası gösteriliyor.
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition shadow-sm"
              >
                Önceki
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm ${
                    currentPage === i + 1
                      ? "bg-[#0F172A] text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition shadow-sm"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[1.5rem] shadow-xl border border-gray-100 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-gray-900 text-lg">
                {editFaq ? "Soruyu Düzenle" : "Yeni Soru Ekle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
              <div className="p-6 space-y-5">
                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Kategori</label>
                  <select
                    value={faqCategoryId}
                    onChange={(e) => setFaqCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition bg-white"
                  >
                    <option value="">Kategori Seçin (Opsiyonel)</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Question */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Soru</label>
                  <input
                    type="text"
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Soru başlığını giriniz..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition"
                  />
                </div>

                {/* Answer Rich Text Editor */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Cevap</label>
                  <RichTextEditor
                    value={answer}
                    onChange={setAnswer}
                    placeholder="HTML biçimli cevabı giriniz..."
                  />
                </div>

                {/* Multi-Select Creatable Tag Input Component */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Etiketler (Tags)</label>
                  <div className="border border-gray-200 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all bg-white relative">
                    <div className="flex flex-wrap gap-2 items-center">
                      {selectedTags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          <TagIcon className="w-3 h-3 text-blue-500" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-blue-400 hover:text-red-500 rounded transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={selectedTags.length === 0 ? "Etiket yazıp Enter'a basın..." : "Etiket ekle..."}
                        value={tagInput}
                        onChange={(e) => { setTagInput(e.target.value); setShowTagSuggestions(true); }}
                        onFocus={() => setShowTagSuggestions(true)}
                        onKeyDown={handleTagInputKeyDown}
                        className="flex-1 min-w-[150px] border-none p-0 text-sm focus:outline-none focus:ring-0"
                      />
                    </div>

                    {/* Tag Suggestions Dropdown */}
                    {showTagSuggestions && tagInput.trim() && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-48 overflow-y-auto">
                        {tagSuggestions.map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleAddTag(tag.name)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 font-medium transition"
                          >
                            {tag.name}
                          </button>
                        ))}
                        {/* Option to create a new tag if not found in list */}
                        {!allTags.some(t => t.name.toLowerCase() === tagInput.trim().toLowerCase()) && (
                          <button
                            type="button"
                            onClick={() => handleAddTag(tagInput)}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-blue-600 font-semibold transition border-t border-gray-50"
                          >
                            + "{tagInput.trim()}" Yeni Etiket Olarak Ekle
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Suggestion Dismiss Area */}
                  {showTagSuggestions && tagInput.trim() && (
                    <div className="fixed inset-0 z-40" onClick={() => setShowTagSuggestions(false)} />
                  )}
                </div>

                {/* Call to Action Button Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Yönlendirme Buton Metni (Opsiyonel)</label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Örn: Hemen Başvur"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Yönlendirme Buton URL'si (Opsiyonel)</label>
                    <input
                      type="text"
                      value={buttonLink}
                      onChange={(e) => setButtonLink(e.target.value)}
                      placeholder="Örn: https://gazi.edu.tr"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                {/* Active Switch */}
                <div className="flex items-center gap-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Soru yayında aktif olarak gösterilsin</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
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
                  {isSubmitting ? "Kaydediliyor..." : editFaq ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
