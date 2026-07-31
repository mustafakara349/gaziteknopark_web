import { SearchIcon, ChevronDownIcon } from "../common/icons";
import { inputClass } from "../common/FormField";

export default function EventFilterBar({
  categories,
  category,
  setCategory,
  search,
  setSearch,
  sort,
  setSort
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
      {/* Kategori Filtresi */}
      <div className="relative w-full md:w-56">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${inputClass} pr-10 appearance-none bg-white cursor-pointer`}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
        {/* Arama */}
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Etkinlik ara..."
            className={`${inputClass} pl-10`}
          />
        </div>

        {/* Sıralama */}
        <div className="relative w-full sm:w-56">
          <select
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
