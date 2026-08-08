import { useState, useEffect } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Building2,
  GraduationCap,
  Newspaper,
  Megaphone,
  Image,
  CalendarDays,
  Factory,
  Users,
  Settings,
  Menu,
  X,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Share2,

} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Anasayfa Yönetimi", icon: Home, path: "/admin/anasayfa" },
  {
    label: "Kurumsal Bilgiler",
    icon: Building2,
    path: "/admin/kurumsal",
    children: [
      { label: "Hakkımızda", path: "/admin/kurumsal/hakkimizda" },
      { label: "Hizmet ve İmkanlarımız", path: "/admin/kurumsal/hizmetlerimiz" },
      { label: "Yönetim ve Ekip", path: "/admin/kurumsal/yonetim-ve-ekip" },
      { label: "Mevzuat ve Belgeler", path: "/admin/kurumsal/mevzuat-ve-belgeler" },
      { label: "Girişim Ofisi", path: "/admin/kurumsal/girisim-ofisi" },
      { label: "SSS (Sıkça Sorulan Sorular)", path: "/admin/kurumsal/sss" },
    ],
  },
  { label: "Staj Başvuruları", icon: GraduationCap, path: "/admin/staj-basvurulari" },
  { label: "Haberler", icon: Newspaper, path: "/admin/haberler" },
  { label: "Duyurular", icon: Megaphone, path: "/admin/duyurular" },
  { label: "Medya Galeri", icon: Image, path: "/admin/medya" },
  { label: "Etkinlikler", icon: CalendarDays, path: "/admin/etkinlikler" },
  { label: "Firma Yönetimi", icon: Factory, path: "/admin/firmalar" },
  { label: "LinkedIn Gönderileri", icon: Share2, path: "/admin/linkedin-posts" },
  { label: "Sıkça Sorulan Sorular", icon: HelpCircle, path: "/admin/faqs" },
  { label: "Admin Yönetimi", icon: Users, path: "/admin/kullanicilar" },
  { label: "Genel Ayarlar", icon: Settings, path: "/admin/ayarlar" },
];

export default function AdminSidebar({
  isDesktopCollapsed,
  isMobileOpen,
  onToggleDesktop,
  onCloseMobile,
}) {
  const location = useLocation();
  const [logoError, setLogoError] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    "/admin/kurumsal": true, // Default open if on kurumsal
  });

  useEffect(() => {
    // Auto expand menu if current route starts with parent path
    menuItems.forEach((item) => {
      if (item.children && location.pathname.startsWith(item.path)) {
        setExpandedMenus((prev) => ({ ...prev, [item.path]: true }));
      }
    });
  }, [location.pathname]);

  const toggleSubMenu = (path, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-[#0B2558] text-white
          transition-all duration-300 ease-in-out flex flex-col shrink-0
          ${isMobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full"}
          lg:relative lg:translate-x-0 ${isDesktopCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Header Bar */}
        <div
          className={`flex items-center h-16 px-4 border-b border-white/10 shrink-0 ${isDesktopCollapsed ? "lg:justify-center justify-between" : "justify-between"
            }`}
        >
          <Link
            to="/admin/dashboard"
            onClick={onCloseMobile}
            className={`items-center gap-2 overflow-hidden ${isDesktopCollapsed ? "hidden lg:hidden" : "flex"
              }`}
          >
            {!logoError ? (
              <img
                src="/gazi_logo.png"
                alt="Gazi Teknopark"
                onError={() => setLogoError(true)}
                className="h-7 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <span className="font-extrabold text-base tracking-tight whitespace-nowrap">
                GAZİTEKNOPARK
              </span>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={onToggleDesktop}
            className="hidden lg:flex p-1.5 hover:bg-white/10 rounded-lg transition text-blue-100/80 hover:text-white"
            title={isDesktopCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
            aria-label="Menü Daralt/Genişlet"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition text-blue-100/80 hover:text-white"
            title="Menüyü Kapat"
            aria-label="Menüyü Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children?.length);
            const isParentActive = location.pathname.startsWith(item.path);
            const isExactActive = location.pathname === item.path;
            const isExpanded = Boolean(expandedMenus[item.path]);

            if (hasChildren) {
              return (
                <div key={item.path} className="space-y-1">
                  {/* Parent Button/Link */}
                  <div
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200 group cursor-pointer
                      ${isParentActive
                        ? "bg-white/15 text-white shadow-sm font-semibold"
                        : "text-blue-100/80 hover:bg-white/8 hover:text-white"
                      }
                      ${isDesktopCollapsed ? "lg:justify-center lg:px-2" : ""}
                    `}
                    onClick={(e) => {
                      if (isDesktopCollapsed) {
                        // In collapsed mode, navigate to parent page
                        return;
                      }
                      toggleSubMenu(item.path, e);
                    }}
                  >
                    <Link
                      to={item.path}
                      onClick={onCloseMobile}
                      className="flex items-center gap-3 flex-1 overflow-hidden"
                      title={isDesktopCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${isParentActive ? "text-white" : "text-blue-200/70 group-hover:text-white"
                          }`}
                      />
                      <span className={isDesktopCollapsed ? "lg:hidden" : "block"}>
                        {item.label}
                      </span>
                    </Link>

                    {!isDesktopCollapsed && (
                      <button
                        onClick={(e) => toggleSubMenu(item.path, e)}
                        className="p-1 hover:bg-white/10 rounded-md transition text-blue-200/70 hover:text-white"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Children Dropdown Sub-menu */}
                  {isExpanded && !isDesktopCollapsed && (
                    <div className="pl-4 space-y-1 border-l border-white/15 ml-3.5 my-1">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={onCloseMobile}
                            className={`
                              block px-3 py-2 rounded-lg text-xs font-medium transition-all
                              ${isChildActive
                                ? "bg-white/20 text-white font-bold"
                                : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                              }
                            `}
                          >
                            {child.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isExactActive || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path))
                    ? "bg-white/15 text-white shadow-sm font-semibold"
                    : "text-blue-100/80 hover:bg-white/8 hover:text-white"
                  }
                  ${isDesktopCollapsed ? "lg:justify-center lg:px-2" : ""}
                `}
                title={isDesktopCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${isExactActive ? "text-white" : "text-blue-200/70 group-hover:text-white"
                    }`}
                />
                <span className={isDesktopCollapsed ? "lg:hidden" : "block"}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
