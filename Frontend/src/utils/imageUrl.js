/**
 * Formats image URLs so relative backend upload paths (/uploads/...) 
 * resolve correctly against the backend host (e.g. http://localhost:5080)
 */
export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5080/api";
  const baseUrl = apiBase.replace(/\/api\/?$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
