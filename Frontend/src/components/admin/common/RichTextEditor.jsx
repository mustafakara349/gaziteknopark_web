import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function RichTextEditor({ value, onChange, placeholder = "İçerik giriniz..." }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!quillRef.current) {
      // Clear container
      containerRef.current.innerHTML = "";

      const editorContainer = document.createElement("div");
      containerRef.current.appendChild(editorContainer);

      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        },
      });

      quillRef.current = quill;

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      quill.on("text-change", () => {
        if (isUpdatingRef.current) return;
        const html = quill.root.innerHTML === "<p><br></p>" ? "" : quill.root.innerHTML;
        onChange(html);
      });
    }

    return () => {
      // Cleanup on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const currentHTML = quillRef.current.root.innerHTML;
      const targetHTML = value || "";
      if (currentHTML !== targetHTML && !(currentHTML === "<p><br></p>" && targetHTML === "")) {
        isUpdatingRef.current = true;
        quillRef.current.clipboard.dangerouslyPasteHTML(targetHTML);
        isUpdatingRef.current = false;
      }
    }
  }, [value]);

  return (
    <div className="rich-text-editor border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
      <div ref={containerRef} />
    </div>
  );
}
