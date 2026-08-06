import { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  Settings2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import AdminNewsCategoryModal from "../../components/admin/news/AdminNewsCategoryModal";
import AdminNewsFormModal from "../../components/admin/news/AdminNewsFormModal";
import { getImageUrl } from "../../utils/imageUrl";

export default function AdminNewsPage() {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  
  // Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNews();
  }, [page, search, categoryId, status, date]);

  const fetchCategories = async () => {
    try {
      const response = await adminAxios.get("/news-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        pageSize: 10,
        ...(search && { search }),
        ...(categoryId && { categoryId }),
        ...(date && { date })
      };
      // Note: Backend might not support status filtering on admin side out of the box based on the DTO,
      // but we will filter it locally if the backend doesn't support it or just pass it if we add it.

      const response = await adminAxios.get("/news", { params });
      
      let fetchedNews = response.data;
      if (status === "active") {
        fetchedNews = fetchedNews.filter(n => n.isActive === true);
      } else if (status === "passive") {
        fetchedNews = fetchedNews.filter(n => n.isActive === false);
      } else if (status) {
        fetchedNews = fetchedNews.filter(n => n.status === status);
      }

      setNews(fetchedNews);
      
      // Try reading headers for pagination if available, otherwise fake it or use total
      const totalPagesHeader = response.headers["x-total-pages"];
      const totalCountHeader = response.headers["x-total-count"];
      
      if (totalPagesHeader) setTotalPages(parseInt(totalPagesHeader));
      if (totalCountHeader) setTotalCount(parseInt(totalCountHeader));
      
    } catch (error) {
      console.error("Error fetching news", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    
    try {
      await adminAxios.delete(`/news/${id}`);
      fetchNews();
    } catch (error) {
      console.error("Error deleting news", error);
      alert("Haber silinirken bir hata oluştu.");
    }
  };

  const openEditModal = (id) => {
    setEditId(id);
    setIsFormModalOpen(true);
  };

  const openCreateModal = () => {
    setEditId(null);
    setIsFormModalOpen(true);
  };

  // Helper for pagination rendering
  const renderPagination = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
              page === i 
                ? "bg-[#0F172A] text-white" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {i}
          </button>
        );
      } else if (i === page - 2 || i === page + 2) {
        pages.push(
          <span key={i} className="w-8 h-8 flex items-center justify-center text-gray-400">
            <MoreHorizontal className="w-4 h-4" />
          </span>
        );
      }
    }
    return pages;
  };

  const getActiveBadge = (item) => {
    if (!item.isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
          Pasif
        </span>
      );
    }

    if (item.publishedAt && new Date(item.publishedAt) > new Date()) {
      const formattedDate = new Date(item.publishedAt).toLocaleDateString("tr-TR", {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium" title={`${formattedDate} tarihinde yayınlanacak`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          {formattedDate}'de Yayınlanacak
        </span>
      );
    }

    if (item.unpublishedAt && new Date(item.unpublishedAt) > new Date()) {
      const formattedDate = new Date(item.unpublishedAt).toLocaleDateString("tr-TR", {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-medium" title={`${formattedDate} tarihinde yayından kaldırılacak`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Aktif <span className="opacity-75 font-normal">({formattedDate} Bitiş)</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        Aktif
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Card */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Haber Yönetimi</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            Haber ekleme, düzenleme, silme ve kategori yönetimi işlemlerini buradan gerçekleştirebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Kategorileri Yönet
          </button>
          <button 
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Haber Ekle
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Filters Area */}
        <div className="p-4 sm:p-6 flex flex-wrap gap-4 items-center bg-gray-50/50 border-b border-gray-100">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Haber başlığı ara..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="relative">
            <select 
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
              className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select 
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="passive">Pasif</option>
            </select>
          </div>

          <input 
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FAFC] text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium w-16">Kapak</th>
                <th className="px-6 py-4 font-medium">Başlık</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium">Yayınlanma Tarihi</th>
                <th className="px-6 py-4 font-medium">Görün.</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Settings2 className="w-8 h-8 animate-spin mb-4" />
                      <p>Haberler yükleniyor...</p>
                    </div>
                  </td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Kriterlere uygun haber bulunamadı.
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                        {item.coverImageUrl ? (
                          <img src={getImageUrl(item.coverImageUrl)} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[150px] sm:max-w-[200px] xl:max-w-[300px]">
                      <div>{item.title}</div>
                      <div className="text-xs text-gray-400 font-normal mt-0.5">Yazar: {item.authorName || "Gazi Teknopark"}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.categoryName || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {getActiveBadge(item)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("tr-TR", {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      }) : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {item.views?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => window.open(`/haberler/${item.slug}`, '_blank')}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <div className="text-sm text-gray-500">
            Toplam <span className="font-medium text-gray-900">{totalCount}</span> haberden <span className="font-medium text-gray-900">{news.length > 0 ? (page - 1) * 10 + 1 : 0}-{Math.min(page * 10, totalCount)}</span> arası gösteriliyor
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {renderPagination()}

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AdminNewsCategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        onSuccess={fetchCategories}
      />
      
      <AdminNewsFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        editId={editId}
        categories={categories}
        onSuccess={() => {
          setIsFormModalOpen(false);
          fetchNews();
        }}
      />
    </div>
  );
}
