import { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import {
  GraduationCap,
  Search,
  Filter,
  Eye,
  Trash2,
  FileText,
  Download,
  ExternalLink,
  Clock,
  UserCheck,
  User,
  X,
  RefreshCw,
  AlertCircle,
  Save,
  Check,
  Undo2
} from "lucide-react";

/* ──────────────────────────── Helper Functions ──────────────────────────── */

const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5080/api";
  const origin = apiBase.replace(/\/api\/?$/, "");
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
};

const getStatusBadge = (status) => {
  switch (status) {
    case "Beklemede":
      return {
        label: "Beklemede",
        badge: "bg-amber-50 text-amber-800 border-amber-200",
      };
    case "Incelendi":
      return {
        label: "İncelendi",
        badge: "bg-blue-50 text-blue-800 border-blue-200",
      };
    case "Kabul":
      return {
        label: "Kabul Edildi",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      };
    case "Red":
      return {
        label: "Reddedildi",
        badge: "bg-rose-50 text-rose-800 border-rose-200",
      };
    default:
      return {
        label: status || "Belirtilmedi",
        badge: "bg-slate-50 text-slate-700 border-slate-200",
      };
  }
};

const formatInternshipType = (type) => {
  switch (type) {
    case "Zorunlu":
      return "Zorunlu Staj";
    case "Gonullu":
    case "Gönüllü":
      return "Gönüllü Staj";
    case "IsyeriEgitimi":
    case "İş Yeri Eğitimi":
      return "İş Yeri Eğitimi";
    default:
      return type || "-";
  }
};

const formatInternshipTime = (time) => {
  switch (time) {
    case "TamZamanli":
    case "Tam Zamanlı":
      return "Tam Zamanlı";
    case "YariZamanli":
    case "Yarı Zamanlı":
      return "Yarı Zamanlı";
    default:
      return time || "-";
  }
};

