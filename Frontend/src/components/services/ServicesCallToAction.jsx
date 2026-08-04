import React from "react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

export default function ServicesCallToAction({ cta }) {
  if (!cta) return null;

  const { title, description, buttonText, buttonUrl, brochureText, brochureUrl } = cta;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-light to-primary-dark p-8 md:p-12 text-white shadow-lg text-center">
      {/* Arka plan geometrik süsleri */}
      <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent-blue/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center space-y-6">
        {/* İkon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
          <LucideIcons.Sparkles className="h-6 w-6 text-white" />
        </div>

        {/* Başlık */}
        <h3 className="text-2xl font-extrabold sm:text-3xl md:text-4xl text-white">
          {title}
        </h3>

        {/* Açıklama */}
        {description && (
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
            {description}
          </p>
        )}

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
          {/* Birincil Aksiyon Butonu */}
          {buttonText && buttonUrl && (
            <Link
              to={buttonUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary shadow-md hover:bg-gray-50 transition-colors duration-300"
            >
              {buttonText}
              <LucideIcons.ArrowRight className="ml-2 h-4.5 w-4.5" />
            </Link>
          )}

          {/* İkincil Broşür İndirme Aksiyonu */}
          {brochureText && brochureUrl && (
            <a
              href={brochureUrl}
              download
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors duration-300"
            >
              <LucideIcons.Download className="mr-2 h-4.5 w-4.5" />
              {brochureText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
