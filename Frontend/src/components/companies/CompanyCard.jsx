function getInitials(name) {
  if (!name) return "GP";
  const words = name.trim().split(" ");
  return words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : words[0].substring(0, 2).toUpperCase();
}

function GlobeIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ArrowIcon({ className = "h-3 w-3" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function CompanyCard({ company, onViewDetails }) {
  const { logo, companyName, sector, activityArea, tags, website } = company;

  return (
    <div className="group flex flex-col rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Logo Alanı: kare ikon ve geniş fonttype logolar için object-contain, kutu/arka plan yok */}
      <div className="flex h-20 items-center justify-center">
        {logo ? (
          <img src={logo} alt={companyName} className="max-h-full max-w-[75%] object-contain" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-base font-bold text-white">
            {getInitials(companyName)}
          </div>
        )}
      </div>

      <div className="mt-5 text-center">
        <h3 className="text-sm font-semibold text-ink line-clamp-1" title={companyName}>
          {companyName}
        </h3>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-accent-blue">
          {sector || activityArea}
        </p>
      </div>

      {tags?.length > 0 && (
        <p className="mt-3 text-center text-[11px] text-gray-400 line-clamp-1">{tags.join(" · ")}</p>
      )}

      <div className="mt-6 flex items-center justify-between">
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            aria-label="Web sitesi"
            className="text-gray-300 transition-colors hover:text-accent-blue"
          >
            <GlobeIcon className="h-[18px] w-[18px]" />
          </a>
        ) : (
          <span className="h-[18px] w-[18px]" />
        )}

        <button
          type="button"
          onClick={() => onViewDetails(company)}
          className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary transition-all hover:gap-1.5"
        >
          Detayları Gör
          <ArrowIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
