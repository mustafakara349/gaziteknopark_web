import apiClient from "./client";

const get = (url, params) => apiClient.get(url, { params }).then((res) => res.data);

export const getSliders = () => get("/sliders");
export const getNews = (params) => get("/news", params);
export const getNewsById = (id, params) => get(`/news/${id}`, params);
export const getNewsCategories = () => get("/news-categories");
export const getEvents = () => get("/events");
export const getStatistics = () => get("/statistics");
export const getInitiativeOffice = () => get("/initiative-office");
export const getSettings = () => get("/settings");
export const getSuccessStories = () => get("/success-stories");
export const getLinkedInPosts = (params) => get("/linkedin-posts", params);
export const getCompanies = (params) => get("/companies", params);
export const getCompanyCategories = () => get("/company-categories");
export const getFeaturedTechnologies = () => get("/featured-technologies");
export const getMediaAlbums = () => get("/media-albums");
export const getMedia = (params) => get("/media", params);
export const getSocialLinks = () => get("/social-links");
export const getFaq = () => get("/faq");
export const getContactInfo = () => get("/contact/info");
export const getPages = () => get("/pages");
export const getPageContent = (slug, params) => get(`/pages/content/${slug}`, params);
export const getTeamMembers = () => get("/team-members");
export const getServices = () => get("/services");
export const getDocuments = (params) => get("/documents", params);
export const getDocumentCategories = () => get("/document-categories");
export const getAnnouncements = (params) => get("/announcements", params);
export const getAnnouncementBySlug = (slug) => get(`/announcements/${slug}`);
export const getAnnouncementCategories = () => get("/announcement-categories");

export const submitContactMessage = (payload) => apiClient.post("/contact/messages", payload).then((res) => res.data);
export const submitInternshipApplication = (payload) => apiClient.post("/internship-applications", payload).then((res) => res.data);
export const login = (payload) => apiClient.post("/auth/login", payload).then((res) => res.data);
export const register = (payload) => apiClient.post("/auth/register", payload).then((res) => res.data);
