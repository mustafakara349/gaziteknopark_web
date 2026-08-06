import { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, ImageOff } from "lucide-react";
import AdminSliderFormModal from "../../components/admin/home/AdminSliderFormModal";

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

export default function AdminHomePage() {
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSlider, setEditSlider] = useState(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/sliders", { params: { activeOnly: false } });
      setSliders(response.data.sort((a, b) => a.orderNo - b.orderNo));
    } catch (error) {
      console.error("Error fetching sliders", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditSlider(null);
    setIsFormOpen(true);
  };

  const openEditModal = (slider) => {
    setEditSlider(slider);
    setIsFormOpen(true);
  };

  const handleDelete = async (slider) => {
    if (!window.confirm("Bu slaytı silmek istediğinize emin misiniz?")) return;
    try {
      await adminAxios.delete(`/sliders/${slider.id}`);
      fetchSliders();
    } catch (error) {
      console.error("Error deleting slider", error);
      alert("Slayt silinirken bir hata oluştu.");
    }
  };

  const toPayload = (slider) => ({
    imageFileId: slider.imageFileId,
    linkUrl: slider.linkUrl,
    orderNo: slider.orderNo,
    isActive: slider.isActive,
    translations: slider.translations?.length
      ? slider.translations.map((t) => ({
          languageId: t.languageId,
          title: t.title,
          description: t.description,
          buttonText: t.buttonText,
        }))
      : [{ languageId: 1, title: null, description: null, buttonText: null }],
  });

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sliders.length) return;

    const current = sliders[index];
    const target = sliders[targetIndex];

    try {
      await Promise.all([
        adminAxios.put(`/sliders/${current.id}`, { ...toPayload(current), orderNo: target.orderNo }),
        adminAxios.put(`/sliders/${target.id}`, { ...toPayload(target), orderNo: current.orderNo }),
      ]);
      fetchSliders();
    } catch (error) {
      console.error("Error reordering sliders", error);
      alert("Sıralama değiştirilirken bir hata oluştu.");
    }
  };

  const toggleActive = async (slider) => {
    try {
      await adminAxios.put(`/sliders/${slider.id}`, { ...toPayload(slider), isActive: !slider.isActive });
      fetchSliders();
    } catch (error) {
      console.error("Error toggling slider", error);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Anasayfa Yönetimi</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            Anasayfadaki hero slider'ın görsellerini, başlıklarını ve sırasını buradan yönetebilirsiniz.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yeni Slayt Ekle
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FAFC] text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium w-16">Sıra</th>
                <th className="px-6 py-4 font-medium w-28">Görsel</th>
                <th className="px-6 py-4 font-medium">Başlık</th>
                <th className="px-6 py-4 font-medium">Bağlantı</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">Yükleniyor...</td>
                </tr>
              ) : sliders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Henüz slayt eklenmemiş. Eklenene kadar anasayfada varsayılan görseller gösterilir.
                  </td>
                </tr>
              ) : (
                sliders.map((slider, index) => {
                  const tr = slider.translations?.find((t) => t.languageId === 1) || slider.translations?.[0];
                  return (
                    <tr key={slider.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleMove(index, -1)}
                            disabled={index === 0}
                            className="text-gray-300 hover:text-gray-700 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(index, 1)}
                            disabled={index === sliders.length - 1}
                            className="text-gray-300 hover:text-gray-700 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                          {slider.imageFileId ? (
                            <img
                              src={`${baseUrl}/api/files/${slider.imageFileId}`}
                              alt={tr?.title || "Slayt"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageOff className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-xs">
                        {tr?.title || <span className="text-gray-400 font-normal">(Başlıksız)</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">
                        {slider.linkUrl || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => toggleActive(slider)}>
                          {slider.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Yayında
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                              Pasif
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(slider)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(slider)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
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

      <AdminSliderFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editSlider={editSlider}
        nextOrderNo={sliders.length ? Math.max(...sliders.map((s) => s.orderNo)) + 1 : 0}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchSliders();
        }}
      />
    </div>
  );
}
