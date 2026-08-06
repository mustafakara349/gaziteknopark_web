import { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import { Plus, Edit2, Trash2, Settings2, ImageOff, Video } from "lucide-react";
import AdminMediaAlbumModal from "../../components/admin/media/AdminMediaAlbumModal";
import AdminMediaItemFormModal from "../../components/admin/media/AdminMediaItemFormModal";

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

export default function AdminMediaPage() {
  const [items, setItems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [albumFilter, setAlbumFilter] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [albumFilter]);

  const fetchAlbums = async () => {
    try {
      const response = await adminAxios.get("/media-albums", { params: { activeOnly: false } });
      setAlbums(response.data);
    } catch (error) {
      console.error("Error fetching media albums", error);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const params = { activeOnly: false, ...(albumFilter && { albumId: albumFilter }) };
      const response = await adminAxios.get("/media", { params });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching media items", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditItem(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Bu medyayı silmek istediğinize emin misiniz?")) return;
    try {
      await adminAxios.delete(`/media/${item.id}`);
      fetchItems();
    } catch {
      alert("Silinirken bir hata oluştu.");
    }
  };

  const findAlbumTitle = (albumId) => {
    const album = albums.find((a) => a.id === albumId);
    const tr = album?.translations?.find((t) => t.languageId === 1) || album?.translations?.[0];
    return tr?.title;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Medya Galeri</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            Fotoğraf ve videoları albümler halinde buradan yönetebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAlbumModalOpen(true)}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Albümleri Yönet
          </button>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Medya Ekle
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-wrap gap-4 items-center bg-gray-50/50 border-b border-gray-100">
          <select
            value={albumFilter}
            onChange={(e) => setAlbumFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="">Tüm Albümler</option>
            {albums.map((album) => {
              const tr = album.translations?.find((t) => t.languageId === 1) || album.translations?.[0];
              return <option key={album.id} value={album.id}>{tr?.title}</option>;
            })}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FAFC] text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium w-16">Önizleme</th>
                <th className="px-6 py-4 font-medium">Başlık</th>
                <th className="px-6 py-4 font-medium">Tür</th>
                <th className="px-6 py-4 font-medium">Albüm</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">Yükleniyor...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Henüz medya eklenmemiş.</td></tr>
              ) : (
                items.map((item) => {
                  const tr = item.translations?.find((t) => t.languageId === 1) || item.translations?.[0];
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                          {item.type === "Foto" && item.fileId ? (
                            <img src={`${baseUrl}/api/files/${item.fileId}`} alt={tr?.title || ""} className="w-full h-full object-cover" />
                          ) : item.type === "Video" ? (
                            <Video className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ImageOff className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-xs">
                        {tr?.title || <span className="text-gray-400 font-normal">(Başlıksız)</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.type === "Foto" ? "Fotoğraf" : "Video"}</td>
                      <td className="px-6 py-4 text-gray-600">{findAlbumTitle(item.albumId) || "-"}</td>
                      <td className="px-6 py-4">
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-medium">Yayında</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium">Pasif</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      <AdminMediaItemFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editItem={editItem}
        albums={albums}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchItems();
        }}
      />

      <AdminMediaAlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        onChanged={fetchAlbums}
      />
    </div>
  );
}
