import React from "react";
import { Eye, Download } from "lucide-react";
import { DocumentItem } from "../../types/document";
import { pickTranslation } from "../../utils/i18n";

interface DocumentCardProps {
  document: DocumentItem;
  categoryName?: string;
  onPreview: (doc: DocumentItem) => void;
}

// Convert bytes to KB/MB format
const formatSize = (bytes?: number) => {
  if (bytes === undefined || bytes === null || bytes === 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

// Format date to local month & year (e.g. "Ocak 2026")
const formatDateMonthYear = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
};

// Helper for dynamic badge colors
const getFileTypeStyle = (ext: string) => {
  switch (ext) {
    case "pdf":
      return "bg-red-50 text-red-600 border border-red-100/50";
    case "doc":
    case "docx":
      return "bg-blue-50 text-blue-600 border border-blue-100/50";
    case "xls":
    case "xlsx":
      return "bg-green-50 text-green-600 border border-green-100/50";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-100/50";
  }
};

export default function DocumentCard({ document, categoryName, onPreview }: DocumentCardProps) {
  const t = pickTranslation(document) as { title?: string; fileUrl?: string; filePath?: string; fileSize?: number };
  const title = t.title || "İsimsiz Belge";
  const fileUrl = t.fileUrl;
  const fileSize = t.fileSize;

  const getFileExtension = (urlOrPath?: string) => {
    if (!urlOrPath) return "pdf";
    const cleanUrl = urlOrPath.split("?")[0];
    const ext = cleanUrl.split(".").pop()?.toLowerCase();
    return ext || "pdf";
  };

  const fileExt = getFileExtension(fileUrl || t.filePath);
  const sizeText = formatSize(fileSize);
  const dateText = formatDateMonthYear(document.publishedDate);

  const handleCardClick = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      alert("Dosya bağlantısı bulunamadı.");
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(document);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fileUrl) {
      e.preventDefault();
      alert("Dosya bağlantısı bulunamadı.");
      return;
    }
    window.open(fileUrl, "_blank");
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between gap-4 p-5 transition-all duration-200 hover:z-10 hover:shadow-md bg-white border-b border-gray-100 last:border-b-0 sm:flex-row sm:items-center cursor-pointer select-none"
    >
      {/* Sol & Orta Alan */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start flex-1">
        {/* Sol Alan: Dosya İkonu */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xs font-black uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105 ${getFileTypeStyle(
            fileExt
          )}`}
        >
          {fileExt}
        </div>

        {/* Orta Alan: Başlık ve Metadata */}
        <div className="flex-1 space-y-1.5">
          <h3 className="text-base font-semibold text-[#1f2937] transition-colors duration-200 group-hover:text-primary-light leading-snug">
            {title}
          </h3>
          
          {/* Metadata format: [Kategori Adı] • [Dosya Boyutu] • [Tarih] */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 font-medium">
            {categoryName && <span>{categoryName}</span>}
            {sizeText && (
              <>
                <span className="text-gray-300">•</span>
                <span>{sizeText}</span>
              </>
            )}
            {dateText && (
              <>
                <span className="text-gray-300">•</span>
                <span>{dateText}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sağ Alan: Butonlar */}
      <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        {/* Önizle Butonu */}
        <button
          type="button"
          onClick={handlePreviewClick}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-200 hover:border-primary-light hover:bg-[#e8f2fc] hover:text-primary-light cursor-pointer sm:w-auto active:scale-95"
        >
          <Eye className="h-4 w-4" />
          <span>Önizle</span>
        </button>

        {/* İndir Butonu */}
        <a
          href={fileUrl || "#"}
          onClick={handleDownloadClick}
          download
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-light cursor-pointer sm:w-auto shadow-sm shadow-primary/10 active:scale-95"
        >
          <Download className="h-4 w-4" />
          <span>İndir</span>
        </a>
      </div>
    </div>
  );
}
