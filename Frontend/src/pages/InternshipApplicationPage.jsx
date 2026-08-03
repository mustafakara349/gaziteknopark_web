import { useState, useRef, useCallback } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { submitInternshipApplication } from "../api/endpoints";
import PageSection from "../components/common/PageSection";
import FormField, { inputClass } from "../components/common/FormField";
import ConsentModal from "../components/common/ConsentModal";

/* ──────────────────────────── Constants ──────────────────────────── */

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const CLASS_OPTIONS = [
  { value: "", label: "Seçiniz" },
  { value: "hazirlik", label: "Hazırlık Sınıfı" },
  { value: "1", label: "1. Sınıf" },
  { value: "2", label: "2. Sınıf" },
  { value: "3", label: "3. Sınıf" },
  { value: "4", label: "4. Sınıf" },
  { value: "5", label: "5. Sınıf" },
  { value: "yeni-mezun", label: "Yeni Mezun" },
];

const INTERNSHIP_TIME_OPTIONS = [
  { value: "", label: "Seçiniz" },
  { value: "tam-zamanli", label: "Tam Zamanlı" },
  { value: "yari-zamanli", label: "Yarı Zamanlı" },
];

const INTERNSHIP_TYPE_OPTIONS = [
  { value: "", label: "Seçiniz" },
  { value: "zorunlu", label: "Zorunlu Staj" },
  { value: "gonullu", label: "Gönüllü Staj" },
  { value: "isyeri-egitimi", label: "İş Yeri Eğitimi" },
];

const PHOTO_ACCEPT = ".jpg,.jpeg,.png";
const PHOTO_MAX_MB = 5;
const CV_ACCEPT = ".pdf";
const CV_MAX_MB = 10;

