import { useState } from "react";
import AdminAboutTab from "../../components/admin/corporate/AdminAboutTab";
import AdminTeamTab from "../../components/admin/corporate/AdminTeamTab";

const tabs = [
  { key: "about", label: "Hakkımızda" },
  { key: "team", label: "Yönetim ve Ekip" },
];

export default function AdminCorporatePage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8">
        <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Kurumsal Bilgiler</h1>
        <p className="text-gray-500 mt-2 text-sm max-w-xl">
          Hakkımızda metnini ve yönetim/ekip organizasyon şemasını buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#0F172A] text-[#0F172A]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "about" && <AdminAboutTab />}
        {activeTab === "team" && <AdminTeamTab />}
      </div>
    </div>
  );
}
