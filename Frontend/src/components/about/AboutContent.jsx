import { Building2, HeartHandshake, Rocket, GraduationCap, TrendingUp, Globe, Leaf, Users, Target, Factory, Info } from "lucide-react";
import AboutVisualCard from "./AboutVisualCard";
import AboutCarousel from "./AboutCarousel";
import { extractParagraphs } from "../../utils/html";

// Paragrafların sırasına göre atanan görsel tema (ikon + kategori etiketi).
// Gazi Teknopark "Hakkımızda" metninin bugünkü 10 paragrafının konusuna göre
// belirlendi; metnin kendisi değişmediği sürece sıra geçerlidir. Paragraf
// sayısı bundan fazla olursa DEFAULT_THEME kullanılır.
const SECTION_THEMES = [
  { icon: Building2, label: "Kuruluş & Altyapı" },
  { icon: HeartHandshake, label: "Hizmet Anlayışımız" },
  { icon: Rocket, label: "Girişimcilik Programları" },
  { icon: GraduationCap, label: "Üniversite İşbirlikleri" },
  { icon: TrendingUp, label: "Yatırım ve Büyüme" },
  { icon: Globe, label: "Uluslararasılaşma" },
  { icon: Leaf, label: "Sürdürülebilirlik ve Yeşil Enerji" },
  { icon: Users, label: "Yönetim ve Ekip Anlayışımız" },
  { icon: Target, label: "Gelecek Hedeflerimiz" },
  { icon: Factory, label: "Faaliyet Alanlarımız" },
];
const DEFAULT_THEME = { icon: Info, label: "Genel Bilgi" };

// Metinde (1. paragrafta) zaten geçen rakamların birebir kopyası; sol görsel
// kartın altında büyük punto ile öne çıkarmak için ayrıca tutuluyor. Paragraf
// içindeki orijinal cümleler bu listeden bağımsız olarak aynen kalır.
const ABOUT_STATS = [
  { value: "2008", label: "Kuruluş Yılı" },
  { value: "182", label: "Firma" },
  { value: "20.000 m²", label: "Kapalı Alan" },
];

export default function AboutContent({ content, aboutImage }) {
  const paragraphs = extractParagraphs(content);
  const slides = paragraphs.map((paragraph, index) => {
    const theme = SECTION_THEMES[index] ?? DEFAULT_THEME;
    return { icon: theme.icon, label: theme.label, text: paragraph };
  });

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-[340px_1fr] md:items-start md:gap-8">
      <AboutVisualCard stats={ABOUT_STATS} aboutImage={aboutImage} />
      <AboutCarousel slides={slides} />
    </div>
  );
}
