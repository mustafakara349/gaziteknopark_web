import { useRef, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Link, 
  Heading1, 
  Heading2, 
  Heading3, 
  RemoveFormatting 
} from "lucide-react";

export default function RichTextEditor({ value, onChange, placeholder = "İçerik giriniz..." }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt("Bağlantı URL'sini giriniz:", "https://");
    if (url) {
      execCommand("createLink", url);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="Kalın"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="İtalik"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="Altı Çizili"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("strikeThrough")}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="Üstü Çizili"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<h1>")}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="Başlık 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<h2>")}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="Başlık 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<h3>")}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="Başlık 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="Madde İşaretli Liste"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="Numaralı Liste"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={addLink}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="Bağlantı Ekle"
        >
          <Link className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand("removeFormat")}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
          title="Biçimlendirmeyi Temizle"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="p-4 min-h-[220px] max-h-[400px] overflow-y-auto outline-none text-sm text-gray-800 prose prose-sm max-w-none"
        placeholder={placeholder}
      />
    </div>
  );
}
