import { useState, useEffect, useRef } from "react";
import adminAxios from "../../../utils/adminAxios";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Rocket,
  Save,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Copy,
  X,
  GraduationCap,
  Building,
  Lightbulb,
  Award,
  Zap,
  Target,
  Users,
  CheckCircle2,
  Upload,
  ImagePlus,
} from "lucide-react";
import RichTextEditor from "../../../components/admin/common/RichTextEditor";

const baseUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5080";

const AVAILABLE_ICONS = [
  { name: "Rocket", label: "Roket (Start-up / Girişim)", Icon: Rocket },
  { name: "GraduationCap", label: "Kep (Akademik / Eğitim)", Icon: GraduationCap },
  { name: "Building", label: "Bina (Kurumsal / Ofis)", Icon: Building },
  { name: "Lightbulb", label: "Ampul (Fikir / İnovasyon)", Icon: Lightbulb },
  { name: "Award", label: "Ödül (Başarı / Program)", Icon: Award },
  { name: "Zap", label: "Hızlı Yıldırım (Ön Kuluçka)", Icon: Zap },
  { name: "Target", label: "Hedef (Hızlandırma)", Icon: Target },
  { name: "Users", label: "Kullanıcılar (Topluluk / Ekip)", Icon: Users },
];

export default function AdminCorporateInitiativePage() {
  const [officeData, setOfficeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const imageInputRef = useRef(null);

  // General Office Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Published");
  const [imageFileId, setImageFileId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [generalMessage, setGeneralMessage] = useState("");

  // Incubator Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncubator, setEditingIncubator] = useState(null);
  const [incTitle, setIncTitle] = useState("");
  const [incSubtitle, setIncSubtitle] = useState("");
  const [incIcon, setIncIcon] = useState("Rocket");
  const [incOrderIndex, setIncOrderIndex] = useState(1);
  const [incStatus, setIncStatus] = useState("Published");
  const [incDescription, setIncDescription] = useState("");
  const [incFeatures, setIncFeatures] = useState("");
  const [isSavingIncubator, setIsSavingIncubator] = useState(false);

  useEffect(() => {
    fetchOfficeData();
  }, []);

  const fetchOfficeData = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/initiative-office");
      const list = response.data;
      if (list && list.length > 0) {
        const item = list[0];
        setOfficeData(item);
        setTitle(item.title || "Girişim Ofisi");
        setContent(item.content || "");
        setStatus(item.status || "Published");
        setImageFileId(item.imageFileId || null);
        setImageUrl(item.imageUrl || null);
      } else {
        setTitle("Girişim Ofisi");
        setContent("");
        setStatus("Published");
        setImageFileId(null);
        setImageUrl(null);
        setOfficeData(null);
      }
    } catch (error) {
      console.error("Girişim ofisi bilgileri yüklenirken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Görsel Yükleme İşlemi ---
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await adminAxios.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newFileId = response.data.id;
      const newUrl = response.data.url || response.data.path;
      setImageFileId(newFileId);
      setImageUrl(newUrl);
    } catch (error) {
      console.error("Görsel yüklenirken hata oluştu:", error);
      alert("Görsel yüklenirken bir hata oluştu.");
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFileId(null);
    setImageUrl(null);
  };

  const getFullImageUrl = (path, fileId) => {
    if (path) {
      if (path.startsWith("http")) return path;
      return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    }
    if (fileId) {
      return `${baseUrl}/api/files/${fileId}`;
    }
    return null;
  };

  // --- 1. Kaydet: Genel Bilgiler ---
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setIsSavingGeneral(true);
    setGeneralMessage("");
    try {
      const payload = {
        imageFileId: imageFileId || null,
        status: status,
        title: title,
        content: content,
        translations: [
          {
            languageId: 1,
            title: title,
            content: content,
          },
        ],
        incubators: (officeData?.incubators || []).map((inc) => ({
          id: inc.id,
          icon: inc.icon,
          orderIndex: inc.orderIndex,
          status: inc.status,
          title: inc.title,
          subtitle: inc.subtitle,
          description: inc.description,
          features: inc.features,
          translations: [
            {
              languageId: 1,
              title: inc.title,
              subtitle: inc.subtitle,
              description: inc.description,
              features: inc.features,
            },
          ],
        })),
      };

      let response;
      if (officeData?.id) {
        response = await adminAxios.put(`/initiative-office/${officeData.id}`, payload);
      } else {
        response = await adminAxios.post("/initiative-office", payload);
      }

      setOfficeData(response.data);
      setImageFileId(response.data.imageFileId);
      setImageUrl(response.data.imageUrl);
      setGeneralMessage("Genel bilgiler ve görsel başarıyla kaydedildi.");
    } catch (error) {
      console.error("Genel bilgiler kaydedilirken hata oluştu:", error);
      setGeneralMessage("Kaydedilirken bir hata oluştu.");
    } finally {
      setIsSavingGeneral(false);
      setTimeout(() => setGeneralMessage(""), 3500);
    }
  };

  // --- 2. Modal Aç: Yeni Kuluçka Ekle ---
  const openCreateModal = () => {
    setEditingIncubator(null);
    setIncTitle("");
    setIncSubtitle("");
    setIncIcon("Rocket");
    setIncOrderIndex((officeData?.incubators?.length || 0) + 1);
    setIncStatus("Published");
    setIncDescription("");
    setIncFeatures("");
    setIsModalOpen(true);
  };

  // --- 3. Modal Aç: Düzenle ---
  const openEditModal = (inc) => {
    setEditingIncubator(inc);
    setIncTitle(inc.title || "");
    setIncSubtitle(inc.subtitle || "");
    setIncIcon(inc.icon || "Rocket");
    setIncOrderIndex(inc.orderIndex || 1);
    setIncStatus(inc.status || "Published");
    setIncDescription(inc.description || "");
    setIncFeatures(inc.features || "");
    setIsModalOpen(true);
  };

  // --- 4. Kopyala ---
  const handleDuplicate = async (inc) => {
    if (!officeData?.id) {
      alert("Lütfen önce genel bilgileri kaydediniz.");
      return;
    }

    const currentIncubators = officeData.incubators || [];
    const newIncubator = {
      icon: inc.icon,
      orderIndex: currentIncubators.length + 1,
      status: inc.status,
      title: `${inc.title} (Kopya)`,
      subtitle: inc.subtitle,
      description: inc.description,
      features: inc.features,
      translations: [
        {
          languageId: 1,
          title: `${inc.title} (Kopya)`,
          subtitle: inc.subtitle,
          description: inc.description,
          features: inc.features,
        },
      ],
    };

    const updatedIncubators = [...currentIncubators, newIncubator];
    await saveFullOfficeWithIncubators(updatedIncubators);
  };

  // --- 5. Sil ---
  const handleDeleteIncubator = async (inc) => {
    if (!window.confirm(`"${inc.title}" kuluçka merkezini silmek istediğinize emin misiniz?`)) return;

    const currentIncubators = officeData?.incubators || [];
    const updatedIncubators = currentIncubators.filter((item) => item.id !== inc.id);
    await saveFullOfficeWithIncubators(updatedIncubators);
  };

  // --- 6. Modal İçinde Kaydet ---
  const handleSaveIncubator = async (e) => {
    e.preventDefault();
    if (!incTitle.trim()) {
      alert("Lütfen bir başlık giriniz.");
      return;
    }

    setIsSavingIncubator(true);
    try {
      const currentIncubators = officeData?.incubators || [];
      let updatedIncubators = [];

      const incubatorPayload = {
        id: editingIncubator ? editingIncubator.id : undefined,
        icon: incIcon,
        orderIndex: Number(incOrderIndex),
        status: incStatus,
        title: incTitle,
        subtitle: incSubtitle,
        description: incDescription,
        features: incFeatures,
        translations: [
          {
            languageId: 1,
            title: incTitle,
            subtitle: incSubtitle,
            description: incDescription,
            features: incFeatures,
          },
        ],
      };

      if (editingIncubator) {
        updatedIncubators = currentIncubators.map((item) =>
          item.id === editingIncubator.id ? { ...item, ...incubatorPayload } : item
        );
      } else {
        updatedIncubators = [...currentIncubators, incubatorPayload];
      }

      await saveFullOfficeWithIncubators(updatedIncubators);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Kuluçka merkezi kaydedilirken hata oluştu:", error);
      alert("Kaydedilirken bir hata oluştu.");
    } finally {
      setIsSavingIncubator(false);
    }
  };

  // Yardımcı Kaydetme Fonksiyonu
  const saveFullOfficeWithIncubators = async (incubatorList) => {
    const payload = {
      imageFileId: imageFileId || null,
      status: status,
      title: title || "Girişim Ofisi",
      content: content || "",
      translations: [
        {
          languageId: 1,
          title: title || "Girişim Ofisi",
          content: content || "",
        },
      ],
      incubators: incubatorList.map((inc) => ({
        id: inc.id,
        icon: inc.icon,
        orderIndex: Number(inc.orderIndex),
        status: inc.status,
        title: inc.title,
        subtitle: inc.subtitle,
        description: inc.description,
        features: inc.features,
        translations: [
          {
            languageId: 1,
            title: inc.title,
            subtitle: inc.subtitle,
            description: inc.description,
            features: inc.features,
          },
        ],
      })),
    };

    let response;
    if (officeData?.id) {
      response = await adminAxios.put(`/initiative-office/${officeData.id}`, payload);
    } else {
      response = await adminAxios.post("/initiative-office", payload);
    }

    setOfficeData(response.data);
    setImageFileId(response.data.imageFileId);
    setImageUrl(response.data.imageUrl);
  };

  // İkon Çizici
  const renderIcon = (iconName) => {
    const matched = AVAILABLE_ICONS.find((i) => i.name === iconName);
    const IconComp = matched ? matched.Icon : Rocket;
    return <IconComp className="w-5 h-5 text-blue-600" />;
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400 max-w-[1400px] mx-auto">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Sayfa Başlığı ve Geri Dönüş */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/kurumsal"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
              title="Kurumsal Bilgiler Ana Sayfasına Dön"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Rocket className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Girişim Ofisi Yönetimi
            </h1>
          </div>
          <p className="text-gray-500 mt-2 text-sm max-w-xl">
            Gazi Teknopark Girişim Ofisi genel tanıtım bilgilerini, kapak görselini ve kuluçka merkezlerini buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      {/* SECTION 1: Genel Bilgiler ve Görsel */}
      <form onSubmit={handleSaveGeneral} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>Genel Tanıtım Bilgileri ve Görsel</span>
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Yayın Durumu:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Published">Yayında</option>
              <option value="Draft">Taslak</option>
            </select>
          </div>
        </div>

        {/* Görsel Yükleme Alanı */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Sayfa Kapak Görseli / Resim</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 bg-gray-50/50 border border-gray-200/80 rounded-2xl">
            {getFullImageUrl(imageUrl, imageFileId) ? (
              <div className="relative w-52 aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-white group shrink-0 shadow-xs">
                <img
                  src={getFullImageUrl(imageUrl, imageFileId)}
                  alt="Girişim Ofisi Kapak Görseli"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-md"
                  title="Görseli Kaldır"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-52 aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center text-gray-400 p-4 text-center shrink-0">
                <ImagePlus className="w-7 h-7 mb-1 text-gray-400" />
                <span className="text-xs font-medium leading-tight text-gray-500">Görsel Yüklenmedi</span>
              </div>
            )}

            <div className="space-y-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploadingImage}
                onClick={() => imageInputRef.current?.click()}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Upload className="w-4 h-4 text-blue-600" />}
                {isUploadingImage ? "Görsel Yükleniyor..." : (imageFileId || imageUrl) ? "Görseli Değiştir" : "Görsel Yükle"}
              </button>
              <p className="text-[11px] text-gray-400 max-w-sm">
                Girişim Ofisi sayfasının üst kısmında sergilenecek kapak resmini buradan değiştirebilirsiniz. (PNG, JPG, WEBP)
              </p>
            </div>
          </div>
        </div>



        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Genel Tanıtım ve Açıklama Metni</label>
          <RichTextEditor value={content} onChange={setContent} placeholder="Girişim ofisi hakkında genel tanıtım ve vizyon metni..." />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSavingGeneral}
            className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSavingGeneral ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSavingGeneral ? "Kaydediliyor..." : "Genel Bilgileri Kaydet"}
          </button>
          {generalMessage && <span className="text-sm font-medium text-emerald-600">{generalMessage}</span>}
        </div>
      </form>

      {/* SECTION 2: Kuluçka Merkezleri ve Programları */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Kuluçka Merkezleri ve Programları</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Farklı hedef kitlelere yönelik kuluçka merkezlerini ekleyin ve yönetin.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Yeni Kuluçka Ekle
          </button>
        </div>

        {/* Kuluçka Listesi Tablosu */}
        {(!officeData?.incubators || officeData.incubators.length === 0) ? (
          <div className="p-10 text-center text-gray-500 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            Henüz eklenmiş bir kuluçka merkezi bulunmamaktadır. "Yeni Kuluçka Ekle" butonuna tıklayarak ekleyebilirsiniz.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-[#F8FAFC] text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3.5 font-medium w-12 text-center">Sıra</th>
                  <th className="px-5 py-3.5 font-medium w-16 text-center">İkon</th>
                  <th className="px-5 py-3.5 font-medium">Kuluçka Adı / Alt Başlık</th>
                  <th className="px-5 py-3.5 font-medium">Açıklama & Özellikler</th>
                  <th className="px-5 py-3.5 font-medium">Durum</th>
                  <th className="px-5 py-3.5 font-medium text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {officeData.incubators.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-500 text-center">{inc.orderIndex}</td>
                    <td className="px-5 py-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
                        {renderIcon(inc.icon)}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-normal min-w-[220px]">
                      <div className="font-bold text-gray-900 text-sm">{inc.title || "-"}</div>
                      {inc.subtitle && <div className="text-xs text-blue-600 font-medium mt-0.5">{inc.subtitle}</div>}
                    </td>
                    <td className="px-5 py-4 whitespace-normal max-w-sm">
                      <p className="text-xs text-gray-600 line-clamp-2 mb-1">{inc.description || "-"}</p>
                      {inc.features && (
                        <div className="flex flex-wrap gap-1">
                          {inc.features.split("\n").filter(Boolean).map((feat, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {inc.status?.toLowerCase() === "published" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          Yayında
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                          Taslak
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(inc)}
                          className="px-2.5 py-1.5 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium flex items-center gap-1"
                          title="Düzenle"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Düzenle
                        </button>
                        <button
                          onClick={() => handleDuplicate(inc)}
                          className="px-2.5 py-1.5 text-xs text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition font-medium flex items-center gap-1"
                          title="Kopyala"
                        >
                          <Copy className="w-3.5 h-3.5" /> Kopyala
                        </button>
                        <button
                          onClick={() => handleDeleteIncubator(inc)}
                          className="px-2.5 py-1.5 text-xs text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition font-medium flex items-center gap-1"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* KULUÇKA EKLE / DÜZENLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingIncubator ? "Kuluçka Merkezi Düzenle" : "Yeni Kuluçka Merkezi Ekle"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIncubator} className="p-6 space-y-4">
              {/* Başlık ve Alt Başlık */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Kuluçka Başlığı</label>
                  <input
                    type="text"
                    value={incTitle}
                    onChange={(e) => setIncTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: Anahtar Kuluçka Merkezi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Alt Başlık / Kategori</label>
                  <input
                    type="text"
                    value={incSubtitle}
                    onChange={(e) => setIncSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: Girişimciler & Yenilikçi Projeler"
                  />
                </div>
              </div>

              {/* İkon Seçici, Sıra ve Durum */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">İkon</label>
                  <select
                    value={incIcon}
                    onChange={(e) => setIncIcon(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {AVAILABLE_ICONS.map((i) => (
                      <option key={i.name} value={i.name}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Sıra No</label>
                  <input
                    type="number"
                    value={incOrderIndex}
                    onChange={(e) => setIncOrderIndex(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Durum</label>
                  <select
                    value={incStatus}
                    onChange={(e) => setIncStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Published">Yayında</option>
                    <option value="Draft">Taslak</option>
                  </select>
                </div>
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Açıklama</label>
                <textarea
                  rows="3"
                  value={incDescription}
                  onChange={(e) => setIncDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Erken aşama teknoloji girişimcilerine, öğrencilere sunulan imkanlar..."
                />
              </div>

              {/* Özellikler (Satır Satır) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Sunduğu Destek ve Özellikler (Her satıra bir özellik yazın)
                </label>
                <textarea
                  rows="3"
                  value={incFeatures}
                  onChange={(e) => setIncFeatures(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                  placeholder={"Prototipleme ve altyapı kullanım desteği\nTÜBİTAK BIGG yönlendirmesi\nMentörlük desteği"}
                />
              </div>

              {/* Alt Butonlar */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSavingIncubator}
                  className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingIncubator ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