const AYDINLATMA_METNI = `KİŞİSEL VERİLERİN İŞLENMESİ HAKKINDA AYDINLATMA METNİ
(STAJYER ADAYLARI)

Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun ("KVK Kanunu") 10. maddesi ile Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ kapsamında hazırlanmıştır.

1. Kanun Hakkında Genel Bilgilendirme

KVK Kanunu, kişisel verilerin işlenmesinde başta özel hayatın gizliliği olmak üzere kişilerin temel hak ve özgürlüklerini korumak ve kişisel verileri işleyen gerçek ve tüzel kişilerin yükümlülükleri ile uyacakları usul ve esasları düzenlemek amacıyla 24 Mart 2016 tarihinde kabul edilmiş, 7 Nisan 2016 tarihli 29677 sayılı Resmî Gazetede yayımlanmıştır. Gazi Teknopark markası ile tanınan şirketimiz, kişisel verilerinizin hukuka uygun olarak toplanması, saklanması ve paylaşılmasını sağlamak ve gizliliğinizi korumak amacıyla mümkün olan en üst seviyede güvenlik tedbirlerini almaktadır. Amacımız; 6698 sayılı "Kişisel Verilerin Korunması Kanunu'nun 10. maddesi gereğince ve sizlerin memnuniyeti doğrultusunda, kişisel verilerinizin alınma şekilleri, işlenme amaçları, paylaşılan kişiler, hukuki nedenleri ve haklarınız konularında sizi en şeffaf şekilde bilgilendirmektir.

2. Bilgilendirmenin Kapsamı

İşbu Bilgilendirme, Gazi Teknopark Teknoloji Geliştirme Bölgesinde yer alan firmalarda staj yapmak üzere başvuran stajyer adaylarını kapsamaktadır. Teknoloji Geliştirme Bölgemizde faaliyet gösteren ve stajyer ihtiyacı olan firmalarımızla staj yeri arayan öğrencilerin bir araya getirilmesini amaçlamaktadır.

3. Veri Sorumlusu

6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verileriniz; veri sorumlusu olarak Gazi Teknopark tarafından aşağıda açıklanan kapsamda toplanacak ve işlenecektir.

4. Kişisel Verilerinizin İşlenme Amacı ve Hukuki Sebepleri Neleridir?

a. Başvuruda bulunan stajyer adaylarının ad-soyad, telefon numarası, adres, yaş, doğum tarihi, okuduğu okul-bölüm-sınıf bilgisi, öğrenci numarası, eğitim aldığı bölüm ve eğitim başarı notu bilgileri, "bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması" sebebine dayanarak aşağıdaki amaçla işlenmektedir.

• Teknoloji Geliştirme Bölgemizde faaliyet gösteren ve stajyer ihtiyacı olan firmalarımızın stajyer adaylarının ihtiyaçlarına uygunluğunu ve yetkinliğini değerlendirebilmesi,

b. Stajyer adaylarının ad-soyad, telefon numarası, adres, yaş, doğum tarihi, okuduğu okul-bölüm-sınıf bilgisi, öğrenci numarası, eğitim aldığı bölüm ve eğitim başarı notu bilgileri, "bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması" sebebine dayanarak aşağıdaki amaçlarla işlenmektedir.

• Adaylarının staja kabul edilip edilmeyeceğinin değerlendirilebilmesi,

5. Bizimle paylaştığınız kişisel verilerinizin aktarılabileceği kişiler kimlerdir?

Yukarıda belirtilen amaçlara ek olarak, bizimle paylaştığınız kişisel verilerinizin aktarılabileceği kişiler;

• Teknoloji Geliştirme Bölgemizde faaliyet gösteren ve stajyer ihtiyacı olan firmalar (Yukarıda açıklandığı üzere, bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması sebebine dayanarak)
• Teknoloji Geliştirme Bölgeleri Kanunu, Araştırma, Geliştirme ve Tasarım Faaliyetlerinin Desteklenmesi Hakkında Kanun, Vergi Usul Kanunu, Sayıştay Kanunu, Suç Gelirlerinin Aklanmasının Önlenmesi Hakkında Kanun, Kara Paranın Aklanmasının Önlenmesine Dair Kanun, Türk Ticaret Kanunu, Borçlar Kanunu ve diğer mevzuat hükümlerinin zorunlu kıldığı kişi veya kuruluşlar (yasal yükümlülüklerimizin yerine getirilmesi sebebine dayanarak)
• Mevzuattan kaynaklanan gereklilikler nedeniyle T.C. Ticaret Bakanlığı, T.C. Sanayi ve Teknoloji Bakanlığı, T.C. Hazine ve Maliye Bakanlığı, TÜBİTAK, KOSGEB, Stajyer adayının kayıtlı olduğu eğitim kurumu gibi resmi kurum ve kuruluşlar (yasal yükümlülüklerimizin yerine getirilmesi sebebine dayanarak)
• Kanunen yetkili kamu kurum ve kuruluşları, Valilik, İç İşleri Bakanlığı, kolluk kuvvetleri, savcılıklar ve yasal nedenlerle talepte bulunan diğer adli makamlar ile idari ve yasal merciler (yasal yükümlülüklerimizin yerine getirilmesi sebebine dayanarak)
• Şirketimizin, 6102 sayılı Türk Ticaret Kanunu gereğince denetime tabi şirketlerden olması nedeni ile iç ve dış denetim şirketleri ve denetçiler (yasal yükümlülüklerimizin yerine getirilmesi sebebine dayanarak)

6. Verilerinizin saklanma süresi nedir?

Başvuruda bulunan stajyer adayları ve stajyerlerin kişisel verileri 1 (bir) yıl süre ile saklanarak, bu sürenin sona ermesini takip eden ilk periyodik imhada silinmektedir.

7. Kişisel Veri Sahibinin 6698 sayılı Kanun'un 11. maddesinde Sayılan Hakları

Kişisel veri sahipleri olarak, haklarınıza ilişkin taleplerinizi aşağıda düzenlenen yöntemlerle Gazi Teknoparka iletmeniz durumunda talebin niteliğine göre Gazi Teknopark talebi en kısa sürede ve en geç otuz gün içinde sonuçlandıracaktır.

Bu kapsamda kişisel veri sahipleri;

• Kişisel verilerinin işlenip işlenmediğini öğrenme,
• Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,
• Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,
• Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,
• Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,
• 6698 sayılı Kanun ve ilgili diğer kanun hükümlerine uygun olarak işlenmiş olmasına rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması halinde kişisel verilerin silinmesini veya yok edilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,
• İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme,
• Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme haklarına sahiptir.

Posta yolu ile yapmak istediğiniz başvurularınızı, veri sorumlusu olarak Şirketimizin Bahçelievler Mahallesi 323/1.Cadde Gazi Üniversitesi Teknokent Binası A Blok No:10/50A/40 (06830) Gölbaşı/Ankara adresine gönderebilirsiniz. E-posta yoluyla yapmak istediğiniz başvurularınızı info@gaziteknopark.com.tr adresine iletebilirsiniz.`;

