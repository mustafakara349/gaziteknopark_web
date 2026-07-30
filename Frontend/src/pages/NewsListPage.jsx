import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Calendar, ArrowUpDown, RotateCcw, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getNews, getNewsCategories } from "../api/endpoints";

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
  const ITEMS_PER_PAGE = 15; // 3 columns x 5 rows
  const [currentPage, setCurrentPage] = useState(initialPage);

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
      const params = {};
      if (selectedCategoryId) params.categoryId = selectedCategoryId;
      if (search.trim()) params.search = search.trim();
      if (selectedDate) params.date = selectedDate;
      if (sort) params.sort = sort;

      getNews(params)
        .then((res) => {
          const list = Array.isArray(res) ? res : (res?.data || []);
          setNewsData(list);
        })
        .catch((err) => console.error("Haberler çekilirken hata oluştu:", err))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedCategoryId, selectedDate, sort]);

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

  // Pagination calculation
  const totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);
  const paginatedNews = newsData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen">
      {/* Top Section (Haberler) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        <div>

          {/* Dedicated Filter & Search & Sort Bar */}
          <div className="bg-white rounded-[1.5rem] p-4 mb-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-wrap lg:flex-nowrap items-center gap-3">

            {/* 1. Search Bar */}
            <div className="relative flex-1 min-w-[220px] w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Haber başlığı, içerik veya yazar ara..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-10 py-3 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-transparent focus:border-[#0066cc] rounded-xl text-sm text-[#0B2558] placeholder-gray-400 focus:outline-none transition-all"
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

            {/* 2. Category Filter */}
            <div className="relative w-full sm:w-auto flex-1 min-w-[180px]">
              <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-8 py-3 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-transparent focus:border-[#0066cc] rounded-xl text-sm text-[#0B2558] font-medium appearance-none focus:outline-none cursor-pointer transition-all"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Specific Date Picker */}
            <div className="relative w-full sm:w-auto flex-1 min-w-[160px]">
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-3 py-3 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-transparent focus:border-[#0066cc] rounded-xl text-xs text-[#0B2558] font-medium focus:outline-none cursor-pointer transition-all"
                title="Tarihe Göre Filtrele"
              />
            </div>

            {/* 4. Sort Dropdown */}
            <div className="relative w-full sm:w-auto flex-1 min-w-[180px]">
              <ArrowUpDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-8 py-3 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-transparent focus:border-[#0066cc] rounded-xl text-sm text-[#0B2558] font-medium appearance-none focus:outline-none cursor-pointer transition-all"
              >
                <option value="newest">En Yeniden En Eskiye</option>
                <option value="oldest">En Eskiden En Yeniye</option>
              </select>
            </div>

            {/* 5. Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto px-4 py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
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
                {paginatedNews.map((item) => {
                  const title = item.title || item.translations?.[0]?.title || "Başlıksız Haber";
                  const summary = item.summary || item.translations?.[0]?.summary || "";

                  return (
                    <Link
                      to={`/haberler/${item.slug || item.id}`}
                      key={item.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] group/card"
                    >
                      <div className="h-[210px] overflow-hidden relative">
                        <img
                          src={item.coverImageUrl || DEFAULT_COVER}
                          alt={title}
                          onError={(e) => { e.target.src = DEFAULT_COVER; }}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
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
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Önceki Sayfa"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 200, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${currentPage === pageNum
                        ? "bg-[#0066cc] text-white shadow-sm"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Sonraki Sayfa"
                  >
                    <ChevronRight size={18} />
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
