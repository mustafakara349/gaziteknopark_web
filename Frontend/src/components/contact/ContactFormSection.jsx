import { useState } from "react";
import FormField, { inputClass } from "../common/FormField";
import { submitContactMessage } from "../../api/endpoints";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  department: "genel",
  subject: "",
  message: "",
  kvkkConsent: false,
};

export default function ContactFormSection() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "success" | "error"
  const [error, setError] = useState(null);

  const update = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.kvkkConsent) {
      setError("Lütfen KVKK Aydınlatma Metnini onaylayınız.");
      return;
    }

    setStatus("submitting");
    setError(null);

    const departmentLabel =
      form.department === "tto"
        ? "[Teknoloji Transfer Ofisi (TTO)]"
        : form.department === "kulucka"
        ? "[Girişimcilik & Kuluçka]"
        : form.department === "yonetim"
        ? "[Yönetim & İdari İşler]"
        : "[Genel İletişim]";

    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      subject: `${departmentLabel} ${form.subject}`.trim(),
      message: form.message,
    };

    try {
      await submitContactMessage(payload);
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setError("Mesajınız gönderilirken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.");
    }
  };

  return (
    <div className="mt-12 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Görüş & Öneri</span>
        <h2 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">Gazi Teknopark'a Yazın</h2>
        <p className="mt-2 text-xs text-gray-500 sm:text-sm">
          Soru, görüş, iş birliği ve bilgi taleplerinizi aşağıdaki formu doldurarak ilgili birimlerimize iletebilirsiniz.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        {status === "success" ? (
          <div className="rounded-2xl bg-hover-blue p-8 text-center border border-primary/20 animate-slide-down">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
              ✓
            </div>
            <h3 className="mt-3 text-lg font-bold text-primary">Mesajınız İletilmiştir</h3>
            <p className="mt-1 text-xs text-gray-600">
              Talebiniz kaydedilmiştir. İlgili birim yöneticimiz en kısa sürede tarafınıza dönüş yapacaktır.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-5 rounded-full bg-primary px-6 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              Yeni Mesaj Gönder
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Ad Soyad" required>
                <input
                  required
                  placeholder="Örn: Ahmet Yılmaz"
                  value={form.fullName}
                  onChange={update("fullName")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="E-Posta Adresi" required>
                <input
                  type="email"
                  required
                  placeholder="Örn: ahmet@example.com"
                  value={form.email}
                  onChange={update("email")}
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Telefon Numarası">
                <input
                  placeholder="Örn: 05XX XXX XX XX"
                  value={form.phone}
                  onChange={update("phone")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="İlgili Birim">
                <select value={form.department} onChange={update("department")} className={inputClass}>
                  <option value="genel">Genel İletişim / Danışma</option>
                  <option value="tto">Teknoloji Transfer Ofisi (TTO)</option>
                  <option value="kulucka">Girişimcilik & Kuluçka Merkezi</option>
                  <option value="yonetim">Yönetim & İdari İşler</option>
                </select>
              </FormField>
            </div>

            <FormField label="Konu Başlığı" required>
              <input
                required
                placeholder="Örn: Kuluçka Merkezi Başvuru Süreci Hakkında"
                value={form.subject}
                onChange={update("subject")}
                className={inputClass}
              />
            </FormField>

            <FormField label="Mesajınız" required>
              <textarea
                required
                rows={4}
                placeholder="Mesajınızı detaylı şekilde buraya yazabilirsiniz..."
                value={form.message}
                onChange={update("message")}
                className={inputClass}
              />
            </FormField>

            {/* KVKK Onay Kutusu */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="kvkkConsent"
                checked={form.kvkkConsent}
                onChange={update("kvkkConsent")}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="kvkkConsent" className="text-xs text-gray-500 leading-normal">
                Gazi Teknopark{" "}
                <span className="font-semibold text-primary underline cursor-pointer">KVKK Aydınlatma Metni</span>'ni
                okudum, kişisel verilerimin iletişim talebimin karşılanması amacıyla işlenmesini onaylıyorum.
              </label>
            </div>

            {error && <p className="text-xs font-semibold text-accent">{error}</p>}

            <div className="pt-2 text-center sm:text-right">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full sm:w-auto rounded-full bg-primary px-8 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg disabled:opacity-60"
              >
                {status === "submitting" ? "Gönderiliyor..." : "Mesajı İlet &rarr;"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
