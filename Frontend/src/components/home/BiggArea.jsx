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
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary md:text-3xl">BiGG Alanı</h2>
        {biggUrl && (
          <a
            href={biggUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            BiGG Anahtar'a Git
          </a>
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-surface p-8 md:p-10">
        <h3 className="text-lg font-semibold text-[#333] md:text-xl">
          {t.title ?? "Girişim Ofisi"}
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
          {t.content
            ? t.content.replace(/<[^>]+>/g, "").slice(0, 320)
            : "Girişimcilerimize fikir aşamasından ticarileşmeye kadar destek sağlıyoruz."}
        </p>
      </div>
    </section>
  );
}
