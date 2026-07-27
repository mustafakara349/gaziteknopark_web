import { useEffect, useState } from "react";
import { getInitiativeOffice, getSettings } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";

export default function BiggArea() {
  const [office, setOffice] = useState(null);
  const [biggUrl, setBiggUrl] = useState(null);

  useEffect(() => {
    getInitiativeOffice()
      .then((list) => setOffice(list[0] ?? null))
      .catch(() => setOffice(null));

    getSettings()
      .then((list) => {
        const setting = list.find((s) => s.settingKey === "bigg_anahtar_url");
        setBiggUrl(pickTranslation(setting).value ?? null);
      })
      .catch(() => setBiggUrl(null));
  }, []);

  const t = pickTranslation(office ?? {});

  return (
    <section className="mx-auto max-w-[1360px] px-4 mt-24 md:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-blue-100/80 bg-gradient-to-r from-[#d6e6f7] via-[#e8f1fa] to-[#d6e6f7] p-8 md:p-12 shadow-xs">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Text Content */}
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-[#082b5c] md:text-3xl lg:text-4xl">
              {t.title || "TÜBİTAK 1512 BİGG Programı"}
            </h2>
            <h3 className="mt-2 text-lg font-extrabold text-[#0055b8] md:text-xl">
              Fikriniz Girişime Dönüşsün!
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-700 md:text-sm md:leading-normal">
              {t.content
                ? t.content.replace(/<[^>]+>/g, "").slice(0, 260)
                : "Gazi Teknopark uygulayıcı kuruluşu olduğu TÜBİTAK BİGG programı ile teknoloji tabanlı iş fikirlerinizi hayata geçirmeniz için %100 hibe desteği, mentörlük ve altyapı imkanları sunuyor. Hemen başvurun, hayallerinizi ertelemeyin."}
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            <a
              href={biggUrl || "/basvuru/firma"}
              target={biggUrl ? "_blank" : "_self"}
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#082b5c] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#051d40] hover:shadow-lg active:scale-95"
            >
              HEMEN BAŞVUR
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
