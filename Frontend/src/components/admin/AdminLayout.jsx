import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleDesktop = () => {
    setIsDesktopCollapsed((prev) => !prev);
  };

  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar (Responsive: Drawer on mobile/tablet, Collapsible column on desktop) */}
      <AdminSidebar
        isDesktopCollapsed={isDesktopCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleDesktop={toggleDesktop}
        onToggleMobile={toggleMobile}
        onCloseMobile={closeMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <AdminHeader onToggleMobile={toggleMobile} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 shrink-0">
          <span>© {new Date().getFullYear()} Gazi Teknopark Yönetim Paneli. Tüm hakları saklıdır.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#0B2558] transition">Kullanım Kılavuzu</a>
            <a href="#" className="hover:text-[#0B2558] transition">Destek Talebi</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
