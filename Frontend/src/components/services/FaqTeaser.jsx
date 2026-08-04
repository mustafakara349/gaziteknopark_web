import React from "react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

export default function FaqTeaser({ questions = [] }) {
  if (!questions || questions.length === 0) return null;

  // En fazla 3 soruyu gösterelim
  const displayedQuestions = questions.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Üst Kısım: Başlık (Dışarıda) */}
      <div className="text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">
          Destek & Bilgi
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-primary sm:text-3xl">
          Merak Ettikleriniz mi Var?
        </h2>
      </div>

      {/* Kart Yapısı */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          
          {/* Sol Taraf: Metin ve İki Buton */}
          <div className="flex flex-col space-y-5 max-w-md">
            <p className="text-sm text-gray-500 leading-relaxed md:text-base">
              Başvuru süreçleri, muafiyetler ve diğer tüm detaylar hakkında bilgi almak için sıkça sorulan sorulara göz atabilir veya bizimle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/sss"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:opacity-90 transition-opacity"
              >
                Sıkça Sorulan Sorular
                <LucideIcons.HelpCircle className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/iletisim"
                className="inline-flex items-center justify-center rounded-full border border-primary text-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-primary/5 transition-colors"
              >
                İletişime Geçin
                <LucideIcons.Mail className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Sağ Taraf: Soru Listesi */}
          <div className="flex-1 divide-y divide-gray-100 md:max-w-xl">
            {displayedQuestions.map((item, index) => (
              <div key={item.id || index} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                <span className="text-base font-bold text-accent-blue/80 font-sans mt-0.5">
                  0{index + 1}.
                </span>
                <p className="text-sm font-semibold text-primary/95 leading-relaxed md:text-base">
                  {item.question}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
