import apiClient from "../api/client";
import { DocumentItem, DocumentCategory } from "../types/document";

export const getDocuments = async (params?: Record<string, any>): Promise<DocumentItem[]> => {
  const response = await apiClient.get<DocumentItem[]>("/documents", { params });
  return response.data;
};

export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  const response = await apiClient.get<DocumentCategory[]>("/document-categories");
  return response.data;
};
