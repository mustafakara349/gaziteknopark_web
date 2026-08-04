import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Rocket,
  FileText,
  ShieldCheck,
  GraduationCap,
  Award,
  Building2,
  Plus,
  Minus,
  Headphones,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  X,
  HelpCircle,
  LayoutGrid,
} from "lucide-react";
import { FAQ_CATEGORIES, FAQ_ITEMS } from "../data/faq-data";
import PageSection from "../components/common/PageSection";

/* ─── Icon map ──────────────────────────────────────────────────────────── */
const ICON_MAP = {
  Rocket,
  FileText,
  ShieldCheck,
  GraduationCap,
  Award,
  Building2,
};

/* ─── Utility: highlight matching text ──────────────────────────────────── */
function Highlight({ text, query }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="faq-highlight">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ─── Accordion Item ─────────────────────────────────────────────────────── */
function AccordionItem({ item, query }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);

  // Reset to closed whenever the item set changes (filter/category change)
  useEffect(() => {
    setOpen(false);
  }, [item.id]);

  return (
    <div
      className={`faq-card ${open ? "faq-card--open" : ""}`}
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
      aria-expanded={open}
    >
      <div className="faq-card__header">
        <span className="faq-card__q-icon">
          <HelpCircle size={17} />
        </span>
        <span className="faq-card__question">
          <Highlight text={item.question} query={query} />
        </span>
        <span className="faq-card__toggle-icon">
          {open ? <Minus size={17} /> : <Plus size={17} />}
        </span>
      </div>

      {/* Body — always rendered for SEO, visually hidden via CSS */}
      <div
        ref={bodyRef}
        className="faq-card__body"
        style={{
          maxHeight: open ? `${bodyRef.current?.scrollHeight ?? 800}px` : "0px",
          opacity: open ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="faq-card__answer">
          <p>{item.answer}</p>
          {item.links && item.links.length > 0 && (
            <div className="faq-card__links">
              {item.links.map((link, i) =>
                link.external ? (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="faq-link"
                  >
                    {link.label}
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <Link key={i} to={link.href} className="faq-link">
                    {link.label}
                    <ChevronRight size={13} />
                  </Link>
                )
              )}
            </div>
          )}
          {item.tags && (
            <div className="faq-card__tags">
              {item.tags.map((tag, i) => (
                <span key={i} className="faq-tag faq-tag--answer">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Category Group (SEO: all content rendered, filtered client-side) ──── */
function CategoryGroup({ category, items, query }) {
  const Icon = ICON_MAP[category.icon] || Rocket;
  if (items.length === 0) return null;

  return (
    <section className="faq-group" aria-labelledby={`cat-${category.id}`}>
      <div className="faq-group__header">
        <div className="faq-group__icon">
          <Icon size={18} />
        </div>
        <div>
          <h2 id={`cat-${category.id}`} className="faq-group__title">{category.label}</h2>
          <p className="faq-group__count">{items.length} soru</p>
        </div>
      </div>
      <div className="faq-list">
        {items.map((item) => (
          <AccordionItem key={item.id} item={item} query={query} />
        ))}
      </div>
    </section>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function FaqPage() {
  const [query, setQuery] = useState("");
  // null = "Tümü" (all categories shown)
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const searchRef = useRef(null);

  const isSearching = query.trim().length > 0;
  const isFiltering = activeCategoryId !== null;

  /* Items filtered by search OR category */
  const filteredItems = useMemo(() => {
    let items = FAQ_ITEMS;

    if (isSearching) {
      const q = query.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (isFiltering && !isSearching) {
      items = items.filter((item) => item.categoryId === activeCategoryId);
    }

    return items;
  }, [query, activeCategoryId, isSearching, isFiltering]);

  /* Group filtered items by category (for the grouped view) */
  const groupedItems = useMemo(() => {
    return FAQ_CATEGORIES.map((cat) => ({
      category: cat,
      items: filteredItems.filter((item) => item.categoryId === cat.id),
    })).filter((g) => g.items.length > 0);
  }, [filteredItems]);

  const handleTagClick = (tag) => {
    const tagText = tag.replace("#", "");
    setQuery(tagText);
    setActiveCategoryId(null);
    searchRef.current?.focus();
  };

  const handleCategoryClick = (id) => {
    setActiveCategoryId(id);
    setQuery(""); // clear search when selecting a category
  };

  const activeCategory = FAQ_CATEGORIES.find((c) => c.id === activeCategoryId);
  const totalItems = filteredItems.length;

  return (
    <>
      <style>{`
        /* search wrap — standalone, no card */
        .faq-search-wrap {
          position: relative;
        }
        .faq-search-input {
          width: 100%;
          padding: 14px 52px 14px 50px;
          border-radius: 14px;
          border: 1.5px solid rgba(11,62,117,0.15);
          background: #fff;
          font-size: 0.97rem;
          color: #0B3E75;
          box-shadow: 0 2px 12px rgba(11,62,117,0.08);
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .faq-search-input::placeholder { color: rgba(11,62,117,0.4); }
        .faq-search-input:focus {
          border-color: #0B3E75;
          box-shadow: 0 4px 20px rgba(11,62,117,0.12);
        }
        .faq-search-icon {
          position: absolute; left: 15px; top: 50%;
          transform: translateY(-50%);
          color: rgba(11,62,117,0.5); pointer-events: none;
        }
        .faq-search-clear {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%);
          background: rgba(11,62,117,0.07);
          border: none; border-radius: 50%;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(11,62,117,0.6);
          transition: all 0.2s;
        }
        .faq-search-clear:hover { background: rgba(11,62,117,0.14); color: #0B3E75; }

        .faq-tag--answer {
          font-size: 0.72rem; padding: 4px 10px;
          cursor: default; pointer-events: none;
          background: rgba(11,62,117,0.06);
          border-color: rgba(11,62,117,0.12);
          color: rgba(11,62,117,0.6);
        }
        .faq-tag--answer:hover {
          background: rgba(11,62,117,0.06);
          border-color: rgba(11,62,117,0.12);
          color: rgba(11,62,117,0.6);
          transform: none; box-shadow: none;
        }

        /* ══════════════════════════════════════════════════════════════════
           LAYOUT: Sidebar + Content
        ══════════════════════════════════════════════════════════════════ */
        .faq-layout {
          display: grid;
          grid-template-columns: 272px 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .faq-layout { grid-template-columns: 1fr; }
          .faq-sidebar { display: none !important; }
        }

        /* SIDEBAR */
        .faq-sidebar {
          position: sticky; top: 96px;
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid rgba(11,62,117,0.09);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(11,62,117,0.07);
        }
        .faq-sidebar__header {
          padding: 16px 18px 14px;
          background: linear-gradient(135deg, #0B3E75 0%, #1155a0 100%);
          display: flex; align-items: center; gap: 10px;
        }
        .faq-sidebar__header-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
        }
        .faq-sidebar__header-text {
          font-size: 0.8rem; font-weight: 700; color: #fff;
          letter-spacing: 0.03em;
        }
        .faq-sidebar__header-sub {
          font-size: 0.7rem; color: rgba(255,255,255,0.6);
          margin-top: 1px;
        }

        .faq-sidebar__item {
          display: flex; align-items: center; gap: 11px;
          padding: 12px 18px;
          cursor: pointer; transition: all 0.2s ease;
          border-left: 4px solid transparent;
          font-size: 0.86rem; font-weight: 500;
          color: rgba(11,62,117,0.72);
          border-bottom: 1px solid rgba(11,62,117,0.05);
        }
        .faq-sidebar__item:last-child { border-bottom: none; }
        .faq-sidebar__item:hover { background: rgba(11,62,117,0.04); color: #0B3E75; }
        .faq-sidebar__item--active {
          border-left-color: #0B3E75;
          background: rgba(11,62,117,0.07);
          color: #0B3E75; font-weight: 600;
        }
        .faq-sidebar__item-icon {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 8px;
          flex-shrink: 0; background: rgba(11,62,117,0.07);
          color: #0B3E75; transition: all 0.2s;
        }
        .faq-sidebar__item--active .faq-sidebar__item-icon {
          background: #0B3E75; color: #fff;
        }
        .faq-sidebar__count {
          margin-left: auto; font-size: 0.7rem; font-weight: 700;
          color: rgba(11,62,117,0.35);
          background: rgba(11,62,117,0.05);
          padding: 2px 8px; border-radius: 999px;
        }
        .faq-sidebar__item--active .faq-sidebar__count {
          background: rgba(11,62,117,0.12);
          color: #0B3E75;
        }

        /* Mobile tabs */
        .faq-tabs-mobile {
          display: none;
          overflow-x: auto; gap: 8px; padding-bottom: 4px;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
        }
        .faq-tabs-mobile::-webkit-scrollbar { display: none; }
        @media (max-width: 900px) { .faq-tabs-mobile { display: flex; } }
        .faq-tab-pill {
          flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 999px;
          border: 1.5px solid rgba(11,62,117,0.15);
          background: #fff; font-size: 0.8rem; font-weight: 600;
          color: rgba(11,62,117,0.7); cursor: pointer;
          transition: all 0.22s; white-space: nowrap;
        }
        .faq-tab-pill--active { background: #0B3E75; border-color: #0B3E75; color: #fff; }
        .faq-tab-pill:hover:not(.faq-tab-pill--active) { border-color: #0B3E75; color: #0B3E75; }

        /* ══════════════════════════════════════════════════════════════════
           CONTENT: grouped accordions
        ══════════════════════════════════════════════════════════════════ */
        .faq-group { margin-bottom: 36px; }
        .faq-group:last-child { margin-bottom: 0; }
        .faq-group__header {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 14px;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(11,62,117,0.07);
        }
        .faq-group__icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #0B3E75 0%, #1a5ea8 100%);
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(11,62,117,0.22);
        }
        .faq-group__title {
          font-size: 1rem; font-weight: 700; color: #0B3E75; margin: 0;
        }
        .faq-group__count {
          font-size: 0.78rem; color: rgba(11,62,117,0.5); margin: 2px 0 0;
        }

        .faq-list { display: flex; flex-direction: column; gap: 8px; }

        /* CARDS */
        .faq-card {
          border-radius: 12px; background: #fff;
          border: 1.5px solid rgba(11,62,117,0.08);
          transition: all 0.28s ease; cursor: pointer;
          overflow: hidden; user-select: none;
        }
        .faq-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(11,62,117,0.12);
          border-color: rgba(11,62,117,0.18);
        }
        .faq-card--open {
          border-color: rgba(11,62,117,0.22);
          box-shadow: 0 4px 18px rgba(11,62,117,0.09);
        }
        .faq-card__header {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 16px 18px; gap: 12px;
        }
        .faq-card__q-icon {
          flex-shrink: 0; color: rgba(11,62,117,0.3);
          transition: color 0.22s;
          display: flex; align-items: center;
        }
        .faq-card--open .faq-card__q-icon { color: #0B3E75; }
        .faq-card__question {
          font-size: 0.92rem; font-weight: 600;
          color: #0B3E75; line-height: 1.45; flex: 1;
        }
        .faq-card__toggle-icon {
          flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
          background: rgba(11,62,117,0.06);
          display: flex; align-items: center; justify-content: center;
          color: #0B3E75; transition: background 0.22s, color 0.22s, transform 0.28s;
        }
        .faq-card--open .faq-card__toggle-icon {
          background: #0B3E75; color: #fff; transform: rotate(180deg);
        }
        .faq-card__body {
          overflow: hidden;
          transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease;
        }
        .faq-card__answer {
          padding: 14px 18px 18px;
          border-top: 1px solid rgba(11,62,117,0.07);
        }
        .faq-card__answer p {
          font-size: 0.89rem; color: #4b5563; line-height: 1.72; margin: 0;
        }
        .faq-card__links {
          margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px;
        }
        .faq-link {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.81rem; font-weight: 600; color: #0B3E75;
          text-decoration: underline; text-underline-offset: 3px;
          transition: opacity 0.2s;
        }
        .faq-link:hover { opacity: 0.75; }
        .faq-card__tags {
          display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px;
        }

        /* highlight */
        .faq-highlight {
          background: rgba(11,62,117,0.12);
          color: #0B3E75; border-radius: 3px; padding: 0 2px;
        }

        /* search results bar */
        .faq-filter-bar {
          padding: 10px 16px; border-radius: 10px;
          background: rgba(11,62,117,0.05);
          border: 1px solid rgba(11,62,117,0.1);
          font-size: 0.82rem; color: rgba(11,62,117,0.7);
          margin-bottom: 20px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 8px;
        }
        .faq-filter-bar strong { color: #0B3E75; }
        .faq-filter-bar__clear {
          background: none; border: none; cursor: pointer;
          color: #0B3E75; font-weight: 600; font-size: 0.8rem; padding: 0;
        }

        /* empty state */
        .faq-empty {
          text-align: center; padding: 64px 20px;
          color: rgba(11,62,117,0.4);
        }
        .faq-empty svg { opacity: 0.25; }
        .faq-empty h3 {
          font-size: 1rem; font-weight: 600; color: #0B3E75; margin: 16px 0 0;
        }
        .faq-empty p { font-size: 0.85rem; margin-top: 6px; }

        /* ══════════════════════════════════════════════════════════════════
           CTA BANNER
        ══════════════════════════════════════════════════════════════════ */
        .faq-cta {
          border-radius: 20px;
          background: linear-gradient(135deg, #071e3d 0%, #0B3E75 55%, #0d4c8f 100%);
          padding: 44px 48px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 32px;
          position: relative; overflow: hidden; margin-top: 48px;
        }
        .faq-cta::before {
          content: "";
          position: absolute; width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(11,62,117,0.3) 0%, transparent 70%);
          top: -120px; right: -60px; pointer-events: none;
        }
        .faq-cta::after {
          content: "";
          position: absolute; width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          bottom: -70px; left: 40px; pointer-events: none;
        }
        @media (max-width: 720px) {
          .faq-cta { flex-direction: column; text-align: center; padding: 36px 24px; }
        }
        .faq-cta__left {
          display: flex; align-items: flex-start; gap: 22px;
          flex: 1; position: relative; z-index: 1;
        }
        @media (max-width: 720px) {
          .faq-cta__left { flex-direction: column; align-items: center; }
        }
        .faq-cta__icon-wrap {
          flex-shrink: 0; width: 66px; height: 66px;
          border-radius: 18px;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center;
        }
        .faq-cta__text h3 {
          font-size: 1.2rem; font-weight: 700; color: #fff; margin: 0 0 8px;
        }
        .faq-cta__text p {
          font-size: 0.88rem; color: rgba(255,255,255,0.65);
          margin: 0; line-height: 1.65; max-width: 420px;
        }
        .faq-cta__btn {
          position: relative; z-index: 1; flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 12px;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.3);
          color: #fff; font-weight: 700;
          font-size: 0.9rem; cursor: pointer;
          text-decoration: none; transition: all 0.28s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          white-space: nowrap;
        }
        .faq-cta__btn:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
      `}</style>

      {/* SEARCH — standalone white input bar */}
      <div style={{ maxWidth: 1280, margin: "20px auto 0", padding: "0 1rem" }}>
        <div className="faq-search-wrap">
          <Search size={19} className="faq-search-icon" />
          <input
            ref={searchRef}
            id="faq-search"
            type="text"
            className="faq-search-input"
            placeholder="Soru veya konu arayın... (ör. vergi muafiyeti, başvuru)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveCategoryId(null); }}
            aria-label="SSS arama"
            autoComplete="off"
          />
          {query && (
            <button
              className="faq-search-clear"
              onClick={() => setQuery("")}
              aria-label="Aramayı temizle"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MODULES 2 & 3: CATEGORY SIDEBAR + GROUPED ACCORDIONS
      ════════════════════════════════════════════════════════════════════ */}
      <PageSection className="py-10">

        {/* Mobile horizontal tabs */}
        <div className="faq-tabs-mobile mb-6">
          <button
            className={`faq-tab-pill ${activeCategoryId === null && !isSearching ? "faq-tab-pill--active" : ""}`}
            onClick={() => { setActiveCategoryId(null); setQuery(""); }}
          >
            <LayoutGrid size={14} />
            Tümü
          </button>
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Rocket;
            const isActive = cat.id === activeCategoryId && !isSearching;
            return (
              <button
                key={cat.id}
                className={`faq-tab-pill ${isActive ? "faq-tab-pill--active" : ""}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <Icon size={14} />
                {cat.shortLabel}
              </button>
            );
          })}
        </div>

        <div className="faq-layout">

          {/* ── Desktop Sticky Sidebar ── */}
          <aside className="faq-sidebar" aria-label="Soru kategorileri">
            <div className="faq-sidebar__header">
              <div className="faq-sidebar__header-icon">
                <HelpCircle size={17} />
              </div>
              <div>
                <div className="faq-sidebar__header-text">Kategoriler</div>
                <div className="faq-sidebar__header-sub">{FAQ_ITEMS.length} soru &middot; {FAQ_CATEGORIES.length} kategori</div>
              </div>
            </div>

            {/* "Tümü" option */}
            <div
              className={`faq-sidebar__item ${activeCategoryId === null && !isSearching ? "faq-sidebar__item--active" : ""}`}
              onClick={() => { setActiveCategoryId(null); setQuery(""); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && (setActiveCategoryId(null), setQuery(""))}
            >
              <div className="faq-sidebar__item-icon"><LayoutGrid size={14} /></div>
              <span>Tüm Sorular</span>
              <span className="faq-sidebar__count">{FAQ_ITEMS.length}</span>
            </div>

            {FAQ_CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || Rocket;
              const isActive = cat.id === activeCategoryId && !isSearching;
              const count = FAQ_ITEMS.filter((item) => item.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className={`faq-sidebar__item ${isActive ? "faq-sidebar__item--active" : ""}`}
                  onClick={() => handleCategoryClick(cat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleCategoryClick(cat.id)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="faq-sidebar__item-icon"><Icon size={14} /></div>
                  <span>{cat.label}</span>
                  <span className="faq-sidebar__count">{count}</span>
                </div>
              );
            })}
          </aside>

          {/* ── Main accordion panel ── */}
          <div>
            {/* Active filter indicator */}
            {(isSearching || isFiltering) && (
              <div className="faq-filter-bar">
                <span>
                  {isSearching
                    ? <>&ldquo;<strong>{query}</strong>&rdquo; için <strong>{totalItems}</strong> sonuç</>
                    : <>Kategori: <strong>{activeCategory?.label}</strong> &mdash; <strong>{totalItems}</strong> soru</>
                  }
                </span>
                <button
                  className="faq-filter-bar__clear"
                  onClick={() => { setQuery(""); setActiveCategoryId(null); }}
                >
                  Tümünü Göster ×
                </button>
              </div>
            )}

            {/* Results */}
            {groupedItems.length > 0 ? (
              groupedItems.map(({ category, items }) => (
                <CategoryGroup
                  key={category.id}
                  category={category}
                  items={items}
                  query={query}
                />
              ))
            ) : (
              <div className="faq-empty">
                <Search size={52} />
                <h3>Sonuç bulunamadı</h3>
                <p>
                  &ldquo;{query}&rdquo; için eşleşen bir soru bulunamadı.
                  Farklı anahtar kelimeler deneyin veya aşağıdan bizimle iletişime geçin.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* ════════════════════════════════════════════════════════════════
            MODULE 4: SUPPORT CTA
        ════════════════════════════════════════════════════════════════ */}
        <div className="faq-cta" role="complementary" aria-label="Destek iletişim">
          <div className="faq-cta__left">
            <div className="faq-cta__icon-wrap">
              <Headphones size={30} color="#ffffffff" />
            </div>
            <div className="faq-cta__text">
              <h3>Aradığınız soruya yanıt bulamadınız mı?</h3>
              <p>
                Uzman ekibimiz size yardımcı olmaktan memnuniyet duyar.
                İletişim formumuz aracılığıyla sorunuzu iletin, en kısa sürede
                dönüş yapıyoruz.
              </p>
            </div>
          </div>
          <Link to="/iletisim" className="faq-cta__btn">
            Destek Talebi Oluştur
            <ArrowRight size={17} />
          </Link>
        </div>

      </PageSection>
    </>
  );
}
