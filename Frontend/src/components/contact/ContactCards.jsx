import { useState } from "react";
import { socialIcon } from "../common/icons";
import { pickTranslation } from "../../utils/i18n";
import { Phone, Mail, MapPin, Clock, Copy, Check, ArrowUpRight } from "lucide-react";

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
      <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Phone className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">Santral</h3>
          <p className="mt-1 text-base font-bold text-gray-900">{phone}</p>
          <p className="mt-0.5 text-xs text-gray-500 font-medium">Faks: +90 312 212 90 01</p>
        </div>

        <a
          href={`tel:${phone.replace(/\s+/g, "")}`}
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
        >
          <span>Doğrudan Ara</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* 2. E-Posta & KEP */}
      <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">E-Posta & KEP</h3>
          <p className="mt-1 text-sm font-bold text-gray-900 truncate" title={email}>
            {email}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 font-medium truncate" title="gaziteknopark@hs01.kep.tr">
            KEP: gaziteknopark@hs01.kep.tr
          </p>
        </div>

        <a
          href={`mailto:${email}`}
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
        >
          <span>E-Posta Gönder</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* 3. Adres */}
      <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">Açık Adres</h3>
          <p className="mt-1 text-xs font-medium text-gray-700 leading-relaxed line-clamp-3">{address}</p>
        </div>

        <button
          type="button"
          onClick={handleCopyAddress}
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer text-left"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-600">Adres Kopyalandı</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Adresi Kopyala</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Mesai Saatleri */}
      <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">Mesai Saatleri</h3>
          <p className="mt-1 text-sm font-bold text-gray-900">{workingHours}</p>
          <p className="mt-0.5 text-xs text-gray-500 font-medium">Hafta Sonu: Kapalı</p>
        </div>

        {socialLinks && socialLinks.length > 0 && (
          <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-3">
            {socialLinks.map((link) => {
              const Icon = socialIcon(link.icon);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  title={link.title || link.name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:border-primary hover:bg-primary hover:text-white transition-all"
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
