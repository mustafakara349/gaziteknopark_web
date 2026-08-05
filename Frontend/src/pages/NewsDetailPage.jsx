import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2, X, Tag, ChevronRight, ChevronLeft } from 'lucide-react';
import DOMPurify from 'dompurify';
import { getNewsById, getNews } from '../api/endpoints';
export default function NewsDetailPage() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [related, setRelated] = useState([]);
  const [prevNews, setPrevNews] = useState(null);
  const [nextNews, setNextNews] = useState(null);
  const galleryRef = useRef(null);

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = 300;
      galleryRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

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

  useEffect(() => {
    if (!newsItem) return;
    let cancelled = false;

    getNews({ pageSize: 100, sort: "newest" })
      .then((res) => {
        if (cancelled) return;
        const data = res?.data || [];
        // Filter out current news item for related news list (up to 3)
        setRelated(data.filter((item) => item.id !== newsItem.id && item.slug !== newsItem.slug).slice(0, 3));

        // Find current news position to calculate prev & next
        const idx = data.findIndex((item) => item.id === newsItem.id || (item.slug && item.slug === newsItem.slug));
        if (idx !== -1) {
          setPrevNews(idx > 0 ? data[idx - 1] : null);
          setNextNews(idx < data.length - 1 ? data[idx + 1] : null);
        } else {
          setPrevNews(null);
          setNextNews(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRelated([]);
          setPrevNews(null);
          setNextNews(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [newsItem]);

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
          <div className="flex flex-wrap items-center gap-5 text-gray-500 text-sm font-medium mb-6">
            <span className="flex items-center text-[#0066cc] font-semibold">
              <Tag size={15} className="mr-1.5 opacity-80" /> {categoryName}
            </span>
            <span className="flex items-center">
              <Calendar size={15} className="mr-1.5 opacity-70" /> {formatDate(newsItem.publishedAt)}
            </span>
            {newsItem.readTime > 0 && (
              <span className="flex items-center">
                <Clock size={15} className="mr-1.5 opacity-70" /> {newsItem.readTime} dk okuma
              </span>
            )}
            {newsItem.authorName && (
              <span className="flex items-center">
                <User size={15} className="mr-1.5 opacity-70" /> {newsItem.authorName}
              </span>
            )}
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

        {/* Main Content Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-8">
          <div>
            <div
              className="prose prose-lg max-w-none text-gray-600 prose-headings:text-[#0B2558] prose-a:text-[#0066cc] prose-p:last:mb-0"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
          </div>

          {newsItem.additionalImageUrls && newsItem.additionalImageUrls.length > 0 && (
            <div className="mt-10 pt-10 border-t border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-[#0B2558]">Haberden Kareler</h3>
              </div>
              
              <div className="relative group/slider">
                {/* Left Arrow */}
                <button 
                  onClick={() => scrollGallery('left')}
                  className="absolute -left-6 md:-left-14 top-1/2 -translate-y-1/2 z-10 p-2 flex items-center justify-center text-gray-300 hover:text-[#0066cc] transition-colors"
                  aria-label="Önceki"
                >
                  <ChevronLeft size={48} strokeWidth={1.5} />
                </button>

                {/* Horizontal slider container */}
                <div 
                  ref={galleryRef}
                  className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth px-2" 
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {newsItem.additionalImageUrls.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="h-56 min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] shrink-0 snap-center rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer relative"
                      onClick={() => setLightboxImg(imgUrl)}
                    >
                      <img
                        src={imgUrl}
                        alt={`Galeri ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Subtle overlay on hover for better UX */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  ))}
                </div>

                {/* Right Arrow */}
                <button 
                  onClick={() => scrollGallery('right')}
                  className="absolute -right-6 md:-right-14 top-1/2 -translate-y-1/2 z-10 p-2 flex items-center justify-center text-gray-300 hover:text-[#0066cc] transition-colors"
                  aria-label="Sonraki"
                >
                  <ChevronRight size={48} strokeWidth={1.5} />
                </button>
              </div>

              {/* Add global style just in case inline styles are not enough for webkit */}
              <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
              `}</style>
            </div>
          )}
        </div>

        {/* Önceki & Sonraki Haber Butonları */}
        {(prevNews || nextNews) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {prevNews ? (
              <Link
                to={`/haberler/${prevNews.slug || prevNews.id}`}
                className="group flex items-center gap-4 p-5 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:border-[#0066cc]/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066cc] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#0066cc] group-hover:text-white transition-all">
                  <ChevronLeft size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-[0.75rem] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                    Önceki Haber
                  </span>
                  <span className="text-sm font-bold text-[#0B2558] line-clamp-1 group-hover:text-[#0066cc] transition-colors">
                    {prevNews.title || prevNews.translations?.[0]?.title || "Önceki Haber"}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextNews ? (
              <Link
                to={`/haberler/${nextNews.slug || nextNews.id}`}
                className="group flex items-center justify-end text-right gap-4 p-5 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:border-[#0066cc]/30 hover:shadow-md transition-all sm:col-start-2"
              >
                <div className="min-w-0">
                  <span className="text-[0.75rem] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                    Sonraki Haber
                  </span>
                  <span className="text-sm font-bold text-[#0B2558] line-clamp-1 group-hover:text-[#0066cc] transition-colors">
                    {nextNews.title || nextNews.translations?.[0]?.title || "Sonraki Haber"}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066cc] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#0066cc] group-hover:text-white transition-all">
                  <ChevronRight size={20} />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

      </div>

      {/* Diğer Haberler */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h3 className="mb-6 text-2xl font-bold text-[#0B2558]">Diğer Haberler</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => {
              const itemTitle = item.title || item.translations?.[0]?.title || "Başlıksız Haber";
              const itemSummary = item.summary || item.translations?.[0]?.summary || "";
              const DEFAULT_COVER = "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800";

              return (
                <Link
                  to={`/haberler/${item.slug || item.id}`}
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] group/card"
                >
                  <div className="h-[210px] overflow-hidden relative">
                    <img
                      src={item.coverImageUrl || DEFAULT_COVER}
                      alt={itemTitle}
                      onError={(e) => { e.target.src = DEFAULT_COVER; }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="text-[#0066cc] text-[0.85rem] font-medium mb-3">
                      {formatDate(item.publishedAt)}
                    </div>
                    <h3 className="text-[1.3rem] font-bold text-[#0B2558] mb-4 leading-snug group-hover/card:text-[#0066cc] transition-colors">
                      {itemTitle}
                    </h3>
                    <p className="text-gray-500 text-[0.9rem] mb-8 line-clamp-2 leading-relaxed">
                      {itemSummary}
                    </p>

                    <div className="mt-auto">
                      <span className="inline-flex items-center text-[#0B2558] font-bold text-[0.85rem] group/btn">
                        Devamını Oku
                        <ChevronRight
                          size={16}
                          strokeWidth={2.5}
                          className="ml-1 text-[#0066cc] transition-transform group-hover/card:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

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
