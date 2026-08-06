import { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import { useAuth } from "../../context/AuthContext";
import { Plus, Edit2, Trash2, Settings2, ShieldCheck } from "lucide-react";
import AdminUserFormModal from "../../components/admin/users/AdminUserFormModal";
import AdminRoleModal from "../../components/admin/users/AdminRoleModal";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await adminAxios.get("/admin/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };

  const openCreateModal = () => {
    setEditUser(null);
    setIsFormOpen(true);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`${user.name} kullanıcısını silmek istediğinize emin misiniz?`)) return;
    try {
      await adminAxios.delete(`/admin/users/${user.id}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data ?? "Kullanıcı silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Card */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Admin Yönetimi</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            Panel erişimine sahip yöneticileri, rolleri ve yetki seviyelerini buradan belirleyebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Rolleri Yönet
          </button>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Kullanıcı Ekle
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FAFC] text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Ad Soyad</th>
                <th className="px-6 py-4 font-medium">E-posta</th>
                <th className="px-6 py-4 font-medium">Rol</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium">Son Giriş</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    Yükleniyor...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Henüz kullanıcı bulunmuyor.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                      {u.roleName == null && (
                        <ShieldCheck className="w-4 h-4 text-blue-500" title="Tam yetkili yönetici" />
                      )}
                      {u.name}
                      {u.id === currentUser?.id && (
                        <span className="text-xs text-gray-400 font-normal">(Siz)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-gray-600">{u.roleName ?? "Admin"}</td>
                    <td className="px-6 py-4">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {u.lastLoginAt
                        ? new Date(u.lastLoginAt).toLocaleDateString("tr-TR", {
                            day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={u.id === currentUser?.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AdminUserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editUser={editUser}
        roles={roles}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchUsers();
        }}
      />

      <AdminRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onChanged={fetchRoles}
      />
    </div>
  );
}
