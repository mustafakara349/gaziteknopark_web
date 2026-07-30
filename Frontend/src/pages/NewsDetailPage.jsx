import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2, X } from 'lucide-react';
import { getNewsById } from '../api/endpoints';

export default function NewsDetailPage() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getNewsById(id)
      .then((res) => {
        setNewsItem(res?.data || res || null);
      })
      .catch((err) => console.error("Haber detayı çekilirken hata:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  if (loading) {
    return (
      <div className="w-full bg-[#fcfcfd] min-h-screen pb-24 pt-8 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 bg-gray-200/80 rounded-md w-32 mb-8" />
          <div className="flex gap-4 mb-6">
            <div className="h-6 bg-gray-200/80 rounded-full w-24" />
            <div className="h-6 bg-gray-200/80 rounded-full w-36" />
          </div>
          <div className="h-10 bg-gray-200/80 rounded-xl w-4/5 mb-3" />
          <div className="h-10 bg-gray-200/80 rounded-xl w-3/5 mb-8" />
          <div className="w-full h-[440px] bg-gray-200/80 rounded-[2rem] mb-12" />
          <div className="bg-white rounded-[2rem] p-10 border border-gray-50 space-y-4">
            <div className="h-4 bg-gray-100 rounded-md w-full" />
            <div className="h-4 bg-gray-100 rounded-md w-11/12" />
            <div className="h-4 bg-gray-100 rounded-md w-4/5" />
            <div className="h-4 bg-gray-100 rounded-md w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Haber bulunamadı.</div>;
  }

  const title = newsItem.title || newsItem.translations?.[0]?.title || "Başlıksız Haber";
  const content = newsItem.content || newsItem.translations?.[0]?.content || newsItem.summary || newsItem.translations?.[0]?.summary || "";
  const categoryName = newsItem.categoryName || newsItem.category?.translations?.[0]?.name || "HABER";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Bağlantı kopyalandı!');
    }
  };

  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen pb-24 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header Navigation & Share */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/haberler"
            className="inline-flex items-center text-gray-500 hover:text-[#0066cc] font-medium text-sm transition-colors group"
          >
            <ArrowLeft size={18} strokeWidth={2} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Haberlere Dön
          </Link>

          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#0066cc] hover:text-white transition-all shadow-sm group/share"
            title="Haberi Paylaş"
          >
            <Share2 size={16} className="group-hover/share:scale-110 transition-transform" />
          </button>
        </div>

        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-[#E6F0FA] text-[#0066cc] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {categoryName}
            </span>
            <div className="flex items-center text-gray-500 text-sm font-medium gap-4 ml-2">
              <span className="flex items-center"><Calendar size={15} className="mr-1.5 opacity-70" /> {formatDate(newsItem.publishedAt)}</span>
              {newsItem.readTime > 0 && (
                <span className="flex items-center"><Clock size={15} className="mr-1.5 opacity-70" /> {newsItem.readTime} dk okuma</span>
              )}
              {newsItem.authorName && (
                <span className="flex items-center"><User size={15} className="mr-1.5 opacity-70" /> {newsItem.authorName}</span>
              )}
            </div>
          </div>

          <h1 className="text-[2.2rem] md:text-[2.8rem] leading-[1.15] font-extrabold text-[#0B2558] mb-8 tracking-tight">
            {title}
          </h1>

          {newsItem.coverImageUrl && (
            <div className="w-full h-[400px] md:h-[480px] rounded-[2rem] overflow-hidden shadow-sm relative bg-gray-100">
              <img
                src={newsItem.coverImageUrl}
                alt={title}
                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="mb-12">
          <div
            className="prose prose-lg max-w-none text-gray-600 prose-headings:text-[#0B2558] prose-a:text-[#0066cc]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {newsItem.additionalImageUrls && newsItem.additionalImageUrls.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-2xl font-bold text-[#0B2558]">Haberden Kareler</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {newsItem.additionalImageUrls.map((imgUrl, index) => (
                <div
                  key={index}
                  className="h-52 rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
                  onClick={() => setLightboxImg(imgUrl)}
                >
                  <img
                    src={imgUrl}
                    alt={`Galeri ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); setLightboxImg(null); }}
          >
            <X size={32} />
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg}
              alt="Büyük görünüm"
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
