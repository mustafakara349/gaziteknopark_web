import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, SearchIcon } from "../common/icons";
import { navConfig } from "../../config/navConfig";

function DropdownNavItem({ label, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-medium text-[#333] hover:text-primary transition-colors"
      >
        {label}
        <ChevronDownIcon className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-3">
          <div className="w-64 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden py-2">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-5 py-3 text-sm text-[#333] hover:bg-[var(--color-hover-blue)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center">
      <img
        src="/gazitekno_logo.png"
        alt="Gazi Teknopark"
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
}

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("TR");

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-full bg-white/90 px-6 py-3 shadow-lg backdrop-blur">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {navConfig.map((menu) => (
            <DropdownNavItem key={menu.label} label={menu.label} items={menu.items} />
          ))}
          <Link to="/iletisim" className="text-sm font-medium text-[#333] hover:text-primary transition-colors">
            İletişim
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-4">
            <button
              type="button"
              aria-label="Ara"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-dark-surface)] text-white"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ara..."
              className="w-32 bg-transparent text-sm text-[#333] outline-none placeholder:text-gray-400"
            />
          </div>

          <Link to="/giris" className="text-sm font-medium text-[#333] hover:text-primary transition-colors">
            Giriş
          </Link>

          <button
            type="button"
            onClick={() => setLang((l) => (l === "TR" ? "EN" : "TR"))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold text-[#333] hover:border-primary hover:text-primary transition-colors"
          >
            {lang}
          </button>
        </div>
      </div>
    </header>
  );
}
