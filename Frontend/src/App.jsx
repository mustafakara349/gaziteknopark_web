import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/common/ScrollToTop";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import ComingSoonPage from "./pages/ComingSoonPage";
import TeamMembersPage from "./pages/TeamMembersPage";
import DocumentsPage from "./pages/DocumentsPage";
import ServicesPage from "./pages/ServicesPage";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import AnnouncementDetailPage from "./pages/AnnouncementDetailPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import MediaPage from "./pages/MediaPage";
import CompaniesPage from "./pages/CompaniesPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import InitiativeOfficePage from "./pages/InitiativeOfficePage";
import TechnologiesPage from "./pages/TechnologiesPage";
import InternshipApplicationPage from "./pages/InternshipApplicationPage";
import CompanyApplicationPage from "./pages/CompanyApplicationPage";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";

// Admin Components & Pages
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminCorporatePage from "./pages/admin/AdminCorporatePage";
import AdminCorporateAboutPage from "./pages/admin/corporate/AdminCorporateAboutPage";
import AdminCorporateServicesPage from "./pages/admin/corporate/AdminCorporateServicesPage";
import AdminCorporateTeamPage from "./pages/admin/corporate/AdminCorporateTeamPage";
import AdminCorporateDocumentsPage from "./pages/admin/corporate/AdminCorporateDocumentsPage";
import AdminCorporateInitiativePage from "./pages/admin/corporate/AdminCorporateInitiativePage";
import AdminCorporateFaqPage from "./pages/admin/corporate/AdminCorporateFaqPage";
import AdminInternshipPage from "./pages/admin/AdminInternshipPage";
import AdminNewsPage from "./pages/admin/AdminNewsPage";
import AdminAnnouncementsPage from "./pages/admin/AdminAnnouncementsPage";
import AdminMediaPage from "./pages/admin/AdminMediaPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminCompaniesPage from "./pages/admin/AdminCompaniesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminFaqsPage from "./pages/admin/AdminFaqsPage";
import AdminFaqCategoriesPage from "./pages/admin/AdminFaqCategoriesPage";

function App() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* ─── Public Routes ──────────────────────────── */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/kurumsal/hakkimizda" element={<AboutUs />} />
          <Route path="/kurumsal/yonetim-ve-ekip" element={<TeamMembersPage />} />
          <Route path="/kurumsal/mevzuat-ve-belgeler" element={<DocumentsPage />} />
          <Route path="/kurumsal/hizmetlerimiz" element={<ServicesPage />} />
          <Route path="/haberler" element={<NewsListPage />} />
          <Route path="/haberler/:id" element={<NewsDetailPage />} />
          <Route path="/duyurular" element={<AnnouncementsPage />} />
          <Route path="/duyurular/:slug" element={<AnnouncementDetailPage />} />
          <Route path="/kurumsal/duyurular" element={<AnnouncementsPage />} />
          <Route path="/etkinlikler" element={<EventsPage />} />
          <Route path="/etkinlikler/:slug" element={<EventDetailPage />} />
          <Route path="/medya" element={<MediaPage />} />
          <Route path="/firmalar" element={<CompaniesPage />} />
          <Route path="/firmalar/:id" element={<CompanyDetailPage />} />
          <Route path="/basari-oykuleri" element={<SuccessStoriesPage />} />
          <Route path="/girisimler/girisim-ofisi" element={<InitiativeOfficePage />} />
          <Route path="/girisimler/teknolojiler" element={<TechnologiesPage />} />
          <Route path="/basvuru/staj" element={<InternshipApplicationPage />} />
          <Route path="/basvuru/firma" element={<CompanyApplicationPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/sss" element={<FaqPage />} />
          <Route path="/giris" element={<ComingSoonPage />} />
        </Route>

        {/* ─── Admin Routes ───────────────────────────── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="anasayfa" element={<AdminHomePage />} />
          <Route path="kurumsal" element={<AdminCorporatePage />} />
          <Route path="kurumsal/hakkimizda" element={<AdminCorporateAboutPage />} />
          <Route path="kurumsal/hizmetlerimiz" element={<AdminCorporateServicesPage />} />
          <Route path="kurumsal/yonetim-ve-ekip" element={<AdminCorporateTeamPage />} />
          <Route path="kurumsal/mevzuat-ve-belgeler" element={<AdminCorporateDocumentsPage />} />
          <Route path="kurumsal/girisim-ofisi" element={<AdminCorporateInitiativePage />} />
          <Route path="kurumsal/sss" element={<AdminCorporateFaqPage />} />
          <Route path="staj-basvurulari" element={<AdminInternshipPage />} />
          <Route path="haberler" element={<AdminNewsPage />} />
          <Route path="duyurular" element={<AdminAnnouncementsPage />} />
          <Route path="medya" element={<AdminMediaPage />} />
          <Route path="etkinlikler" element={<AdminEventsPage />} />
          <Route path="firmalar" element={<AdminCompaniesPage />} />
          <Route path="kullanicilar" element={<AdminUsersPage />} />
          <Route path="faqs" element={<AdminFaqsPage />} />
          <Route path="faq-categories" element={<AdminFaqCategoriesPage />} />
          <Route path="ayarlar" element={<AdminSettingsPage />} />
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;
