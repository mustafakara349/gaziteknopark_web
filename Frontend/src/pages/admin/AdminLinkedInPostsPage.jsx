import { useState, useEffect } from "react";
import {
  Search,
  Check,
  X,
  ExternalLink,
  Home as HomeIcon,
  BookOpen,
  Building2,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Star,
  LayoutGrid,
  List
} from "lucide-react";
import adminAxios from "../../utils/adminAxios";
import { getCompanies } from "../../api/endpoints";
import Pagination from "../../components/common/Pagination";
import { LinkedinIcon } from "../../components/common/icons";
import { useToast } from "../../context/ToastContext";

export default function AdminLinkedInPostsPage() {
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Layout choice: list (horizontal row) or grid (square card)
  const [layout, setLayout] = useState("list");

  // Filters
  const [activeTab, setActiveTab] = useState("pending"); // pending, approved, rejected, featured, all
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  // Detailed Modal Popup Post
  const [selectedDetailPost, setSelectedDetailPost] = useState(null);

  // Custom Action Confirmation Modal
  const [confirmModalData, setConfirmModalData] = useState(null); // { id, status, post, actionType, targetFeatured }

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Single post exit animation tracker
  const [animatingPostId, setAnimatingPostId] = useState(null);

  // Per-tab counts for tabs badge and stats bar (fetched separately, updated after each action)
  const [tabCounts, setTabCounts] = useState({ pending: null, approved: null, rejected: null, featured: null, all: null });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when tab or company changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [activeTab, selectedCompany]);

  // Fetch companies
  useEffect(() => {
    getCompanies()
      .then((res) => {
        setCompanies(res || []);
      })
      .catch((err) => console.error("Firmalar yüklenirken hata:", err));
  }, []);

  // Fetch posts on changes
  useEffect(() => {
    fetchPosts();
  }, [activeTab, debouncedSearchQuery, selectedCompany, currentPage]);

  // Fetch stats once on mount (and after each successful action via fetchStats())
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let statusParam = undefined;
      let isFeaturedParam = undefined;

      if (activeTab === "pending") statusParam = 0;
      else if (activeTab === "approved") statusParam = 1;
      else if (activeTab === "rejected") statusParam = 2;
      else if (activeTab === "featured") {
        statusParam = 1; // Approved posts only can be featured
        isFeaturedParam = true;
      }

      const params = {
        status: statusParam,
        search: debouncedSearchQuery || undefined,
        companyId: selectedCompany || undefined,
        isFeatured: isFeaturedParam,
        page: currentPage,
        pageSize
      };

      const response = await adminAxios.get("/admin/linkedin-posts", { params });
      setPosts(response.data || []);

      const totalHeader = response.headers["x-total-count"] || response.headers["X-Total-Count"];
      if (totalHeader) {
        setTotalCount(parseInt(totalHeader, 10));
      } else {
        setTotalCount(0);
      }
    } catch (error) {
      console.error("LinkedIn postları çekilirken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch per-tab counts for badges + stats bar (5 lightweight parallel requests)
  const fetchStats = async () => {
    try {
      const getCount = (res) => parseInt(res.headers["x-total-count"] || res.headers["X-Total-Count"] || "0", 10);
      const [rPending, rApproved, rRejected, rFeatured, rAll] = await Promise.all([
        adminAxios.get("/admin/linkedin-posts", { params: { status: 0, pageSize: 1, page: 1 } }),
        adminAxios.get("/admin/linkedin-posts", { params: { status: 1, pageSize: 1, page: 1 } }),
        adminAxios.get("/admin/linkedin-posts", { params: { status: 2, pageSize: 1, page: 1 } }),
        adminAxios.get("/admin/linkedin-posts", { params: { status: 1, isFeatured: true, pageSize: 1, page: 1 } }),
        adminAxios.get("/admin/linkedin-posts", { params: { pageSize: 1, page: 1 } }),
      ]);
      setTabCounts({
        pending:  getCount(rPending),
        approved: getCount(rApproved),
        rejected: getCount(rRejected),
        featured: getCount(rFeatured),
        all:      getCount(rAll),
      });
    } catch (err) {
      console.error("İstatistikler alınırken hata:", err);
    }
  };

  // Status and channels update with Optimistic Updates to avoid page flickering
  const handleStatusUpdate = async (id, status, showOnHomepage, showOnStories, isFeatured) => {
    try {
      // Local state update first: check if status change causes the post to leave the current active tab
      let shouldRemove = false;
      if (activeTab === "pending" && status !== 0) shouldRemove = true;
      if (activeTab === "approved" && status !== 1) shouldRemove = true;
      if (activeTab === "rejected" && status !== 2) shouldRemove = true;
      if (activeTab === "featured" && (status !== 1 || !isFeatured)) shouldRemove = true;

      if (shouldRemove) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status, showOnHomepage, showOnStories, isFeatured } : p
          )
        );
      }

      // API call in background
      await adminAxios.patch(`/admin/linkedin-posts/${id}/status`, {
        status,
        showOnHomepage,
        showOnStories,
        isFeatured
      });

      // Update selected detail post if open
      if (selectedDetailPost && selectedDetailPost.id === id) {
        setSelectedDetailPost((prev) => ({
          ...prev,
          status,
          showOnHomepage,
          showOnStories,
          isFeatured
        }));
      }

      // Remove from selected list if present
      setSelectedIds((prev) => prev.filter((item) => item !== id));

      // Success toast based on action
      if (isFeatured && status === 1) {
        toast.success("Gönderi yayınlandı ve öne çıkarıldı.", { title: "Yayınlandı & Öne Çıkarıldı" });
      } else if (status === 1) {
        toast.success("Gönderi onaylandı ve yayına alındı.", { title: "Yayınlandı" });
      } else if (status === 2) {
        toast.warning("Gönderi reddedildi ve yayından kaldırıldı.", { title: "Reddedildi" });
      } else if (status === 0) {
        toast.info("Gönderi beklemeye alındı.", { title: "Beklemeye Alındı" });
      }
      // Refresh stats counts for all tabs
      fetchStats();
    } catch (error) {
      console.error("Durum güncellenirken hata oluştu:", error);
      toast.error("Gönderi durumu güncellenemedi. Lütfen tekrar deneyin.", { title: "Güncelleme Hatası", duration: 6000 });
      fetchPosts(); // Rollback
    }
  };

  const openConfirmModal = (id, status, post) => {
    let preparedPost = { ...post };
    // If approving (status === 1) and both booleans are currently false, default them both to true
    if (status === 1 && !post.showOnHomepage && !post.showOnStories) {
      preparedPost.showOnHomepage = true;
      preparedPost.showOnStories = true;
    }
    setConfirmModalData({ id, status, post: preparedPost, actionType: "status" });
  };

  const handleStarClick = (id, isFeatured, post) => {
    // If we want to feature (isFeatured === true) but post is NOT published (status !== 1)
    // → open the "Yayınla ve Öne Çıkar" combined modal instead of a passive error
    if (isFeatured && post.status !== 1) {
      // Default both channels to true if both are currently false
      let preparedPost = { ...post };
      if (!post.showOnHomepage && !post.showOnStories) {
        preparedPost.showOnHomepage = true;
        preparedPost.showOnStories = true;
      }
      setConfirmModalData({
        id,
        status: post.status,
        post: preparedPost,
        actionType: "publish_and_feature"
      });
      return;
    }

    // If it is already featured and we want to unstar it, or if it is published and we want to star it
    setConfirmModalData({
      id,
      status: post.status,
      post,
      actionType: "feature",
      targetFeatured: isFeatured
    });
  };

  const toggleConfirmModalChannel = (field) => {
    setConfirmModalData((prev) => {
      if (!prev) return null;
      const updatedPost = { ...prev.post, [field]: !prev.post[field] };
      return { ...prev, post: updatedPost };
    });
  };

  const handleConfirmAction = () => {
    if (!confirmModalData) return;
    const { id, status, post, actionType, targetFeatured } = confirmModalData;

    // Handle simple featuring/unstarring of already-published post
    if (actionType === "feature") {
      setConfirmModalData(null);
      handleToggleFeatured(id, targetFeatured);
      return;
    }

    // Handle combined Publish + Feature action
    if (actionType === "publish_and_feature") {
      if (!post.showOnHomepage && !post.showOnStories) return; // guarded by disabled button
      setAnimatingPostId(id);
      setConfirmModalData(null);
      setTimeout(async () => {
        await handleStatusUpdate(id, 1, post.showOnHomepage, post.showOnStories, true);
        setAnimatingPostId(null);
      }, 400);
      return;
    }

    // Handle status change validation (regular approve/reject)
    if (status === 1 && !post.showOnHomepage && !post.showOnStories) return; // guarded by disabled button

    // Trigger card exit animation
    setAnimatingPostId(id);
    setConfirmModalData(null);

    // Wait for the exit animation, then call optimistic update in background
    setTimeout(async () => {
      // Use the actual values chosen inside the confirm modal
      const showOnHomepage = status === 1 ? post.showOnHomepage : false;
      const showOnStories = status === 1 ? post.showOnStories : false;

      await handleStatusUpdate(id, status, showOnHomepage, showOnStories, post.isFeatured);
      setAnimatingPostId(null);
    }, 400);
  };

  const handleToggleFeatured = async (id, isFeatured) => {
    try {
      // Optimistic update
      let shouldRemove = activeTab === "featured" && !isFeatured;

      if (shouldRemove) {
        setAnimatingPostId(id);
        setTimeout(() => {
          setPosts((prev) => prev.filter((p) => p.id !== id));
          setAnimatingPostId(null);
        }, 400);
      } else {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured } : p))
        );
      }

      // API call
      await adminAxios.patch(`/admin/linkedin-posts/${id}/status`, {
        isFeatured
      });

      if (selectedDetailPost && selectedDetailPost.id === id) {
        setSelectedDetailPost((prev) => ({
          ...prev,
          isFeatured
        }));
      }

      if (isFeatured) {
        toast.success("Gönderi başarı öykülerinde öne çıkarıldı.", { title: "Öne Çıkarıldı" });
      } else {
        toast.info("Gönderi öne çıkanlar listesinden kaldırıldı.", { title: "Öne Çıkarma Kaldırıldı" });
      }
      // Refresh stats counts for all tabs
      fetchStats();
    } catch (error) {
      console.error("Öne çıkarma durumu güncellenirken hata oluştu:", error);
      toast.error("Öne çıkarma durumu güncellenemedi. Lütfen tekrar deneyin.", { title: "Güncelleme Hatası", duration: 6000 });
      fetchPosts();
    }
  };

  // Toggles channel (Homepage / Stories) options optimistically without re-fetching page
  const handleToggleChannel = async (id, field, value) => {
    // Locate the current post
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const updatedShowOnHomepage = field === "showOnHomepage" ? value : post.showOnHomepage;
    const updatedShowOnStories = field === "showOnStories" ? value : post.showOnStories;

    // Apply optimistic updates
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );

    try {
      await adminAxios.patch(`/admin/linkedin-posts/${id}/status`, {
        showOnHomepage: updatedShowOnHomepage,
        showOnStories: updatedShowOnStories
      });

      if (selectedDetailPost && selectedDetailPost.id === id) {
        setSelectedDetailPost((prev) => ({
          ...prev,
          [field]: value
        }));
      }

      const label = field === "showOnHomepage" ? "Anasayfa" : "Başarı Öyküleri";
      if (value) {
        toast.success(`"${label}" yayın kanalı aktifleştirildi.`, { title: "Kanal Güncellendi" });
      } else {
        toast.info(`"${label}" yayın kanalı devre dışı bırakıldı.`, { title: "Kanal Güncellendi" });
      }
    } catch (error) {
      console.error("Kanal güncellenirken hata oluştu:", error);
      toast.error("Yayın kanalı güncellenemedi. Lütfen tekrar deneyin.", { title: "Güncelleme Hatası", duration: 6000 });
      fetchPosts(); // Rollback
    }
  };

  const handleBulkStatusUpdate = async (status, showOnHomepage = null, showOnStories = null, isFeatured = null) => {
    if (selectedIds.length === 0) return;
    if (selectedIds.length > 100) {
      toast.warning("Tek seferde en fazla 100 gönderi güncelleyebilirsiniz.", { title: "Limit Aşıldı" });
      return;
    }

    let confirmMsg = `${selectedIds.length} adet gönderiyi güncellemek istediğinize emin misiniz?`;
    if (status === 1) {
      confirmMsg = `${selectedIds.length} adet gönderiyi onaylayıp yayınlamak istiyor musunuz?`;
    } else if (status === 2) {
      confirmMsg = `${selectedIds.length} adet gönderiyi reddetmek istiyor musunuz?`;
    }

    if (!window.confirm(confirmMsg)) return;

    try {
      await adminAxios.post("/admin/linkedin-posts/bulk-status", {
        ids: selectedIds,
        status,
        showOnHomepage,
        showOnStories,
        isFeatured
      });
      fetchPosts();
      setSelectedIds([]);
      const count = selectedIds.length;
      if (isFeatured === true) {
        toast.success(`${count} gönderi öne çıkarıldı.`, { title: "Toplu İşlem Başarılı" });
      } else if (isFeatured === false) {
        toast.info(`${count} gönderinin öne çıkarması kaldırıldı.`, { title: "Toplu İşlem Tamamlandı" });
      } else if (status === 1) {
        toast.success(`${count} gönderi onaylandı ve yayına alındı.`, { title: "Toplu Onay Başarılı" });
      } else if (status === 2) {
        toast.warning(`${count} gönderi reddedildi.`, { title: "Toplu Red Tamamlandı" });
      } else {
        toast.success(`${count} gönderi güncellendi.`, { title: "Toplu İşlem Başarılı" });
      }
      // Refresh stats counts for all tabs
      fetchStats();
    } catch (error) {
      console.error("Toplu güncellemede hata:", error);
      toast.error("Toplu işlem gerçekleştirilemedi. Lütfen tekrar deneyin.", { title: "Toplu İşlem Hatası", duration: 6000 });
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllOnPage = () => {
    const pageIds = posts.map((p) => p.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      // Unselect all on this page
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      // Select all on this page, avoiding duplicates
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Card */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            LinkedIn Gönderi Yönetimi
          </h1>
          <p className="text-gray-500 mt-2 text-sm max-w-2xl">
            LinkedIn API ve arka plan servisinden gelen firma başarı paylaşımlarını bu ekrandan inceleyebilir,
            onaylayarak Ana Sayfa veya Başarı Öyküleri sayfasında yayınlanmasını sağlayabilir, öne çıkanları yıldızlayabilirsiniz.
          </p>
        </div>
      </div>


      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6 overflow-x-auto pb-1">
        {[
          { key: "pending",  label: "Onay Bekleyenler" },
          { key: "approved", label: "Yayınlananlar" },
          { key: "rejected", label: "Reddedilenler" },
          { key: "featured", label: "Öne Çıkanlar" },
          { key: "all",      label: "Tüm Gönderiler" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-4 px-1 text-sm font-semibold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all ${activeTab === tab.key
              ? "border-[#0B2558] text-[#0B2558]"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {tab.label}
            {tabCounts[tab.key] !== null && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                tab.key === "pending"  ? "bg-amber-100 text-amber-800" :
                tab.key === "approved" ? "bg-green-100 text-green-800" :
                tab.key === "rejected" ? "bg-red-100 text-red-800" :
                tab.key === "featured" ? "bg-amber-100 text-amber-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filter, Search and Layout Bar */}
      <div className="bg-white p-5 rounded-[1.25rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Gönderi metni veya şirket adı içinde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2558] transition bg-gray-50/50"
          />
        </div>

        {/* Company Filter */}
        <div className="w-full md:w-64">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2558] transition bg-gray-50/50"
          >
            <option value="">Tüm Şirketler</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Layout Toggle Buttons */}
        <div className="flex items-center gap-1 border border-gray-200 p-1 rounded-xl bg-gray-50/50 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setLayout("list")}
            className={`p-2 rounded-lg transition-all ${layout === "list"
              ? "bg-white text-[#0B2558] shadow-sm border border-gray-100"
              : "text-gray-400 hover:text-gray-600"
              }`}
            title="Yatay Liste Görünümü"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout("grid")}
            className={`p-2 rounded-lg transition-all ${layout === "grid"
              ? "bg-white text-[#0B2558] shadow-sm border border-gray-100"
              : "text-gray-400 hover:text-gray-600"
              }`}
            title="Kare Izgara Görünümü"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Action Panel */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={posts.length > 0 && posts.every((p) => selectedIds.includes(p.id))}
              onChange={handleSelectAllOnPage}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 bg-white"
            />
            <span className="text-sm font-semibold text-blue-800">
              {selectedIds.length} gönderi seçildi
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBulkStatusUpdate(1, true, true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Onayla (Ana Sayfa + Başarı Öyküsü)
            </button>
            <button
              onClick={() => handleBulkStatusUpdate(1, false, true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Onayla (Sadece Başarı Öyküsü)
            </button>
            <button
              onClick={() => handleBulkStatusUpdate(null, null, null, true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              Öne Çıkar
            </button>
            <button
              onClick={() => handleBulkStatusUpdate(null, null, null, false)}
              className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              Öne Çıkarmayı Kaldır
            </button>
            <button
              onClick={() => handleBulkStatusUpdate(2)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Seçilenleri Reddet
            </button>
          </div>
        </div>
      )}

      {/* List / Grid Container */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="w-10 h-10 text-[#0B2558] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Gönderiler yükleniyor, lütfen bekleyin...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {activeTab === "pending"  && <Clock      className="w-12 h-12 text-amber-300 mb-4" />}
          {activeTab === "approved" && <CheckCircle className="w-12 h-12 text-green-300 mb-4" />}
          {activeTab === "rejected" && <XCircle     className="w-12 h-12 text-red-300 mb-4" />}
          {activeTab === "featured" && <Star        className="w-12 h-12 text-amber-300 mb-4" />}
          {activeTab === "all"      && <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />}
          <h3 className="text-lg font-bold text-gray-800">
            {activeTab === "pending"  && "Onay bekleyen gönderi bulunmamaktadır."}
            {activeTab === "approved" && "Yayınlanmış gönderi bulunmamaktadır."}
            {activeTab === "rejected" && "Reddedilmiş gönderi bulunmamaktadır."}
            {activeTab === "featured" && "Öne çıkarılmış gönderi bulunmamaktadır."}
            {activeTab === "all"      && "Henüz hiç gönderi kaydı bulunmamaktadır."}
          </h3>
          <p className="text-gray-400 text-sm mt-1.5 max-w-md">
            {activeTab === "pending"  && "Onay bekleyen gönderi geldiğinde burada listelenecektir."}
            {activeTab === "approved" && "Onaylanıp yayına alınan gönderiler burada görünür."}
            {activeTab === "rejected" && "Reddedilen gönderiler burada listelenir."}
            {activeTab === "featured" && "Öne çıkarılan gönderiler başarı öyküleri sayfasında karuselde gösterilir."}
            {activeTab === "all"      && "Arama veya filtre kriterlerinizi değiştirmeyi deneyin."}
          </p>
        </div>

      ) : layout === "list" ? (
        /* ──── HORIZONTAL LIST VIEW (YATAY SATIRSAL) ──── */
        <div className="space-y-4">
          {posts.map((post) => {
            const isSelected = selectedIds.includes(post.id);

            // Left Status Border strip class definition
            const statusBorderClass =
              post.status === 0 ? "border-l-[6px] border-l-amber-500" :
                post.status === 1 ? "border-l-[6px] border-l-green-500" :
                  "border-l-[6px] border-l-red-500";

            return (
              <div
                key={post.id}
                onClick={() => setSelectedDetailPost(post)}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col lg:flex-row overflow-hidden group hover:shadow-md relative cursor-pointer ${isSelected ? "border-blue-500 ring-2 ring-blue-500/10" : "border-gray-150"
                  } ${statusBorderClass} ${animatingPostId === post.id ? "scale-95 opacity-0 -translate-x-8 pointer-events-none" : ""
                  }`}
              >
                {/* Select Checkbox */}
                <div className="absolute top-4 left-4 z-10" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(post.id)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 bg-white/90 cursor-pointer shadow-sm"
                  />
                </div>

                {/* Sütun 1: Sol Media Container (lg:w-60) */}
                <div className="relative w-full lg:w-60 shrink-0 bg-slate-100 overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100">
                  {post.mediaUrl ? (
                    <img
                      src={post.mediaUrl}
                      alt="Post Media"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-102 min-h-[140px]"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0B2558]/5 to-[#0B2558]/20 text-[#0B2558] select-none p-4 min-h-[140px]">
                      <LinkedinIcon className="w-8 h-8 opacity-20 mb-2" />
                      <span className="font-extrabold text-[10px] tracking-widest text-center opacity-40">GAZİ TEKNOPARK</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center">
                    {post.status === 0 ? (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 border border-amber-200 text-amber-800 shadow-sm flex items-center gap-1 bg-white/95">
                        <Clock className="w-3.5 h-3 text-amber-600" />
                        Beklemede
                      </span>
                    ) : post.status === 1 ? (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 border border-green-200 text-green-800 shadow-sm flex items-center gap-1 bg-white/95">
                        <CheckCircle className="w-3.5 h-3 text-green-600" />
                        Yayınlandı
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 border border-red-200 text-red-800 shadow-sm flex items-center gap-1 bg-white/95">
                        <XCircle className="w-3.5 h-3 text-red-600" />
                        Reddedildi
                      </span>
                    )}
                  </div>
                </div>

                {/* Sütun 2: Orta Detay Alanı (flex-1) */}
                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center gap-2.5">
                        {post.companyLogoUrl ? (
                          <img
                            src={post.companyLogoUrl}
                            alt={post.companyName}
                            className="h-8 w-8 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-500 text-xs border border-gray-200">
                            {post.companyName ? post.companyName.charAt(0) : "F"}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[180px]" title={post.companyName}>
                            {post.companyName}
                          </h4>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.publishedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Audit Trail next to company info */}
                      {post.approvedByName && (
                        <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg shrink-0">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            Onaylayan: <b className="text-slate-700">{post.approvedByName}</b>
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3 text-gray-400" />
                            {formatDate(post.approvedAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Controls: Star & LinkedIn Icon */}
                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleStarClick(post.id, !post.isFeatured, post)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition"
                        title={post.isFeatured ? "Öne Çıkarmayı Kaldır" : "Öne Çıkar"}
                      >
                        <Star
                          className={`w-5 h-5 transition ${post.isFeatured
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300 hover:text-amber-500"
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Body Text snippet - truncated with line clamp */}
                  <div className="text-xs text-gray-600 leading-relaxed font-normal bg-slate-50 p-3 rounded-lg border border-slate-100 flex-1 flex flex-col justify-center">
                    <p className="line-clamp-4 overflow-hidden text-ellipsis">
                      {post.postText || <span className="italic text-gray-400">Görsel paylaşıldı (Metin bulunmuyor)</span>}
                    </p>
                  </div>
                </div>

                {/* Sütun 3: Sağ Aksiyon Paneli (lg:w-60) */}
                <div
                  className="w-full lg:w-60 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 p-5 flex flex-col justify-between bg-slate-50/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top: 2 Modern Switches */}
                  <div className="space-y-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Yayın Mecraları
                    </span>

                    {/* Switch 1: Anasayfa */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-slate-700">Anasayfa</span>
                      <button
                        onClick={() => handleToggleChannel(post.id, "showOnHomepage", !post.showOnHomepage)}
                        className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${post.showOnHomepage ? "bg-green-600" : "bg-slate-200"
                          }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${post.showOnHomepage ? "translate-x-4.5" : "translate-x-0"
                            }`}
                        />
                      </button>
                    </div>

                    {/* Switch 2: Başarı Öyküleri */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-slate-700">Başarı Öyküleri</span>
                      <button
                        onClick={() => handleToggleChannel(post.id, "showOnStories", !post.showOnStories)}
                        className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${post.showOnStories ? "bg-green-600" : "bg-slate-200"
                          }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${post.showOnStories ? "translate-x-4.5" : "translate-x-0"
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Bottom: Action Buttons */}
                  <div className="flex gap-2 items-center mt-6">
                    {post.status === 0 ? (
                      <>
                        <button
                          onClick={() => openConfirmModal(post.id, 1, post)}
                          className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Yayınla
                        </button>
                        <button
                          onClick={() => openConfirmModal(post.id, 2, post)}
                          className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reddet
                        </button>
                      </>
                    ) : post.status === 1 ? (
                      <button
                        onClick={() => openConfirmModal(post.id, 2, post)}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Kaldır
                      </button>
                    ) : (
                      <button
                        onClick={() => openConfirmModal(post.id, 1, post)}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Yayınla
                      </button>
                    )}

                    <a
                      href={post.postUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-[#0A66C2] hover:bg-[#0A66C2]/5 rounded-xl border border-slate-200 transition shrink-0"
                      title="LinkedIn'de Gör"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ──── SQUARE GRID VIEW (KARE IZGARA) ──── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const isSelected = selectedIds.includes(post.id);
            const displayText = post.postText;

            return (
              <div
                key={post.id}
                onClick={() => setSelectedDetailPost(post)}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-md relative cursor-pointer ${isSelected ? "border-blue-500 ring-2 ring-blue-500/10" : "border-gray-150"
                  } ${animatingPostId === post.id ? "scale-90 opacity-0 -translate-y-4 pointer-events-none" : ""
                  }`}
              >
                {/* Select Checkbox */}
                <div className="absolute top-4 left-4 z-10" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(post.id)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 bg-white/90 cursor-pointer shadow-sm"
                  />
                </div>

                {/* Star Icon & URN Badge */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleStarClick(post.id, !post.isFeatured, post)}
                    className="p-1 rounded-md bg-white/95 shadow-sm border border-gray-100 transition"
                    title={post.isFeatured ? "Öne Çıkarmayı Kaldır" : "Öne Çıkar"}
                  >
                    <Star
                      className={`w-4 h-4 transition ${post.isFeatured
                        ? "text-amber-500 fill-amber-500"
                        : "text-gray-300 hover:text-amber-500"
                        }`}
                    />
                  </button>
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/95 shadow-sm border border-gray-100">
                    <svg className="h-4 w-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                </div>

                <div>
                  {/* Visual Media Thumbnail */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-gray-100">
                    {post.mediaUrl ? (
                      <img
                        src={post.mediaUrl}
                        alt="Post Media"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-102"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0B2558]/5 to-[#0B2558]/20 text-[#0B2558] select-none p-4">
                        <LinkedinIcon className="w-8 h-8 opacity-20 mb-2" />
                        <span className="font-extrabold text-[10px] tracking-widest text-center opacity-40">GAZİ TEKNOPARK</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center">
                      {post.status === 0 ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 border border-amber-200 text-amber-800 shadow-sm flex items-center gap-1 bg-white/95">
                          <Clock className="w-3.5 h-3 text-amber-600" />
                          Beklemede
                        </span>
                      ) : post.status === 1 ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 border border-green-200 text-green-800 shadow-sm flex items-center gap-1 bg-white/95">
                          <CheckCircle className="w-3.5 h-3 text-green-600" />
                          Yayınlandı
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 border border-red-200 text-red-800 shadow-sm flex items-center gap-1 bg-white/95">
                          <XCircle className="w-3.5 h-3 text-red-600" />
                          Reddedildi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4">
                    {/* Company Header */}
                    <div className="flex items-center gap-2.5">
                      {post.companyLogoUrl ? (
                        <img
                          src={post.companyLogoUrl}
                          alt={post.companyName}
                          className="h-8 w-8 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-500 text-xs border border-gray-200">
                          {post.companyName ? post.companyName.charAt(0) : "F"}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-gray-900 truncate" title={post.companyName}>
                          {post.companyName}
                        </h4>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.publishedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Post Text - truncated with line clamp */}
                    <div className="text-xs text-gray-600 leading-relaxed font-normal bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="line-clamp-4 overflow-hidden text-ellipsis">
                        {displayText || <span className="italic text-gray-400">Görsel paylaşıldı (Metin bulunmuyor)</span>}</p>
                    </div>

                    {/* Channel Options */}
                    <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Yayın Kanalları
                      </span>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                          <input
                            type="checkbox"
                            checked={post.showOnHomepage}
                            onChange={(e) =>
                              handleToggleChannel(post.id, "showOnHomepage", e.target.checked)
                            }
                            className="w-4 h-4 rounded text-[#0B2558] focus:ring-[#0B2558] border-gray-300"
                          />
                          <HomeIcon className="w-3.5 h-3.5 text-slate-400" />
                          Anasayfa
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                          <input
                            type="checkbox"
                            checked={post.showOnStories}
                            onChange={(e) =>
                              handleToggleChannel(post.id, "showOnStories", e.target.checked)
                            }
                            className="w-4 h-4 rounded text-[#0B2558] focus:ring-[#0B2558] border-gray-300"
                          />
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          Başarı Öyküleri
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 border-t border-gray-50 bg-gray-50/30">
                  {/* Audit Trail */}
                  {post.approvedByName && (
                    <div className="py-2.5 flex flex-col gap-1 border-b border-gray-50 text-[10px] text-gray-500 font-normal">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        Onaylayan: <b>{post.approvedByName}</b>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(post.approvedAt)}
                      </span>
                    </div>
                  )}

                  {/* Action buttons row */}
                  <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                    {post.status === 0 ? (
                      <>
                        <button
                          onClick={() => openConfirmModal(post.id, 1, post)}
                          className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Yayınla
                        </button>
                        <button
                          onClick={() => openConfirmModal(post.id, 2, post)}
                          className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reddet
                        </button>
                      </>
                    ) : post.status === 1 ? (
                      <button
                        onClick={() => openConfirmModal(post.id, 2, post)}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Yayından Kaldır
                      </button>
                    ) : (
                      <button
                        onClick={() => openConfirmModal(post.id, 1, post)}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Onayla & Yayınla
                      </button>
                    )}

                    <a
                      href={post.postUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-[#0A66C2] hover:bg-[#0A66C2]/5 rounded-lg border border-slate-200 transition"
                      title="LinkedIn'de Gör"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !isLoading && posts.length > 0 && (
        <div className="flex justify-center mt-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      {/* Detail Modal (Popup Dialog) */}
      {selectedDetailPost && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                {selectedDetailPost.companyLogoUrl ? (
                  <img
                    src={selectedDetailPost.companyLogoUrl}
                    alt={selectedDetailPost.companyName}
                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-150 font-bold text-gray-600 text-sm">
                    {selectedDetailPost.companyName ? selectedDetailPost.companyName.charAt(0) : "F"}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-none">{selectedDetailPost.companyName}</h3>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 leading-none">
                    <Calendar className="w-3.5 h-3.5" />
                    Gönderim Zamanı: {formatDate(selectedDetailPost.publishedAt)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailPost(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
              {/* Image Preview */}
              {selectedDetailPost.mediaUrl && (
                <div className="w-full rounded-2xl overflow-hidden max-h-[320px] bg-slate-50 border border-slate-100">
                  <img
                    src={selectedDetailPost.mediaUrl}
                    alt="Post Detail Media"
                    className="w-full h-full object-contain max-h-[320px] mx-auto"
                  />
                </div>
              )}

              {/* Message text */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-bold">Gönderi Açıklaması</span>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line font-normal">
                  {selectedDetailPost.postText || <span className="italic text-gray-400">Görsel paylaşıldı (Metin bulunmuyor)</span>}
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Yayın Durumu</span>
                  <div>
                    {selectedDetailPost.status === 0 ? (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 border border-amber-200 text-amber-800">
                        Beklemede
                      </span>
                    ) : selectedDetailPost.status === 1 ? (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-green-100 border border-green-200 text-green-800">
                        Yayınlandı
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-100 border border-red-200 text-red-800">
                        Reddedildi
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-bold">Öne Çıkarıldı mı?</span>
                  <span className={`text-[11px] font-bold ${selectedDetailPost.isFeatured ? "text-amber-600" : "text-gray-500"}`}>
                    {selectedDetailPost.isFeatured ? "Evet (Başarı Öykülerinde Öne Çıkıyor)" : "Hayır"}
                  </span>
                </div>

                {selectedDetailPost.approvedByName && (
                  <>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">İşlem Yapan Yönetici</span>
                      <span className="text-xs text-slate-800 font-bold">{selectedDetailPost.approvedByName}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">İşlem Zamanı</span>
                      <span className="text-xs text-slate-800 font-semibold">{formatDate(selectedDetailPost.approvedAt)}</span>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sosyal Mecra URN</span>
                  <span className="text-[11px] text-slate-800 font-mono break-all">{selectedDetailPost.linkedinPostUrn}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Veritabanı Güncelleme</span>
                  <span className="text-xs text-slate-800 font-semibold">{formatDate(selectedDetailPost.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3 justify-between bg-slate-50/50 items-center">
              <a
                href={`/firmalar/${selectedDetailPost.companyId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white hover:bg-slate-50 text-[#0B2558] border border-gray-200 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Building2 className="w-4 h-4 text-[#0B2558]" />
                Şirket Sayfasına Git
              </a>

              <div className="flex gap-2">
                <a
                  href={selectedDetailPost.postUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  LinkedIn'de Gör
                </a>
                <button
                  onClick={() => setSelectedDetailPost(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog Modal */}
      {confirmModalData && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-6 w-full max-w-md mx-auto relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setConfirmModalData(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon & Title depending on action type */}
            <div className="flex flex-col items-center text-center space-y-4">
              {confirmModalData.actionType === "publish_and_feature" ? (
                <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 text-amber-500 shadow-inner">
                  <Star className="w-8 h-8 fill-amber-500" />
                </div>
              ) : confirmModalData.actionType === "feature" && confirmModalData.targetFeatured ? (
                <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 text-amber-500 shadow-inner">
                  <Star className="w-8 h-8 fill-amber-500" />
                </div>
              ) : confirmModalData.actionType === "feature" && !confirmModalData.targetFeatured ? (
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100 text-red-500 shadow-inner">
                  <Star className="w-8 h-8 text-red-400" />
                </div>
              ) : confirmModalData.status === 1 ? (
                <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center border border-green-100 text-green-600 shadow-inner">
                  <Check className="w-8 h-8" />
                </div>
              ) : (
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100 text-red-600 shadow-inner">
                  <X className="w-8 h-8" />
                </div>
              )}

              <div>
                <h3 className="text-lg font-extrabold text-slate-800">
                  {confirmModalData.actionType === "publish_and_feature" ? "Yayınla ve Öne Çıkar" :
                    confirmModalData.actionType === "feature" ? (confirmModalData.targetFeatured ? "Gönderiyi Öne Çıkar" : "Öne Çıkarmayı Kaldır") :
                      confirmModalData.status === 1 ? "Gönderiyi Onayla ve Yayınla" : "Gönderiyi Reddet / Kaldır"}
                </h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {confirmModalData.actionType === "publish_and_feature" ? "Bu gönderi henüz yayında değil. Yayın mecralarını seçerek onaylayıp başarı öykülerinde öne çıkarabilirsiniz." :
                    confirmModalData.actionType === "feature" ? (confirmModalData.targetFeatured ? "Bu gönderiyi başarı öyküleri sayfasındaki karuselde öne çıkarmak istediğinize emin misiniz?" : "Bu gönderiyi öne çıkan gönderiler arasından kaldırmak istediğinize emin misiniz?") :
                      confirmModalData.status === 1 ? "Bu gönderiyi onaylayarak seçtiğiniz mecralarda yayınlamak istediğinize emin misiniz?" :
                        "Bu gönderiyi reddetmek ve yayından kaldırmak istediğinize emin misiniz?"}
                </p>
              </div>
            </div>

            {/* Short Card Preview */}
            <div className="mt-5 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
              {confirmModalData.post.companyLogoUrl ? (
                <img
                  src={confirmModalData.post.companyLogoUrl}
                  alt="logo"
                  className="h-8 w-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                  {confirmModalData.post.companyName ? confirmModalData.post.companyName.charAt(0) : "F"}
                </div>
              )}
              <div className="overflow-hidden flex-1">
                <h4 className="text-xs font-bold text-slate-800 truncate">{confirmModalData.post.companyName}</h4>
                <p className="text-[10px] text-gray-400 truncate max-w-[280px]">
                  {confirmModalData.post.postText || "Görsel paylaşıldı (Metin bulunmuyor)"}
                </p>
              </div>
            </div>

            {/* Channel Switches — shown for both regular approve (status) and publish_and_feature */}
            {(confirmModalData.actionType === "status" && confirmModalData.status === 1) || confirmModalData.actionType === "publish_and_feature" ? (
              <div className="mt-5 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Yayın Mecraları</span>

                {/* Anasayfa Switch */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-700">Anasayfa</span>
                  <button
                    onClick={() => toggleConfirmModalChannel("showOnHomepage")}
                    className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${confirmModalData.post.showOnHomepage ? "bg-green-600" : "bg-slate-200"
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${confirmModalData.post.showOnHomepage ? "translate-x-4.5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* Başarı Öyküleri Switch */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-700">Başarı Öyküleri</span>
                  <button
                    onClick={() => toggleConfirmModalChannel("showOnStories")}
                    className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${confirmModalData.post.showOnStories ? "bg-green-600" : "bg-slate-200"
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${confirmModalData.post.showOnStories ? "translate-x-4.5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* Info note for publish_and_feature */}
                {confirmModalData.actionType === "publish_and_feature" && (
                  <p className="text-[10px] text-amber-600 flex items-center gap-1 pt-1">
                    <Star className="w-3 h-3 fill-amber-500 shrink-0" />
                    Gönderi onaylandıktan sonra seçilen mecralarda yayınlanır ve öne çıkarılır.
                  </p>
                )}
              </div>
            ) : null}

            {/* Validation Error Banner */}
            {((confirmModalData.actionType === "status" && confirmModalData.status === 1) || confirmModalData.actionType === "publish_and_feature") && !confirmModalData.post.showOnHomepage && !confirmModalData.post.showOnStories && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2 font-medium animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Gönderiyi yayınlamak için en az bir yayın mecrası seçmelisiniz.</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmModalData(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Vazgeç
              </button>
              <button
                disabled={
                  ((confirmModalData.actionType === "status" && confirmModalData.status === 1) || confirmModalData.actionType === "publish_and_feature")
                  && !confirmModalData.post.showOnHomepage && !confirmModalData.post.showOnStories
                }
                onClick={handleConfirmAction}
                className={`flex-1 py-2.5 text-white rounded-xl text-xs font-semibold shadow-sm transition ${confirmModalData.actionType === "publish_and_feature"
                  ? "bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                  : confirmModalData.actionType === "feature" && confirmModalData.targetFeatured
                    ? "bg-amber-500 hover:bg-amber-600"
                    : confirmModalData.actionType === "feature" && !confirmModalData.targetFeatured
                      ? "bg-red-600 hover:bg-red-700"
                      : confirmModalData.status === 1
                        ? "bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                        : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {confirmModalData.actionType === "publish_and_feature"
                  ? "Yayınla ve Öne Çıkar"
                  : confirmModalData.actionType === "feature" && confirmModalData.targetFeatured
                    ? "Evet, Öne Çıkar"
                    : confirmModalData.actionType === "feature" && !confirmModalData.targetFeatured
                      ? "Öne Çıkarmayı Kaldır"
                      : "Evet, İşlemi Yap"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
