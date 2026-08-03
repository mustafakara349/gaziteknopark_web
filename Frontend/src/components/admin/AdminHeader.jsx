import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Menu,
  Search,
  Bell,
  LogOut,
  User,
  X,
} from "lucide-react";

export default function AdminHeader({ onToggleMobile }) {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 h-16 flex items-center px-4 sm:px-6 gap-2 sm:gap-4 shrink-0 shadow-xs">
      {/* Mobile Menu Button (Hamburger) */}
      <button
        onClick={onToggleMobile}
        className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-700 lg:hidden shrink-0"
        aria-label="Menüyü Aç"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Site-style Search Bar */}
      <div className="flex-1 max-w-xs sm:max-w-md">
        <div className="relative flex items-center rounded-full bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 px-3.5 py-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0066cc]/20 focus-within:border-[#0066cc]">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Panelde ara..."
            className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#0B2558] outline-none placeholder:text-gray-400 ml-2.5 pr-2"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-gray-400 hover:text-gray-600 p-0.5 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Notifications + Profile + Logout */}
      <div className="flex items-center gap-1.5 sm:gap-3 ml-auto shrink-0">
        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-gray-100 rounded-xl transition text-gray-600">
          <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-gray-200">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0B2558] rounded-full flex items-center justify-center shadow-xs shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight hidden md:block">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[120px]">
              {user?.name || "Admin"}
            </p>
            <p className="text-[10px] sm:text-[11px] text-gray-500">Süper Admin</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 hover:bg-red-50 rounded-xl transition text-gray-500 hover:text-red-600"
          title="Çıkış Yap"
        >
          <LogOut className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
}
