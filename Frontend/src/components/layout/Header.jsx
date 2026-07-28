import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, SearchIcon } from "../common/icons";
import { navConfig } from "../../config/navConfig";

/* ─────────────────────────────────── DROPDOWN ─────────────────────────── */
function DropdownNavItem({ label, items, onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-[#0066cc] transition-colors py-1 cursor-pointer whitespace-nowrap"
      >
        {label}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180 text-[#0066cc]" : ""
            }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full pt-2.5 z-50 animate-slide-down">
          <div className="w-60 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 overflow-hidden p-1.5 border border-white/80">
            {items.map((item) => (
              item.isExternal ? (
                <a
                  key={item.href || item.to}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClose}
                  className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#dbeafe] hover:text-[#0055b8] rounded-xl transition-all duration-150"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#dbeafe] hover:text-[#0055b8] rounded-xl transition-all duration-150"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────── LOGIN DROPDOWN ─────────────────────── */
function LoginDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-[#0066cc] transition-colors py-1 cursor-pointer whitespace-nowrap"
      >
        Giriş
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180 text-[#0066cc]" : ""
            }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full pt-2.5 z-50 animate-slide-down">
          <div className="w-52 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 overflow-hidden p-1.5 border border-white/80">
            <Link
              to="/giris"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#dbeafe] hover:text-[#0055b8] rounded-xl transition-all duration-150"
            >
              Firma Yetkilisi Girişi
            </Link>
            <a
              href="https://argeportal.gaziteknopark.com.tr/"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#dbeafe] hover:text-[#0055b8] rounded-xl transition-all duration-150"
            >
              Ar-Ge Portalı Girişi
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────── LOGO ─────────────────────────────── */
function Logo() {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <Link to="/" className="shrink-0 flex items-center">
        <img
          src="/gazi_logo.png"
          alt="Gazi Teknopark"
          onError={() => setImgError(true)}
          className="h-[18px] sm:h-[24px] w-auto object-contain"
        />
      </Link>
    );
  }

  return (
    <Link
      to="/"
      className="flex items-baseline text-sm sm:text-base font-extrabold tracking-tight shrink-0 text-[#082b5c]"
    >
      <span>GAZ</span>
      <span className="relative">
        İ
        <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#e30613]" />
      </span>
      <span>TEKNOPARK</span>
    </Link>
  );
}

/* ─────────────────────── ANIMATED SEARCH (fixed-width container) ───────── */
function AnimatedSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    /* Fixed outer container – always 160px wide so header never shifts */
    <div className="flex items-center justify-end" style={{ width: 160, flexShrink: 0 }}>
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          if (!query && document.activeElement !== inputRef.current) {
            setIsExpanded(false);
          }
        }}
        className={`flex items-center rounded-full border border-slate-300/80 shadow-xs bg-white/90 backdrop-blur-sm transition-all duration-300 ease-out overflow-hidden ${isExpanded || query
          ? "w-40 p-0.5 pr-3 ring-2 ring-[#0066cc]/20"
          : "w-8 h-8 p-0.5 justify-center border-transparent"
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
    </div>
  );
}

/* ─────────────────────── HAMBURGER (mobile menu icon) ─────────────────── */
function HamburgerIcon({ open }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <line x1="4" y1="4" x2="18" y2="18" />
          <line x1="18" y1="4" x2="4" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="19" y2="6" />
          <line x1="3" y1="11" x2="19" y2="11" />
          <line x1="3" y1="16" x2="19" y2="16" />
        </>
      )}
    </svg>
  );
}

/* ──────────────────── MOBILE MENU (full-screen drawer) ────────────────── */
function MobileMenu({ open, onClose, lang, onLangToggle }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col px-4 pt-4 md:px-8 lg:px-12">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel - matches Image 3 exactly */}
      <div className="relative z-50 mx-auto w-full max-w-[1440px] rounded-[32px] bg-[#f4f5f7] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* Top bar (Logo + Close X) */}
        <div className="flex items-center justify-between px-6 h-[68px]">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer -mr-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Nav Items */}
        <div className="px-2 pb-6 pt-2 flex flex-col gap-1">
          {/* Mobile Search */}
          <div className="px-4 pb-3 pt-1">
            <div className="flex items-center rounded-xl bg-white border border-slate-200 px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#0066cc]/20 focus-within:border-[#0066cc]/50 transition-all">
              <SearchIcon className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Ara..."
                className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 ml-2"
              />
            </div>
          </div>

          {navConfig.map((menu) => (
            <MobileDropdownItem key={menu.label} label={menu.label} items={menu.items} onClose={onClose} />
          ))}

          <div className="px-2">
            <Link
              to="/iletisim"
              onClick={onClose}
              className="flex items-center px-4 py-3.5 text-base font-semibold text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors"
            >
              İletişim
            </Link>
          </div>

          <div className="h-px bg-slate-200/60 my-2 mx-4" />

          <div className="flex items-center justify-between px-6 py-4 mt-2">
            <MobileLoginDropdown onClose={onClose} />
            <button
              type="button"
              onClick={onLangToggle}
              className="flex h-10 w-14 items-center justify-center rounded-full border border-slate-400 text-sm font-bold text-slate-700 hover:border-[#0066cc] hover:text-[#0066cc] transition-colors"
            >
              {lang}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDropdownItem({ label, items, onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-base font-semibold text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors"
      >
        {label}
        <ChevronDownIcon
          className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-1 pb-2 pt-1">
          {items.map((item) => (
            item.isExternal ? (
              <a
                key={item.href || item.to}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                onClick={onClose}
                className="block px-8 py-2.5 text-sm font-medium text-slate-600 hover:text-[#0066cc] transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="block px-8 py-2.5 text-sm font-medium text-slate-600 hover:text-[#0066cc] transition-colors"
              >
                {item.label}
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function MobileLoginDropdown({ onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-base font-bold text-slate-800 hover:text-[#0066cc] transition-colors"
      >
        Giriş
        <ChevronDownIcon
          className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 flex w-48 flex-col gap-1 rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5">
          <Link
            to="/giris"
            onClick={onClose}
            className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0066cc] transition-colors"
          >
            Firma Yetkilisi Girişi
          </Link>
          <a
            href="https://argeportal.gaziteknopark.com.tr/"
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0066cc] transition-colors"
          >
            Ar-Ge Portalı Girişi
          </a>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── MAIN HEADER ─────────────────────────────── */
export default function Header() {
  const [lang, setLang] = useState("EN");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => setLang((l) => (l === "TR" ? "EN" : "TR"));

  return (
    <>
      <header
        className={`sticky z-50 transition-all duration-500 ease-in-out ${isScrolled ? "top-0 px-0" : "top-4 px-4 md:px-8 lg:px-12"
          }`}
      >
        {/* Animated Container */}
        <div
          className={`mx-auto flex h-[68px] w-full items-center justify-between bg-white/80 backdrop-blur-md transition-all duration-500 ease-in-out ${isScrolled
            ? "max-w-full rounded-none px-6 md:px-10 lg:px-16 shadow-md border-b border-white/60"
            : "max-w-[1440px] rounded-full px-4 sm:px-6 shadow-lg border border-white/60"
            }`}
        >
          {/* Left: Logo */}
          <div className="flex min-w-0 xl:min-w-[160px] items-center shrink">
            <Logo />
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden items-center gap-7 xl:flex">
            {navConfig.map((menu) => (
              <DropdownNavItem key={menu.label} label={menu.label} items={menu.items} />
            ))}
            <Link
              to="/iletisim"
              className="text-sm font-semibold text-slate-800 hover:text-[#0066cc] transition-colors whitespace-nowrap"
            >
              İletişim
            </Link>
          </nav>

          {/* Right: Search + Login + Lang (desktop) */}
          <div className="hidden min-w-[160px] items-center justify-end gap-4 xl:flex">
            <AnimatedSearch />
            <LoginDropdown />
            {/* Stroke-only language button */}
            <button
              type="button"
              onClick={toggleLang}
              className="flex h-7 w-11 items-center justify-center rounded-full border border-slate-500 text-xs font-bold text-slate-800 hover:border-[#0066cc] hover:text-[#0066cc] transition-all cursor-pointer"
            >
              {lang}
            </button>
          </div>

          {/* Mobile right: hamburger */}
          <div className="flex items-center xl:hidden">
            <button
              type="button"
              aria-label="Menü"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        lang={lang}
        onLangToggle={toggleLang}
      />
    </>
  );
}
