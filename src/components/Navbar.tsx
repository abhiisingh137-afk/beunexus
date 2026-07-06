import React, { useState } from "react";
import { BookOpen, LogIn, LayoutDashboard, LogOut, Menu, X, Landmark, GraduationCap, Calendar, Calculator, FileText, Video, Bell, Trophy, Sun, Moon, Award, Bot } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  setPage: (page: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({ currentPage, setPage, isAdmin, onLogout, darkMode, onToggleDarkMode }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Landmark },
    { id: "syllabus", label: "Syllabus", icon: BookOpen },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "pyqs", label: "PYQs", icon: GraduationCap },
    { id: "gate", label: "GATE Hub", icon: Award },
    { id: "bot-materials", label: "Bot Uploads", icon: Bot },
    { id: "lectures", label: "Lectures", icon: Video },
    { id: "notices", label: "Notices", icon: Bell },
    { id: "results", label: "Results", icon: Trophy },
    { id: "sgpa", label: "SGPA Calc", icon: Calculator },
    { id: "routine", label: "Routine Maker", icon: Calendar },
  ];

  const handleNav = (pageId: string) => {
    setPage(pageId);
    setMobileOpen(false);
  };

  return (
    <nav id="app-navbar" className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <button
              onClick={() => handleNav("home")}
              className="flex items-center gap-3 hover:opacity-95 transition focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 shadow-sm shrink-0">
                <img
                  src="https://i.ibb.co/SwwsnFM2/logo2.png"
                  alt="nexusBEU Logo"
                  className="w-full h-full object-contain p-0.5"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                  nexus<span className="text-blue-600">BEU</span>
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                  Student Academic Portal
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition duration-200 cursor-pointer ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Admin and Mobile Trigger */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-200 focus:outline-none cursor-pointer"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAdmin ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  id="nav-admin-dash"
                  onClick={() => handleNav("admin-dashboard")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition duration-200 cursor-pointer ${
                    currentPage === "admin-dashboard"
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-800 dark:hover:text-blue-400"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Portal
                </button>
                <button
                  id="nav-admin-logout"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 transition duration-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                id="nav-admin-login"
                onClick={() => handleNav("admin-login")}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${
                  currentPage === "admin-login"
                    ? "bg-blue-700 text-white"
                    : "bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white"
                }`}
              >
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Admin Login
              </button>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 dark:text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition cursor-pointer"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium transition duration-150 cursor-pointer ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5 text-blue-500 shrink-0" />
                  {item.label}
                </button>
              );
            })}

            {/* Mobile Admin Actions */}
            <div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800 mt-4">
              {isAdmin ? (
                <div className="px-4 space-y-2">
                  <button
                    id="mobile-nav-admin-dash"
                    onClick={() => handleNav("admin-dashboard")}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 transition cursor-pointer"
                  >
                    <LayoutDashboard className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-500" />
                    Admin Portal
                  </button>
                  <button
                    id="mobile-nav-admin-logout"
                    onClick={() => {
                      onLogout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 transition cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 shrink-0 text-rose-500 dark:text-rose-400" />
                    Logout Admin
                  </button>
                </div>
              ) : (
                <div className="px-4">
                  <button
                    id="mobile-nav-admin-login"
                    onClick={() => handleNav("admin-login")}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold bg-blue-600 dark:bg-blue-700 text-white shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition cursor-pointer"
                  >
                    <LogIn className="w-5 h-5 shrink-0" />
                    Admin Access
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
