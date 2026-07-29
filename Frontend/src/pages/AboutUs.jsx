import { useEffect, useState } from "react";
import { getPageContent } from "../api/endpoints";
import PageSection from "../components/common/PageSection";
import AboutContent from "../components/about/AboutContent";

const PAGE_SLUG = "hakkimizda";

export default function AboutUs() {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "not-found" | "error"
  const [page, setPage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setStatus("loading");
    getPageContent(PAGE_SLUG)
      .then((data) => {
        if (cancelled) return;
        setPage(data);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`[AboutUs] "${PAGE_SLUG}" sayfası alınamadı:`, err.response?.status, err.response?.data ?? err.message);
        setStatus(err.response?.status === 404 ? "not-found" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <PageSection className="pt-8 md:pt-14">
        <div className="mx-auto max-w-[760px] animate-pulse space-y-4 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:p-12">
          <div className="h-6 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      </PageSection>
    );
  }

  if (status === "not-found") {
    return (
      <PageSection className="pt-8 md:pt-14">
        <div className="mx-auto max-w-[760px] rounded-3xl border border-dashed border-gray-300 bg-surface py-10 text-center text-sm text-gray-400">
          Bu içerik henüz yayınlanmamış.
        </div>
      </PageSection>
    );
  }

  if (status === "error" || !page) {
    return (
      <PageSection className="pt-8 md:pt-14">
        <div className="mx-auto max-w-[760px] rounded-3xl border border-dashed border-gray-300 bg-surface py-10 text-center text-sm text-gray-400">
          Sayfa içeriği yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection className="pt-8 md:pt-14">
      <AboutContent content={page.content} />
    </PageSection>
  );
}
