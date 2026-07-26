import { Link } from "react-router-dom";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "../common/icons";

function MapPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-white/80"
    >
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-white/80"
    >
      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-white/80"
    >
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#082b5c] text-white">
      <div className="mx-auto grid max-w-[1360px] gap-8 px-6 py-12 md:grid-cols-4 md:gap-10">
        {/* Column 1: Brand Info */}
        <div className="md:col-span-1">
          <div className="flex items-baseline text-xl font-extrabold tracking-tight">
            <span>GAZİ TEKNOPARK</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-300">
            İnovasyon ve teknolojinin buluşma noktası. Geleceği tasarlayan girişimciler için sürdürülebilir ekosistem.
          </p>
        </div>

        {/* Column 2: Fast Links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Hızlı Bağlantılar</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                KVKK
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Gizlilik Politikası
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Kullanım Koşulları
              </a>
            </li>
            <li>
              <Link to="/iletisim" className="hover:text-white transition-colors">
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Details */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">İletişim</h3>
          <ul className="mt-3 space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <MapPinIcon />
              <span>Gazi Üniversitesi Gölbaşı Yerleşkesi</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon />
              <span>+90 312 484 83 50</span>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon />
              <span>info@gaziteknopark.com.tr</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Social Links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Bizi Takip Edin</h3>
          <div className="mt-3 flex items-center gap-2.5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <LinkedinIcon style={{ width: 14, height: 14 }} className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <InstagramIcon style={{ width: 14, height: 14 }} className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <XIcon style={{ width: 14, height: 14 }} className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <FacebookIcon style={{ width: 14, height: 14 }} className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © 2024 Gazi Teknopark. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
