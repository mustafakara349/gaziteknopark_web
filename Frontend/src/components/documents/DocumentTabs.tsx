import React from "react";
import { DocumentCategory } from "../../types/document";
import { pickTranslation } from "../../utils/i18n";

interface DocumentTabsProps {
  categories: DocumentCategory[];
  activeCategory: number | null;
  setActiveCategory: (id: number | null) => void;
}

export default function DocumentTabs({
  categories,
  activeCategory,
  setActiveCategory,
}: DocumentTabsProps) {
  return (
    <div className="no-scrollbar -mx-4 flex overflow-x-auto px-4 pb-1 whitespace-nowrap md:mx-0 md:overflow-visible md:px-0">
      <div className="flex gap-2">
        {/* Tümü Tab */}
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
            activeCategory === null
              ? "bg-primary text-white shadow-sm shadow-primary/20"
              : "border border-slate-200 bg-slate-50 text-gray-600 hover:bg-slate-200"
          }`}
        >
          Tümü
        </button>

        {/* Categories Tab */}
        {categories.map((cat) => {
          const t = pickTranslation(cat) as { name?: string };
          const name = t.name || "Kategori";
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                isActive
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "border border-slate-200 bg-slate-50 text-gray-600 hover:bg-slate-200"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
