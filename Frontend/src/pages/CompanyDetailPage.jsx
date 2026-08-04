import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Info,
  Layers,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users
} from "lucide-react";
import { getCompanyById, getCompanyCategories, getActivityAreas } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageSection from "../components/common/PageSection";
import { FacebookIcon, InstagramIcon, XIcon, LinkedinIcon, YoutubeIcon } from "../components/common/icons";

const SWIPE_THRESHOLD_PX = 50;
const GRID_COLS_CLASS = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" };

function getInitials(name) {
  if (!name) return "GP";
  const words = name.trim().split(" ");
  return words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : words[0].substring(0, 2).toUpperCase();
}

// Sol taraf: "Hakkımızda" carousel'indeki AboutVisualCard ile birebir aynı kalıp.
function CompanyVisualCard({ company, stats }) {
  return (
    <div className="flex h-[300px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm md:h-[480px]">
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary via-primary-light to-primary-dark">
        {company.logoUrl ? (
          <img src={company.logoUrl} alt={company.name} className="h-full w-full object-contain p-8" />
        ) : (
          <span className="text-5xl font-extrabold text-white/70 md:text-6xl">{getInitials(company.name)}</span>
        )}
      </div>

      {stats.length > 0 && (
        <div className={`grid ${GRID_COLS_CLASS[stats.length]} divide-x divide-gray-100 border-t border-gray-100`}>
          {stats.map((stat) => (
            <div key={stat.label} className="px-2 py-4 text-center">
              <p className="text-base font-bold text-primary md:text-xl">{stat.value}</p>
              <p className="mt-1 text-[9px] font-medium uppercase tracking-wide text-gray-500 md:text-[11px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sağ taraftaki her bölüm: AboutCarouselCard ile birebir aynı header/body kalıbı.
function SlideCard({ icon: Icon, label, children }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-blue-100/80 bg-gradient-to-r from-[#d6e6f7] via-[#e8f1fa] to-[#d6e6f7] px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-gray-100 md:h-11 md:w-11">
          <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.75} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-primary sm:text-xs md:text-sm">
          {label}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-6 pr-5 text-sm leading-relaxed text-gray-700 sm:p-8 sm:pr-7 md:p-10 md:pr-9 md:text-base md:leading-[1.75]">
        {children}
      </div>
    </div>
  );
}

// Ok butonu: CarouselControls'daki ArrowButton ile birebir aynı.
function ArrowButton({ direction, onClick, className = "" }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const label = direction === "prev" ? "Önceki bölüm" : "Sonraki bölüm";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex items-center justify-center rounded-full bg-white text-primary shadow-md ring-1 ring-gray-100 transition-all duration-200 hover:scale-110 hover:bg-primary hover:text-white active:scale-95 ${className}`}
    >
      <Icon className="h-5 w-5" strokeWidth={2} />
    </button>
  );
}

// Sağ taraf: "Hakkımızda" bölümündeki AboutCarousel'in birebir aynısı, JSX içerik taşıyacak şekilde.
function CompanySlider({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const total = slides.length;

  const goTo = useCallback((index) => setActiveIndex(((index % total) + total) % total), [total]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  };
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      if (deltaX > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  };

  if (total === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-3xl border border-gray-100 bg-white text-sm text-gray-400 shadow-sm md:h-[480px]">
        Bu firma için henüz ek bilgi eklenmedi.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Firma detay bölümleri"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, i) => (
              <div key={i} className="h-[420px] w-full shrink-0 md:h-[480px]">
                <SlideCard icon={slide.icon} label={slide.label}>
                  {slide.content}
                </SlideCard>
              </div>
            ))}
          </div>
        </div>

        {total > 1 && (
          <>
            <ArrowButton
              direction="prev"
              onClick={goPrev}
              className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 md:flex md:h-12 md:w-12 lg:-left-6"
            />
            <ArrowButton
              direction="next"
              onClick={goNext}
              className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 md:flex md:h-12 md:w-12 lg:-right-6"
            />
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <ArrowButton direction="prev" onClick={goPrev} className="h-9 w-9 md:hidden" />
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${i + 1}. bölüme git`}
                aria-current={i === activeIndex}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  i === activeIndex ? "w-6 bg-primary" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          <ArrowButton direction="next" onClick={goNext} className="h-9 w-9 md:hidden" />
        </div>
      )}
    </div>
  );
}

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activityAreas, setActivityAreas] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setCompany(null);
    window.scrollTo({ top: 0 });

    Promise.all([
      getCompanyById(id),
      getCompanyCategories().catch(() => []),
      getActivityAreas().catch(() => [])
    ])
      .then(([companyRes, categoriesRes, activityAreasRes]) => {
        if (cancelled) return;
        setCompany(companyRes?.data || companyRes || null);
        setCategories(categoriesRes || []);
        setActivityAreas(activityAreasRes || []);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus(err.response?.status === 404 ? "not-found" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: company?.name, url: window.location.href }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const TopBar = () => (
    <div className="mb-6 flex items-center justify-between">
      <Link
        to="/firmalar"
        className="group inline-flex items-center text-sm font-semibold text-gray-500 transition-colors hover:text-primary"
      >
        <ArrowLeft size={18} strokeWidth={2} className="mr-2 transition-transform group-hover:-translate-x-1" />
        Firmalara Dön
      </Link>
      <button
        type="button"
        onClick={handleShare}
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-surface hover:text-primary"
        title="Firmayı Paylaş"
      >
        <Share2 size={16} />
      </button>
    </div>
  );

  if (status === "loading") {
    return (
      <PageSection className="pt-8 pb-16 md:pt-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-6 h-4 w-32 rounded-md bg-gray-100" />
          <div className="mb-8 space-y-3">
            <div className="h-8 w-72 rounded-lg bg-gray-100" />
            <div className="h-5 w-40 rounded-full bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[340px_1fr] md:gap-8">
            <div className="h-[300px] rounded-3xl bg-gray-100 md:h-[480px]" />
            <div className="h-[420px] rounded-3xl bg-gray-100 md:h-[480px]" />
          </div>
        </div>
      </PageSection>
    );
  }

  if (status === "not-found" || !company) {
    return (
      <PageSection className="pt-8 pb-16 md:pt-12">
        <div className="mx-auto max-w-6xl">
          <TopBar />
          <div className="rounded-3xl border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
            Bu firma bulunamadı.
          </div>
        </div>
      </PageSection>
    );
  }

  if (status === "error") {
    return (
      <PageSection className="pt-8 pb-16 md:pt-12">
        <div className="mx-auto max-w-6xl">
          <TopBar />
          <div className="rounded-3xl border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
            Firma bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </div>
        </div>
      </PageSection>
    );
  }

  const t = pickTranslation(company);
  const categoryNames = (company.categoryIds || [])
    .map((cid) => categories.find((c) => c.id === cid))
    .filter(Boolean)
    .map((c) => pickTranslation(c).name);
  const activityAreaNames = (company.activityAreaIds || [])
    .map((aid) => activityAreas.find((a) => a.id === aid))
    .filter(Boolean)
    .map((a) => pickTranslation(a).name);

  const socialLinks = [
    { url: company.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { url: company.instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { url: company.xUrl, label: "X (Twitter)", Icon: XIcon },
    { url: company.linkedInUrl, label: "LinkedIn", Icon: LinkedinIcon },
    { url: company.youtubeUrl, label: "Youtube", Icon: YoutubeIcon }
  ].filter((s) => s.url);

  const infoItems = [
    company.foundedYear && { Icon: Calendar, label: "Kuruluş Yılı", value: company.foundedYear },
    company.employeeCount && { Icon: Users, label: "Çalışan Sayısı", value: company.employeeCount },
    company.address && { Icon: MapPin, label: "Adres", value: company.address },
    company.phone && { Icon: Phone, label: "Telefon", value: company.phone },
    company.email && { Icon: Mail, label: "E-posta", value: company.email }
  ].filter(Boolean);

  const stats = [
    company.foundedYear && { value: company.foundedYear, label: "Kuruluş Yılı" },
    company.employeeCount && { value: company.employeeCount, label: "Çalışan Sayısı" },
    activityAreaNames.length > 0 && { value: activityAreaNames.length, label: "Faaliyet Alanı" }
  ].filter(Boolean);

  const hasContactBlock = infoItems.length > 0 || company.website || socialLinks.length > 0;

  const slides = [];
  if (t.description) {
    slides.push({
      icon: Info,
      label: "Firma Hakkında",
      content: <p className="whitespace-pre-line">{t.description}</p>
    });
  }
  if (activityAreaNames.length > 0) {
    slides.push({
      icon: Layers,
      label: "Faaliyet Alanları",
      content: (
        <div className="flex flex-wrap gap-2">
          {activityAreaNames.map((name) => (
            <span key={name} className="rounded-full bg-hover-blue px-4 py-1.5 text-sm font-semibold text-accent-blue">
              {name}
            </span>
          ))}
        </div>
      )
    });
  }
  if (hasContactBlock) {
    slides.push({
      icon: Building2,
      label: "Firma Bilgileri",
      content: (
        <div className="space-y-6">
          {infoItems.length > 0 && (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {infoItems.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={16} className="mt-0.5 shrink-0 text-primary/50" />
                  <div>
                    <dt className="text-xs font-semibold text-gray-400">{label}</dt>
                    <dd className="text-sm font-medium text-gray-700">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}

          {(company.website || socialLinks.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-5">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Globe size={15} />
                  Web Sitesi
                </a>
              )}
              {socialLinks.map(({ url, label, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-gray-500 transition-colors hover:bg-primary hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      )
    });
  }

  return (
    <PageSection className="pt-8 pb-16 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <TopBar />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">{company.name}</h1>
          {categoryNames.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {categoryNames.map((name) => (
                <span key={name} className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[340px_1fr] md:items-start md:gap-8">
          <CompanyVisualCard company={company} stats={stats} />
          <CompanySlider slides={slides} />
        </div>
      </div>
    </PageSection>
  );
}
