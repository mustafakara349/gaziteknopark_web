/**
 * Gazi Teknopark — Sıkça Sorulan Sorular (SSS) Veri Dosyası
 */

export const FAQ_CATEGORIES = [
  {
    id: "girisimcilik",
    label: "Girişimcilik & Kuluçka",
    shortLabel: "Girişimcilik",
    icon: "Rocket",
    tag: "#Kuluçka",
  },
  {
    id: "arge-basvuru",
    label: "Ar-Ge & Firma Başvuruları",
    shortLabel: "Başvurular",
    icon: "FileText",
    tag: "#BaşvuruSüreçleri",
  },
  {
    id: "muafiyetler",
    label: "Muafiyetler & Teşvikler",
    shortLabel: "Teşvikler",
    icon: "ShieldCheck",
    tag: "#VergiMuafiyeti",
  },
  {
    id: "akademisyen",
    label: "Akademisyen & Üniversite-Sanayi",
    shortLabel: "Akademisyen",
    icon: "GraduationCap",
    tag: "#Akademisyen",
  },
  {
    id: "tto-patent",
    label: "TTO, Patent & Proje Destekleri",
    shortLabel: "TTO & Patent",
    icon: "Award",
    tag: "#TTO",
  },
  {
    id: "genel-kampus",
    label: "Genel Kampüs & İdari Hizmetler",
    shortLabel: "Kampüs",
    icon: "Building2",
    tag: "#OfisKiralama",
  },
];

