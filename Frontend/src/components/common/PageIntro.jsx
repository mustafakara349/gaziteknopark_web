import { Link, useLocation } from "react-router-dom";
import { getPageMeta } from "../../utils/breadcrumb";

export default function PageIntro() {
  const { pathname } = useLocation();
  const meta = getPageMeta(pathname);
  if (!meta) return null;

  return (
    <div className="px-4 pt-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <nav
          aria-label="breadcrumb"
          className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-blue-100/80 bg-gradient-to-r from-[#d6e6f7] via-[#e8f1fa] to-[#d6e6f7] px-4 py-1.5 text-xs font-medium"
        >
          {meta.trail.map((crumb, i) => {
            const isLast = i === meta.trail.length - 1;
            return (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-primary/30">/</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="text-primary/60 hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-primary" : "text-primary/60"}>{crumb.label}</span>
                )}
              </span>
            );
          })}
        </nav>
        <h1 className="mt-4 text-center text-2xl font-bold text-primary md:text-3xl">{meta.title}</h1>
      </div>
    </div>
  );
}
