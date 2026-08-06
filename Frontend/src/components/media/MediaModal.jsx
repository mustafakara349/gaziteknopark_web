import { X, Download, Share2, Check, Calendar } from "lucide-react";
import { useState } from "react";

export default function MediaModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!item) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);

    if (item.downloadUrl) {
      const link = document.createElement("a");
      link.href = item.downloadUrl;
      link.download = item.title || "gaziteknopark-medya";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const displayDate = item.dateLabel || item.date || "Gazi Teknopark";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white border border-gray-200 shadow-2xl flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 bg-[#fcfcfd] rounded-t-[2rem]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-50 text-[#0066cc] text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wide">
              {item.category || "Gazi Teknopark Medya"}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
              <Calendar className="w-3 h-3 text-[#0066cc]" />
              {displayDate}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#0B2558] flex items-center justify-center transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Content Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* VIDEO PLAYER (Fixed 1920x1080 Aspect Ratio -> aspect-video) */}
          {item.type === "video" && (
            <div className="w-full aspect-video rounded-[1.5rem] overflow-hidden bg-slate-950 shadow-md border border-gray-200 relative">
              {item.videoEmbedUrl ? (
                <iframe
                  src={item.videoEmbedUrl}
                  title={item.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col items-center justify-center p-6 text-center text-white">
                    <h4 className="text-lg font-bold mt-1 max-w-lg">{item.title}</h4>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PHOTO PREVIEW */}
          {item.type === "photo" && (
            <div className="w-full max-h-[500px] rounded-[1.5rem] overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              <img
                src={item.imageUrl || item.coverImage}
                alt={item.title}
                className="w-full h-full object-contain max-h-[500px]"
              />
            </div>
          )}

          {/* Title & Description */}
          <div>
            <h3 className="text-xl font-bold text-[#0B2558]">{item.title}</h3>
            {item.description && (
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.description}</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-gray-100 bg-[#fcfcfd] rounded-b-[2rem] flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#0B2558] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Bağlantı Kopyalandı</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Bağlantıyı Paylaş</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            {item.downloadUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-full bg-[#0B2558] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#0066cc] cursor-pointer"
              >
                {downloaded ? (
                  <>
                    <Check className="w-4 h-4" />
                    İndirildi
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    İndir
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-white transition-colors cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
