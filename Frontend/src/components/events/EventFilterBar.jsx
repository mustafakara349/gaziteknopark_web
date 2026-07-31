import { SearchIcon, ChevronDownIcon } from "../common/icons";
import { inputClass } from "../common/FormField";

const WHEN_OPTIONS = [
  { value: "all", label: "Tümü" },
  { value: "upcoming", label: "Yaklaşan" },
  { value: "past", label: "Geçmiş" }
];

export default function EventFilterBar({
  when,
  setWhen,
  search,
  setSearch,
  sort,
  setSort
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
      {/* Zaman Durumu Filtresi: native radio grubu, tam klavye ve ekran okuyucu desteği */}
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="sr-only">Zaman durumuna göre filtrele</legend>
        {WHEN_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 ${
              when === opt.value
                ? "border-primary bg-primary text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="event-when"
              value={opt.value}
              checked={when === opt.value}
              onChange={(e) => setWhen(e.target.value)}
              className="sr-only"
            />
            {opt.label}
          </label>
        ))}
      </fieldset>

      <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
        {/* Arama */}
        <div className="relative w-full sm:w-64">
          <label htmlFor="event-search" className="sr-only">
            Etkinlik ara
          </label>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            id="event-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Etkinlik ara..."
            className={`${inputClass} pl-10`}
          />
        </div>

        {/* Sıralama */}
        <div className="relative w-full sm:w-56">
          <label htmlFor="event-sort" className="sr-only">
            Sıralama
          </label>
          <select
            id="event-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={`${inputClass} pr-10 appearance-none bg-white cursor-pointer`}
          >
            <option value="date_asc">Tarih (Yakından Uzağa)</option>
            <option value="date_desc">Tarih (Uzaktan Yakına)</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
            <ChevronDownIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
