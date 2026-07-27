import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      {/* Sabit / Sticky Header */}
      <Header />

      {/* Sayfa İçeriği */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
