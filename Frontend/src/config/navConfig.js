export const navConfig = [
  {
    label: "Kurumsal",
    items: [
      { label: "Hakkımızda", to: "/kurumsal/hakkimizda" },
      { label: "Hizmet ve İmkanlarımız", to: "/kurumsal/hizmetlerimiz" },
      { label: "Yönetim ve Ekip", to: "/kurumsal/yonetim-ve-ekip" },
      { label: "Mevzuat ve Belgeler", to: "/kurumsal/mevzuat-ve-belgeler" },
      { label: "Duyurular", to: "/duyurular" },
      { label: "Haberler", to: "/haberler" },
      { label: "Etkinlikler", to: "/etkinlikler" },
      { label: "Medya", to: "/medya" },
    ],
  },
  {
    label: "Firmalar",
    items: [
      { label: "Firmalarımız", to: "/firmalar" },
      { label: "Başarı Öyküleri", to: "/basari-oykuleri" },
    ],
  },
  {
    label: "Girişimler",
    items: [
      { label: "Girişim Ofisi", to: "/girisimler/girisim-ofisi" },
      { label: "Teknolojiler", to: "/girisimler/teknolojiler" },
    ],
  },
  {
    label: "Başvurular",
    items: [
      { label: "Staj Başvurusu", to: "/basvuru/staj" },
      { label: "Firma Başvurusu", to: "/basvuru/firma", href: "https://argeportal.gaziteknopark.com.tr/onbasvuruformu", isExternal: true },
      { label: "BİGG Başvuru", to: "/basvuru/bigg", href: "https://www.gazibigg.com/", isExternal: true },
    ],
  },
];
