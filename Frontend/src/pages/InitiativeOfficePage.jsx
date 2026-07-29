import { useEffect, useState } from "react";
import { getInitiativeOffice, getSettings } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";

export default function InitiativeOfficePage() {
  const [office, setOffice] = useState(null);
  const [biggUrl, setBiggUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getInitiativeOffice()
      .then((list) => setOffice(list[0] ?? null))
      .catch(() => setOffice(null))
      .finally(() => setLoaded(true));
    getSettings()
      .then((list) => {
        const setting = list.find((s) => s.settingKey === "bigg_anahtar_url");
        setBiggUrl(pickTranslation(setting).value ?? null);
      })
      .catch(() => setBiggUrl(null));
  }, []);

  const t = pickTranslation(office ?? {});

  return (
    <div>
      <PageSection>
        {loaded && !office ? (
          <EmptyState />
        ) : (
          <div className="rounded-3xl bg-surface p-8 md:p-10">
            {t.title && <h2 className="text-xl font-semibold text-[#333]">{t.title}</h2>}
            {t.content && (
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-600 md:text-base">
                {t.content.replace(/<[^>]+>/g, "")}
              </p>
            )}
            {biggUrl && (
              <a
                href={biggUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                BiGG Anahtar'a Git
              </a>
            )}
          </div>
        )}
      </PageSection>
    </div>
  );
}
