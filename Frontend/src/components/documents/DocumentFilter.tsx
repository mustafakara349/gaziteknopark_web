import React from "react";
import { Search, ChevronDown, RefreshCw } from "lucide-react";
import { inputClass } from "../common/FormField";

interface DocumentFilterProps {
  search: string;
  setSearch: (val: string) => void;
  selectedFileType: string;
  setSelectedFileType: (val: string) => void;
}

export default function DocumentFilter({
  search,
  setSearch,
  selectedFileType,
  setSelectedFileType,
}: DocumentFilterProps) {
  const hasActiveFilters = search || selectedFileType;

  const handleClear = () => {
    setSearch("");
    setSelectedFileType("");
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Belge Adı Arama */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Belge adı ile ara..."
            className={`${inputClass} pl-10`}
          />
        </div>

        {/* Dosya Türü Dropdown */}
        <div className="relative w-full md:w-64">
          <select
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
            className={`${inputClass} pr-10 appearance-none bg-white cursor-pointer`}
          >
            <option value="">Tüm Dosya Türleri</option>
            <option value="pdf">PDF Belgeleri (.pdf)</option>
            <option value="doc">Word Belgeleri (.doc, .docx)</option>
            <option value="xls">Excel Belgeleri (.xls, .xlsx)</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end animate-slide-down">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Filtreleri Temizle</span>
          </button>
        </div>
      )}
    </div>
  );
}
