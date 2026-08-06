import { useState, useEffect } from "react";
import adminAxios from "../../../utils/adminAxios";
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminContactMessagesTab() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get("/contact/messages");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching contact messages", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = async (msg) => {
    const opening = expandedId !== msg.id;
    setExpandedId(opening ? msg.id : null);
    if (opening && !msg.isRead) {
      try {
        await adminAxios.patch(`/contact/messages/${msg.id}/read`);
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
      } catch (error) {
        console.error("Error marking message as read", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      await adminAxios.delete(`/contact/messages/${id}`);
      fetchMessages();
    } catch {
      alert("Mesaj silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <p className="text-sm text-gray-500 max-w-xl">
        İletişim formu üzerinden gönderilen mesajlar burada listelenir.
      </p>

      <div className="border border-gray-100 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="px-6 py-10 text-center text-gray-400">Yükleniyor...</div>
        ) : messages.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500">Henüz mesaj gelmemiş.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div key={msg.id}>
                <button
                  onClick={() => toggleExpand(msg)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors text-left"
                >
                  {msg.isRead ? (
                    <MailOpen className="w-4 h-4 text-gray-300 shrink-0" />
                  ) : (
                    <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate ${msg.isRead ? "text-gray-600" : "font-semibold text-gray-900"}`}>
                      {msg.subject || "(Konusuz)"} — <span className="text-gray-500 font-normal">{msg.fullName}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                  </span>
                  {expandedId === msg.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {expandedId === msg.id && (
                  <div className="px-4 pb-4 pl-11 space-y-2 bg-gray-50/50">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">E-posta:</span> {msg.email}
                      {msg.phone && <> · <span className="font-medium text-gray-800">Telefon:</span> {msg.phone}</>}
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Mesajı Sil
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
