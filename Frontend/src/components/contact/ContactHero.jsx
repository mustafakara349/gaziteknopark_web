import PageSection from "../common/PageSection";

export default function ContactHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#082b5c] via-[#0b3b7c] to-[#051d40] text-white">
      {/* Decorative Background Patterns */}
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <PageSection className="relative z-10 py-12 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Corporate Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
              Gazi Teknoloji Geliştirme Bölgesi
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            İletişim & Ulaşım Rehberi
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100/90 leading-relaxed md:text-lg">
            Gazi Teknopark yönetim ekibi, Teknoloji Transfer Ofisi (TTO), Kuluçka Merkezi ve ilgili birimlerimize
            doğrudan ulaşabilir; yerleşkemizi ziyaret etmek için ulaşım rehberini inceleyebilirsiniz.
          </p>

          {/* Quick Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-medium text-white/80">
            <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5">
              📍 Gölbaşı Yerleşkesi / Ankara
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5">
              🕒 Hafta İçi: 08:30 - 17:30
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5">
              🛡️ 7/24 Güvenlikli Kampüs
            </span>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
