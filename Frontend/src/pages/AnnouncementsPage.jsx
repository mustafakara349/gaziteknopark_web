import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, ArrowRight, Calendar, Filter, RotateCcw, ChevronDown } from "lucide-react";
import apiClient from "../api/client";
import { getAnnouncementCategories } from "../api/endpoints";

const ITEMS_PER_PAGE = 6;

export default function AnnouncementsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("categoryId") || "";
  const initialDate = searchParams.get("date") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [categories, setCategories] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const navigate = useNavigate();

  // Sync state changes with URL Search Params
  useEffect(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (selectedCategoryId) params.categoryId = selectedCategoryId;
    if (selectedDate) params.date = selectedDate;
    if (currentPage > 1) params.page = currentPage.toString();

    setSearchParams(params, { replace: true });
  }, [search, selectedCategoryId, selectedDate, currentPage, setSearchParams]);

  // Fetch categories on mount
  useEffect(() => {
    getAnnouncementCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => console.error("Duyuru kategorileri çekilirken hata:", err));
  }, []);

  // Fetch announcements
  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
      };
      if (selectedCategoryId) params.categoryId = selectedCategoryId;
      if (search.trim()) params.search = search.trim();
      if (selectedDate) params.date = selectedDate;

      const response = await apiClient.get("/announcements", { params });
      setAnnouncements(response.data || []);
      const total = parseInt(response.headers["x-total-count"] || "0", 10);
      setTotalCount(total);
    } catch (err) {
      console.error("Duyurular çekilirken hata:", err);
      setAnnouncements([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategoryId, search, selectedDate]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

  const formatDate = (dateString) => {
    if (!dateString) return { day: "--", month: "---" };
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, "0");
    const months = ["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"];
    const month = months[d.getMonth()];
    return { day, month };
  };

  // Debounced search
  const [searchTimer, setSearchTimer] = useState(null);
  const handleSearchChange = (value) => {
    setSearch(value);
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(
      setTimeout(() => {
        setCurrentPage(1);
      }, 400)
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategoryId("");
    setSelectedDate("");
    setCurrentPage(1);
  };

  const hasActiveFilter = !!search || !!selectedCategoryId || !!selectedDate;

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Integrated Search, Category & Date Filter Bar */}
        <div className="bg-white rounded-2xl md:rounded-full p-3 mb-10 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-3">

          {/* Search Input */}
          <div className="relative flex-1 w-full pl-3">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Duyurularda ara..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-transparent border-none text-sm text-[#0B2558] placeholder-gray-400 focus:outline-none focus:ring-0 font-medium"
            />
          </div>

          <div className="h-8 w-px bg-gray-200 hidden md:block" />

          {/* Category Dropdown (Combobox) */}
          <div className="relative w-full md:w-56 shrink-0">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Filter size={16} />
            </div>
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-10 py-3 bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 rounded-full text-sm font-medium text-[#0B2558] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] appearance-none cursor-pointer transition-colors"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="h-8 w-px bg-gray-200 hidden md:block" />

          {/* Date Picker */}
          <div className="relative w-full md:w-48 shrink-0">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Calendar size={16} />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 rounded-full text-sm font-medium text-[#0B2558] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] cursor-pointer transition-colors"
            />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilter && (
            <button
              onClick={handleResetFilters}
              className="w-full md:w-auto px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shrink-0"
              title="Filtreleri Temizle"
            >
              <RotateCcw size={14} />
              <span className="md:hidden lg:inline">Temizle</span>
            </button>
          )}

        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-[2rem] p-6 border border-gray-200 animate-pulse flex h-36">
                <div className="w-20 h-24 bg-gray-100 rounded-2xl mr-6 shrink-0"></div>
                <div className="flex-1 py-2">
                  <div className="w-20 h-5 bg-gray-100 rounded-full mb-3"></div>
                  <div className="w-3/4 h-6 bg-gray-100 rounded mb-3"></div>
                  <div className="w-full h-4 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-200 shadow-sm">
            <p className="text-lg font-bold text-[#0B2558] mb-2">Aramanıza Uyan Duyuru Bulunamadı</p>
            <p className="text-gray-500 text-sm mb-6">Seçtiğiniz filtreleme kriterlerine uygun duyuru kaydı bulunmuyor.</p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-full text-sm font-medium hover:bg-[#152e6e] transition-colors"
            >
              Tüm Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {announcements.map((item) => {
              const { day, month } = formatDate(item.publishedAt);
              const categoryName = item.categoryName || "Genel";

              return (
                <div
                  key={item.id}
                  className="bg-[#fcfcfd] rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between border border-gray-200 hover:border-blue-300 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => navigate(`/duyurular/${item.slug}`)}
                >
                  <div className="flex items-start md:items-center gap-6 md:gap-8 w-full md:w-auto flex-1">

                    {/* Date Block */}
                    <div className="w-20 h-24 md:w-24 md:h-28 rounded-2xl bg-[#EBF3FF] flex flex-col items-center justify-center shrink-0">
                      <span className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A] leading-none mb-1">{day}</span>
                      <span className="text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">{month}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wide mb-3">
                        {categoryName}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-[#0B2558] mb-2 group-hover:text-[#0066cc] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 md:pr-12">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  {/* Detay Link */}
                  <div className="hidden md:flex items-center gap-2 text-[#0066cc] font-semibold text-sm shrink-0 pl-6 border-l border-gray-100 h-full py-8 ml-4">
                    Detay
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all bg-white"
                >
                  <ChevronLeft size={16} />
                </button>

                {(() => {
                  const pages = [];
                  if (totalPages <= 5) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (currentPage > 3) pages.push("...");
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    for (let i = start; i <= end; i++) {
                      if (!pages.includes(i)) pages.push(i);
                    }
                    if (currentPage < totalPages - 2) pages.push("...");
                    if (!pages.includes(totalPages)) pages.push(totalPages);
                  }

                  return pages.map((pageNum, idx) => {
                    if (pageNum === "...") {
                      return (
                        <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold select-none">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 rounded-full font-semibold text-sm transition-all ${currentPage === pageNum
                            ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  });
                })()}

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all bg-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