const ACIK_RIZA_METNI = `AÇIK RIZA METNİ
(STAJYER ADAYLARI)

Gazi Teknopark Teknoloji Geliştirme Bölgesi Kurucu ve İşletici A.Ş.'nin stajyer adayları için Kişisel Verilerin İşlenmesi Hakkında Bilgilendirme Metnini ("Aydınlatma Metni") okudum, anladım.

Aydınlatma Metninde, Gazi Teknopark Teknoloji Geliştirme Bölgesinde faaliyet gösteren firmalarda staj yapabilmem için işlenmesi gerekli olan kişisel veriler tek tek sayılmış olup; staj başvurusunda bulunurken gönderdiğim özgeçmişimde bu veriler dışında kişisel/özel nitelikli kişisel verilere yer vermeyeceğimi; özgeçmişimin bu veriler dışında kişisel veri içermesi halinde söz konusu verilerin Aydınlatma Metninde tarafıma bildirilen amaçlarla işlenmesine ve aktarılmasına açık rızam ile muvafakat ettiğimi ve paylaştığım verilerin bana ait doğru veriler olduğunu beyan ederim.`;

/* ──────────────────────────── Helpers ──────────────────────────── */

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  university: "",
  department: "",
  classYear: "",
  universityStartDate: "",
  internshipTime: "",
  internshipType: "",
  aboutMe: "",
  photo: null,
  cv: null,
};

const selectClass = `${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2212%22%20height%3d%2212%22%20viewBox%3d%220%200%2012%2012%22%3e%3cpath%20fill%3d%22%236b7280%22%20d%3d%22M2%204l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10`;

function formatPhoneNumber(val) {
  let digits = val.replace(/\D/g, "");
  if (!digits) return "";

  if (!digits.startsWith("05")) {
    if (digits.startsWith("5")) {
      digits = "0" + digits;
    } else {
      digits = "05" + digits;
    }
  }

  digits = digits.slice(0, 11);

  let formatted = digits.slice(0, 4);
  if (digits.length > 4) {
    formatted += " " + digits.slice(4, 7);
  }
  if (digits.length > 7) {
    formatted += " " + digits.slice(7, 9);
  }
  if (digits.length > 9) {
    formatted += " " + digits.slice(9, 11);
  }

  return formatted;
}

