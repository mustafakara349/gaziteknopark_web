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
    logo: company.logoUrl ?? null,
    companyName: company.shortName || company.name,
    description: t.description,
    sector: categoryNames[0],
    categoryNames,
    activityAreaNames,
    tags: activityAreaNames,
    website: company.website,
    linkedin: company.linkedInUrl
  };
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activityAreas, setActivityAreas] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
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

  // Filtreleme mantığı
  const filteredCompanies = companies
    .filter((company) => {
      const t = pickTranslation(company);
      const matchesSearch =
        !search ||
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        (company.shortName ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (t.description ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesSector = !selectedSector || company.categoryIds.includes(Number(selectedSector));
      const matchesActivity = !selectedActivity || company.activityAreaIds.includes(Number(selectedActivity));

      return matchesSearch && matchesSector && matchesActivity;
    })
    .map((company) => toCompanyView(company, categories, activityAreas))
    .sort((a, b) => {
      const logoDiff = (b.logo ? 1 : 0) - (a.logo ? 1 : 0);
      return logoDiff !== 0 ? logoDiff : a.companyName.localeCompare(b.companyName, "tr");
    });

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
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </PageSection>
    </div>
  );
}
