import React, { useState, useEffect } from "react";
import { getDocuments, getDocumentCategories } from "../../services/documentService";
import { DocumentItem, DocumentCategory } from "../../types/document";
import { pickTranslation } from "../../utils/i18n";
import DocumentFilter from "./DocumentFilter";
import DocumentTabs from "./DocumentTabs";
import DocumentCard from "./DocumentCard";
import DocumentViewer from "./DocumentViewer";
import { RefreshCw, Search } from "lucide-react";

const INITIAL_PAGE_SIZE = 5;
const PAGE_SIZE_INCREMENT = 5;

export default function DocumentList() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string>("");

  // Pagination states
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_PAGE_SIZE);

  // Viewer states
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [docsData, catsData] = await Promise.all([
        getDocuments(),
        getDocumentCategories(),
      ]);
      setDocuments(docsData);
      setCategories(catsData);
    } catch (err) {
      console.error("Doküman verileri yüklenirken hata oluştu:", err);
      setError("Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      // Small timeout to show off the premium skeleton loaders
      setTimeout(() => setLoading(false), 600);
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [searchText, selectedCategory, selectedFileType]);

  const getFileExtension = (urlOrPath?: string) => {
    if (!urlOrPath) return "";
    const cleanUrl = urlOrPath.split("?")[0];
    const ext = cleanUrl.split(".").pop()?.toLowerCase();
    return ext || "";
  };

  // Dynamically extract unique file extensions from all documents loaded
  const fileTypes = Array.from(
    new Set(
      documents
        .map((doc) => getFileExtension(doc.externalUrl))
        .filter((ext) => ext !== "")
    )
  ).sort();

  // Filter logic
  const filteredDocuments = documents.filter((doc) => {
    const title = doc.title || "";
    const fileUrl = doc.externalUrl || "";

    // 1. Search text filter
    const matchesSearch =
      !searchText || title.toLowerCase().includes(searchText.toLowerCase());

    // 2. Category filter
    const matchesCategory =
      selectedCategory === null || doc.categoryId === selectedCategory;

    // 3. File type filter
    const matchesFileType =
      !selectedFileType || getFileExtension(fileUrl) === selectedFileType;

    return matchesSearch && matchesCategory && matchesFileType;
  });

  const paginatedDocuments = filteredDocuments.slice(0, visibleCount);
  const hasMore = filteredDocuments.length > visibleCount;

  const handlePreview = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setIsViewerOpen(true);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE_INCREMENT);
  };

  const getCategoryName = (catId: number) => {
    const category = categories.find((c) => c.id === catId);
    if (!category) return undefined;
    const t = pickTranslation(category) as { name?: string };
    return t.name;
  };

  return (
    <div className="space-y-6">
      {/* 1. Filters */}
      <DocumentFilter
        search={searchText}
        setSearch={setSearchText}
        selectedFileType={selectedFileType}
        setSelectedFileType={setSelectedFileType}
        fileTypes={fileTypes}
      />

      {/* 2. Category Tabs */}
      {!loading && (
        <DocumentTabs
          categories={categories}
          activeCategory={selectedCategory}
          setActiveCategory={setSelectedCategory}
        />
      )}

      {/* 3. Main content area (Loading Skeleton vs Error vs Empty State vs List) */}
      {loading ? (
        /* Skeleton Loader: matches the list card structure */
        <div className="divide-y divide-gray-100 rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center bg-white"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start flex-1">
                {/* File Icon Box */}
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-100" />
                {/* Title and details */}
                <div className="flex-1 space-y-2.5">
                  <div className="h-4 w-3/4 rounded bg-slate-100" />
                  <div className="flex gap-2">
                    <div className="h-3 w-24 rounded bg-slate-100" />
                    <div className="h-3 w-16 rounded bg-slate-100" />
                    <div className="h-3 w-20 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
              {/* Button Placeholders */}
              <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
                <div className="h-10 w-full sm:w-24 rounded-xl bg-slate-100" />
                <div className="h-10 w-full sm:w-24 rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
          <div className="text-red-500 font-semibold">{error}</div>
          <button
            type="button"
            onClick={fetchData}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light cursor-pointer active:scale-95 shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Yeniden Dene</span>
          </button>
        </div>
      ) : filteredDocuments.length === 0 ? (
        /* Premium custom Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-14 px-6 text-center shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4 border border-slate-100">
            <Search className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-slate-700 mb-1.5">Sonuç Bulunamadı</h4>
          <p className="text-sm text-slate-400 max-w-sm">
            Arama kriterlerinize uygun belge bulunamadı.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="divide-y divide-gray-100 rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {paginatedDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                categoryName={doc.category}
                onPreview={handlePreview}
              />
            ))}
          </div>

          {/* 4. Show More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleShowMore}
                className="rounded-full border border-primary bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white cursor-pointer active:scale-95 shadow-sm"
              >
                Daha Fazla Göster
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Document Viewer Side Drawer */}
      <DocumentViewer
        document={selectedDocument}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedDocument(null);
        }}
      />
    </div>
  );
}
