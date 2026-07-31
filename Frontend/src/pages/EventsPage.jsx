import { useEffect, useMemo, useState } from "react";
import { getEventsList } from "../api/endpoints";
import PageSection from "../components/common/PageSection";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import EventFilterBar from "../components/events/EventFilterBar";
import EventCard from "../components/events/EventCard";

const PAGE_SIZE = 9;
const SEARCH_DEBOUNCE_MS = 400;

function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm animate-pulse">
      <div className="aspect-square w-full bg-gray-200" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-2/3 rounded bg-gray-200" />
        <div className="mt-auto h-9 w-full rounded-full bg-gray-100" />
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date_asc");
  const [page, setPage] = useState(1);

  const [status, setStatus] = useState("loading");
  const [result, setResult] = useState({ items: [], page: 1, pageSize: PAGE_SIZE, totalItems: 0, totalPages: 0 });

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, category]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    getEventsList({ page, pageSize: PAGE_SIZE, search: debouncedSearch || undefined, sort })
      .then((data) => {
        if (cancelled) return;
        setResult(data);
        setStatus("success");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, sort]);

  const categories = useMemo(
    () => [...new Set(result.items.map((e) => e.category).filter(Boolean))],
    [result.items]
  );

  const visibleItems = category ? result.items.filter((e) => e.category === category) : result.items;

  return (
    <PageSection className="pt-8 md:pt-14">
      <EventFilterBar
        categories={categories}
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />

      {status === "loading" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {status === "error" && (
        <EmptyState message="Etkinlikler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin." />
      )}

      {status === "success" && visibleItems.length === 0 && (
        <EmptyState message="Arama ve filtreleme kriterlerinize uygun etkinlik bulunamadı." />
      )}

      {status === "success" && visibleItems.length > 0 && (
        <>
          <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {visibleItems.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      )}
    </PageSection>
  );
}
