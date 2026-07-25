import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ComingSoonPage from "./pages/ComingSoonPage";
import TeamMembersPage from "./pages/TeamMembersPage";
import DocumentsPage from "./pages/DocumentsPage";
import ServicesPage from "./pages/ServicesPage";
import NewsListPage from "./pages/NewsListPage";
import MediaPage from "./pages/MediaPage";
import CompaniesPage from "./pages/CompaniesPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import InitiativeOfficePage from "./pages/InitiativeOfficePage";
import TechnologiesPage from "./pages/TechnologiesPage";
import InternshipApplicationPage from "./pages/InternshipApplicationPage";
import CompanyApplicationPage from "./pages/CompanyApplicationPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hakkinda/yonetim-ve-ekip" element={<TeamMembersPage />} />
          <Route path="/hakkinda/mevzuat-ve-belgeler" element={<DocumentsPage />} />
          <Route path="/hakkinda/hizmetlerimiz" element={<ServicesPage />} />
          <Route path="/haberler" element={<NewsListPage />} />
          <Route path="/etkinlikler" element={<ComingSoonPage title="Etkinlikler" />} />
          <Route path="/medya" element={<MediaPage />} />
          <Route path="/firmalar" element={<CompaniesPage />} />
          <Route path="/basari-oykuleri" element={<SuccessStoriesPage />} />
          <Route path="/girisimler/girisim-ofisi" element={<InitiativeOfficePage />} />
          <Route path="/girisimler/teknolojiler" element={<TechnologiesPage />} />
          <Route path="/basvuru/staj" element={<InternshipApplicationPage />} />
          <Route path="/basvuru/firma" element={<CompanyApplicationPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/giris" element={<ComingSoonPage title="Giriş" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
