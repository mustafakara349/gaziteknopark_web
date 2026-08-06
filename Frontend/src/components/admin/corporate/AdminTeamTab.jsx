import { useState, useEffect } from "react";
import adminAxios from "../../../utils/adminAxios";
import { Plus, Edit2, Trash2, ImageOff } from "lucide-react";
import AdminTeamMemberFormModal from "./AdminTeamMemberFormModal";

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

export default function AdminTeamTab() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/team-members");
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditMember(null);
    setIsFormOpen(true);
  };

  const openEditModal = (member) => {
    setEditMember(member);
    setIsFormOpen(true);
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`"${member.fullName}" kaydını silmek istediğinize emin misiniz?`)) return;
    try {
      await adminAxios.delete(`/team-members/${member.id}`);
      fetchMembers();
    } catch (error) {
      alert(error.response?.data ?? "Silinirken bir hata oluştu.");
    }
  };

  const findParentName = (parentId) => members.find((m) => m.id === parentId)?.fullName;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 max-w-xl">
          Yönetim ve ekip organizasyon şemasında görünen kişi ve birimleri buradan yönetin.
        </p>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yeni Ekle
        </button>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FAFC] text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium w-16">Foto</th>
                <th className="px-6 py-4 font-medium">Ad / Birim</th>
                <th className="px-6 py-4 font-medium">Unvan</th>
                <th className="px-6 py-4 font-medium">Üst Birim</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">Yükleniyor...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Henüz kayıt yok.</td></tr>
              ) : (
                members.map((m) => {
                  const tr = m.translations?.find((t) => t.languageId === 1) || m.translations?.[0];
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                          {m.photoFileId ? (
                            <img src={`${baseUrl}/api/files/${m.photoFileId}`} alt={m.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {m.fullName} {m.isUnit && <span className="text-xs text-blue-500 font-normal">(Birim)</span>}
                      </td>
                      <td className="px-6 py-3 text-gray-600">{tr?.title || "-"}</td>
                      <td className="px-6 py-3 text-gray-500">{findParentName(m.parentId) || "-"}</td>
                      <td className="px-6 py-3">
                        {m.status?.toLowerCase() === "published" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-medium">Yayında</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium">Taslak</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(m)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(m)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminTeamMemberFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editMember={editMember}
        members={members}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchMembers();
        }}
      />
    </div>
  );
}
