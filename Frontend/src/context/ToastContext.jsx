/**
 * ToastContext.jsx
 * ─────────────────────────────────────────────────────────────────────────
 * Siteye global toast/notification sistemi sağlar.
 *
 * Kullanım:
 *   import { useToast } from "@/context/ToastContext";
 *
 *   const toast = useToast();
 *   toast.success("İşlem başarıyla tamamlandı!");
 *   toast.error("Bir hata oluştu.");
 *   toast.warning("Dikkat: Bu işlem geri alınamaz.");
 *   toast.info("Bilgi: Değişiklikler kaydedildi.");
 *
 * Opsiyonlar:
 *   toast.success("Mesaj", { duration: 5000 });   // ms cinsinden süre (varsayılan: 4000)
 *   toast.success("Mesaj", { title: "Başlık" });   // özel başlık
 * ─────────────────────────────────────────────────────────────────────────
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ToastContext = createContext(null);

let _toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  // Map of toastId → timeout handle, to clear on manual dismiss
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    // First mark as exiting (triggers slide-out animation)
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Clear any pending auto-dismiss timer
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
    // Remove from DOM after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  }, []);

  const show = useCallback(
    (type, message, options = {}) => {
      const id = ++_toastId;
      const duration = options.duration ?? 4000;
      const title = options.title ?? null;

      setToasts((prev) => [
        ...prev,
        { id, type, message, title, exiting: false },
      ]);

      if (duration > 0) {
        timers.current[id] = setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss]
  );

  const api = {
    success: (message, options) => show("success", message, options),
    error:   (message, options) => show("error",   message, options),
    warning: (message, options) => show("warning", message, options),
    info:    (message, options) => show("info",    message, options),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

// ─── Toast Container (rendered inside Provider) ───────────────────────────────
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      style={{ maxWidth: "clamp(280px, 90vw, 400px)" }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ─── Individual Toast Item ────────────────────────────────────────────────────
const TOAST_CONFIG = {
  success: {
    bg:       "bg-white",
    border:   "border-green-200",
    accent:   "bg-green-500",
    iconBg:   "bg-green-50",
    iconColor:"text-green-600",
    titleColor:"text-green-700",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
    defaultTitle: "Başarılı",
  },
  error: {
    bg:       "bg-white",
    border:   "border-red-200",
    accent:   "bg-red-500",
    iconBg:   "bg-red-50",
    iconColor:"text-red-600",
    titleColor:"text-red-700",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    defaultTitle: "Hata",
  },
  warning: {
    bg:       "bg-white",
    border:   "border-amber-200",
    accent:   "bg-amber-500",
    iconBg:   "bg-amber-50",
    iconColor:"text-amber-600",
    titleColor:"text-amber-700",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    defaultTitle: "Uyarı",
  },
  info: {
    bg:       "bg-white",
    border:   "border-blue-200",
    accent:   "bg-blue-500",
    iconBg:   "bg-blue-50",
    iconColor:"text-blue-600",
    titleColor:"text-blue-700",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
    ),
    defaultTitle: "Bilgi",
  },
};

function ToastItem({ toast, onDismiss }) {
  const cfg = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
  const title = toast.title ?? cfg.defaultTitle;

  // Two-phase mount: start off-screen (translate-x-full), then snap to visible
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Defer by one frame so the CSS transition picks up the change
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Slide state: entering → visible, exiting → slide out to right
  const isOut = toast.exiting || !visible;

  return (
    <div
      role="alert"
      className={`
        pointer-events-auto
        relative flex items-start gap-3
        w-full rounded-2xl border shadow-lg shadow-black/8
        overflow-hidden pr-10 pl-1 py-1
        ${cfg.bg} ${cfg.border}
      `}
      style={{
        transition: "opacity 0.32s cubic-bezier(0.4,0,0.2,1), transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        opacity: isOut ? 0 : 1,
        transform: isOut ? "translateX(calc(100% + 1.5rem))" : "translateX(0)",
      }}
    >
      {/* Left accent strip */}
      <div className={`self-stretch w-1 rounded-full shrink-0 ${cfg.accent}`} />

      {/* Icon */}
      <div className={`mt-2.5 flex items-center justify-center w-8 h-8 rounded-xl ${cfg.iconBg} ${cfg.iconColor} shrink-0`}>
        {cfg.icon}
      </div>

      {/* Text */}
      <div className="flex-1 py-2.5 min-w-0">
        <p className={`text-xs font-bold leading-none mb-1 ${cfg.titleColor}`}>{title}</p>
        <p className="text-xs text-slate-600 leading-snug break-words">{toast.message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Bildirimi kapat"
        className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
        </svg>
      </button>
    </div>
  );
}