const formatClassYear = (year) => {
  switch (year) {
    case "hazirlik":
      return "Hazırlık Sınıfı";
    case "yeni-mezun":
      return "Yeni Mezun";
    case "1":
      return "1. Sınıf";
    case "2":
      return "2. Sınıf";
    case "3":
      return "3. Sınıf";
    case "4":
      return "4. Sınıf";
    case "5":
      return "5. Sınıf";
    default:
      return year ? `${year}. Sınıf` : "-";
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const formatDateOnly = (dateStr) => {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

/* ──────────────────────────── Main Component ──────────────────────────── */

export default function AdminInternshipPage() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Filters & Search State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pending Status Changes for Table Rows: { [id]: newStatus }
  const [pendingTableStatuses, setPendingTableStatuses] = useState({});

  // Modals State
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalPendingStatus, setModalPendingStatus] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await adminAxios.get("/internship-applications");
      setApplications(response.data);
      setPendingTableStatuses({});
    } catch (error) {
      console.error("Staj başvuruları yüklenirken hata oluştu:", error);
      setErrorMessage("Başvurular yüklenirken bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchApplications();
    setIsRefreshing(false);
  };

  // Save Status Handler
  const handleSaveStatus = async (id, newStatus) => {
    if (!newStatus) return;
    setSavingId(id);
    try {
      const response = await adminAxios.patch(`/internship-applications/${id}/status`, {
        status: newStatus,
      });

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, ...response.data } : app))
      );

      setPendingTableStatuses((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      if (selectedApp && selectedApp.id === id) {
        setSelectedApp((prev) => ({ ...prev, ...response.data }));
        setModalPendingStatus(response.data.status);
      }
    } catch (error) {
      console.error("Durum kaydedilirken hata oluştu:", error);
      alert("Durum kaydedilirken bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setSavingId(null);
    }
  };

  const handleTableStatusSelect = (id, newStatus) => {
    setPendingTableStatuses((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const handleCancelTableStatus = (id) => {
    setPendingTableStatuses((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDelete = async (app) => {
    const candidateName = `${app.firstName} ${app.lastName}`;
    if (!window.confirm(`"${candidateName}" isimli adayın staj başvurusunu silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await adminAxios.delete(`/internship-applications/${app.id}`);
      setApplications((prev) => prev.filter((item) => item.id !== app.id));
      if (selectedApp?.id === app.id) {
        setIsDetailModalOpen(false);
        setSelectedApp(null);
      }
    } catch (error) {
      console.error("Başvuru silinirken hata oluştu:", error);
      alert("Başvuru silinirken bir hata oluştu.");
    }
  };

  const openDetailModal = (app) => {
    setSelectedApp(app);
    setModalPendingStatus(pendingTableStatuses[app.id] || app.status);
    setIsDetailModalOpen(true);
  };

  const handleDownload = async (url, filename) => {
    if (!url) {
      alert("Dosya bağlantısı bulunamadı.");
      return;
    }
    const fullUrl = getFileUrl(url);
    try {
      const link = document.createElement("a");
      link.href = fullUrl;
      link.target = "_blank";
      link.download = filename || "dosya";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Dosya indirme hatası:", err);
      window.open(fullUrl, "_blank");
    }
  };

  /* ──────── Filtered & Sorted Applications ──────── */
  const filteredApplications = applications
    .filter((app) => {
      if (search.trim()) {
        const query = search.toLowerCase();
        const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
        const email = (app.email || "").toLowerCase();
        const phone = (app.phone || "").toLowerCase();
        const university = (app.university || "").toLowerCase();
        const department = (app.department || "").toLowerCase();

        if (
          !fullName.includes(query) &&
          !email.includes(query) &&
          !phone.includes(query) &&
          !university.includes(query) &&
          !department.includes(query)
        ) {
          return false;
        }
      }

      if (statusFilter !== "ALL" && app.status !== statusFilter) {
        return false;
      }

      if (typeFilter !== "ALL" && app.internshipType !== typeFilter) {
        return false;
      }

      if (timeFilter !== "ALL" && app.internshipTime !== timeFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.appliedAt || 0).getTime();
      const dateB = new Date(b.appliedAt || 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  // Statistics counters
  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === "Beklemede").length;
  const reviewedCount = applications.filter((a) => a.status === "Incelendi").length;
  const acceptedCount = applications.filter((a) => a.status === "Kabul").length;
  const rejectedCount = applications.filter((a) => a.status === "Red").length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 text-slate-800">
      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Staj Başvuruları
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">
            Staj başvurusunda bulunan adayların listesini ve detaylarını buradan inceleyebilirsiniz.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg border border-slate-200 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`cursor-pointer bg-white rounded-xl border p-4 shadow-2xs transition ${
            statusFilter === "ALL" ? "border-slate-800 ring-1 ring-slate-800/10" : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Toplam</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter("Beklemede")}
          className={`cursor-pointer bg-white rounded-xl border p-4 shadow-2xs transition ${
            statusFilter === "Beklemede" ? "border-amber-500 ring-1 ring-amber-500/10" : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">Bekleyen</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter("Incelendi")}
          className={`cursor-pointer bg-white rounded-xl border p-4 shadow-2xs transition ${
            statusFilter === "Incelendi" ? "border-blue-600 ring-1 ring-blue-600/10" : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">İncelendi</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">{reviewedCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter("Kabul")}
          className={`cursor-pointer bg-white rounded-xl border p-4 shadow-2xs transition ${
            statusFilter === "Kabul" ? "border-emerald-600 ring-1 ring-emerald-600/10" : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Kabul Edilen</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{acceptedCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter("Red")}
          className={`cursor-pointer bg-white rounded-xl border p-4 shadow-2xs transition ${
            statusFilter === "Red" ? "border-rose-600 ring-1 ring-rose-600/10" : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">Reddedilen</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">{rejectedCount}</p>
        </div>
      </div>

      {/* ── Search & Filters Bar ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ad, soyad, e-posta, telefon veya üniversite ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 transition"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="Beklemede">Bekleyen</option>
              <option value="Incelendi">İncelendi</option>
              <option value="Kabul">Kabul Edilen</option>
              <option value="Red">Reddedilen</option>
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 transition"
          >
            <option value="ALL">Tüm Staj Türleri</option>
            <option value="Zorunlu">Zorunlu Staj</option>
            <option value="Gonullu">Gönüllü Staj</option>
            <option value="IsyeriEgitimi">İş Yeri Eğitimi</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 transition"
          >
            <option value="ALL">Tüm Zamanlar</option>
            <option value="TamZamanli">Tam Zamanlı</option>
            <option value="YariZamanli">Yarı Zamanlı</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 transition"
          >
            <option value="newest">Yeniden Eskiye</option>
            <option value="oldest">Eskiden Yeniye</option>
          </select>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-700 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Applications Table Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <RefreshCw className="w-6 h-6 text-slate-500 animate-spin mb-3" />
            <p className="text-slate-500 text-xs font-medium">Staj başvuruları yükleniyor...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Başvuru Bulunamadı
            </h3>
            <p className="text-slate-500 text-xs max-w-md">
              {search || statusFilter !== "ALL" || typeFilter !== "ALL" || timeFilter !== "ALL"
                ? "Arama kriterlerinize uygun staj başvurusu bulunamadı."
                : "Henüz sisteme yapılmış bir staj başvurusu bulunmamaktadır."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Aday</th>
                  <th className="py-3 px-4">Üniversite & Bölüm</th>
                  <th className="py-3 px-4">Staj Detayı</th>
                  <th className="py-3 px-4">Başvuru Tarihi</th>
                  <th className="py-3 px-4">Durum</th>
                  <th className="py-3 px-4 sm:px-6 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {filteredApplications.map((app) => {
                  const currentStatus = app.status || "Beklemede";
                  const pendingStatus = pendingTableStatuses[app.id];
                  const displayStatus = pendingStatus !== undefined ? pendingStatus : currentStatus;
                  const hasUnsavedChange = pendingStatus !== undefined && pendingStatus !== currentStatus;
                  const isSaving = savingId === app.id;
                  const statusInfo = getStatusBadge(displayStatus);
                  const photoUrl = getFileUrl(app.photoFileUrl);

                  return (
                    <tr
                      key={app.id}
                      className={`transition-colors group ${
                        hasUnsavedChange ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Aday Foto & İsim */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => photoUrl && setPhotoPreviewUrl(photoUrl)}
                            className={`w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center ${
                              photoUrl ? "cursor-pointer hover:ring-2 hover:ring-slate-400/50 transition" : ""
                            }`}
                            title={photoUrl ? "Fotoğrafı Büyüt" : "Fotoğraf Yok"}
                          >
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={`${app.firstName} ${app.lastName}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <User className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                              {app.firstName} {app.lastName}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>{app.email}</span>
                              {app.phone && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span>{app.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Üniversite & Bölüm */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 line-clamp-1">
                          {app.university || "-"}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1">
                          {app.department || "-"} {app.classYear && `(${formatClassYear(app.classYear)})`}
                        </div>
                      </td>

                      {/* Staj Detayı */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                          {formatInternshipType(app.internshipType)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {formatInternshipTime(app.internshipTime)}
                        </div>
                      </td>

                      {/* Başvuru Tarihi */}
                      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                        {formatDate(app.appliedAt)}
                      </td>

                      {/* Durum Selector & Kaydet */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            disabled={isSaving}
                            value={displayStatus}
                            onChange={(e) => handleTableStatusSelect(app.id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition focus:outline-none focus:ring-1 focus:ring-slate-400 ${statusInfo.badge} ${
                              hasUnsavedChange ? "ring-2 ring-amber-400" : ""
                            }`}
                          >
                            <option value="Beklemede">Beklemede</option>
                            <option value="Incelendi">İncelendi</option>
                            <option value="Kabul">Kabul Edildi</option>
                            <option value="Red">Reddedildi</option>
                          </select>

                          {hasUnsavedChange && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleSaveStatus(app.id, pendingStatus)}
                                disabled={isSaving}
                                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md transition flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50"
                                title="Değişikliği Kaydet"
                              >
                                {isSaving ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-3 h-3" />
                                    Kaydet
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleCancelTableStatus(app.id)}
                                disabled={isSaving}
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-md transition"
                                title="İptal Et"
                              >
                                <Undo2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* İşlem Butonları */}
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openDetailModal(app)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                            title="Başvuru Detayını İncele"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {app.cvFileUrl ? (
                            <button
                              onClick={() => handleDownload(app.cvFileUrl, `${app.firstName}_${app.lastName}_CV.pdf`)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="CV İndir / Görüntüle"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="p-1.5 text-slate-300 cursor-not-allowed" title="CV Bulunamadı">
                              <FileText className="w-4 h-4" />
                            </span>
                          )}

                          <button
                            onClick={() => handleDelete(app)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Başvuruyu Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ──────────────────────────── DETAIL MODAL ──────────────────────────── */}
      {isDetailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/60">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedApp.firstName} {selectedApp.lastName}
                  </h2>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(modalPendingStatus).badge}`}>
                    {getStatusBadge(modalPendingStatus).label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Başvuru Tarihi: <span className="font-medium text-slate-700">{formatDate(selectedApp.appliedAt)}</span>
                </p>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              
              {/* Status Selector Bar */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  BAŞVURU DURUMUNU DEĞİŞTİR:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setModalPendingStatus("Beklemede")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      modalPendingStatus === "Beklemede"
                        ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Beklemede
                  </button>
                  <button
                    onClick={() => setModalPendingStatus("Incelendi")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      modalPendingStatus === "Incelendi"
                        ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    İncelendi
                  </button>
                  <button
                    onClick={() => setModalPendingStatus("Kabul")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      modalPendingStatus === "Kabul"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Kabul Edildi
                  </button>
                  <button
                    onClick={() => setModalPendingStatus("Red")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      modalPendingStatus === "Red"
                        ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Reddedildi
                  </button>
                </div>
              </div>

              {/* Warning notice if status modified */}
              {modalPendingStatus !== selectedApp.status && (
                <div className="bg-amber-50 border border-amber-200/80 text-amber-900 p-3 rounded-xl text-xs flex items-center justify-between">
                  <span>
                    Durum değişti ({getStatusBadge(selectedApp.status).label} → {getStatusBadge(modalPendingStatus).label}). Değişikliği uygulamak için <strong>"Kaydet"</strong> butonuna basınız.
                  </span>
                </div>
              )}

              {/* Section 1: Kişisel Bilgiler (Fotoğraf & İsim Soyisim) */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100">
                  KİŞİSEL BİLGİLER
                </h3>
                <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-14 text-xs sm:text-sm">
                  {/* Direkt Görünür Fotoğraf (Tam Boyut / Kırpılmamış) */}
                  <div
                    onClick={() => getFileUrl(selectedApp.photoFileUrl) && setPhotoPreviewUrl(getFileUrl(selectedApp.photoFileUrl))}
                    className="shrink-0 cursor-pointer group"
                    title="Fotoğrafı Büyütmek İçin Tıklayın"
                  >
                    {selectedApp.photoFileUrl ? (
                      <div className="p-1 bg-white border border-slate-200 rounded-xl shadow-2xs group-hover:border-slate-400 transition inline-block">
                        <img
                          src={getFileUrl(selectedApp.photoFileUrl)}
                          alt={`${selectedApp.firstName} ${selectedApp.lastName}`}
                          className="max-h-56 max-w-[220px] w-auto h-auto rounded-lg object-contain block"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-28 rounded-xl bg-slate-200 border border-slate-300 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                        <User className="w-7 h-7 mb-1" />
                        <span className="text-[10px] font-medium leading-tight">Fotoğraf Yüklenmedi</span>
                      </div>
                    )}
                  </div>

                  {/* İsim Soyisim (Çizgisiz, çizgi hizasında başlayan düzen) */}
                  <div className="flex flex-wrap items-center gap-8 sm:gap-12 py-1">
                    <div>
                      <span className="text-xs font-medium text-slate-400 block mb-1">Adı</span>
                      <span className="font-semibold text-slate-900 text-sm sm:text-base">{selectedApp.firstName || "-"}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400 block mb-1">Soyadı</span>
                      <span className="font-semibold text-slate-900 text-sm sm:text-base">{selectedApp.lastName || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: İletişim Bilgileri */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100">
                  İLETİŞİM BİLGİLERİ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 text-xs sm:text-sm">
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">E-posta Adresi</span>
                    <a
                      href={`mailto:${selectedApp.email}`}
                      className="font-semibold text-blue-600 hover:underline text-sm"
                    >
                      {selectedApp.email || "-"}
                    </a>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Telefon Numarası</span>
                    <a
                      href={`tel:${selectedApp.phone}`}
                      className="font-semibold text-slate-900 hover:text-blue-600 text-sm"
                    >
                      {selectedApp.phone || "-"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Section 3: Eğitim ve Staj Bilgileri */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100">
                  EĞİTİM VE STAJ BİLGİLERİ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 text-xs sm:text-sm">
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Üniversite</span>
                    <span className="font-semibold text-slate-900">{selectedApp.university || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Bölüm</span>
                    <span className="font-semibold text-slate-900">{selectedApp.department || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Sınıf Derecesi</span>
                    <span className="font-semibold text-slate-900">{formatClassYear(selectedApp.classYear)}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Üniv. Başlangıç Tarihi</span>
                    <span className="font-semibold text-slate-900">{formatDateOnly(selectedApp.universityStartDate)}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Staj Türü</span>
                    <span className="font-semibold text-blue-600">{formatInternshipType(selectedApp.internshipType)}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Staj Zamanı</span>
                    <span className="font-semibold text-slate-900">{formatInternshipTime(selectedApp.internshipTime)}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Ön Yazı */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
                  ÖN YAZI / KENDİNDEN BAHSET
                </h3>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedApp.coverLetter || selectedApp.aboutMe || "Aday ön yazı girmemiştir."}
                </div>
              </div>

              {/* Section 5: Yasal İzinler & KVKK Onayları */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100">
                  YASAL İZİNLER VE KVKK ONAYLARI
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">KVKK Aydınlatma Metni Onayı</span>
                    <span className="text-slate-500">Onay Tarihi: {formatDate(selectedApp.kvkkConsentAt)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Açık Rıza Metni Onayı</span>
                    <span className="text-slate-500">Onay Tarihi: {formatDate(selectedApp.explicitConsentAt)}</span>
                  </div>
                </div>
              </div>

              {/* Section 6: Sistem Kayıt Bilgileri */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
                  SİSTEM KAYIT BİLGİLERİ (AUDIT)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-100/50 p-3 rounded-xl text-slate-600">
                  <div>
                    <span className="text-slate-400 block mb-0.5">UUID</span>
                    <span className="font-mono text-[11px] text-slate-700 truncate block">{selectedApp.uuid || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Onaylayan Admin ID</span>
                    <span className="font-medium text-slate-800">{selectedApp.approvedBy || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Güncelleyen Admin ID</span>
                    <span className="font-medium text-slate-800">{selectedApp.updatedBy || "-"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Son Güncelleme</span>
                    <span className="text-slate-800">{formatDate(selectedApp.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Section 7: CV Dosyası */}
              <div>
                <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ÖZGEÇMİŞ (CV) DOSYASI
                  </h3>

                  {selectedApp.cvFileUrl && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(getFileUrl(selectedApp.cvFileUrl), "_blank")}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3 h-3" /> Yeni Sekmede Aç
                      </button>
                      <button
                        onClick={() => handleDownload(selectedApp.cvFileUrl, `${selectedApp.firstName}_${selectedApp.lastName}_CV.pdf`)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition shadow-2xs"
                      >
                        <Download className="w-3 h-3" /> İndir
                      </button>
                    </div>
                  )}
                </div>

                {selectedApp.cvFileUrl ? (
                  <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-200 h-[400px]">
                    <iframe
                      src={getFileUrl(selectedApp.cvFileUrl)}
                      className="w-full h-full border-none"
                      title="CV PDF Ön İzleme"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500 text-xs">
                    Bu başvuruya ait CV dosyası bulunamadı.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
              <div>
                {modalPendingStatus !== selectedApp.status && (
                  <span className="text-xs text-amber-700 font-medium">
                    Değişiklik henüz kaydedilmedi.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Kapat
                </button>

                {modalPendingStatus !== selectedApp.status && (
                  <button
                    onClick={() => handleSaveStatus(selectedApp.id, modalPendingStatus)}
                    disabled={savingId === selectedApp.id}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                  >
                    {savingId === selectedApp.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Kaydet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────── PHOTO PREVIEW MODAL ──────────────────────────── */}
      {photoPreviewUrl && (
        <div
          onClick={() => setPhotoPreviewUrl(null)}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2">
            <img
              src={photoPreviewUrl}
              alt="Aday Fotoğrafı"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setPhotoPreviewUrl(null)}
              className="absolute top-3 right-3 bg-slate-900/70 text-white p-1.5 rounded-full hover:bg-slate-900 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
