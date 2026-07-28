import { Link } from "react-router-dom";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "../common/icons";

/* ─── Inline SVG Icons ─── */
function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
      <path d="M21.8 8s-.2-1.4-.8-2a2.9 2.9 0 00-2-.8C17.1 5 12 5 12 5s-5.1 0-7 .2c-.8.1-1.5.4-2 .8-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5C2 14.3 2.2 16 2.2 16s.2 1.4.8 2c.5.6 1.2.9 2 1C6.8 19.1 12 19.1 12 19.1s5.1 0 7-.2c.8-.1 1.5-.4 2-1 .6-.6.8-2 .8-2s.2-1.7.2-3.3v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l5.5 3L10 15z" />
    </svg>
  );
}

/* ─── Logo (White Version) ─── */
function FooterLogo() {
  return (
    <Link to="/" className="inline-flex items-center">
      <img
        src="/gazi_logo.png"
        alt="Gazi Teknopark"
        className="h-[28px] w-auto object-contain brightness-0 invert"
        onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
      />
      <span
        className="hidden items-baseline text-xl font-extrabold tracking-tight text-white"
      >
        GAZİ TEKNOPARK
      </span>
    </Link>
  );
}

/* ─── Social Link ─── */
function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 hover:border-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
    >
      {children}
    </a>
  );
}

/* ─── Footer Nav Column ─── */
function FooterNavColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white/50">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.isExternal ? (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/70 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ) : (
              <Link
                to={link.to}
                className="text-sm text-white/70 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Main Footer ─── */
export default function Footer() {
  const year = new Date().getFullYear();

  const navColumns = [
    {
      title: "Kurumsal",
      links: [
        { label: "Hakkımızda", to: "/kurumsal/hakkimizda" },
        { label: "Yönetim ve Ekip", to: "/kurumsal/yonetim-ve-ekip" },
        { label: "Mevzuat ve Belgeler", to: "/kurumsal/mevzuat-ve-belgeler" },
        { label: "Hizmetlerimiz / İmkânlarımız", to: "/kurumsal/hizmetlerimiz" },
        { label: "Haberler ve Duyurular", to: "/haberler" },
        { label: "Medya", to: "/medya" },
        { label: "Etkinlikler", to: "/etkinlikler" },
      ],
    },
    {
      title: "Başvurular",
      links: [
        { label: "Firma Başvurusu", to: "/basvuru/firma", href: "https://argeportal.gaziteknopark.com.tr/onbasvuruformu", isExternal: true },
        { label: "Staj Başvurusu", to: "/basvuru/staj" },
        { label: "BİGG Başvuru", to: "/basvuru/bigg", href: "https://www.gazibigg.com/", isExternal: true },
      ],
    },
  ];

  return (
    <footer className="mt-16 bg-[#002866]">

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 pt-12 pb-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-5">
            <FooterLogo />
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              İnovasyon ve teknolojinin buluşma noktası. Geleceği tasarlayan girişimciler için sürdürülebilir ekosistem.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <SocialLink href="https://www.linkedin.com/company/gaziteknopark" label="LinkedIn">
                <LinkedinIcon />
              </SocialLink>
              <SocialLink href="https://www.instagram.com/gaziteknopark/" label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="https://x.com/Gazi_Teknopark" label="X (Twitter)">
                <XIcon />
              </SocialLink>
              <SocialLink href="https://www.facebook.com/gaziteknoparktgb/" label="Facebook">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href="https://www.youtube.com/@gaziteknopark4704" label="YouTube">
                <YouTubeIcon />
              </SocialLink>
            </div>
          </div>

          {/* Navigation Columns */}
          {navColumns.map((col) => (
            <FooterNavColumn key={col.title} title={col.title} links={col.links} />
          ))}

          {/* İletişim Column */}
          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white/50">
              İLETİŞİM
            </h3>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              <a
                href="https://maps.google.com/?q=Gazi+Üniversitesi+Gölbaşı+Yerleşkesi"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 hover:text-white transition-colors"
              >
                <MapPinIcon />
                <span>Gazi Üniversitesi Gölbaşı Yerleşkesi, Ankara</span>
              </a>
              <a href="tel:+903124848350" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <PhoneIcon />
                <span>+90 312 484 83 50</span>
              </a>
              <div className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>+90 (312) 485 14 59</span>
              </div>
              <a href="mailto:info@gaziteknopark.com.tr" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <MailIcon />
                <span>info@gaziteknopark.com.tr</span>
              </a>
              <a href="mailto:gaziteknopark@hs01.kep.tr" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <MailIcon />
                <span>gaziteknopark@hs01.kep.tr</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/10 mx-6 md:mx-10 lg:mx-16" />

      {/* ── Bottom Bar ── */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 py-5">
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
          <span>© {year} Gazi Teknopark. Tüm hakları saklıdır.</span>
          <div className="flex items-center gap-4">
            <Link to="/kvkk" className="hover:text-white/70 transition-colors">KVKK</Link>
            <Link to="/gizlilik" className="hover:text-white/70 transition-colors">Gizlilik</Link>
            <Link to="/kullanim-kosullari" className="hover:text-white/70 transition-colors">Kullanım Koşulları</Link>
            <Link to="/sss" className="hover:text-white/70 transition-colors">SSS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
