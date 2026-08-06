import PageSection from "../common/PageSection";
import { MapPin, Clock, ShieldCheck } from "lucide-react";

export default function ContactHero() {
  return (
    <div className="bg-[#0B2558] text-white">
      <PageSection className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
              Gazi Teknoloji Geliştirme Bölgesi
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            İletişim
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100/90 leading-relaxed md:text-lg">
            Gazi Teknopark yönetim ekibi, Teknoloji Transfer Ofisi (TTO), Kuluçka Merkezi ve ilgili birimlerimize
            doğrudan ulaşabilir; yerleşkemizi ziyaret edebilirsiniz.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium text-white/80">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 border border-white/10">
              <MapPin className="h-4 w-4 text-accent-blue" />
              <span>Gölbaşı Yerleşkesi / Ankara</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 border border-white/10">
              <Clock className="h-4 w-4 text-accent-blue" />
              <span>Hafta İçi: 08:30 - 17:30</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 border border-white/10">
              <ShieldCheck className="h-4 w-4 text-accent-blue" />
              <span>Güvenlikli Kampüs</span>
            </span>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
