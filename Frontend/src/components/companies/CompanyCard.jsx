// Firmanın baş harflerini ve tutarlı bir premium gradyanı üreten yardımcı fonksiyon
const getInitialsAndGradient = (name) => {
  if (!name) return { initials: "GP", gradientClass: "from-primary to-primary-light" };
  const words = name.trim().split(" ");
  const initials = words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : words[0].substring(0, 2).toUpperCase();

  const gradients = [
    "from-primary via-[#0a3875] to-primary-light",
    "from-[#0b3873] via-accent-blue/80 to-[#124d9c]",
    "from-primary-light via-[#134fa1] to-[#041a3b]",
    "from-primary via-[#0d4085] to-accent-blue"
  ];
  
  const charSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(charSum) % gradients.length;

  return { initials, gradientClass: gradients[index] };
};

export default function CompanyCard({ company, onViewDetails }) {
  const { logo, companyName, description, sector, activityArea, tags, website } = company;
  const { initials, gradientClass } = getInitialsAndGradient(companyName);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-gray-200/80">
      
      <div>
        {/* Üst Kısım: Geniş Logo Alanı (Primary Visual Area) */}
        <div className="w-full h-32 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-xs relative group-hover:border-slate-200 transition-colors">
          {logo ? (
            <img src={logo} alt={companyName} className="h-full w-full object-contain p-4" />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
              {/* Premium abstract tech building icon */}
              <svg className="h-10 w-10 text-white/90 drop-shadow-xs" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v3" />
              </svg>
            </div>
          )}
        </div>

        {/* Firma Bilgileri Alanı */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-ink line-clamp-1 group-hover:text-[#0066cc] transition-colors" title={companyName}>
            {companyName}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            {sector || activityArea}
          </p>
        </div>

        {/* Orta Kısım: Açıklama */}
        <div className="mt-3">
          <p className="text-[13px] text-slate-700 leading-relaxed line-clamp-3 min-h-[60px]">
            {description}
          </p>
        </div>

        {/* Teknoloji Alanı Etiketleri */}
        <div 
          className="mt-4 flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1 -mb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-md bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 shrink-0 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Alt Kısım: Butonlar ve Linkler */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
        {/* Web Sitesi Linki */}
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0066cc] transition-colors cursor-pointer group/web"
          >
            <svg
              className="h-4 w-4 text-slate-400 group-hover/web:text-[#0066cc] transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>Web Sitesi</span>
          </a>
        ) : (
          <span className="text-xs text-slate-300 font-medium">Web Sitesi Yok</span>
        )}

        {/* Detayları Gör Butonu */}
        <button
          type="button"
          onClick={() => onViewDetails(company)}
          className="inline-flex items-center gap-1 bg-[#0066cc] hover:bg-[#0055b8] text-white text-xs font-bold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-300 shadow-sm shadow-[#0066cc]/15 hover:shadow-md hover:shadow-[#0066cc]/25 cursor-pointer group/btn"
        >
          <span>Detayları Gör</span>
          <svg
            className="h-3 w-3 transform transition-transform group-hover/btn:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

    </div>
  );
}
