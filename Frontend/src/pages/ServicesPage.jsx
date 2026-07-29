import { useEffect, useState } from "react";
import { getServices } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(setServices).catch(() => setServices([]));
  }, []);

  return (
    <div>
      <PageSection>
        {services.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const t = pickTranslation(service);
              return (
                <div key={service.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="text-lg font-bold">{t.title?.charAt(0) ?? "H"}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[#333]">{t.title}</h3>
                  {t.description && <p className="mt-2 line-clamp-3 text-sm text-gray-500">{t.description}</p>}
                </div>
              );
            })}
          </div>
        )}
      </PageSection>
    </div>
  );
}
