import { useState } from "react";
import { submitContactMessage } from "../api/endpoints";
import PageHeader from "../components/common/PageHeader";
import PageSection from "../components/common/PageSection";
import FormField, { inputClass } from "../components/common/FormField";

const initialForm = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  sector: "",
  message: "",
};

export default function CompanyApplicationPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const combinedMessage = [
        `Firma: ${form.companyName}`,
        form.sector && `Sektör: ${form.sector}`,
        "",
        form.message,
      ]
        .filter(Boolean)
        .join("\n");

      await submitContactMessage({
        fullName: form.contactName,
        email: form.email,
        phone: form.phone,
        subject: "Firma Başvurusu",
        message: combinedMessage,
      });
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setError("Başvurunuz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div>
      <PageHeader title="Firma Başvurusu" subtitle="Gazi Teknopark'ta yer almak isteyen firmalar için ön başvuru formu." />
      <PageSection className="max-w-3xl">
        {status === "success" ? (
          <div className="rounded-2xl bg-hover-blue p-8 text-center">
            <p className="text-sm font-medium text-primary">Başvurunuz alındı. Değerlendirme sonrası sizinle iletişime geçeceğiz.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Firma Adı" required>
                <input required value={form.companyName} onChange={update("companyName")} className={inputClass} />
              </FormField>
              <FormField label="Sektör">
                <input value={form.sector} onChange={update("sector")} className={inputClass} />
              </FormField>
              <FormField label="Yetkili Ad Soyad" required>
                <input required value={form.contactName} onChange={update("contactName")} className={inputClass} />
              </FormField>
              <FormField label="E-posta" required>
                <input type="email" required value={form.email} onChange={update("email")} className={inputClass} />
              </FormField>
              <FormField label="Telefon">
                <input value={form.phone} onChange={update("phone")} className={inputClass} />
              </FormField>
            </div>
            <FormField label="Firma Hakkında / Talebiniz" required>
              <textarea required rows={5} value={form.message} onChange={update("message")} className={inputClass} />
            </FormField>

            {error && <p className="text-sm text-accent">{error}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === "submitting" ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </button>
          </form>
        )}
      </PageSection>
    </div>
  );
}
