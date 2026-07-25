import { useEffect, useState } from "react";
import { getCompanies, getCompanyCategories } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageHeader from "../components/common/PageHeader";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    getCompanies().then(setCompanies).catch(() => setCompanies([]));
    getCompanyCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const filtered = activeCategory
    ? companies.filter((c) => c.categoryIds?.includes(activeCategory))
    : companies;

  return (
    <div>
      <PageHeader title="Firmalarımız" subtitle="Gazi Teknopark bünyesinde faaliyet gösteren firmalar." />
      <PageSection>
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === null ? "bg-primary text-white" : "bg-surface text-[#333]"}`}
            >
              Tümü
            </button>
            {categories.map((cat) => {
              const t = pickTranslation(cat);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === cat.id ? "bg-primary text-white" : "bg-surface text-[#333]"}`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((company) => {
              const t = pickTranslation(company);
              return (
                <div key={company.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-16 w-16 rounded-xl bg-surface" />
                  <h3 className="mt-3 text-sm font-semibold text-[#333]">{company.name}</h3>
                  {t.description && <p className="mt-1 line-clamp-2 text-xs text-gray-500">{t.description}</p>}
                </div>
              );
            })}
          </div>
        )}
      </PageSection>
    </div>
  );
}
