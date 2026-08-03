function ChevronLeftIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

// Sayfa numaralarını "1 ... 4 5 6 ... 12" şeklinde kısaltmalı olarak üretir.
function buildPageList(page, totalPages) {
  const pages = [];
  const radius = 1;
  const start = Math.max(2, page - radius);
  const end = Math.min(totalPages - 1, page + radius);

  pages.push(1);
  if (start > 2) pages.push("ellipsis-start");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("ellipsis-end");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Sayfalama">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500 cursor-pointer"
        aria-label="Önceki sayfa"
      >
        <ChevronLeftIcon />
      </button>

      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors cursor-pointer ${
              p === page
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-surface"
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={`${p}-${idx}`} className="flex h-9 w-9 items-center justify-center text-sm text-gray-400">
            …
          </span>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500 cursor-pointer"
        aria-label="Sonraki sayfa"
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
