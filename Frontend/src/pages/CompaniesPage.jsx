import { useState, useEffect } from "react";
import { companiesData } from "../data/companies";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";
import CompanyCard from "../components/companies/CompanyCard";
import CompanyFilter from "../components/companies/CompanyFilter";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

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
  const filteredCompanies = companiesData.filter((company) => {
    const matchesSearch =
      !search ||
      company.companyName.toLowerCase().includes(search.toLowerCase()) ||
      company.description.toLowerCase().includes(search.toLowerCase());

    const matchesSector = !selectedSector || company.sector === selectedSector;
    const matchesActivity =
      !selectedActivity || company.activityArea === selectedActivity;
    const matchesTech = !selectedTech || company.tags.includes(selectedTech);

    return matchesSearch && matchesSector && matchesActivity && matchesTech;
  });

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
          selectedTech={selectedTech}
          setSelectedTech={setSelectedTech}
        />
      </PageSection>


      {/* 3- Firma Kartları Alanı */}
      <PageSection className="!py-4">
        {filteredCompanies.length === 0 ? (
          <EmptyState message="Arama ve filtreleme kriterlerinize uygun firma bulunamadı." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onViewDetails={setSelectedCompany}
              />
            ))}
          </div>
        )}
      </PageSection>

      {/* 4- Firma Detay Modalı (Interactive Detail Modal) */}
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
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                      {selectedCompany.sector}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-500">
                      {selectedCompany.activityArea}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detaylı Açıklama */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Firma Hakkında
                </h4>
                <p className="text-sm leading-relaxed text-gray-600">
                  {selectedCompany.description}
                </p>
              </div>

              {/* Geliştirilen Teknolojiler */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Teknoloji ve Uzmanlık Alanları
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-surface border border-gray-100 px-3 py-1 text-xs font-semibold text-primary-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

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
