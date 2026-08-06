export interface DocumentTranslation {
  languageId: number;
  languageCode?: string;
  title: string;
  fileId: number;
  fileUrl?: string;
  filePath?: string;
  fileSize?: number;
}

export interface DocumentCategoryTranslation {
  languageId: number;
  languageCode?: string;
  name: string;
}

export interface DocumentCategory {
  id: number;
  translations: DocumentCategoryTranslation[];
}

export interface DocumentItem {
  id: number;
  uuid?: string;
  title: string;
  category: string;
  categoryId: number;
  categoryName?: string;
  publishedDate: string;
  externalUrl?: string;
  status: string;
  orderNo: number;
  translations?: DocumentTranslation[];
}

export interface DocumentFilterState {
  searchText: string;
  selectedCategory: number | null;
  selectedFileType: string;
}
