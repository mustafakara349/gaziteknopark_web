import React, { useEffect, useRef, useState } from "react";
import { X, Download, Printer } from "lucide-react";
import { DocumentItem } from "../../types/document";
import { pickTranslation } from "../../utils/i18n";

interface DocumentViewerProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentViewer({ document: docItem, isOpen, onClose }: DocumentViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // States to manage mount/unmount and smooth css transitions
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => setIsAnimating(true), 30);
      document.body.style.overflow = "hidden";
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!docItem || !isRendered) return null;

  const title = docItem.title || "Belge Önizleme";
  const fileUrl = docItem.externalUrl;

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
      } catch (e) {
        console.error("Yazdırılırken hata oluştu. Tarayıcı ayarları iframe yazdırmayı engelliyor olabilir.", e);
        window.print();
      }
    } else {
      window.print();
    }
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank");
  };

  const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL as string || "http://localhost:5080/api")
    .replace("/api", "");

  const isExternal =
    fileUrl &&
    (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) &&
    !fileUrl.includes(window.location.host) &&
    !fileUrl.includes(backendBaseUrl);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop with Fade transition */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-out cursor-pointer ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer / Modal Container with Slide transition */}
      <div
        className={`relative z-10 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[600px] md:w-1/2 md:rounded-l-2xl ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="pr-4 min-w-0">
            <h3 className="truncate text-base font-semibold text-[#1f2937] md:text-lg" title={title}>
              {title}
            </h3>
            <p className="text-xs text-gray-400">Belge Önizleme Ekranı</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Yazdır */}
            <button
              type="button"
              onClick={handlePrint}
              title="Belgeyi Yazdır"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-slate-100 hover:text-[#1f2937] cursor-pointer"
            >
              <Printer className="h-5 w-5" />
            </button>

            {/* İndir */}
            <button
              type="button"
              onClick={handleDownload}
              title="Belgeyi İndir"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-slate-100 hover:text-[#1f2937] cursor-pointer"
            >
              <Download className="h-5 w-5" />
            </button>

            {/* Kapat */}
            <button
              type="button"
              onClick={onClose}
              title="Kapat"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-gray-500 transition-colors hover:bg-red-50 hover:text-accent cursor-pointer border border-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content iframe: h-[calc(100vh-80px)] is simulated here inside a flex-1 viewport container */}
        <div className="flex-1 bg-gray-50 p-4 h-[calc(100vh-80px)] overflow-hidden">
          {fileUrl ? (
            isExternal ? (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f2fc] text-primary mb-4 border border-[#d2e5f9]">
                  <Download className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-slate-700 mb-1.5">Harici Kaynak Belgesi</h4>
                <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
                  Bu belge harici resmi kaynaklarda (resmigazete.gov.tr, mevzuat.gov.tr vb.) barındırılmaktadır. Güvenlik politikaları nedeniyle doğrudan bu pencerede görüntülenemez.
                </p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-light cursor-pointer active:scale-95 shadow-sm shadow-primary/10"
                >
                  <span>Belgeyi Yeni Sekmede Aç</span>
                </a>
              </div>
            ) : (
              <iframe
                id="document-iframe"
                ref={iframeRef}
                src={fileUrl}
                title={title}
                className="h-full w-full rounded-xl border border-gray-200 bg-white shadow-sm"
                loading="lazy"
              />
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-400">
              <p className="text-sm">Doküman yüklenemedi: Dosya bağlantısı eksik.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
