/**
 * Gazi Teknopark "Hizmetlerimiz ve İmkanlarımız" Sayfası Gerçek İçerik Verisi
 */

export const servicesContent = {
  // 3 ve 4. Hizmet Birimleri (Kategori Kartları ve Detay Blokları için Ortak Veri Kaynağı)
  units: [
    {
      id: "gazi-tto",
      icon: "Award",
      title: "Gazi Teknoloji Transfer Ofisi (Gazi TTO)",
      summary: "Üniversite-sanayi iş birliği geliştirme, patent başvurusu, fon kaynaklarına erişim ve ticarileştirme destekleri.",
      description: "Akademik bilgi birikimini sanayinin Ar-Ge ihtiyaçlarıyla buluşturarak patentlemeden ticarileştirmeye kadar tüm aşamalarda profesyonel destek sağlıyoruz.",
      items: [
        "TTO Faaliyetleri İçin Bilgilendirme ve Eğitim Hizmetleri",
        "Ulusal ve Uluslararası Fon Kaynaklarına Erişim Hizmetleri",
        "Üniversite-Sanayi İş Birliği Geliştirme ve Proje Yönetimi",
        "Patent ve Diğer Fikri Sınai Mülkiyet Hakları Başvurusu ve Ticarileştirilmesi",
        "Girişimcilik ve Şirketleşme Destekleri",
      ],
      image: "https://gossipdergi.com/wp-content/uploads/2019/03/logo02-1024x577.jpg",
    },
    {
      id: "incubation",
      icon: "Users",
      title: "Anahtar Kuluçka Hizmetleri",
      summary: "Uygun koşullu açık ve kapalı ofis imkanları, prototipleme, mentorluk ve yatırımcı buluşturma faaliyetleri.",
      description: "Erken aşama teknoloji girişimlerinin hızlı ve sürdürülebilir büyümelerini sağlamak amacıyla tüm mali, idari ve teknik destekleri bir arada sunuyoruz.",
      items: [
        "Uygun Koşullu Açık ve Kapalı Ofis İmkanı",
        "Anahtar Prototip Atölyesinde Prototipleme ve Üretim",
        "Eğitim, Bilgilendirme ve Mentorluk Destekleri",
        "Mali, İdari ve Hukuksal Konularda Ücretsiz Danışmanlık",
        "Yatırımcı Buluşturma ve Finansman Kaynaklarına Erişim Desteği",
        "Üniversite Kaynaklarına Erişim ve İş Birliği Hizmetleri",
      ],
      image: "https://sp.sanayigazetesi.com.tr/wp-content/uploads/2023/12/3-20.jpg",
    },
    {
      id: "bigg-gazi",
      icon: "Rocket",
      title: "BİGG Anahtar (TÜBİTAK 1512)",
      summary: "TÜBİTAK 1512 Resmi Uygulayıcı Kuruluşu olarak iş fikrinden ticarileşmeye giden yolda resmi hibe ve şirketleşme desteği.",
      description: "TÜBİTAK 1512 BİGG Programı kapsamında girişimcilerin iş fikirlerini ticarileştirilebilir iş modellerine dönüştürerek hibe destekli şirketleşmelerini sağlıyoruz.",
      items: [
        "Fikirden İcraata İş Fikri Yarışması",
        "İş Modeli Kurma ve Ticarileştirme Odaklı Eğitimler",
        "Teknik, Ticari, İş Modeli Mentorluk Destekleri",
        "Fikri Mülkiyet ve Ar-Ge Teşviklerinden Yararlandırma Destekleri",
        "Anahtar Prototip Atölyesinde Ücretsiz Prototipleme Desteği",
        "İş Birliği ve Eşleştirme Destekleri",
      ],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPK9OUL910jV-LWRPOd7_ChWOOifqUSM6xKPv0cMIl_AuDSXb0F_uMSs6L&s=10",
    },
    {
      id: "cluster",
      icon: "Globe",
      title: "Gazi Bilişim Kümesi",
      summary: "Ortak proje geliştirme fırsatları, yurtdışına açılma hedefleri doğrultusunda iş toplantıları ve ihracat destekleri.",
      description: "Bilişim sektöründeki firmalarımızın ihracat kapasitelerini artırmak ve küresel pazarlara entegre olmalarını sağlamak amacıyla ortak projeler ve yurt dışı pazarlama faaliyetleri yürütüyoruz.",
      items: [
        "Firmalara Ortak Proje/Ürün/İş Geliştirme Süreçlerini Geliştirme Fırsatları",
        "Yurtdışına Açılma Hedefleri Doğrultusunda İş Toplantıları ve Yatırımcı Görüşmeleri",
        "Firmaların İhracat Kapasitelerini Arttırmak İçin Eğitim, Danışmanlık ve Yurtdışı Pazarlama",
      ],
      image: "https://www.tgbd.org.tr/content/upload/attached-files/dscn3207-20181220105829.jpg",
    },
  ],

  // 5. Teşvikler / Yasal Avantajlar
  incentives: {
    // 5.1 Girişimciler / Firmalar
    entrepreneur: {
      title: "Teknoparkta Faaliyet Gösteren Kuruluşlara Yönelik Avantajlar",
      items: [
        "Bölgede faaliyet gösteren gelir ve kurumlar vergisi mükelleflerinin, bölgedeki yazılım, tasarım ve Ar-Ge faaliyetlerinden elde ettikleri kazançları için 31.12.2028 tarihine kadar Gelir ve Kurumlar vergisinden muafiyet.",
        "Bölgede çalışan araştırmacı, yazılımcı, tasarımcı, Ar-Ge ve destek personeline ilişkin 31.12.2028 tarihine kadar her türlü gelir vergisinden muafiyet.",
        "Bölgede çalışan araştırmacı, yazılımcı, tasarımcı, Ar-Ge ve destek personeline yönelik 31.12.2028 tarihine kadar SGK işveren payının %50 oranında muafiyeti.",
        "Bölgede üretilen Ar-Ge projeleri kapsamındaki yazılımlar için KDV muafiyeti.",
      ],
      note: "4691 Sayılı Teknoloji Geliştirme Bölgeleri Kanunu kapsamındaki muafiyetler, resmi güncellemeler doğrultusunda 31.12.2028 tarihine kadar uzatılmıştır.",
    },
    // 5.2 Akademisyen / Kamu Personeli
    academician: {
      title: "Üniversite ve Kamu Personeli İstihdamı İle İlgili Sağlanan Avantajlar",
      items: [
        "Akademisyen ve kamu kurumu personelinin Teknopark bünyesindeki firmalarda sürekli veya yarı zamanlı olarak çalışabilme imkanı.",
        "Öğretim elemanlarının yaptıkları araştırmaların sonuçlarını ticarileştirmek amacı ile bölgede şirket kurabilme, kurulu bir şirkete ortak olabilme ve/veya bu şirketlerin yönetiminde görev alabilme imkanı.",
        "Öğretim elemanlarının bölgedeki Ar-Ge faaliyetlerinden elde ettiği gelirlerin üniversite döner sermaye kapsamı dışında tutulması.",
      ],
      note: "Gazi Teknoloji A.Ş., akademisyenlerin sanayi ile iş birliği içerisinde yürütecekleri Ar-Ge projelerini 4691 sayılı kanun çerçevesinde Teknopark'ta gerçekleştirmelerini desteklemektedir.",
    },
  },

  // 6. Kampüs İmkanları
  facilities: [
    {
      icon: "Compass",
      label: "Mogan Gölü Manzaralı Huzurlu Kampüs",
      description:
        "Gazi Teknopark, Ankara'nın doğa içindeki en prestijli çalışma ortamlarından birini sunar. Mogan Gölü manzarasına karşı huzurlu ve yeşil bir kampüs atmosferinde yenilikçi projelerinizi hayata geçirin.",
      featured: true,
    },
    {
      icon: "MapPin",
      label: "Ankara-Konya Yolu ve Çevreyoluna Kolay Ulaşım",
    },
    {
      icon: "Layers",
      label: "Nitelikli Altyapı Hizmetleri",
    },
    {
      icon: "Car",
      label: "Açık ve Kapalı Otopark Alanları (Güneş Enerjili Dahil)",
    },
    {
      icon: "Video",
      label: "Konferans Salonu ve Toplantı Odaları",
    },
    {
      icon: "Heart",
      label: "Sosyal, Spor ve Dinlenme Alanları",
    },
    {
      icon: "Zap",
      label: "Elektrikli Araç Şarj İstasyonu",
    },
    {
      icon: "Coffee",
      label: "Kafeterya ve Yemek Hizmetleri",
    },
    {
      icon: "Shield",
      label: "24 Saat Güvenlik ve Danışma Hizmeti",
    },
  ],
  facilityImages: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGOF1QooLi6qvKfJekHd5qNvvPEFjbaSFge0YB5cRgTAH-Wx4wdYIdQ4Y&s=10",
  ],

  // 7. Üyelikler ve Kurumsal Rozetler
  badges: [
    {
      name: "TGBD - Teknoloji Geliştirme Bölgeleri Derneği Üyeliği",
      logo: null,
    },
    {
      name: "IASP - Uluslararası Teknoparklar Birliği Üyeliği",
      logo: null,
    },
    {
      name: "TechAnkara - Ankara Teknoparklar Platformu Ortaklığı",
      logo: null,
    },
  ],

  // 8. SSS Köprüsü
  faq: [
    {
      id: "faq-1",
      question: "Gazi Teknopark Bölgesi'nde yer almak için başvuru süreci nasıl işler?",
    },
    {
      id: "faq-2",
      question: "Hangi firmalar Teknokent vergi muafiyetlerinden yararlanabilir?",
    },
    {
      id: "faq-3",
      question: "Akademisyenlerin teknoparkta şirket kurma şartları nelerdir?",
    },
  ],

  // 9. Kapanış Eylem Çağrısı (CTA)
  cta: {
    title: "Gazi Teknopark Ekosistemine Katılın",
    description: "Siz de yenilikçi Ar-Ge projenizle Türkiye'nin en başarılı Teknoparklarından birinde yerinizi alın, cazip yasal teşviklerden hemen yararlanın.",
    buttonText: "Firma Başvurusu Yap",
    buttonUrl: "/basvuru/firma",
    brochureText: "Tanıtım Broşürünü İndir (PDF)",
    brochureUrl: "",
  },
};
