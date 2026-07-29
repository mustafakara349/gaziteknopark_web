import { useEffect } from "react";
import PageSection from "../components/common/PageSection";

const EXTERNAL_FORM_URL = "https://argeportal.gaziteknopark.com.tr/onbasvuruformu";

export default function CompanyApplicationPage() {
  useEffect(() => {
    // Automatically attempt to open the external portal in a new tab
    window.open(EXTERNAL_FORM_URL, "_blank");
  }, []);

  return (
    <div>
      <PageSection className="max-w-2xl">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-hover-blue text-primary">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>

          <h2 className="mt-6 text-xl font-bold text-gray-800">
            Ar-Ge Portalı Ön Başvuru Sayfası
          </h2>

          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            Firma ön başvuru işlemleriniz için Gazi Teknopark Ar-Ge Portalı başvuru formuna yönlendiriliyorsunuz. Yeni sekme açılmadıysa aşağıdaki butona tıklayabilirsiniz.
          </p>

          <div className="mt-8">
            <a
              href={EXTERNAL_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-md"
            >
              Başvuru Formunu Yeni Sekmede Aç
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
