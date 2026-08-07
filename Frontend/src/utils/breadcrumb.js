import { navConfig } from "../config/navConfig";

const EXTRA_PAGES = {
  "/iletisim": "İletişim",
  "/giris": "Giriş",
  "/sss": "Sıkça Sorulan Sorular",
};

export function getPageMeta(pathname) {
  if (pathname === "/") return null;

  for (const group of navConfig) {
    const item = group.items.find((i) => i.to === pathname);
    if (item) {
      return {
        title: item.label,
        trail: [{ label: "Anasayfa", to: "/" }, { label: group.label }, { label: item.label }],
      };
    }
  }

  const label = EXTRA_PAGES[pathname];
  if (label) {
    return { title: label, trail: [{ label: "Anasayfa", to: "/" }, { label }] };
  }

  return null;
}
