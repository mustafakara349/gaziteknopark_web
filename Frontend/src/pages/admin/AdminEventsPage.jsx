import { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import { Plus, Eye, Edit2, Trash2, MapPin, ImageOff } from "lucide-react";
import AdminEventFormModal from "../../components/admin/events/AdminEventFormModal";

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setIsFormOpen(true);
  };

  const openEditModal = (id) => {
    setEditId(id);
    setIsFormOpen(true);
  };

  const handleDelete = async (ev) => {
    if (!window.confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
    try {
      await adminAxios.delete(`/events/${ev.id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event", error);
      alert("Etkinlik silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Etkinlik Yönetimi</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            Etkinlik ekleme, düzenleme ve silme işlemlerini buradan gerçekleştirebilirsiniz.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yeni Etkinlik Ekle
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FAFC] text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium w-16">Afiş</th>
                <th className="px-6 py-4 font-medium">Başlık</th>
                <th className="px-6 py-4 font-medium">Konum</th>
                <th className="px-6 py-4 font-medium">Başlangıç</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">Yükleniyor...</td></tr>
              ) : events.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Henüz etkinlik eklenmemiş.</td></tr>
              ) : (
                events.map((ev) => {
                  const tr = ev.translations?.find((t) => t.languageId === 1) || ev.translations?.[0];
                  return (
                    <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                          {ev.coverImageFileId ? (
                            <img src={`${baseUrl}/api/files/${ev.coverImageFileId}`} alt={tr?.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-xs sm:max-w-md">
                        {tr?.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {tr?.location ? (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {tr.location}
                          </span>
                        ) : "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {ev.startDate
                          ? new Date(ev.startDate).toLocaleDateString("tr-TR", {
                              day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {ev.status?.toLowerCase() === "published" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Yayında
                          </span>
                        ) : ev.status?.toLowerCase() === "draft" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                            Taslak
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                            Arşiv
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => window.open(`/etkinlikler/${tr?.slug}`, "_blank")}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Görüntüle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(ev.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ev)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
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

      <AdminEventFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editId={editId}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchEvents();
        }}
      />
    </div>
  );
}
