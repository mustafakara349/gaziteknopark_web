import { useState } from "react";
import { MailIcon, socialIcon } from "../common/icons";
import { pickTranslation } from "../../utils/i18n";

export default function ContactCards({ contactInfo, socialLinks }) {
  const [copied, setCopied] = useState(false);
  const t = pickTranslation(contactInfo ?? {});

  const phone = contactInfo?.phone || "+90 312 212 90 00";
  const email = contactInfo?.email || "info@gaziteknopark.com.tr";
  const address =
    t.address || "Gazi Üniversitesi Gölbaşı Yerleşkesi, Bahçelievler Mah. 35. Cadde No: 9, 06830 Gölbaşı / ANKARA";
  const workingHours = t.workingHours || "Pazartesi - Cuma: 08:30 - 17:30";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Santral */}
      <div className="group flex flex-col justify-between rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/15 hover:shadow-2xl">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-primary transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-blue-200">Santral</h3>
          <p className="mt-1 text-lg font-black text-white">{phone}</p>
          <p className="mt-0.5 text-xs text-blue-100/70 font-medium">Faks: +90 312 212 90 01</p>
        </div>

        <a
          href={`tel:${phone.replace(/\s+/g, "")}`}
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-white hover:text-blue-200 transition-colors"
        >
          <span>Doğrudan Ara</span>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      {/* 2. E-Posta & KEP */}
      <div className="group flex flex-col justify-between rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/15 hover:shadow-2xl">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-primary transition-colors">
            <MailIcon className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-blue-200">E-Posta & KEP</h3>
          <p className="mt-1 text-sm font-black text-white truncate" title={email}>
            {email}
          </p>
          <p className="mt-0.5 text-xs text-blue-100/70 font-medium truncate" title="gaziteknopark@hs01.kep.tr">
            KEP: gaziteknopark@hs01.kep.tr
          </p>
        </div>

        <a
          href={`mailto:${email}`}
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-white hover:text-blue-200 transition-colors"
        >
          <span>E-Posta Gönder</span>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      {/* 3. Adres */}
      <div className="group flex flex-col justify-between rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/15 hover:shadow-2xl">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-primary transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-blue-200">Açık Adres</h3>
          <p className="mt-1 text-xs font-medium text-white/90 leading-relaxed line-clamp-3">{address}</p>
        </div>

        <button
          type="button"
          onClick={handleCopyAddress}
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-white hover:text-blue-200 transition-colors cursor-pointer text-left"
        >
          {copied ? <span>✓ Adres Kopyalandı</span> : <span>📋 Adresi Kopyala</span>}
        </button>
      </div>

      {/* 4. Çalışma Saatleri & Sosyal */}
      <div className="group flex flex-col justify-between rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/15 hover:shadow-2xl">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-primary transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-blue-200">Mesai Saatleri</h3>
          <p className="mt-1 text-sm font-black text-white">{workingHours}</p>
          <p className="mt-0.5 text-xs text-blue-100/70 font-medium">Hafta Sonu: Kapalı</p>
        </div>

        {socialLinks && socialLinks.length > 0 && (
          <div className="mt-6 flex items-center gap-2 border-t border-white/15 pt-3">
            {socialLinks.map((link) => {
              const Icon = socialIcon(link.icon);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  title={link.title || link.name}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white hover:text-primary transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