function validateFile(file, acceptExts, maxMB) {
  if (!file) return "Bu alan zorunludur.";
  const ext = "." + file.name.split(".").pop().toLowerCase();
  const exts = acceptExts.split(",").map((e) => e.trim().toLowerCase());
  if (!exts.includes(ext)) return `Geçersiz dosya formatı. Kabul edilen: ${acceptExts}`;
  if (file.size > maxMB * 1024 * 1024) return `Dosya boyutu en fazla ${maxMB}MB olabilir.`;
  return null;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ──────────────────────────── Component ──────────────────────────── */

export default function InternshipApplicationPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [apiError, setApiError] = useState(null);

  // Consent state
  const [consentAydinlatma, setConsentAydinlatma] = useState(false);
  const [consentAcikRiza, setConsentAcikRiza] = useState(false);
  const [modalType, setModalType] = useState(null); // "aydinlatma" | "acikRiza" | null

  // reCAPTCHA
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const formRef = useRef(null);

  /* ── Field updaters ── */
  const updateText = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const updatePhone = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setForm((f) => ({ ...f, phone: formatted }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
  };

  const handlePhoneFocus = () => {
    if (!form.phone) {
      setForm((f) => ({ ...f, phone: "05" }));
    }
  };

  const updateFile = (key) => (e) => {
    const file = e.target.files?.[0] || null;
    setForm((f) => ({ ...f, [key]: file }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  /* ── Validation ── */
  const validate = useCallback(() => {
    const errs = {};

    if (!form.firstName.trim()) errs.firstName = "Ad alanı zorunludur.";
    if (!form.lastName.trim()) errs.lastName = "Soyad alanı zorunludur.";
    if (!form.email.trim()) errs.email = "E-posta alanı zorunludur.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Geçerli bir e-posta adresi giriniz.";
    if (!form.phone.trim()) errs.phone = "Telefon alanı zorunludur.";
    else if (!/^(\+?90|0)?5\d{9}$/.test(form.phone.replace(/\D/g, ""))) errs.phone = "Geçerli bir telefon numarası giriniz.";
    if (!form.university.trim()) errs.university = "Üniversite alanı zorunludur.";
    if (!form.department.trim()) errs.department = "Bölüm alanı zorunludur.";
    if (!form.classYear) errs.classYear = "Sınıf seçimi zorunludur.";
    if (!form.universityStartDate) {
      errs.universityStartDate = "Başlangıç tarihi zorunludur.";
    } else {
      const startDate = new Date(form.universityStartDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate > today) {
        errs.universityStartDate = "Başlangıç tarihi bugünden ileri bir tarih olamaz.";
      } else if (startDate.getFullYear() < 1970) {
        errs.universityStartDate = "Geçerli bir başlangıç tarihi giriniz (1970 ve sonrası).";
      }
    }
    if (!form.internshipTime) errs.internshipTime = "Staj zamanı seçimi zorunludur.";
    if (!form.internshipType) errs.internshipType = "Staj tipi seçimi zorunludur.";
    if (!form.aboutMe.trim()) errs.aboutMe = "Kendini tanıtma metni zorunludur.";
    else if (form.aboutMe.length > 500) errs.aboutMe = "En fazla 500 karakter yazabilirsiniz.";

    const photoErr = validateFile(form.photo, PHOTO_ACCEPT, PHOTO_MAX_MB);
    if (photoErr) errs.photo = photoErr;

    const cvErr = validateFile(form.cv, CV_ACCEPT, CV_MAX_MB);
    if (cvErr) errs.cv = cvErr;

    if (!consentAydinlatma) errs.consentAydinlatma = "Aydınlatma Metnini onaylamanız gerekmektedir.";
    if (!consentAcikRiza) errs.consentAcikRiza = "Açık Rıza Metnini onaylamanız gerekmektedir.";

    if (!captchaToken) errs.captcha = "Lütfen robot olmadığınızı doğrulayınız.";

    return errs;
  }, [form, consentAydinlatma, consentAcikRiza, captchaToken]);

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");
    setApiError(null);

    try {
      const payload = new FormData();
      payload.append("firstName", form.firstName);
      payload.append("lastName", form.lastName);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("university", form.university);
      payload.append("department", form.department);
      payload.append("classYear", form.classYear);
      payload.append("universityStartDate", form.universityStartDate);
      payload.append("internshipTime", form.internshipTime);
      payload.append("internshipType", form.internshipType);
      payload.append("aboutMe", form.aboutMe);
      payload.append("photo", form.photo);
      payload.append("cv", form.cv);
      payload.append("kvkkConsent", consentAydinlatma);
      payload.append("explicitConsent", consentAcikRiza);
      payload.append("captchaToken", captchaToken);

      await submitInternshipApplication(payload);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      console.error("Staj başvurusu gönderim hatası:", err);
      setStatus("error");
      const msg = err?.response?.data?.title || err?.response?.data || "Başvurunuz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.";
      setApiError(typeof msg === "string" ? msg : "Başvurunuz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
      captchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  /* ── Modal accept handlers ── */
  const handleAcceptAydinlatma = () => {
    setConsentAydinlatma(true);
    setModalType(null);
    if (errors.consentAydinlatma) setErrors((prev) => ({ ...prev, consentAydinlatma: null }));
  };
  const handleAcceptAcikRiza = () => {
    setConsentAcikRiza(true);
    setModalType(null);
    if (errors.consentAcikRiza) setErrors((prev) => ({ ...prev, consentAcikRiza: null }));
  };

  /* ── Render helper for inline errors ── */
  const FieldError = ({ name }) => {
    if (!errors[name]) return null;
    return <p className="mt-1.5 text-xs font-medium text-accent">{errors[name]}</p>;
  };

  /* ── Section label helper ── */
  const SectionLabel = ({ title, subtitle }) => (
    <div className="mb-6 pb-4 border-b border-gray-100">
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );

  /* ────────────────────────────── JSX ────────────────────────────── */

  return (
    <div>
      <PageSection className="max-w-4xl">
        {status === "success" ? (
          /* ── Success State ── */
          <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm animate-slide-down md:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-800">Başvurunuz Alındı!</h2>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Staj başvurunuz başarıyla iletilmiştir. Değerlendirme sürecinin ardından sizinle e-posta veya telefon yoluyla iletişime geçilecektir.
            </p>
            <button
              onClick={() => {
                setStatus("idle");
                setForm(initialForm);
                setConsentAydinlatma(false);
                setConsentAcikRiza(false);
                setCaptchaToken(null);
                captchaRef.current?.reset();
                setErrors({});
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Yeni Başvuru Yap
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10"
          >
            {/* ─── Section 1: Kişisel Bilgiler ─── */}
            <div>
              <SectionLabel
                title="Kişisel Bilgiler"
                subtitle="İletişim ve kimlik bilgileriniz"
              />
              <div className="grid gap-5 md:grid-cols-2">
                <div id="field-firstName">
                  <FormField label="Ad" required>
                    <input
                      value={form.firstName}
                      onChange={updateText("firstName")}
                      placeholder="Adınız"
                      className={`${inputClass} ${errors.firstName ? "border-accent" : ""}`}
                    />
                  </FormField>
                  <FieldError name="firstName" />
                </div>

                <div id="field-lastName">
                  <FormField label="Soyad" required>
                    <input
                      value={form.lastName}
                      onChange={updateText("lastName")}
                      placeholder="Soyadınız"
                      className={`${inputClass} ${errors.lastName ? "border-accent" : ""}`}
                    />
                  </FormField>
                  <FieldError name="lastName" />
                </div>

                <div id="field-email">
                  <FormField label="E-posta" required>
                    <input
                      type="email"
                      value={form.email}
                      onChange={updateText("email")}
                      placeholder="ornek@email.com"
                      className={`${inputClass} ${errors.email ? "border-accent" : ""}`}
                    />
                  </FormField>
                  <FieldError name="email" />
                </div>

                <div id="field-phone">
                  <FormField label="Telefon" required>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={updatePhone}
                      onFocus={handlePhoneFocus}
                      placeholder="05XX XXX XX XX"
                      maxLength={15}
                      className={`${inputClass} ${errors.phone ? "border-accent" : ""}`}
                    />
                  </FormField>
                  <FieldError name="phone" />
                </div>
              </div>
            </div>

            {/* ─── Section 2: Eğitim Bilgileri ─── */}
            <div>
              <SectionLabel
                title="Eğitim Bilgileri"
                subtitle="Üniversite ve bölüm bilgileriniz"
              />
              <div className="grid gap-5 md:grid-cols-2">
                <div id="field-university">
                  <FormField label="Üniversite" required>
                    <input
                      value={form.university}
                      onChange={updateText("university")}
                      placeholder="Üniversite adı"
                      className={`${inputClass} ${errors.university ? "border-accent" : ""}`}
                    />
                  </FormField>
                  <FieldError name="university" />
                </div>

                <div id="field-department">
                  <FormField label="Bölüm" required>
                    <input
                      value={form.department}
                      onChange={updateText("department")}
                      placeholder="Bölüm adı"
                      className={`${inputClass} ${errors.department ? "border-accent" : ""}`}
                    />
                  </FormField>
                  <FieldError name="department" />
                </div>

                <div id="field-classYear">
                  <FormField label="Sınıf" required>
                    <select
                      value={form.classYear}
                      onChange={updateText("classYear")}
                      className={`${selectClass} ${errors.classYear ? "border-accent" : ""} ${!form.classYear ? "text-gray-400" : ""}`}
                    >
                      {CLASS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FieldError name="classYear" />
                </div>

                <div id="field-universityStartDate">
                  <FormField label="Üniversiteye Başlangıç Tarihi" required>
                    <input
                      type="date"
                      value={form.universityStartDate}
                      onChange={updateText("universityStartDate")}
                      className={`${inputClass} ${errors.universityStartDate ? "border-accent" : ""}`}
                    />
                  </FormField>
                  <FieldError name="universityStartDate" />
                </div>
              </div>
            </div>

            {/* ─── Section 3: Staj Bilgileri ─── */}
            <div>
              <SectionLabel
                title="Staj Bilgileri"
                subtitle="Staj tercihleri ve kendinizi tanıtmanız"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <div id="field-internshipTime">
                  <FormField label="Staj Zamanı" required>
                    <select
                      value={form.internshipTime}
                      onChange={updateText("internshipTime")}
                      className={`${selectClass} ${errors.internshipTime ? "border-accent" : ""} ${!form.internshipTime ? "text-gray-400" : ""}`}
                    >
                      {INTERNSHIP_TIME_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FieldError name="internshipTime" />
                </div>
                <div id="field-internshipType">
                  <FormField label="Staj Tipi" required>
                    <select
                      value={form.internshipType}
                      onChange={updateText("internshipType")}
                      className={`${selectClass} ${errors.internshipType ? "border-accent" : ""} ${!form.internshipType ? "text-gray-400" : ""}`}
                    >
                      {INTERNSHIP_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FieldError name="internshipType" />
                </div>
              </div>

              {/* Tanıtma Metni */}
              <div id="field-aboutMe" className="mt-5">
                <FormField label="Kısaca Kendinizi Tanıtın" required>
                  <textarea
                    rows={4}
                    value={form.aboutMe}
                    onChange={updateText("aboutMe")}
                    maxLength={500}
                    placeholder="Kendinizi, ilgi alanlarınızı ve stajdan beklentilerinizi kısaca açıklayınız..."
                    className={`${inputClass} resize-none ${errors.aboutMe ? "border-accent" : ""}`}
                  />
                </FormField>
                <div className="mt-1 flex items-center justify-between">
                  <FieldError name="aboutMe" />
                  <span className={`text-xs font-medium ml-auto ${form.aboutMe.length > 450 ? "text-accent" : "text-gray-400"}`}>
                    {form.aboutMe.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Section 4: Dosya Yükleme ─── */}
            <div>
              <SectionLabel
                title="Dosya Yükleme"
                subtitle="Fotoğrafınızı ve CV dosyanızı yükleyiniz"
              />
              <div className="grid gap-5 md:grid-cols-2">
                {/* Photo Upload */}
                <div id="field-photo">
                  <span className="text-sm font-medium text-[#333]">
                    Fotoğraf <span className="text-accent">*</span>
                  </span>
                  <label
                    className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${errors.photo
                      ? "border-accent/40 bg-red-50/30"
                      : form.photo
                        ? "border-primary/30 bg-hover-blue"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <input type="file" accept={PHOTO_ACCEPT} onChange={updateFile("photo")} className="sr-only" />
                    {form.photo ? (
                      <div className="flex flex-col items-center gap-1 text-center">
                        <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-800 truncate max-w-[200px]">{form.photo.name}</span>
                        <span className="text-[11px] text-gray-400">{formatFileSize(form.photo.size)}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-xs font-medium text-gray-500">Fotoğraf Yükle</span>
                        <span className="text-[10px] text-gray-400">JPG, PNG • Maks. 5MB</span>
                      </div>
                    )}
                  </label>
                  <FieldError name="photo" />
                </div>

                {/* CV Upload */}
                <div id="field-cv">
                  <span className="text-sm font-medium text-[#333]">
                    CV (Özgeçmiş) <span className="text-accent">*</span>
                  </span>
                  <label
                    className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${errors.cv
                      ? "border-accent/40 bg-red-50/30"
                      : form.cv
                        ? "border-primary/30 bg-hover-blue"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <input type="file" accept={CV_ACCEPT} onChange={updateFile("cv")} className="sr-only" />
                    {form.cv ? (
                      <div className="flex flex-col items-center gap-1 text-center">
                        <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-800 truncate max-w-[200px]">{form.cv.name}</span>
                        <span className="text-[11px] text-gray-400">{formatFileSize(form.cv.size)}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-xs font-medium text-gray-500">CV Yükle</span>
                        <span className="text-[10px] text-gray-400">PDF • Maks. 10MB</span>
                      </div>
                    )}
                  </label>
                  <FieldError name="cv" />
                </div>
              </div>
            </div>

            {/* ─── Section 5: Onaylar & Gönderim ─── */}
            <div>
              <SectionLabel
                title="Onaylar"
                subtitle="Başvuru için gerekli yasal onaylar"
              />

              <div className="space-y-4">
                {/* Aydınlatma Metni */}
                <div id="field-consentAydinlatma">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consentAydinlatma}
                      onChange={(e) => {
                        if (consentAydinlatma) {
                          setConsentAydinlatma(false);
                        } else {
                          e.preventDefault();
                          setModalType("aydinlatma");
                        }
                      }}
                      className={`mt-0.5 h-4 w-4 rounded border-gray-300 cursor-pointer transition-colors ${consentAydinlatma ? "accent-emerald-500" : "accent-primary"
                        }`}
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Gazi Teknopark{" "}
                      <button
                        type="button"
                        onClick={() => setModalType("aydinlatma")}
                        className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark transition-colors"
                      >
                        aydınlatma metnini
                      </button>
                      {" "}okudum ve anladım.
                    </span>
                  </label>
                  <FieldError name="consentAydinlatma" />
                </div>

                {/* Açık Rıza Metni */}
                <div id="field-consentAcikRiza">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consentAcikRiza}
                      onChange={(e) => {
                        if (consentAcikRiza) {
                          setConsentAcikRiza(false);
                        } else {
                          e.preventDefault();
                          setModalType("acikRiza");
                        }
                      }}
                      className={`mt-0.5 h-4 w-4 rounded border-gray-300 cursor-pointer transition-colors ${consentAcikRiza ? "accent-emerald-500" : "accent-primary"
                        }`}
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Gazi Teknopark{" "}
                      <button
                        type="button"
                        onClick={() => setModalType("acikRiza")}
                        className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark transition-colors"
                      >
                        açık rıza metnini
                      </button>
                      {" "}okudum ve kabul ediyorum.
                    </span>
                  </label>
                  <FieldError name="consentAcikRiza" />
                </div>
              </div>

              {/* reCAPTCHA */}
              <div id="field-captcha" className="mt-6">
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => {
                    setCaptchaToken(token);
                    if (errors.captcha) setErrors((prev) => ({ ...prev, captcha: null }));
                  }}
                  onExpired={() => setCaptchaToken(null)}
                />
                <FieldError name="captcha" />
              </div>

              {/* API Error */}
              {apiError && (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-accent">
                  {apiError}
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      Başvuruyu Gönder
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </PageSection>

      {/* ── Consent Modals ── */}
      <ConsentModal
        title="Aydınlatma Metni"
        content={AYDINLATMA_METNI}
        isOpen={modalType === "aydinlatma"}
        onClose={() => setModalType(null)}
        onAccept={handleAcceptAydinlatma}
      />
      <ConsentModal
        title="Açık Rıza Metni"
        content={ACIK_RIZA_METNI}
        isOpen={modalType === "acikRiza"}
        onClose={() => setModalType(null)}
        onAccept={handleAcceptAcikRiza}
      />
    </div>
  );
}
