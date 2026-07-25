import { useEffect, useState } from "react";
import { getCompanies } from "../../api/endpoints";
import SectionTitle from "../common/SectionTitle";
import ShowMoreButton from "../common/ShowMoreButton";
import EmptyState from "../common/EmptyState";

export default function CompaniesSection() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    getCompanies().then(setCompanies).catch(() => setCompanies([]));
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <SectionTitle title="Firmalarımız" action={<ShowMoreButton to="/firmalar" />} />
      {companies.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-4 rounded-3xl bg-surface p-6 md:grid-cols-4 md:p-8">
          {companies.slice(0, 8).map((company) => (
            <div
              key={company.id}
              className="flex h-24 items-center justify-center rounded-2xl bg-white text-sm font-medium text-[#333] shadow-sm"
              title={company.name}
            >
              {company.name}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
