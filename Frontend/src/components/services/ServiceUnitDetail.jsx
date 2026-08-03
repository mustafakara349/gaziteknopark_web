import React from "react";
import * as LucideIcons from "lucide-react";

export default function ServiceUnitDetail({ unit }) {
  if (!unit) return null;

  const { id, title, description, items = [], icon, image } = unit;

  // Dinamik olarak Lucide ikonunu çözümler
  const IconComponent = LucideIcons[icon] || LucideIcons.HelpCircle;

  // Varsayılan görsel
  const imageUrl = image || "https://sp.sanayigazetesi.com.tr/wp-content/uploads/2023/12/3-20.jpg";

  return (
    <div
      id={id}
      className="relative w-full min-h-[380px] md:min-h-[420px] rounded-3xl overflow-hidden shadow-md border border-gray-100 flex items-center group transition-all duration-500 hover:shadow-xl hover:scale-[1.005] mb-6 last:mb-0"
    >
      {/* Arkaplan Görseli */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Lacivert Overlay: mobilde alttan üste, desktopta soldan sağa açılan (solda opak, sağda şeffaf) gradyan */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary via-primary/80 to-transparent md:bg-gradient-to-r md:from-primary md:via-primary/70 md:to-transparent" />

      {/* İçerik Alanı: Sol tarafta hizalanmış */}
      <div className="relative z-20 w-full h-full flex flex-col justify-end md:justify-center p-6 md:p-12 text-white md:w-3/5 md:mr-auto">
        <div className="flex flex-col space-y-4">
          {/* İkon ve Başlık */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm border border-white/15">
              <IconComponent className="h-5.5 w-5.5" strokeWidth={2} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
              {title}
            </h3>
          </div>

          {/* Açıklama Paragrafı */}
          <p className="text-sm md:text-base text-gray-200 font-normal leading-relaxed">
            {description}
          </p>

          {/* Alt Hizmetler / İkonlu Liste Öğeleri */}
          {items?.length > 0 && (
            <ul className="grid grid-cols-1 gap-2.5 pt-2">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="mt-1 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white border border-white/10">
                    <LucideIcons.Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <span className="text-xs md:text-sm font-medium text-gray-100 leading-normal">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
