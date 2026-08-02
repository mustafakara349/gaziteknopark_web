import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, Mail, Paperclip, Download, Tag } from 'lucide-react';
import DOMPurify from 'dompurify';
import { getAnnouncementBySlug } from '../api/endpoints';

export default function AnnouncementDetailPage() {
  const { slug } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getAnnouncementBySlug(slug)
      .then((data) => {
        setAnnouncement(data || null);
      })
      .catch((err) => {
        console.error("Duyuru detayı çekilirken hata:", err);
        setAnnouncement(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: announcement?.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Bağlantı kopyalandı!');
    }
  };

  const getFileIcon = (mime) => {
    if (mime?.includes('pdf')) return '📄';
    if (mime?.includes('word') || mime?.includes('document')) return '📝';
    if (mime?.includes('excel') || mime?.includes('spreadsheet')) return '📊';
    if (mime?.includes('image')) return '🖼️';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="w-full bg-[#fcfcfd] min-h-screen pb-24 pt-8 animate-pulse">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 bg-gray-200/80 rounded-md w-32 mb-8" />
          <div className="flex gap-4 mb-6">
            <div className="h-6 bg-gray-200/80 rounded-full w-24" />
            <div className="h-6 bg-gray-200/80 rounded-full w-36" />
          </div>
          <div className="h-10 bg-gray-200/80 rounded-xl w-4/5 mb-8" />
          <div className="w-full h-[400px] bg-gray-200/80 rounded-[2rem] mb-12" />
          <div className="bg-white rounded-[2rem] p-10 border border-gray-50 space-y-4">
            <div className="h-4 bg-gray-100 rounded-md w-full" />
            <div className="h-4 bg-gray-100 rounded-md w-11/12" />
            <div className="h-4 bg-gray-100 rounded-md w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
        <p className="font-medium text-lg">Duyuru bulunamadı.</p>
        <Link to="/duyurular" className="text-[#0066cc] hover:underline font-medium text-sm">
          ← Duyurulara Dön
        </Link>
      </div>
    );
  }

  const categoryName = announcement.categoryName || "Duyuru";
  const hasImage = !!announcement.coverImageUrl;
  const hasContent = !!announcement.content;
  const hasCta = !!announcement.actionUrl;
  const hasAttachments = announcement.attachments && announcement.attachments.length > 0;

  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen pb-24 pt-8 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Top Header Bar: Back Link on Left, Share Button on Right */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/duyurular"
            className="inline-flex items-center text-gray-500 hover:text-[#0066cc] font-medium text-sm transition-colors group"
          >
            <ArrowLeft size={18} strokeWidth={2} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Duyurulara Dön
          </Link>

          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#0066cc] hover:text-white transition-all shadow-sm group/share"
            title="Duyuruyu Paylaş"
          >
            <Share2 size={16} className="group-hover/share:scale-110 transition-transform" />
          </button>
        </div>

        {/* Category & Date Pills Row */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-5 text-gray-500 text-sm font-medium mb-6">
            <span className="flex items-center text-[#0066cc] font-semibold">
              <Tag size={15} className="mr-1.5 opacity-80" /> {categoryName}
            </span>
            <span className="flex items-center">
              <Calendar size={15} className="mr-1.5 opacity-70" /> {formatDate(announcement.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[2.2rem] md:text-[2.8rem] leading-[1.15] font-extrabold text-[#0B2558] mb-8 tracking-tight">
            {announcement.title}
          </h1>

          {/* Hero Image — only if exists */}
          {hasImage && (
            <div className="w-full h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden mb-10 shadow-sm relative bg-gray-100">
              <img
                src={announcement.coverImageUrl}
                alt={announcement.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">

          {/* Summary */}
          {announcement.summary && (
            <p className="text-gray-600 leading-relaxed mb-8 text-base md:text-lg">
              {announcement.summary}
            </p>
          )}

          {/* HTML Content — only if exists */}
          {hasContent && (
            <div
              className="prose prose-lg max-w-none text-gray-600 prose-headings:text-[#0B2558] prose-a:text-[#0066cc] prose-li:marker:text-[#0066cc] leading-relaxed mb-10"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.content, {
                USE_PROFILES: { html: true },
                ADD_ATTR: ['target', 'rel'],
              }) }}
            />
          )}

          {/* CTA Button — only if actionUrl exists */}
          {hasCta && (
            <div className="mb-10">
              <a
                href={announcement.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1E3A8A] hover:bg-[#152e6e] text-white font-bold rounded-xl transition-colors shadow-md"
              >
                {announcement.actionLabel || "Detaylı Bilgi"}
              </a>
            </div>
          )}

          {/* Attachments — only if exists */}
          {hasAttachments && (
            <div className="bg-[#f0f4f9]/80 rounded-2xl p-6 mb-10 border border-blue-100/60">
              <h3 className="text-lg font-bold text-[#0B2558] mb-4 flex items-center gap-2">
                <Paperclip size={18} className="text-[#0066cc]" />
                Ekler & Dokümanlar
              </h3>
              <div className="flex flex-wrap gap-3">
                {announcement.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-[#0B2558] hover:text-[#0066cc] border border-gray-200 hover:border-blue-300 font-medium text-sm shadow-sm transition-all group"
                  >
                    <span className="text-lg">{getFileIcon(att.fileMime)}</span>
                    <div className="flex flex-col">
                      <span className="group-hover:text-[#0066cc] transition-colors">{att.fileName}</span>
                      {att.fileSize > 0 && (
                        <span className="text-xs text-gray-400">{formatFileSize(att.fileSize)}</span>
                      )}
                    </div>
                    <Download size={14} className="text-gray-400 group-hover:text-[#0066cc] transition-colors ml-1" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Footer Share section (without "Tüm Duyuruları Gör" link) */}
          <div className="border-t border-gray-100 pt-6 flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-500">Paylaş:</span>
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
              title="Paylaş"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => {
                window.location.href = `mailto:?subject=${encodeURIComponent(announcement.title)}&body=${encodeURIComponent(window.location.href)}`;
              }}
              className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
              title="E-posta ile Gönder"
            >
              <Mail size={18} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
