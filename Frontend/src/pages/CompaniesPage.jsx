import { useState, useEffect, useRef } from "react";
import { getCompanies, getCompanyCategories, getActivityAreas } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";
import CompanyCard from "../components/companies/CompanyCard";
import CompanyFilter from "../components/companies/CompanyFilter";
import Pagination from "../components/common/Pagination";

const ITEMS_PER_PAGE = 20;

function toCompanyView(company, categories, activityAreas) {
  const t = pickTranslation(company);
  const categoryNames = company.categoryIds
    .map((id) => categories.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => pickTranslation(c).name);
  const activityAreaNames = company.activityAreaIds
    .map((id) => activityAreas.find((a) => a.id === id))
    .filter(Boolean)
    .map((a) => pickTranslation(a).name);

  return {
    id: company.id,
    logo: null,
    companyName: company.name,
    description: t.description,
    sector: categoryNames[0],
    categoryNames,
    activityAreaNames,
    tags: activityAreaNames,
    website: company.website
  };
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activityAreas, setActivityAreas] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef(null);

  useEffect(() => {
    getCompanies().then(setCompanies).catch(() => setCompanies([]));
    getCompanyCategories().then(setCategories).catch(() => setCategories([]));
    getActivityAreas().then(setActivityAreas).catch(() => setActivityAreas([]));
  }, []);

  // Filtre değişince ilk sayfaya dön
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSector, selectedActivity]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ESC tuşu ile modalı kapatma desteği
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedCompany(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Modal açıkken arka plan kaymasını engelleme
  useEffect(() => {
    if (selectedCompany) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedCompany]);

  // Filtreleme mantığı
  const filteredCompanies = companies
    .filter((company) => {
      const t = pickTranslation(company);
      const matchesSearch =
        !search ||
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.description ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesSector = !selectedSector || company.categoryIds.includes(Number(selectedSector));
      const matchesActivity = !selectedActivity || company.activityAreaIds.includes(Number(selectedActivity));

      return matchesSearch && matchesSector && matchesActivity;
    })
    .map((company) => toCompanyView(company, categories, activityAreas));

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="relative min-h-screen pb-12">
      {/* 1- Arama ve Filtreleme Alanı */}
      <PageSection className="!py-6">
        <CompanyFilter
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

      {/* 2- Firma Kartları Alanı */}
      <PageSection className="!py-4">
        <div ref={gridRef} />
        {filteredCompanies.length === 0 ? (
          <EmptyState message="Arama ve filtreleme kriterlerinize uygun firma bulunamadı." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onViewDetails={setSelectedCompany}
                />
              ))}
            </div>
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </PageSection>

      {/* 3- Firma Detay Modalı */}
      {selectedCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setSelectedCompany(null)}
        >
          <div
            className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all duration-300 sm:p-8 animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapat Butonu */}
            <button
              type="button"
              onClick={() => setSelectedCompany(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-gray-400 hover:bg-gray-100 hover:text-ink transition-colors cursor-pointer"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal İçeriği */}
            <div className="flex flex-col gap-6">
              {/* Başlık ve Logo Bölümü */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Logo / Badge */}
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#082b5c]/5 flex items-center justify-center border border-gray-100">
                  {selectedCompany.logo ? (
                    <img
                      src={selectedCompany.logo}
                      alt={selectedCompany.companyName}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-lg font-extrabold">
                      {selectedCompany.companyName.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-ink sm:text-2xl">
                    {selectedCompany.companyName}
                  </h2>
                  {selectedCompany.categoryNames.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {selectedCompany.categoryNames.map((name) => (
                        <span
                          key={name}
                          className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Detaylı Açıklama */}
              {selectedCompany.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Firma Hakkında
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {selectedCompany.description}
                  </p>
                </div>
              )}

              {/* Faaliyet Alanları */}
              {selectedCompany.activityAreaNames.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Faaliyet Alanları
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.activityAreaNames.map((name) => (
                      <span
                        key={name}
                        className="rounded-lg bg-surface border border-gray-100 px-3 py-1 text-xs font-semibold text-primary-light"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Butonlar */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3 pt-5 border-t border-gray-100">
                {selectedCompany.website ? (
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer w-full sm:w-auto"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span>Web Sitesini Ziyaret Et</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 rounded-full bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-400 w-full sm:w-auto"
                  >
                    <span>Web Sitesi Mevcut Değil</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-surface cursor-pointer w-full sm:w-auto"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
