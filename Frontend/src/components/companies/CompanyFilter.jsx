import { SearchIcon, ChevronDownIcon } from "../common/icons";
import { inputClass } from "../common/FormField";
import { pickTranslation } from "../../utils/i18n";

export default function CompanyFilter({
  search,
  setSearch,
  selectedSector,
  setSelectedSector,
  selectedActivity,
  setSelectedActivity,
  categories,
  activityAreas
}) {
  const hasActiveFilters = search || selectedSector || selectedActivity;

  const handleClear = () => {
    setSearch("");
    setSelectedSector("");
    setSelectedActivity("");
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Arama Alanı */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Firma adı ile ara..."
            className={`${inputClass} pl-10`}
          />
        </div>

        {/* Sektör Filtresi */}
        <div className="relative">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className={`${inputClass} pr-10 appearance-none bg-white cursor-pointer`}
          >
            <option value="">Tüm Sektörler</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {pickTranslation(cat).name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
            <ChevronDownIcon className="h-4 w-4" />
          </span>
        </div>

        {/* Faaliyet Alanı Filtresi */}
        <div className="relative">
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className={`${inputClass} pr-10 appearance-none bg-white cursor-pointer`}
          >
            <option value="">Tüm Faaliyet Alanları</option>
            {activityAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {pickTranslation(area).name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
            <ChevronDownIcon className="h-4 w-4" />
          </span>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end animate-slide-down">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 cursor-pointer"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
}
