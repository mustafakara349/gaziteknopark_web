import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import ComingSoonPage from "./pages/ComingSoonPage";
import TeamMembersPage from "./pages/TeamMembersPage";
import DocumentsPage from "./pages/DocumentsPage";
import ServicesPage from "./pages/ServicesPage";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import MediaPage from "./pages/MediaPage";
import CompaniesPage from "./pages/CompaniesPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import InitiativeOfficePage from "./pages/InitiativeOfficePage";
import TechnologiesPage from "./pages/TechnologiesPage";
import InternshipApplicationPage from "./pages/InternshipApplicationPage";
import CompanyApplicationPage from "./pages/CompanyApplicationPage";
import ContactPage from "./pages/ContactPage";

function AdminRedirect() {
  useEffect(() => {
    window.location.href = "https://login.gaziteknopark.com.tr/login";
  }, []);
  return null;
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kurumsal/hakkimizda" element={<AboutUs />} />
        <Route path="/kurumsal/yonetim-ve-ekip" element={<TeamMembersPage />} />
        <Route path="/kurumsal/mevzuat-ve-belgeler" element={<DocumentsPage />} />
        <Route path="/kurumsal/hizmetlerimiz" element={<ServicesPage />} />
        <Route path="/haberler" element={<NewsListPage />} />
        <Route path="/haberler/:id" element={<NewsDetailPage />} />
        <Route path="/duyurular" element={<AnnouncementsPage />} />
        <Route path="/kurumsal/duyurular" element={<AnnouncementsPage />} />
        <Route path="/etkinlikler" element={<EventsPage />} />
        <Route path="/etkinlikler/:slug" element={<EventDetailPage />} />
        <Route path="/medya" element={<MediaPage />} />
        <Route path="/firmalar" element={<CompaniesPage />} />
        <Route path="/basari-oykuleri" element={<SuccessStoriesPage />} />
        <Route path="/girisimler/girisim-ofisi" element={<InitiativeOfficePage />} />
        <Route path="/girisimler/teknolojiler" element={<TechnologiesPage />} />
        <Route path="/basvuru/staj" element={<InternshipApplicationPage />} />
        <Route path="/basvuru/firma" element={<CompanyApplicationPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/giris" element={<ComingSoonPage />} />
        <Route path="/admin" element={<AdminRedirect />} />
      </Routes>
    </Layout>
  );
}

export default App;