export const FAQ_ITEMS = [
  // ── GİRİŞİMCİLİK & KULUÇKA ──────────────────────────────────────────────
  {
    id: "g1",
    categoryId: "girisimcilik",
    question: "Gazi Teknopark'ta kuluçka programına nasıl başvurabilirim?",
    answer:
      "Anahtar Kuluçka Programı'na başvurmak için öncelikle online başvuru formunu doldurmanız gerekmektedir. Başvurular değerlendirme kurulu tarafından incelenir; fikrinizin teknoloji odaklı, yenilikçi ve ticarileştirme potansiyeli olan bir yapıda olması temel kriterdir. Başarılı adaylara mülakat daveti gönderilir ve değerlendirme sonucunda kabul kararı bildirilir.",
    tags: ["#Kuluçka", "#Başvuru"],
  },
  {
    id: "g2",
    categoryId: "girisimcilik",
    question: "BİGG Anahtar (TÜBİTAK 1512) programına kimler başvurabilir?",
    answer:
      "TÜBİTAK 1512 BİGG Programı'na bireysel girişimciler, öğrenciler ve araştırmacılar başvurabilir. Başvurucu adayların teknoloji odaklı bir iş fikrine sahip olması ve Gazi Teknopark'ın belirlediği çağrı dönemlerine uygun başvuru yapması gerekmektedir. Program kapsamında iş modeli kurma, mentorluk ve hibe desteği sunulmaktadır.",
    links: [
      { label: "BİGG Başvuru Sayfasına Git ↗", href: "https://www.gazibigg.com/", external: true },
    ],
    tags: ["#BİGG", "#Kuluçka"],
  },
  {
    id: "g3",
    categoryId: "girisimcilik",
    question: "Kuluçka programı kapsamında hangi destekler sağlanmaktadır?",
    answer:
      "Kuluçka programı katılımcılarına; uygun koşullu açık ve kapalı ofis alanı, Anahtar Prototip Atölyesi kullanım hakkı, mali/idari/hukuksal danışmanlık, eğitim ve mentorluk destekleri, yatırımcı buluşturma faaliyetleri ve üniversite kaynaklarına erişim imkanları sağlanmaktadır.",
    tags: ["#Kuluçka", "#Destek"],
  },
  {
    id: "g4",
    categoryId: "girisimcilik",
    question: "Prototip Atölyesi'nden nasıl yararlanabilirim?",
    answer:
      "Anahtar Prototip Atölyesi, Gazi Teknopark bünyesindeki kuluçka firmaları ve BİGG girişimcileri için ücretsiz olarak açıktır. Atölye kullanımı için teknik ekibimizle randevu oluşturmanız yeterlidir. Atölyede 3D yazıcı, lazer kesici ve diğer prototipleme ekipmanlarından yararlanabilirsiniz.",
    tags: ["#Kuluçka", "#Atölye"],
  },

  // ── AR-GE & FİRMA BAŞVURULARI ────────────────────────────────────────────
  {
    id: "a1",
    categoryId: "arge-basvuru",
    question: "Gazi Teknopark Bölgesi'nde yer almak için başvuru süreci nasıl işler?",
    answer:
      "Gazi Teknopark'ta ofis kiralamak isteyen firmaların öncelikle online ön başvuru formunu doldurması gerekmektedir. Başvuru, Ar-Ge & teknik değerlendirme kurulunca incelenir; proje teknik özeti, iş planı ve şirket profili belgeleri talep edilir. Değerlendirme süreci ortalama 2–4 hafta sürmekte olup kabul kararı yazılı olarak bildirilmektedir.",
    links: [
      { label: "Firma Başvuru Formu ↗", href: "https://argeportal.gaziteknopark.com.tr/onbasvuruformu", external: true },
    ],
    tags: ["#BaşvuruSüreçleri", "#OfisKiralama"],
  },
  {
    id: "a2",
    categoryId: "arge-basvuru",
    question: "Teknopark'a kabul için hangi belgeler gereklidir?",
    answer:
      "Başvuruda şu belgeler talep edilmektedir: Şirket Ar-Ge/yazılım/tasarım proje özeti, şirket kuruluş belgesi veya ticaret sicil gazetesi, ortaklık yapısını gösteren belgeler ve özgeçmişler. Bireysel girişimciler için güncel özgeçmiş ile proje tanıtım dosyası yeterlidir.",
    tags: ["#BaşvuruSüreçleri"],
  },
  {
    id: "a3",
    categoryId: "arge-basvuru",
    question: "Teknopark'ta hangi tür firmalar faaliyet gösterebilir?",
    answer:
      "4691 Sayılı Teknoloji Geliştirme Bölgeleri Kanunu gereğince; yazılım, donanım, Ar-Ge ve tasarım faaliyetleri yürüten firmalar Teknopark'ta yer alabilir. Faaliyetin doğrudan teknoloji üretimi veya Ar-Ge niteliği taşıması gerekmektedir. Ticaret, üretim veya hizmet ağırlıklı faaliyetler uygun görülmemektedir.",
    tags: ["#BaşvuruSüreçleri", "#OfisKiralama"],
  },
  {
    id: "a4",
    categoryId: "arge-basvuru",
    question: "Ofis ve çalışma alanı kira bedelleri nasıl belirlenmektedir?",
    answer:
      "Kira bedelleri; alınan ofis tipine (açık ofis, bireysel ofis, kapalı ofis), metrekareye ve kira sözleşmesi süresine göre farklılık göstermektedir. Detaylı fiyat bilgisi ve mevcut kapasite için yönetim birimimizle iletişime geçmenizi tavsiye ederiz.",
    tags: ["#OfisKiralama"],
  },

  // ── MUAFİYETLER & TEŞVİKLER ──────────────────────────────────────────────
  {
    id: "m1",
    categoryId: "muafiyetler",
    question: "Hangi firmalar Teknopark vergi muafiyetlerinden yararlanabilir?",
    answer:
      "Gazi Teknopark'ta faaliyet gösteren ve gelir/kurumlar vergisi mükellefi olan tüm firmalar, bölgedeki yazılım, tasarım ve Ar-Ge faaliyetlerinden elde ettikleri kazançlar için 31.12.2028 tarihine kadar Gelir ve Kurumlar Vergisi'nden muafiyet hakkına sahiptir. Muafiyetten yararlanmak için ilgili faaliyetin teknopark içinde gerçekleştirilmesi ve belgelerinin tam olması gerekmektedir.",
    tags: ["#VergiMuafiyeti", "#Teşvikler"],
  },
  {
    id: "m2",
    categoryId: "muafiyetler",
    question: "SGK işveren payı muafiyeti nasıl uygulanmaktadır?",
    answer:
      "Bölgede çalışan araştırmacı, yazılımcı, tasarımcı, Ar-Ge ve destek personeli için SGK işveren payının %50'si, 31.12.2028 tarihine kadar muaf tutulmaktadır. Bu muafiyetten yararlanmak için söz konusu personelin fiilen Teknopark bölgesinde çalışıyor olması ve ilgili belgelerin BTGM sistemine girilmesi gerekmektedir.",
    tags: ["#SGKMuafiyeti", "#Teşvikler"],
  },
  {
    id: "m3",
    categoryId: "muafiyetler",
    question: "KDV muafiyeti hangi ürün ve hizmetleri kapsamaktadır?",
    answer:
      "Teknopark bölgesinde üretilen Ar-Ge projeleri kapsamındaki yazılımların yurt içi ve yurt dışı satışı KDV'den muaftır. Ancak bu muafiyetin geçerli olabilmesi için yazılımın Teknopark bünyesinde üretilmesi ve Ar-Ge niteliği taşıması şarttır.",
    tags: ["#KDVMuafiyeti", "#VergiMuafiyeti"],
  },
  {
    id: "m4",
    categoryId: "muafiyetler",
    question: "Damga vergisi muafiyeti kapsamı nedir?",
    answer:
      "4691 sayılı Kanun kapsamında Teknopark bölgelerinde yürütülen Ar-Ge projelerine ilişkin olarak düzenlenen kağıtlar damga vergisinden muaf tutulmaktadır. Muafiyetin uygulanabilmesi için sözleşme veya belgenin doğrudan Ar-Ge faaliyetiyle ilgili olması gerekmektedir.",
    tags: ["#DamgaVergisi", "#Teşvikler"],
  },
  {
    id: "m5",
    categoryId: "muafiyetler",
    question: "Muafiyetler ne zamana kadar geçerlidir?",
    answer:
      "4691 Sayılı Teknoloji Geliştirme Bölgeleri Kanunu kapsamındaki muafiyetlerin tamamı, resmi güncellemeler doğrultusunda 31.12.2028 tarihine kadar uzatılmıştır. Güncel mevzuat takibi için Bilim, Sanayi ve Teknoloji Bakanlığı (BTGM) açıklamalarını takip etmenizi öneririz.",
    tags: ["#VergiMuafiyeti", "#SGKMuafiyeti"],
  },

  // ── AKADEMİSYEN & ÜNİVERSİTE-SANAYİ ─────────────────────────────────────
  {
    id: "ak1",
    categoryId: "akademisyen",
    question: "Akademisyenlerin Teknopark'ta şirket kurma şartları nelerdir?",
    answer:
      "Öğretim elemanları; araştırmalarının sonuçlarını ticarileştirmek amacıyla Teknopark bölgesinde şirket kurabilir, kurulu bir şirkete ortak olabilir ya da yönetiminde yer alabilirler. Bu süreçte üniversite yönetiminden onay alınması ve 4691 sayılı Kanun'un ilgili hükümlerine uyulması gerekmektedir. Gazi TTO bu süreçte destek sağlamaktadır.",
    tags: ["#Akademisyen", "#Girişimcilik"],
  },
  {
    id: "ak2",
    categoryId: "akademisyen",
    question: "Akademisyenler döner sermaye kapsamı dışında mı değerlendirilir?",
    answer:
      "Evet. Öğretim elemanlarının Teknopark bölgesindeki Ar-Ge faaliyetlerinden elde ettiği gelirler, üniversite döner sermaye kapsamı dışında tutulmaktadır. Bu, akademisyenler için önemli bir mali avantaj sağlamakta ve sanayi iş birliğini teşvik etmektedir.",
    tags: ["#Akademisyen", "#DönerSermaye"],
  },
  {
    id: "ak3",
    categoryId: "akademisyen",
    question: "Kamu personeli Teknopark firmalarında çalışabilir mi?",
    answer:
      "4691 sayılı Kanun kapsamında akademisyenler ve kamu kurumu personeli, Teknopark bünyesindeki firmalarda sürekli veya yarı zamanlı olarak çalışabilmektedir. Çalışma koşulları ve izin prosedürleri için bağlı olunan kurumun yönetmeliklerine ve kanun hükümlerine uyulması gerekmektedir.",
    tags: ["#Akademisyen", "#KamuPersoneli"],
  },
  {
    id: "ak4",
    categoryId: "akademisyen",
    question: "Üniversite-sanayi iş birliği projeleri için nasıl başvurabilirim?",
    answer:
      "Gazi TTO aracılığıyla üniversite-sanayi iş birliği projeleri için başvuru yapılabilmektedir. Firma veya akademisyenlerin TTO birimine proje fikrinin iletilmesiyle süreç başlar; proje fizibilite değerlendirmesinin ardından hibe veya destek mekanizmalarına yönlendirme yapılır.",
    tags: ["#ÜniversiteSanayi", "#TTO"],
  },

  // ── TTO, PATENT & PROJE DESTEKLERİ ──────────────────────────────────────
  {
    id: "t1",
    categoryId: "tto-patent",
    question: "Patent başvurusu için Gazi TTO nasıl destek sağlamaktadır?",
    answer:
      "Gazi TTO, buluş sahiplerine patent başvurusunun her aşamasında destek vermektedir: buluş değerlendirmesi, tekniğin bilinen durumu araştırması, patent yazımı ve Türk Patent Enstitüsü'ne başvuru sürecinde danışmanlık. Başvuru için önce TTO birimini bilgilendirmeniz ve buluş bildirim formunu doldurmanız gerekmektedir.",
    tags: ["#Patent", "#TTO"],
  },
  {
    id: "t2",
    categoryId: "tto-patent",
    question: "Hangi fon kaynaklarına erişim desteği sunulmaktadır?",
    answer:
      "Gazi TTO; TÜBİTAK (1501, 1507, 1511, 1512, 2244 vb. programlar), KOSGEB, Sanayi Bakanlığı destek programları ve uluslararası fonlar (Horizon Europe vb.) konusunda bilgilendirme ve başvuru destek hizmeti sunmaktadır. Güncel çağrılar için TTO birimiyle iletişime geçebilirsiniz.",
    tags: ["#TTO", "#Fon", "#TÜBİTAK"],
  },
  {
    id: "t3",
    categoryId: "tto-patent",
    question: "Proje yönetimi sürecinde TTO ne tür hizmetler verir?",
    answer:
      "Proje yönetimi kapsamında; proje planlama ve yönetim danışmanlığı, raporlama süreçleri, harcama yönetimi ve mevzuata uygunluk kontrolü hizmetleri verilmektedir. Proje süresince atanan bir TTO uzmanı, firmanın ihtiyaçlarına göre destek sağlamaktadır.",
    tags: ["#TTO", "#ProjeYönetimi"],
  },
  {
    id: "t4",
    categoryId: "tto-patent",
    question: "Fikri mülkiyet haklarının ticarileştirilmesi nasıl gerçekleşir?",
    answer:
      "Gazi TTO, lisans anlaşmaları, spin-off şirket kurma ve teknoloji transferi süreçlerinde aracılık etmektedir. Patent veya ticari sır niteliğindeki bilginin potansiyel alıcı firmalarla buluşturulması, lisans bedellerinin belirlenmesi ve sözleşme süreçlerinde hukuki destek sağlanmaktadır.",
    tags: ["#Patent", "#Ticarileştirme", "#TTO"],
  },

  // ── GENEL KAMPÜS & İDARİ HİZMETLER ──────────────────────────────────────
  {
    id: "k1",
    categoryId: "genel-kampus",
    question: "Teknopark kampüsünde hangi ortak alanlar bulunmaktadır?",
    answer:
      "Gazi Teknopark kampüsünde; konferans salonu ve toplantı odaları, kafeterya ve yemek hizmetleri, açık ve kapalı otopark alanları (güneş enerjili dahil), elektrikli araç şarj istasyonları, sosyal, spor ve dinlenme alanları ile 24 saat güvenlik ve danışma hizmetleri yer almaktadır.",
    tags: ["#OfisKiralama", "#Kampüs"],
  },
  {
    id: "k2",
    categoryId: "genel-kampus",
    question: "Toplantı salonları nasıl rezerve edilir?",
    answer:
      "Konferans salonu ve toplantı odaları, Teknopark yönetim ofisi üzerinden rezerve edilebilmektedir. Taleplerin etkinlik tarihinden en az 3 iş günü önce iletilmesi gerekmektedir. Teknopark firmalarına öncelik tanınmakla birlikte dışarıdan firmalar da uygun tarih ve koşullarda salon kiralayabilmektedir.",
    tags: ["#Kampüs", "#Toplantı"],
  },
  {
    id: "k3",
    categoryId: "genel-kampus",
    question: "Kampüse ulaşım nasıl sağlanmaktadır?",
    answer:
      "Gazi Teknopark, Ankara-Konya karayolu (D-750) üzerinde, Çevreyolu'na yakın konumda bulunmaktadır. Mogan Gölü çevresindeki bu konum, özel araçla kolayca ulaşıma uygun olmakla birlikte toplu taşıma alternatifleri hakkında yönetim birimimizle iletişime geçebilirsiniz.",
    tags: ["#Kampüs", "#Ulaşım"],
  },
  {
    id: "k4",
    categoryId: "genel-kampus",
    question: "Staj başvurusu nasıl yapılır?",
    answer:
      "Gazi Teknopark bünyesinde staj yapmak isteyen öğrenciler, web sitemizdeki Staj Başvurusu formu aracılığıyla başvurabilir. Başvurular değerlendirilerek uygun adaylar mülakat sürecine davet edilmektedir. Stajın, alanınızla ilgili Teknopark firmalarından birinde gerçekleştirilmesi de mümkündür.",
    links: [
      { label: "Staj Başvuru Formu ↗", href: "/basvuru/staj", external: false },
    ],
    tags: ["#Staj", "#Başvuru"],
  },
];

export const QUICK_TAGS = [
  "#BaşvuruSüreçleri",
  "#VergiMuafiyeti",
  "#OfisKiralama",
  "#Kuluçka",
  "#TTO",
  "#SGKMuafiyeti",
  "#Patent",
  "#BİGG",
  "#Akademisyen",
];
