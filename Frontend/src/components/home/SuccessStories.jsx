import { useEffect, useState, useRef } from "react";
import { getLinkedInPosts, getSuccessStories } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import ShowMoreButton from "../common/ShowMoreButton";
import EmptyState from "../common/EmptyState";

const parsePostText = (text) => {
  if (!text) return { title: "", body: "" };

  // Detect first sentence ending with '.', '?' or '!'
  const match = text.match(/^([\s\S]*?[.?!])(?:\s+|$)([\s\S]*)$/);

  if (match) {
    return {
      title: match[1].trim(),
      body: match[2].trim()
    };
  }

  return {
    title: text.length > 100 ? text.slice(0, 100) + "..." : text,
    body: text.length > 100 ? text : ""
  };
};

const defaultStories = [
  {
    id: "mock1",
    companyName: "Gazi Teknopark",
    rawText: "Gazi Teknopark firmalarından TechNova, A serisi yatırım turunda 10 Milyon TL yatırım aldı! Geliştirdikleri yapay zeka tabanlı sağlık çözümleriyle küresel pazara açılmayı hedefleyen ekibimizi tebrik ederiz.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  },
  {
    id: "mock2",
    companyName: "Gazi Teknopark",
    rawText: "AeroSpace TR firmamız TÜBİTAK 1507 Desteği almaya hak kazandı. Yerli ve milli imkanlarla geliştirilen otonom insansız hava aracı yazılımı projesinde emeği geçen tüm mühendislerimizi kutluyoruz.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  },
  {
    id: "mock3",
    companyName: "Gazi Teknopark",
    rawText: "BioGen Sağlık, Avrupa İnovasyon Ödülleri'nde finale kaldı! Erken teşhis koyabilen yeni nesil biyosensör kiti projesi ile göğsümüzü kabartan girişimimizi gönülden tebrik ediyoruz.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  },
  {
    id: "mock4",
    companyName: "Gazi Teknopark",
    rawText: "Bünyemizdeki siber güvenlik girişimi CyberGuard, küresel ölçekte geçerliliği olan ISO 27001 sertifikasyon sürecini başarıyla tamamladı. Güvenli geleceği inşa eden ekibimize başarılar dileriz.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  },
  {
    id: "mock5",
    companyName: "Gazi Teknopark",
    rawText: "Solaris Enerji, yeni nesil yüksek verimlilik sunan güneş paneli sürücü kartlarını piyasaya sundu. Yeşil enerji dönüşümüne katkı sağlayan yerli Ar-Ge projesini tebrik ederiz.",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  },
  {
    id: "mock6",
    companyName: "Gazi Teknopark",
    rawText: "RoboMotion mühendisleri tarafından tasarlanan otonom fabrika robotu prototipi, Uluslararası Endüstri Fuarı'nda birincilik ödülüne layık görüldü. Yerli üretime güç katan ekibimizi kutluyoruz.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  },
  {
    id: "mock7",
    companyName: "Gazi Teknopark",
    rawText: "DataPulse, büyük veri analitiği alanında geliştirdiği bulut tabanlı yazılımı 5 farklı ülkeye ihraç etmeye başladı. Gazi Teknopark'tan doğan küresel başarı hikayeleri büyümeye devam ediyor.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  },
  {
    id: "mock8",
    companyName: "Gazi Teknopark",
    rawText: "NeuroTech ekibi, beyin-bilgisayar arayüzü (BCI) projesi kapsamında ilk başarılı laboratuvar testlerini gerçekleştirdi. Nöroteknoloji alanındaki bu öncü Ar-Ge çalışmasını heyecanla takip ediyoruz.",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  },
  {
    id: "mock9",
    companyName: "Gazi Teknopark",
    rawText: "Akıllı tarım teknolojileri geliştiren AgriSmart, su kullanımını %40 oranında azaltan sensörlü sulama sistemini çiftçilerimizin kullanımına sundu. Sürdürülebilir geleceğe katkılarından dolayı tebrikler!",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  },
  {
    id: "mock10",
    companyName: "Gazi Teknopark",
    rawText: "QuantumSoft yazılım ekibi, kuantum dirençli şifreleme kütüphanesini açık kaynak olarak ekosistemin kullanımına açtı. Siber alandaki bu yenilikçi vizyoner adımı kutluyoruz.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  },
  {
    id: "mock11",
    companyName: "Gazi Teknopark",
    rawText: "Gazi Teknopark 2026 Yılı Kuluçka Merkezleri Başvuru Dönemi Başladı! Yenilikçi iş fikri olan tüm girişimcilerimizi ve Ar-Ge liderlerimizi ekosistemimize katılmaya davet ediyoruz.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    link: "https://www.linkedin.com/",
    platform: "linkedin",
    publishedAt: new Date().toISOString()
  }
];


export default function SuccessStories({ limit = 10, layout = "single-title", hideTitle = false }) {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Drag states for single / single-title
  const [dragStartX, setDragStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // High-Performance 60 FPS Drag Refs for Slider
  const sliderRef = useRef(null);
  const isSliderDraggingRef = useRef(false);
  const sliderStartXRef = useRef(0);
  const sliderScrollLeftRef = useRef(0);
  const hasMovedSliderRef = useRef(false);
  const sliderVelocityRef = useRef(0);
  const sliderLastMouseXRef = useRef(0);
  const sliderAnimFrameRef = useRef(null);

  useEffect(() => {
    getLinkedInPosts({ showOnHomepage: true })
      .then((res) => {
        if (res && res.length > 0) {
          const formatted = res.map((post) => {
            const { title, body } = parsePostText(post.postText);
            return {
              id: post.id,
              companyName: post.companyName || "Gazi Teknopark",
              companyLogoUrl: post.companyLogoUrl,
              title: title,
              body: body,
              rawText: post.postText || "",
              image: post.mediaUrl,
              link: post.postUrl || "#",
              publishedAt: post.publishedAt,
              platform: post.platform || "linkedin"
            };
          });
          setItems(formatted.slice(0, limit));
        } else {
          fetchSuccessStories();
        }
      })
      .catch(() => {
        fetchSuccessStories();
      });
  }, [limit]);

  const fetchSuccessStories = () => {
    getSuccessStories()
      .then((res) => {
        if (res && res.length > 0) {
          const formatted = res.map((story) => {
            const t = pickTranslation(story);
            const raw = t.summary ? `${t.title ? t.title + '. ' : ''}${t.summary}` : t.title || "";
            const { title, body } = parsePostText(raw);
            return {
              id: story.id,
              companyName: "Gazi Teknopark",
              title: t.title || title,
              body: body,
              rawText: raw,
              image: story.image || null,
              link: story.link || "#",
              publishedAt: story.publishedDate
            };
          });
          setItems(formatted.slice(0, limit));
        } else {
          setItems(defaultStories.map(s => {
            const { title, body } = parsePostText(s.rawText);
            return { ...s, title, body };
          }).slice(0, limit));
        }
      })
      .catch(() => setItems(defaultStories.map(s => {
        const { title, body } = parsePostText(s.rawText);
        return { ...s, title, body };
      }).slice(0, limit)));
  };

  useEffect(() => {
    if (items.length <= 1 || isPaused || (layout !== "single" && layout !== "single-title")) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length, isPaused, layout]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return "";
    }
  };

  // Drag handler for Single / Single-Title Carousel
  const handleSingleMouseDown = (e) => {
    setDragStartX(e.clientX);
    setIsDragging(true);
  };

  const handleSingleMouseUp = (e) => {
    if (!isDragging || dragStartX === null) return;
    const diffX = e.clientX - dragStartX;
    if (diffX > 50) {
      // Swiped right -> prev
      setActive((prev) => (prev - 1 + items.length) % items.length);
    } else if (diffX < -50) {
      // Swiped left -> next
      setActive((prev) => (prev + 1) % items.length);
    }
    setIsDragging(false);
    setDragStartX(null);
  };

  // Touch handlers for Mobile Swipe
  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      setDragStartX(e.touches[0].clientX);
      setIsDragging(true);
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || dragStartX === null || !e.changedTouches.length) return;
    const diffX = e.changedTouches[0].clientX - dragStartX;
    if (diffX > 50) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    } else if (diffX < -50) {
      setActive((prev) => (prev + 1) % items.length);
    }
    setIsDragging(false);
    setDragStartX(null);
  };

  // 60 FPS Ultra-Smooth Drag & Momentum Handlers
  function handleGlobalSliderMouseMove(e) {
    if (!isSliderDraggingRef.current || !sliderRef.current) return;

    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - sliderStartXRef.current) * 1.2;

    sliderVelocityRef.current = e.pageX - sliderLastMouseXRef.current;
    sliderLastMouseXRef.current = e.pageX;

    if (Math.abs(walk) > 5) {
      hasMovedSliderRef.current = true;
    }

    sliderRef.current.scrollLeft = sliderScrollLeftRef.current - walk;
  }

  function handleGlobalSliderMouseUp() {
    if (!isSliderDraggingRef.current) return;
    isSliderDraggingRef.current = false;

    window.removeEventListener('mousemove', handleGlobalSliderMouseMove);
    window.removeEventListener('mouseup', handleGlobalSliderMouseUp);

    if (sliderRef.current) {
      sliderRef.current.classList.remove('cursor-grabbing');
      sliderRef.current.classList.add('cursor-grab');

      // Apply Momentum Physics for smooth coasting
      if (Math.abs(sliderVelocityRef.current) > 1.5) {
        let vel = sliderVelocityRef.current * 1.2;
        const step = () => {
          if (!sliderRef.current || Math.abs(vel) < 0.3) {
            if (sliderRef.current) {
              sliderRef.current.style.scrollSnapType = '';
              sliderRef.current.style.scrollBehavior = '';
            }
            return;
          }
          sliderRef.current.scrollLeft -= vel;
          vel *= 0.94;
          sliderAnimFrameRef.current = requestAnimationFrame(step);
        };
        sliderAnimFrameRef.current = requestAnimationFrame(step);
      } else {
        sliderRef.current.style.scrollSnapType = '';
        sliderRef.current.style.scrollBehavior = '';
      }
    }
  }

  function handleSliderMouseDown(e) {
    if (!sliderRef.current) return;
    if (sliderAnimFrameRef.current) cancelAnimationFrame(sliderAnimFrameRef.current);

    isSliderDraggingRef.current = true;
    hasMovedSliderRef.current = false;
    sliderStartXRef.current = e.pageX - sliderRef.current.offsetLeft;
    sliderScrollLeftRef.current = sliderRef.current.scrollLeft;
    sliderLastMouseXRef.current = e.pageX;
    sliderVelocityRef.current = 0;

    // Direct DOM manipulation for zero React re-renders during drag!
    sliderRef.current.style.scrollBehavior = 'auto';
    sliderRef.current.style.scrollSnapType = 'none';
    sliderRef.current.classList.add('cursor-grabbing');
    sliderRef.current.classList.remove('cursor-grab');

    window.addEventListener('mousemove', handleGlobalSliderMouseMove);
    window.addEventListener('mouseup', handleGlobalSliderMouseUp);
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleGlobalSliderMouseMove);
      window.removeEventListener('mouseup', handleGlobalSliderMouseUp);
      if (sliderAnimFrameRef.current) cancelAnimationFrame(sliderAnimFrameRef.current);
    };
  }, []);

  const handleLinkClick = (e, link) => {
    if (hasMovedSliderRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (link && link !== "#") {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  // RENDER CARDS
  const renderSingleTitleCard = (item) => (
    <div key={item.id} className="w-full shrink-0 p-6 md:p-10 select-none">
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        {/* Left Media Area */}
        <div className="group/img relative flex h-64 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 md:w-96 shadow-md">
          {item.image ? (
            <img src={item.image} alt={item.title || item.companyName} className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105 pointer-events-none" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-white/50">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold tracking-wider text-xs">GAZİ TEKNOPARK</span>
            </div>
          )}

          {/* LinkedIn Badge */}
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-sm">
            <svg className="h-5 w-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {/* Header / Company Info */}
            <div className="mb-3 flex items-center gap-3">
              {item.companyLogoUrl ? (
                <img src={item.companyLogoUrl} alt={item.companyName} className="h-9 w-9 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                  {item.companyName.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{item.companyName}</h4>
                {item.publishedAt && (
                  <p className="text-xs text-gray-500">{formatDate(item.publishedAt)}</p>
                )}
              </div>
            </div>

            {/* Title (ONLY in single-title mode) */}
            <h3 className="text-lg font-bold leading-snug text-primary md:text-xl line-clamp-2">
              {item.title}
            </h3>

            {/* Remaining Body Text */}
            {item.body && (
              <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base line-clamp-4">
                {item.body}
              </p>
            )}
          </div>

          {/* Action Link */}
          <div className="mt-5">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-all hover:bg-primary-light hover:shadow-md"
            >
              Gönderiyi Gör
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSingleCard = (item) => (
    <div key={item.id} className="w-full shrink-0 p-6 md:p-10 select-none">
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        {/* Left Media Area */}
        <div className="group/img relative flex h-64 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 md:w-96 shadow-md">
          {item.image ? (
            <img src={item.image} alt={item.companyName} className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105 pointer-events-none" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-white/50">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold tracking-wider text-xs">GAZİ TEKNOPARK</span>
            </div>
          )}

          {/* LinkedIn Badge */}
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-sm">
            <svg className="h-5 w-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </div>
        </div>

        {/* Right Content Area (NO title split in single layout) */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {/* Header / Company Info */}
            <div className="mb-3 flex items-center gap-3">
              {item.companyLogoUrl ? (
                <img src={item.companyLogoUrl} alt={item.companyName} className="h-9 w-9 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                  {item.companyName.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{item.companyName}</h4>
                {item.publishedAt && (
                  <p className="text-xs text-gray-500">{formatDate(item.publishedAt)}</p>
                )}
              </div>
            </div>

            {/* Direct Full Post Text */}
            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-700 line-clamp-6">
              {item.rawText}
            </p>
          </div>

          {/* Action Link */}
          <div className="mt-5">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-all hover:bg-primary-light hover:shadow-md"
            >
              Gönderiyi Gör
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGrid = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="flex h-44 overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 transition-all hover:shadow-lg">
          {/* Small Left Image */}
          <div className="relative w-36 md:w-44 shrink-0 bg-slate-800 overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.companyName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/30 font-bold text-xs p-2 text-center">GAZİ TEKNOPARK</div>
            )}
            <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 shadow-sm">
              <svg className="h-4 w-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {item.companyLogoUrl ? (
                  <img src={item.companyLogoUrl} alt={item.companyName} className="h-7 w-7 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-[10px]">
                    {item.companyName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-semibold text-gray-900">{item.companyName}</h4>
                  {item.publishedAt && <p className="text-[10px] text-gray-400">{formatDate(item.publishedAt)}</p>}
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed line-clamp-3">
                {item.rawText}
              </p>
            </div>
            <div className="mt-2">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                Gönderiyi Gör &rarr;
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSlider = () => (
    <div className="group/container relative">
      <div
        ref={sliderRef}
        onMouseDown={handleSliderMouseDown}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-none select-none cursor-grab snap-x snap-mandatory will-change-scroll"
      >
        {items.map((item) => (
          <div key={item.id} className="w-[300px] shrink-0 snap-start rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-40 w-full bg-slate-800">
                {item.image ? (
                  <img src={item.image} alt={item.companyName} className="h-full w-full object-cover pointer-events-none" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/30 font-bold text-xs">GAZİ TEKNOPARK</div>
                )}
                <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 shadow-sm">
                  <svg className="h-4 w-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  {item.companyLogoUrl ? (
                    <img src={item.companyLogoUrl} alt={item.companyName} className="h-8 w-8 rounded-full object-cover border border-gray-200 shrink-0" />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                      {item.companyName.charAt(0)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-semibold text-gray-900 truncate">{item.companyName}</h4>
                    {item.publishedAt && <p className="text-[10px] text-gray-400">{formatDate(item.publishedAt)}</p>}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed line-clamp-4">{item.rawText}</p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <a
                href={item.link}
                onClick={(e) => handleLinkClick(e, item.link)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-primary hover:underline"
              >
                Gönderiyi Gör &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>


      {/* Hover Controls for Slider */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Önceki"
            onClick={() => sliderRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 opacity-0 group-hover/container:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110"
          >
            &#8249;
          </button>
          <button
            type="button"
            aria-label="Sonraki"
            onClick={() => sliderRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 opacity-0 group-hover/container:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110"
          >
            &#8250;
          </button>
        </>
      )}
    </div>
  );

  const isCarousel = layout === "single" || layout === "single-title";

  return (
    <section className={`w-full bg-slate-50 relative overflow-hidden ${hideTitle ? "py-6 mt-4" : "py-20 mt-20"}`}>
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        {!hideTitle && (
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">Başarı Öyküleri</h2>
            <ShowMoreButton to="/basari-oykuleri" />
          </div>
        )}

        {items.length === 0 ? (
          <EmptyState />
        ) : layout === "grid" ? (
          renderGrid()
        ) : layout === "slider" ? (
          renderSlider()
        ) : (
          <div
            className="group/container relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/5 border border-gray-100 cursor-grab active:cursor-grabbing"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              setIsDragging(false);
            }}
            onMouseDown={handleSingleMouseDown}
            onMouseUp={handleSingleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-red-50/40 pointer-events-none" />

            <div
              className="relative z-10 flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {items.map((item) => (layout === "single-title" ? renderSingleTitleCard(item) : renderSingleCard(item)))}
            </div>

            {/* Hover Prev / Next Buttons (NO PAGINATION DOTS) */}
            {isCarousel && items.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Önceki Slayt"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((prev) => (prev - 1 + items.length) % items.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 opacity-0 group-hover/container:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110"
                >
                  &#8249;
                </button>
                <button
                  type="button"
                  aria-label="Sonraki Slayt"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((prev) => (prev + 1) % items.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 opacity-0 group-hover/container:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110"
                >
                  &#8250;
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
