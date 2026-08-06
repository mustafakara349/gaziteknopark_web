import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Calendar, ArrowUpDown, RotateCcw, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { getNews, getNewsCategories } from "../api/endpoints";
import { getImageUrl } from "../utils/imageUrl";

export default function NewsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial values from URL Search Params
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("categoryId") || "";
  const initialDate = searchParams.get("date") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [newsData, setNewsData] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filter & Search & Sort States
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [sort, setSort] = useState(initialSort);

  // Pagination States
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  // Fallback image link
  const DEFAULT_COVER = "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800";

  // Sync state changes with URL Search Params
  useEffect(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (selectedCategoryId) params.categoryId = selectedCategoryId;
    if (selectedDate) params.date = selectedDate;
    if (sort && sort !== "newest") params.sort = sort;
    if (currentPage > 1) params.page = currentPage.toString();

    setSearchParams(params, { replace: true });
  }, [search, selectedCategoryId, selectedDate, sort, currentPage, setSearchParams]);

  // Fetch categories on mount
  useEffect(() => {
    getNewsCategories()
      .then((res) => {
        const catList = Array.isArray(res) ? res : (res?.data || []);
        setCategories(catList);
      })
      .catch((err) => console.error("Kategoriler çekilirken hata:", err));
  }, []);

  // Fetch news based on search, category, date, sort, and pagination
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const params = {
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
      };
      if (selectedCategoryId) params.categoryId = selectedCategoryId;
      if (search.trim()) params.search = search.trim();
      if (selectedDate) params.date = selectedDate;
      if (sort) params.sort = sort;

      getNews(params)
        .then((res) => {
          setNewsData(res?.data || []);
          setTotalPages(res?.totalPages || 0);
        })
        .catch((err) => console.error("Haberler çekilirken hata oluştu:", err))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedCategoryId, selectedDate, sort, currentPage]);

  const hasActiveFilters = search.trim() !== "" || selectedCategoryId !== "" || selectedDate !== "" || sort !== "newest";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategoryId("");
    setSelectedDate("");
    setSort("newest");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };


  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen">
      {/* Top Section (Haberler) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        <div>

          {/* Integrated Search, Category, Date & Sort Filter Bar */}
          <div className="bg-white rounded-2xl md:rounded-full p-3 mb-10 shadow-lg border border-gray-100 flex flex-col lg:flex-row items-center gap-3">

            {/* 1. Search Bar */}
            <div className="relative flex-1 w-full pl-3">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Haber başlığı, içerik veya yazar ara..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-8 py-3 bg-transparent border-none text-sm text-[#0B2558] placeholder-gray-400 focus:outline-none focus:ring-0 font-medium"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="h-8 w-px bg-gray-200 hidden lg:block" />

            {/* 2. Category Filter */}
            <div className="relative w-full lg:w-48 shrink-0">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Filter size={16} />
              </div>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-9 py-3 bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 rounded-full text-sm font-medium text-[#0B2558] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] appearance-none cursor-pointer transition-colors"
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

            <div className="h-8 w-px bg-gray-200 hidden lg:block" />

            {/* 3. Specific Date Picker */}
            <div className="relative w-full lg:w-44 shrink-0">
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
                title="Tarihe Göre Filtrele"
              />
            </div>

            <div className="h-8 w-px bg-gray-200 hidden lg:block" />

            {/* 4. Sort Dropdown */}
            <div className="relative w-full lg:w-52 shrink-0">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ArrowUpDown size={16} />
              </div>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-9 py-3 bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 rounded-full text-sm font-medium text-[#0B2558] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] appearance-none cursor-pointer transition-colors"
              >
                <option value="newest">En Yeniden En Eskiye</option>
                <option value="oldest">En Eskiden En Yeniye</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* 5. Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="w-full lg:w-auto px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shrink-0"
                title="Filtreleri Temizle"
              >
                <RotateCcw size={14} />
                <span>Temizle</span>
              </button>
            )}

          </div>

          {/* News List Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col animate-pulse"
                >
                  {/* Image Skeleton */}
                  <div className="h-[210px] bg-gray-100" />

                  {/* Content Skeleton */}
                  <div className="p-8 flex flex-col flex-grow">
                    {/* Date Skeleton */}
                    <div className="h-3.5 bg-gray-100 rounded-full w-24 mb-4" />

                    {/* Title Lines Skeleton */}
                    <div className="h-5 bg-gray-100 rounded-lg w-full mb-2.5" />
                    <div className="h-5 bg-gray-100 rounded-lg w-3/4 mb-5" />

                    {/* Summary Lines Skeleton */}
                    <div className="h-3.5 bg-gray-100 rounded-md w-full mb-2" />
                    <div className="h-3.5 bg-gray-100 rounded-md w-4/5 mb-8" />

                    {/* Button Skeleton */}
                    <div className="mt-auto flex items-center gap-2">
                      <div className="h-4 bg-gray-100 rounded-md w-24" />
                      <div className="h-4 w-4 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : newsData.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm my-4">
              <p className="text-lg font-bold text-[#0B2558] mb-2">Aramanıza Uyan Haber Bulunamadı</p>
              <p className="text-gray-500 text-sm mb-6">Seçtiğiniz tarih, kategori veya arama kelimesine ait haber bulunmuyor.</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#0066cc] text-white rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Tüm Haberleri Göster
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {newsData.map((item) => {
                  const title = item.title || item.translations?.[0]?.title || "Başlıksız Haber";
                  const summary = item.summary || item.translations?.[0]?.summary || "";

                  return (
                    <Link
                      to={`/haberler/${item.slug || item.id}`}
                      key={item.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] group/card"
                    >
                      <div className="w-full aspect-[3/2] overflow-hidden relative bg-gray-50">
                        <img
                          src={getImageUrl(item.coverImageUrl) || DEFAULT_COVER}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover blur-xl brightness-75 scale-110"
                        />
                        <img
                          src={getImageUrl(item.coverImageUrl) || DEFAULT_COVER}
                          alt={title}
                          onError={(e) => { e.target.src = DEFAULT_COVER; }}
                          className="relative w-full h-full object-contain transition-transform duration-700 group-hover/card:scale-110"
                        />
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="text-[#0066cc] text-[0.85rem] font-medium mb-3">
                          {formatDate(item.publishedAt)}
                        </div>
                        <h3 className="text-[1.3rem] font-bold text-[#0B2558] mb-4 leading-snug group-hover/card:text-[#0066cc] transition-colors">
                          {title}
                        </h3>
                        <p className="text-gray-500 text-[0.9rem] mb-8 line-clamp-2 leading-relaxed">
                          {summary}
                        </p>

                        <div className="mt-auto">
                          <span className="inline-flex items-center text-[#0B2558] font-bold text-[0.85rem] group/btn">
                            Devamını Oku
                            <ChevronRight
                              size={16}
                              strokeWidth={2.5}
                              className="ml-1 text-[#0066cc] transition-transform group-hover/card:translate-x-1"
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-14">
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all bg-white"
                    title="Önceki Sayfa"
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
                            window.scrollTo({ top: 200, behavior: 'smooth' });
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
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all bg-white"
                    title="Sonraki Sayfa"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
