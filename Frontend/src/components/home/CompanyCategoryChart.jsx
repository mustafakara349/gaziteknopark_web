import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getCompanies, getCompanyCategories } from "../../api/endpoints";
import { pickTranslation } from "../../utils/i18n";
import SectionTitle from "../common/SectionTitle";
import EmptyState from "../common/EmptyState";

// Categorical palette validated with scripts/validate_palette.js (light mode, all checks pass)
const CATEGORY_COLORS = ["#2E5C94", "#E30613", "#1F9E7C", "#C08A1E", "#7B4FA6"];
const OTHER_COLOR = "#9CA3AF";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg bg-white px-3 py-2 text-sm shadow-lg ring-1 ring-black/5">
      <p className="font-semibold text-[#333]">{item.value} firma</p>
      <p className="text-xs text-gray-500">{item.name}</p>
    </div>
  );
}

export default function CompanyCategoryChart() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCompanies().then(setCompanies).catch(() => setCompanies([]));
    getCompanyCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const data = useMemo(() => {
    if (!categories.length || !companies.length) return [];
    const counts = categories.map((cat) => ({
      name: pickTranslation(cat).name ?? "Kategori",
      value: companies.filter((c) => c.categoryIds?.includes(cat.id)).length,
    })).filter((d) => d.value > 0);

    counts.sort((a, b) => b.value - a.value);

    if (counts.length <= 6) return counts;
    const top = counts.slice(0, 5);
    const otherTotal = counts.slice(5).reduce((sum, d) => sum + d.value, 0);
    return [...top, { name: "Diğer", value: otherTotal }];
  }, [categories, companies]);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <SectionTitle title="Firma Kategorileri" />
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col items-center gap-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:p-8">
          <div className="h-64 w-64 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="95%"
                  paddingAngle={data.length > 1 ? 2 : 0}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={entry.name === "Diğer" ? OTHER_COLOR : CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="w-full space-y-3">
            {data.map((entry, index) => (
              <li key={entry.name} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-[#333]">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        entry.name === "Diğer" ? OTHER_COLOR : CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                    }}
                  />
                  {entry.name}
                </span>
                <span className="font-semibold text-gray-500">
                  {entry.value} · %{Math.round((entry.value / total) * 100)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
