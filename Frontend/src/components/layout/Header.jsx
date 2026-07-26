import { useState, useRef } from "react";
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
        className="flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-[#0066cc] transition-colors py-1 cursor-pointer"
      >
        {label}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180 text-[#0066cc]" : ""
            }`}
        />
      </button>

      {/* Glassmorphism Dropdown Menu matching reference screenshot */}
      {open && (
        <div className="absolute left-0 top-full pt-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-60 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 overflow-hidden p-1.5 border border-white/80">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#dbeafe] hover:text-[#0055b8] rounded-xl transition-all duration-150"
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
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <Link to="/" className="shrink-0 flex items-center">
        <img
          src="/gazi_logo.png"
          alt="Gazi Teknopark"
          onError={() => setImgError(true)}
          className="h-4.5 md:h-5.5 w-auto max-h-8 object-contain"
        />
      </Link>
    );
  }

  return (
    <Link to="/" className="flex items-baseline text-lg font-extrabold tracking-tight shrink-0 text-[#082b5c]">
      <span>GAZ</span>
      <span className="relative">
        İ
        <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#e30613]" />
      </span>
      <span>TEKNOPARK</span>
    </Link>
  );
}

function AnimatedSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        if (!query && document.activeElement !== inputRef.current) {
          setIsExpanded(false);
        }
      }}
      className={`group flex items-center rounded-full bg-white/90 backdrop-blur-sm border border-slate-300/80 shadow-xs transition-all duration-300 ease-out overflow-hidden ${isExpanded || query
        ? "w-44 md:w-48 p-0.5 pr-3 ring-2 ring-[#0066cc]/20"
        : "w-7.5 h-7.5 p-0.5 justify-center border-transparent"
        }`}
    >
      <button
        type="button"
        aria-label="Ara"
        onClick={handleExpand}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4a4a4a] text-white hover:bg-[#333] transition-colors cursor-pointer"
      >
        <SearchIcon className="h-3.5 w-3.5 text-white" />
      </button>

      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => {
          if (!query) setIsExpanded(false);
        }}
        placeholder="Ara..."
        className={`bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 transition-all duration-300 ${isExpanded || query
          ? "w-full opacity-100 ml-2 pointer-events-auto"
          : "w-0 opacity-0 p-0 m-0 pointer-events-none"
          }`}
      />
    </div>
  );
}

export default function Header() {
  const [lang, setLang] = useState("EN");

  return (
    <header className="sticky top-4 z-50 px-4 md:px-6">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-5 rounded-full bg-white/75 px-7 py-2.5 shadow-lg backdrop-blur-md border border-white/60">
        {/* Vector Logo - Elegant size */}
        <Logo />

        {/* Main Nav Links */}
        <nav className="hidden items-center gap-6 lg:gap-8 lg:flex">
          {navConfig.map((menu) => (
            <DropdownNavItem key={menu.label} label={menu.label} items={menu.items} />
          ))}
          <Link
            to="/iletisim"
            className="text-sm font-semibold text-slate-800 hover:text-[#0066cc] transition-colors"
          >
            İletişim
          </Link>
        </nav>

        {/* Right Section: Animated Search + Login + Language */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Animated Hover-Expand Search Bar */}
          <AnimatedSearch />

          {/* Login Link */}
          <Link
            to="/giris"
            className="text-sm font-semibold text-slate-800 hover:text-[#0066cc] transition-colors px-1"
          >
            Giriş
          </Link>

          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={() => setLang((l) => (l === "TR" ? "EN" : "TR"))}
            className="flex h-7 px-3 items-center justify-center rounded-full border border-slate-400 bg-white/70 text-xs font-bold text-slate-800 hover:bg-white hover:border-slate-600 transition-all shadow-2xs cursor-pointer"
          >
            {lang}
          </button>
        </div>
      </div>
    </header>
  );
}
