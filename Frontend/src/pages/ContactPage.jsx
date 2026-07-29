import { useEffect, useState } from "react";
import { getContactInfo, getSocialLinks, submitContactMessage } from "../api/endpoints";
import { pickTranslation } from "../utils/i18n";
import PageSection from "../components/common/PageSection";
import FormField, { inputClass } from "../components/common/FormField";
import { socialIcon } from "../components/common/icons";

const initialForm = { fullName: "", email: "", phone: "", subject: "", message: "" };

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    getContactInfo().then(setContactInfo).catch(() => setContactInfo(null));
    getSocialLinks().then(setSocialLinks).catch(() => setSocialLinks([]));
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const t = pickTranslation(contactInfo ?? {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await submitContactMessage(form);
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setError("Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div>
      <PageSection className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          {status === "success" ? (
            <div className="rounded-2xl bg-hover-blue p-8 text-center">
              <p className="text-sm font-medium text-primary">Mesajınız alındı. En kısa sürede size dönüş yapacağız.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Ad Soyad" required>
                  <input required value={form.fullName} onChange={update("fullName")} className={inputClass} />
                </FormField>
                <FormField label="E-posta" required>
                  <input type="email" required value={form.email} onChange={update("email")} className={inputClass} />
                </FormField>
                <FormField label="Telefon">
                  <input value={form.phone} onChange={update("phone")} className={inputClass} />
                </FormField>
                <FormField label="Konu">
                  <input value={form.subject} onChange={update("subject")} className={inputClass} />
                </FormField>
              </div>
              <FormField label="Mesaj" required>
                <textarea required rows={5} value={form.message} onChange={update("message")} className={inputClass} />
              </FormField>

              {error && <p className="text-sm text-accent">{error}</p>}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "submitting" ? "Gönderiliyor..." : "Mesajı Gönder"}
              </button>
            </form>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="rounded-3xl bg-primary p-6 text-white md:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">İletişim Bilgileri</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {contactInfo?.phone && <li>{contactInfo.phone}</li>}
              {contactInfo?.email && <li>{contactInfo.email}</li>}
              {t.address && <li>{t.address}</li>}
              {t.workingHours && <li>{t.workingHours}</li>}
              {!contactInfo && <li className="text-white/60">Bilgi eklenmedi.</li>}
            </ul>

            {socialLinks.length > 0 && (
              <div className="mt-6 flex gap-3">
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
            )}
          </div>

          {contactInfo?.mapEmbedUrl && (
            <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100">
              <iframe
                src={contactInfo.mapEmbedUrl}
                title="Konum"
                className="h-64 w-full"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
}
