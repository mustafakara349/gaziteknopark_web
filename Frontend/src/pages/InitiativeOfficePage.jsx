import { useEffect, useState } from "react";
import { Rocket, GraduationCap, CheckCircle2, X } from "lucide-react";
import { getInitiativeOffice } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageSection from "../components/common/PageSection";

export default function InitiativeOfficePage() {
  const [office, setOffice] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    getInitiativeOffice()
      .then((list) => setOffice(list[0] ?? null))
      .catch(() => setOffice(null));
  }, []);

  const t = pickTranslation(office ?? {});
  const imgSrc = office?.imageUrl || "/images/girisim-ofisi-entrance.png";

  return (
    <div className="pb-16 md:pb-24">
      <PageSection className="pt-4 md:pt-8">
        {/* Sol Resim, Sağ İçerik Metni */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Sol Resim */}
          <div className="lg:col-span-5">
            <div
              className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => setLightboxImg(imgSrc)}
            >
              <img
                src={imgSrc}
                alt="Gazi Teknopark Girişim Ofisi"
                className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Sağ Metin İçeriği */}
          <div className="lg:col-span-7">
            <div className="space-y-4 text-sm leading-relaxed text-slate-700 md:text-base">
              {(office?.content || t.content) && (
                <div 
                  className="whitespace-pre-line leading-relaxed text-slate-700" 
                  dangerouslySetInnerHTML={{ __html: office?.content || t.content }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Kuluçka Yapılanması */}
        <div className="mt-16 md:mt-20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0066cc]">
              Kuluçka Yapılanması
            </h3>
            <h2 className="mt-2 text-2xl font-bold text-[#082b5c] md:text-3xl">
              Girişim Ofisi Bünyesindeki Merkezlerimiz
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Girişimcilerin fikir aşamasından ticarileşmeye kadar olan tüm yolculuklarına özel olarak kurgulanmış kuluçka merkezlerimiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {office?.incubators?.map((inc, index) => {
              const incT = pickTranslation(inc);
              const title = inc.title || incT.title;
              const subtitle = inc.subtitle || incT.subtitle;
              const description = inc.description || incT.description;
              const rawFeatures = inc.features || incT.features;
              const IconComponent = inc.icon === "GraduationCap" ? GraduationCap : Rocket;
              const featuresList = rawFeatures ? rawFeatures.split('\n').filter(Boolean) : [];
              const isAccent = index % 2 !== 0;

              return (
                <div key={inc.id || index} className="relative group rounded-3xl border border-gray-100 bg-white p-8 shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 shadow-xs shrink-0 ${isAccent ? 'bg-red-50 text-accent group-hover:bg-accent group-hover:text-white' : 'bg-blue-50 text-[#0066cc] group-hover:bg-[#0066cc] group-hover:text-white'}`}>
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#082b5c]">{title}</h4>
                      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                    </div>
                  </div>
                  {description && (
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {description}
                    </p>
                  )}
                  {featuresList.length > 0 && (
                    <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                      {featuresList.map((feat, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PageSection>

      {/* Görsel Lightbox Modal (Büyütme Modalı) */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-6 right-6 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImg(null);
            }}
            title="Kapat"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg}
              alt="Gazi Teknopark Girişim Ofisi - Büyük Görünüm"
              className="max-h-[85vh] w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
