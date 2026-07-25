import { useState } from "react";
import { submitInternshipApplication } from "../api/endpoints";
import PageHeader from "../components/common/PageHeader";
import PageSection from "../components/common/PageSection";
import FormField, { inputClass } from "../components/common/FormField";

const initialForm = {
  fullName: "",
  identityNo: "",
  email: "",
  phone: "",
  university: "",
  department: "",
  classYear: "",
  startDate: "",
  endDate: "",
  coverLetter: "",
};

export default function InternshipApplicationPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await submitInternshipApplication({
        ...form,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
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
      <PageHeader title="Staj Başvurusu" subtitle="Gazi Teknopark'ta staj yapmak için formu doldurun." />
      <PageSection className="max-w-3xl">
        {status === "success" ? (
          <div className="rounded-2xl bg-hover-blue p-8 text-center">
            <p className="text-sm font-medium text-primary">Başvurunuz alındı. En kısa sürede sizinle iletişime geçeceğiz.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Ad Soyad" required>
                <input required value={form.fullName} onChange={update("fullName")} className={inputClass} />
              </FormField>
              <FormField label="T.C. Kimlik No">
                <input value={form.identityNo} onChange={update("identityNo")} className={inputClass} maxLength={11} />
              </FormField>
              <FormField label="E-posta" required>
                <input type="email" required value={form.email} onChange={update("email")} className={inputClass} />
              </FormField>
              <FormField label="Telefon">
                <input value={form.phone} onChange={update("phone")} className={inputClass} />
              </FormField>
              <FormField label="Üniversite">
                <input value={form.university} onChange={update("university")} className={inputClass} />
              </FormField>
              <FormField label="Bölüm">
                <input value={form.department} onChange={update("department")} className={inputClass} />
              </FormField>
              <FormField label="Sınıf">
                <input value={form.classYear} onChange={update("classYear")} className={inputClass} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Başlangıç">
                  <input type="date" value={form.startDate} onChange={update("startDate")} className={inputClass} />
                </FormField>
                <FormField label="Bitiş">
                  <input type="date" value={form.endDate} onChange={update("endDate")} className={inputClass} />
                </FormField>
              </div>
            </div>
            <FormField label="Ön Yazı">
              <textarea rows={4} value={form.coverLetter} onChange={update("coverLetter")} className={inputClass} />
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
