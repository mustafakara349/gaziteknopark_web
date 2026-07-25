import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContactInfo, getSettings, getSocialLinks } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import { navConfig } from "../../config/navConfig";
import { socialIcon } from "../common/icons";

export default function Footer() {
  const [settings, setSettings] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings([]));
    getSocialLinks().then(setSocialLinks).catch(() => setSocialLinks([]));
    getContactInfo().then(setContactInfo).catch(() => setContactInfo(null));
  }, []);

  const settingValue = (key) => {
    const setting = settings.find((s) => s.settingKey === key);
    return pickTranslation(setting).value ?? "";
  };

  const contactTranslation = pickTranslation(contactInfo ?? {});

  return (
    <footer className="mt-20 bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="text-xl font-bold">
            <span className="text-white">GAZ</span>
            <span className="relative text-white">
              i
              <span className="absolute -top-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent" />
            </span>
            <span className="text-white">TEKNOPARK</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {settingValue("footer_description") || "Gazi Teknopark, bilim ve teknolojiyi ekonomik değere dönüştüren bir Ar-Ge ekosistemidir."}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">Hızlı Bağlantılar</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navConfig.map((menu) => (
              <li key={menu.label}>
                <Link to={menu.items[0]?.to ?? "/"} className="text-white/80 hover:text-white transition-colors">
                  {menu.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/iletisim" className="text-white/80 hover:text-white transition-colors">
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">İletişim</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {contactInfo?.phone && <li>{contactInfo.phone}</li>}
            {contactInfo?.email && <li>{contactInfo.email}</li>}
            {contactTranslation.address && <li>{contactTranslation.address}</li>}
            {contactTranslation.workingHours && <li>{contactTranslation.workingHours}</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">Bizi Takip Edin</h3>
          <div className="mt-4 flex gap-3">
            {socialLinks.map((link) => {
              const Icon = socialIcon(link.icon);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Gazi Teknopark. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
