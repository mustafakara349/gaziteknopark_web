import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getLinkedInPosts, getCompanies, getCompanyCategories, getActivityAreas } from "../api/endpoints";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import SuccessStoriesFilter from "../components/success-stories/SuccessStoriesFilter";
import FeaturedStoriesCarousel from "../components/success-stories/FeaturedStoriesCarousel";

const PAGE_SIZE = 12;

export default function SuccessStoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL params
  const initialSearch   = searchParams.get("search")   || "";
  const initialSector   = searchParams.get("sector")   || "";
  const initialActivity = searchParams.get("activity") || "";
  const initialPage     = parseInt(searchParams.get("page") || "1", 10);

  // Filter states (synced to URL)
  const [search,           setSearch]           = useState(initialSearch);
  const [selectedSector,   setSelectedSector]   = useState(initialSector);
  const [selectedActivity, setSelectedActivity] = useState(initialActivity);
  const [currentPage,      setCurrentPage]      = useState(initialPage);

  // Data states
  const [posts,      setPosts]      = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading,    setLoading]    = useState(true);

  // For featured carousel — fetched once, not paginated
  const [allFeaturedPosts, setAllFeaturedPosts] = useState([]);

  // Reference data
  const [companies,     setCompanies]     = useState([]);
  const [categories,    setCategories]    = useState([]);
  const [activityAreas, setActivityAreas] = useState([]);

  const gridRef = useRef(null);

  // ─── 1. Sync filter/page state → URL ───────────────────────────────────────
  useEffect(() => {
    const params = {};
    if (search.trim())    params.search   = search.trim();
    if (selectedSector)   params.sector   = selectedSector;
    if (selectedActivity) params.activity = selectedActivity;
    if (currentPage > 1)  params.page     = currentPage.toString();
    setSearchParams(params, { replace: true });
  }, [search, selectedSector, selectedActivity, currentPage, setSearchParams]);

  // ─── 2. Reset to page 1 when filters change ────────────────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSector, selectedActivity]);

  // ─── 3. Fetch reference data once on mount ─────────────────────────────────
  useEffect(() => {
    getCompanies().then(setCompanies).catch(() => setCompanies([]));
    getCompanyCategories().then(setCategories).catch(() => setCategories([]));
    getActivityAreas().then(setActivityAreas).catch(() => setActivityAreas([]));

    // Featured posts for carousel — separate, unfiltered, unpaginated
    getLinkedInPosts({ showOnStories: true, isFeatured: true, pageSize: 50 })
      .then((res) => setAllFeaturedPosts(res.data || []))
      .catch(() => setAllFeaturedPosts([]));
  }, []);

  // ─── 4. Fetch paginated + filtered posts ───────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);

      const params = {
        showOnStories: true,
        page:     currentPage,
        pageSize: PAGE_SIZE,
      };
      if (search.trim())    params.search    = search.trim();

      // Client-side sector/activity filtering still needed since backend
      // doesn't know about categoryIds/activityAreaIds on Company.
      getLinkedInPosts(params)
        .then((res) => {
          let data = res.data || [];

          // Apply client-side sector/activity filter (uses company reference data)
          if (selectedSector || selectedActivity) {
            data = data.filter((post) => {
              const company = companies.find((c) => c.id === post.companyId);
              const matchesSector =
                !selectedSector ||
                (company && company.categoryIds.includes(Number(selectedSector)));
              const matchesActivity =
                !selectedActivity ||
                (company && company.activityAreaIds.includes(Number(selectedActivity)));
              return matchesSector && matchesActivity;
            });
          }

          setPosts(data);
          setTotalPages(res.totalPages || 0);
        })
        .catch(() => {
          setPosts([]);
          setTotalPages(0);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedSector, selectedActivity, currentPage, companies]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handlePageChange = (page) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="relative min-h-screen pb-12">
      {/* Featured Stories Carousel */}
      <PageSection className="!pt-6 !pb-2">
        <FeaturedStoriesCarousel posts={allFeaturedPosts} />
      </PageSection>

      {/* Search and Filter Section */}
      <PageSection className="!py-4">
        <SuccessStoriesFilter
          search={search}
          setSearch={setSearch}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
          selectedActivity={selectedActivity}
          setSelectedActivity={setSelectedActivity}
          categories={categories}
          activityAreas={activityAreas}
        />
      </PageSection>

      {/* Grid List Section */}
      <PageSection className="!py-4">
        <div ref={gridRef} />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState message="Arama ve filtreleme kriterlerinize uygun başarı öyküsü bulunamadı." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {posts.map((item) => (
                <div
                  key={item.id}
                  className="flex h-44 overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 transition-all hover:shadow-lg"
                >
                  {/* Small Left Image */}
                  <div className="relative w-36 md:w-44 shrink-0 bg-slate-800 overflow-hidden">
                    {item.mediaUrl ? (
                      <img src={item.mediaUrl} alt={item.companyName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/30 font-bold text-xs p-2 text-center select-none">
                        GAZİ TEKNOPARK
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 shadow-sm">
                      <svg className="h-4 w-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {item.companyLogoUrl ? (
                          <img
                            src={item.companyLogoUrl}
                            alt={item.companyName}
                            className="h-7 w-7 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-[10px]">
                            {item.companyName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-900 truncate max-w-[150px] md:max-w-[200px]">
                            {item.companyName}
                          </h4>
                          {item.publishedAt && (
                            <p className="text-[10px] text-gray-400">{formatDate(item.publishedAt)}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed line-clamp-3 font-normal">
                        {item.postText}
                      </p>
                    </div>
                    <div className="mt-2">
                      <a
                        href={item.postUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        Gönderiyi Gör &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </PageSection>
    </div>
  );
}
