import { useState, useRef, useEffect, useCallback } from "react";

export default function ConsentModal({ title, content, isOpen, onClose, onAccept }) {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const sentinelRef = useRef(null);
  const contentRef = useRef(null);

  // Reset scroll state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToEnd(false);
    }
  }, [isOpen]);

  // Observe the sentinel element at the bottom of the content
  useEffect(() => {
    if (!isOpen || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasScrolledToEnd(true);
        }
      },
      { root: contentRef.current, threshold: 1.0 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-gray-100 bg-white shadow-2xl animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 md:px-8">
          <h2 className="text-lg font-bold text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Kapat"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-6 md:px-8 text-sm text-gray-600 leading-relaxed"
        >
          <div className="whitespace-pre-line">{content}</div>

          {/* Invisible sentinel at the very bottom to detect scroll end */}
          <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          {!hasScrolledToEnd && (
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Onaylamak için metnin sonuna kadar okuyunuz.
            </p>
          )}
          {hasScrolledToEnd && <div />}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Kapat
            </button>
            <button
              onClick={onAccept}
              disabled={!hasScrolledToEnd}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Okudum, Onaylıyorum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
