import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PageIntro from "../common/PageIntro";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      {/* Sabit / Sticky Header */}
      <Header />

      {/* Sayfa İçeriği */}
      <main className="flex-1">
        <PageIntro />
        {children}
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

