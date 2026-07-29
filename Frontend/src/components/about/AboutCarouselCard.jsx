export default function AboutCarouselCard({ icon: Icon, label, text }) {
  return (
    <div className="flex h-full flex-col">
      {/* Header bölgesi: ikon + kategori etiketi, gövdeden ayrı bir bant */}
      <div className="flex shrink-0 items-center gap-3 border-b border-blue-100/80 bg-gradient-to-r from-[#d6e6f7] via-[#e8f1fa] to-[#d6e6f7] px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-gray-100 md:h-11 md:w-11">
          <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.75} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-primary sm:text-xs md:text-sm">
          {label}
        </span>
      </div>

      {/* Body bölgesi: paragraf metni */}
      <div
        className="flex-1 overflow-y-auto p-6 pr-5 text-sm leading-relaxed text-gray-700 sm:p-8 sm:pr-7 md:p-10 md:pr-9 md:text-lg md:leading-[1.75]"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}
