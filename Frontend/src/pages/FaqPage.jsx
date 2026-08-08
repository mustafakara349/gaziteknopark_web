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
  ExternalLink,
  ChevronRight,
  X,
  HelpCircle,
  LayoutGrid,
} from "lucide-react";
import { getFaq } from "../api/endpoints";
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
function AccordionItem({ item, query, onTagClick }) {
  const [open, setOpen] = useState(false);

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
        className="faq-card__body"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="faq-card__body-inner">
          <div className="faq-card__answer text-gray-600 prose prose-sm max-w-none">
            {/* HTML Cevap İçeriği (Backend tarafında XSS filtrelemesinden geçmiştir) */}
            <div
              dangerouslySetInnerHTML={{ __html: item.answer }}
              className="leading-relaxed text-sm text-gray-600"
            />

            {/* Buton ve Etiketler Ortak Satır Alanı */}
            {((item.tags && item.tags.length > 0) || (item.buttonLink && item.buttonText)) && (
              <div className="faq-card__footer-row">

                {/* Sol Taraf: Soruya Bağlı Etiketler */}
                <div className="faq-card__tags">
                  {item.tags && item.tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => onTagClick(tag.name)}
                      className="faq-tag faq-tag--answer text-[10px] bg-gray-100 hover:bg-blue-50 hover:text-[#0B3E75] hover:border-blue-200 border border-transparent px-2.5 py-0.5 rounded-full transition-all cursor-pointer font-medium"
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>

                {/* Sağ Taraf: Aksiyon Yönlendirme Butonu */}
                {item.buttonLink && item.buttonText && (
                  <div className="faq-card__button-wrap shrink-0 ml-auto">
                    {item.buttonLink.startsWith("http://") || item.buttonLink.startsWith("https://") || item.buttonLink.startsWith("//") ? (
                      <a
                        href={item.buttonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="faq-action-btn inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B3E75] hover:bg-[#1155a0] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                      >
                        {item.buttonText}
                        <ExternalLink size={13} />
                      </a>
                    ) : (
                      <Link
                        to={item.buttonLink}
                        className="faq-action-btn inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B3E75] hover:bg-[#1155a0] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                      >
                        {item.buttonText}
                        <ChevronRight size={13} />
                      </Link>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Category Group ─────────────────────────────────────────────────────── */
function CategoryGroup({ category, items, query, onTagClick }) {
  const Icon = ICON_MAP[category.icon] || HelpCircle;
  if (items.length === 0) return null;

  return (
    <section className="faq-group" aria-labelledby={`cat-${category.id}`}>
      <div className="faq-group__header">
        <div className="faq-group__icon">
          <Icon size={18} />
        </div>
        <div>
          <h2 id={`cat-${category.id}`} className="faq-group__title">{category.name}</h2>
          <p className="faq-group__count">{items.length} Soru</p>
        </div>
      </div>
      <div className="faq-list">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="faq-item-wrapper"
            style={{ "--index": index }}
          >
            <AccordionItem item={item} query={query} onTagClick={onTagClick} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Kategori veya arama sorgusu değiştiğinde sayfayı yukarı yumuşakça kaydırır
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategoryId, query]);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const data = await getFaq();
      setFaqs(data || []);
    } catch (error) {
      console.error("Error fetching FAQs", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dinamik olarak FAQ listesindeki kategorileri çıkarma
  const categories = useMemo(() => {
    const catsMap = new Map();
    faqs.forEach(faq => {
      if (faq.faqCategory) {
        catsMap.set(faq.faqCategory.id, faq.faqCategory);
      }
    });
    return Array.from(catsMap.values()).sort((a, b) => a.orderNo - b.orderNo);
  }, [faqs]);

  const isSearching = query.trim().length > 0;
  const isFiltering = activeCategoryId !== null;

  /* Items filtered by search OR category */
  const filteredItems = useMemo(() => {
    let items = faqs;

    if (isSearching) {
      const q = query.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.name.toLowerCase().includes(q))
      );
    }

    if (isFiltering && !isSearching) {
      items = items.filter((item) => item.faqCategoryId === activeCategoryId);
    }

    return items;
  }, [query, activeCategoryId, faqs, isSearching, isFiltering]);

  /* Group filtered items by category (for the grouped view) */
  const groupedItems = useMemo(() => {
    if (isFiltering && !isSearching) {
      const activeCat = categories.find(c => c.id === activeCategoryId);
      if (!activeCat) return [];
      return [{
        category: activeCat,
        items: filteredItems
      }];
    }

    const grouped = categories.map((cat) => ({
      category: cat,
      items: filteredItems.filter((item) => item.faqCategoryId === cat.id),
    })).filter((g) => g.items.length > 0);

    // Kategoriye bağlı olmayan genel sorular
    const uncategorized = filteredItems.filter(item => !item.faqCategoryId);
    if (uncategorized.length > 0) {
      grouped.push({
        category: { id: 0, name: "Genel Sorular", slug: "genel", icon: "HelpCircle" },
        items: uncategorized
      });
    }

    return grouped;
  }, [filteredItems, categories, activeCategoryId, isSearching, isFiltering]);

  const handleTagClick = (tagName) => {
    setQuery(tagName);
    setActiveCategoryId(null);
    searchRef.current?.focus();
  };

  const handleCategoryClick = (id) => {
    setActiveCategoryId(id);
    setQuery(""); // clear search when selecting a category
  };

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const totalItems = filteredItems.length;

  return (
    <>
      <style>{`
        /* search wrap */
        .faq-search-wrap {
          position: relative;
          margin-bottom: 24px;
        }
        .faq-search-input {
          width: 100%;
          padding: 16px 56px 16px 52px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 1rem;
          color: #0f172a;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
          outline: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
          box-sizing: border-box;
        }
        .faq-search-input::placeholder { color: #94a3b8; }
        .faq-search-input:focus {
          border-color: #0B3E75;
          box-shadow: 0 10px 30px -10px rgba(11, 62, 117, 0.15), 0 0 0 3px rgba(11, 62, 117, 0.05);
        }
        .faq-search-icon {
          position: absolute; left: 18px; top: 50%;
          transform: translateY(-50%);
          color: #64748b; pointer-events: none;
        }
        .faq-search-clear {
          position: absolute; right: 16px; top: 50%;
          transform: translateY(-50%);
          background: #f1f5f9;
          border: none; border-radius: 50%;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #475569;
          transition: all 0.2s ease;
        }
        .faq-search-clear:hover { background: #e2e8f0; color: #0f172a; }

        .faq-tag--answer {
          font-size: 0.72rem; padding: 4px 10px;
          background: rgba(11,62,117,0.06);
          border-color: rgba(11,62,117,0.12);
          color: rgba(11,62,117,0.6);
        }

        /* ══════════════════════════════════════════════════════════════════
           LAYOUT: Sidebar + Content
        ══════════════════════════════════════════════════════════════════ */
        .faq-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 36px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .faq-layout { grid-template-columns: 1fr; }
          .faq-sidebar { display: none !important; }
        }

        /* SIDEBAR */
        .faq-sidebar {
          position: sticky; top: 100px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
        }
        .faq-sidebar__header {
          padding: 20px 24px;
          background: linear-gradient(135deg, #0B3E75 0%, #154e8c 100%);
          display: flex; align-items: center; gap: 12px;
        }
        .faq-sidebar__header-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          color: #ffffff; flex-shrink: 0;
        }
        .faq-sidebar__header-text {
          font-size: 0.85rem; font-weight: 700; color: #ffffff;
          letter-spacing: 0.02em;
        }
        .faq-sidebar__header-sub {
          font-size: 0.72rem; color: rgba(255,255,255,0.7);
          margin-top: 2px;
        }

        .faq-sidebar__item {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 24px;
          cursor: pointer; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border-left: 3px solid transparent;
          font-size: 0.88rem; font-weight: 500;
          color: #475569;
          border-bottom: 1px solid #f1f5f9;
        }
        .faq-sidebar__item:last-child { border-bottom: none; }
        .faq-sidebar__item:hover { background: #f8fafc; color: #0b3e75; }
        .faq-sidebar__item--active {
          border-left-color: #0B3E75;
          background: rgba(241, 245, 249, 0.5);
          color: #0B3E75; font-weight: 600;
        }
        .faq-sidebar__item-icon {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 8px;
          flex-shrink: 0; background: #f1f5f9;
          color: #475569; transition: all 0.25s;
        }
        .faq-sidebar__item--active .faq-sidebar__item-icon {
          background: #0B3E75; color: #ffffff;
        }
        .faq-sidebar__count {
          margin-left: auto; font-size: 0.72rem; font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 8px; border-radius: 999px;
        }
        .faq-sidebar__item--active .faq-sidebar__count {
          background: rgba(11, 62, 117, 0.1);
          color: #0B3E75;
        }

        /* Mobile horizontal tabs */
        .faq-tabs-mobile {
          display: none;
          overflow-x: auto; gap: 8px; padding-bottom: 8px;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
        }
        .faq-tabs-mobile::-webkit-scrollbar { display: none; }
        @media (max-width: 960px) { .faq-tabs-mobile { display: flex; } }
        .faq-tab-pill {
          flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 18px; border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: #ffffff; font-size: 0.8rem; font-weight: 600;
          color: #475569; cursor: pointer;
          transition: all 0.22s; white-space: nowrap;
        }
        .faq-tab-pill--active { background: #0B3E75; border-color: #0B3E75; color: #ffffff; }
        .faq-tab-pill:hover:not(.faq-tab-pill--active) { border-color: #0B3E75; color: #0B3E75; }

        /* Accordions Groups */
        .faq-group { margin-bottom: 40px; }
        .faq-group:last-child { margin-bottom: 0; }
        .faq-group__header {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 20px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #0B3E75 0%, #154e8c 100%);
          border-radius: 14px;
          color: #ffffff;
          box-shadow: 0 4px 15px -3px rgba(11, 62, 117, 0.12);
        }
        .faq-group__icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(255, 255, 255, 0.15);
          display: flex; align-items: center; justify-content: center;
          color: #ffffff; flex-shrink: 0;
        }
        .faq-group__title {
          font-size: 1.05rem; font-weight: 700; color: #ffffff; margin: 0;
        }
        .faq-group__count {
          font-size: 0.78rem; color: rgba(255, 255, 255, 0.7); margin: 2px 0 0;
        }

        .faq-list { display: flex; flex-direction: column; gap: 12px; }

        /* CARDS */
        .faq-card {
          border-radius: 16px; background: #ffffff;
          border: 1px solid #e2e8f0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;
          overflow: hidden; user-select: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
        }
        .faq-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px -4px rgba(11, 62, 117, 0.08), 0 4px 12px -2px rgba(11, 62, 117, 0.03);
          border-color: #cbd5e1;
        }
        .faq-card--open {
          border-color: #cbd5e1;
          box-shadow: 0 10px 25px -5px rgba(11, 62, 117, 0.05);
        }
        .faq-card__header {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 22px 28px; gap: 14px;
        }
        .faq-card__q-icon {
          flex-shrink: 0; color: #94a3b8;
          transition: color 0.25s;
          display: flex; align-items: center;
        }
        .faq-card--open .faq-card__q-icon { color: #0B3E75; }
        .faq-card__question {
          font-size: 0.96rem; font-weight: 600;
          color: #0b3e75; line-height: 1.5; flex: 1;
        }
        .faq-card__toggle-icon {
          flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%;
          background: #f1f5f9;
          display: flex; align-items: center; justify-content: center;
          color: #475569; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .faq-card--open .faq-card__toggle-icon {
          background: #0B3E75; color: #ffffff; transform: rotate(180deg);
        }
        .faq-card__body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          opacity: 0;
        }
        .faq-card--open .faq-card__body {
          grid-template-rows: 1fr;
          opacity: 1;
        }
        .faq-card__body-inner {
          overflow: hidden;
        }
        .faq-card__answer {
          padding: 12px 28px 24px;
          border-top: 1px dashed transparent;
        }
        .faq-card__answer p {
          font-size: 0.88rem; color: #475569; line-height: 1.75; margin: 0;
        }
        .faq-card__answer a {
          color: #0B3E75; text-decoration: underline; text-underline-offset: 3px;
          font-weight: 600; transition: opacity 0.2s;
        }
        .faq-card__answer a:hover { opacity: 0.8; }
        
        .faq-card__answer a.faq-action-btn {
          color: #ffffff !important;
          text-decoration: none !important;
          font-weight: 600;
        }
        .faq-card__answer a.faq-action-btn:hover {
          color: #ffffff !important;
          opacity: 0.9;
        }
        
        .faq-card__footer-row {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px dashed #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .faq-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        /* stagger fade-in cascade animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .faq-item-wrapper {
          opacity: 0;
          animation: fadeInUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: calc(var(--index) * 60ms);
        }

        /* highlight */
        .faq-highlight {
          background: rgba(11,62,117,0.08);
          color: #0B3E75; border-radius: 4px; padding: 1px 3px;
          font-weight: 600;
        }

        /* filter bar */
        .faq-filter-bar {
          padding: 12px 20px; border-radius: 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          font-size: 0.85rem; color: #475569;
          margin-bottom: 24px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 8px;
        }
        .faq-filter-bar strong { color: #0b3e75; font-weight: 600; }
        .faq-filter-bar__clear {
          background: none; border: none; cursor: pointer;
          color: #0B3E75; font-weight: 700; font-size: 0.82rem; padding: 0;
          transition: opacity 0.2s;
        }
        .faq-filter-bar__clear:hover { opacity: 0.8; }

        /* empty state */
        .faq-empty {
          text-align: center; padding: 64px 20px;
          color: #94a3b8;
          background: #ffffff;
          border-radius: 16px;
          border: 1px dashed #cbd5e1;
        }
        .faq-empty svg { color: #94a3b8; margin: 0 auto; opacity: 0.6; }
        .faq-empty h3 {
          font-size: 1.05rem; font-weight: 600; color: #0b3e75; margin: 16px 0 8px;
        }
        .faq-empty p { font-size: 0.85rem; max-w-sm; margin: 0 auto; line-height: 1.5; }

        /* CTA */
        .faq-cta {
          border-radius: 24px;
          background: linear-gradient(135deg, #091e3a 0%, #0B3E75 60%, #154e8c 100%);
          padding: 40px 48px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 32px;
          position: relative; overflow: hidden; margin-top: 48px;
          box-shadow: 0 10px 30px -10px rgba(11, 62, 117, 0.3);
        }
        .faq-cta::before {
          content: "";
          position: absolute; width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 65%);
          top: -150px; right: -80px; pointer-events: none;
        }
        @media (max-width: 768px) {
          .faq-cta { flex-direction: column; text-align: center; padding: 32px 24px; }
        }
        .faq-cta__left {
          display: flex; align-items: center; gap: 20px;
          flex: 1; position: relative; z-index: 1;
        }
        @media (max-width: 768px) {
          .faq-cta__left { flex-direction: column; align-items: center; }
        }
        .faq-cta__icon-wrap {
          flex-shrink: 0; width: 60px; height: 60px;
          border-radius: 16px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
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
          CATEGORY SIDEBAR + GROUPED ACCORDIONS
      ════════════════════════════════════════════════════════════════════ */}
      <PageSection className="pt-2 pb-10 md:pt-6 md:pb-16">

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            Sorular yükleniyor, lütfen bekleyiniz...
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Sistemde henüz yayınlanmış soru bulunmuyor.
          </div>
        ) : (
          <>
            {/* Mobile horizontal tabs */}
            <div className="faq-tabs-mobile mb-6">
              <button
                className={`faq-tab-pill ${activeCategoryId === null && !isSearching ? "faq-tab-pill--active" : ""}`}
                onClick={() => { setActiveCategoryId(null); setQuery(""); }}
              >
                <LayoutGrid size={14} />
                Tümü
              </button>
              {categories.map((cat) => {
                const Icon = ICON_MAP[cat.icon] || Rocket;
                const isActive = cat.id === activeCategoryId && !isSearching;
                return (
                  <button
                    key={cat.id}
                    className={`faq-tab-pill ${isActive ? "faq-tab-pill--active" : ""}`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <Icon size={14} />
                    {cat.name}
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
                    <div className="faq-sidebar__header-sub">{faqs.length} soru &middot; {categories.length} kategori</div>
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
                  <span className="faq-sidebar__count">{faqs.length}</span>
                </div>

                {categories.map((cat) => {
                  const Icon = ICON_MAP[cat.icon] || Rocket;
                  const isActive = cat.id === activeCategoryId && !isSearching;
                  const count = faqs.filter((item) => item.faqCategoryId === cat.id).length;
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
                      <span>{cat.name}</span>
                      <span className="faq-sidebar__count">{count}</span>
                    </div>
                  );
                })}
              </aside>

              {/* ── Main accordion panel ── */}
              <div key={`${activeCategoryId}-${query}`}>
                {/* Active filter indicator */}
                {(isSearching || isFiltering) && (
                  <div className="faq-filter-bar">
                    <span>
                      {isSearching
                        ? <>&ldquo;<strong>{query}</strong>&rdquo; için <strong>{totalItems}</strong> sonuç</>
                        : <>Kategori: <strong>{activeCategory?.name}</strong> &mdash; <strong>{totalItems}</strong> soru</>
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
                      onTagClick={handleTagClick}
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
          </>
        )}

        {/* Support CTA */}
        <div className="faq-cta" role="complementary" aria-label="İletişim">
          <div className="faq-cta__left">
            <div className="faq-cta__text">
              <h3>Aradığınız sorunun cevabını bulamadınız mı?</h3>
              <p>
                Bizimle iletişime geçerek sorularınızı doğrudan iletebilirsiniz.
              </p>
            </div>
          </div>
          <Link to="/iletisim" className="faq-cta__btn">
            İletişime Geç
          </Link>
        </div>

      </PageSection>
    </>
  );
}
