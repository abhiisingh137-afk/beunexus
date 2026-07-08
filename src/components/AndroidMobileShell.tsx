import React, { useState } from "react";
import { 
  Home as HomeIcon, 
  FileText, 
  GraduationCap, 
  Calendar, 
  Grid, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogIn, 
  BookOpen, 
  Video, 
  Bell, 
  Trophy, 
  Info, 
  Shield, 
  Phone, 
  Calculator,
  UserCheck,
  Award,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AndroidMobileShellProps {
  currentPage: string;
  setPage: (page: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function AndroidMobileShell({
  currentPage,
  setPage,
  isAdmin,
  onLogout,
  darkMode,
  onToggleDarkMode
}: AndroidMobileShellProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  // Back button functionality
  const showBackButton = currentPage !== "home";

  const handleBack = () => {
    setPage("home");
  };

  // Bottom navigation items
  const primaryTabs = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "pyqs", label: "PYQs", icon: GraduationCap },
    { id: "routine", label: "Routine", icon: Calendar },
  ];

  // Helper to check if current page is in bottom nav
  const isTabActive = (tabId: string) => {
    if (tabId === "home" && currentPage === "home") return true;
    if (tabId === "notes" && currentPage === "notes") return true;
    if (tabId === "pyqs" && currentPage === "pyqs") return true;
    if (tabId === "routine" && currentPage === "routine") return true;
    return false;
  };

  // Determine current page title
  const getPageTitle = () => {
    switch (currentPage) {
      case "home":
        return "nexusBEU";
      case "syllabus":
        return "Syllabus Directory";
      case "notes":
        return "Notes & Material";
      case "pyqs":
        return "Previous Year Papers";
      case "gate":
        return "GATE Exam Hub";
      case "bot-materials":
        return "Materials Bot Hub";
      case "lectures":
        return "Video Lectures";
      case "results":
        return "Exam Results";
      case "notices":
        return "Academic Notices";
      case "sgpa":
        return "SGPA Calculator";
      case "routine":
        return "Routine Maker";
      case "admin-login":
        return "Admin Portal Access";
      case "admin-dashboard":
        return "Admin Management";
      case "about":
        return "About Us";
      case "privacy":
        return "Privacy Policy";
      case "contact":
        return "Contact Support";
      case "sitemap":
        return "Sitemap Index";
      default:
        return "nexusBEU";
    }
  };

  const auxiliaryServices = [
    { id: "syllabus", label: "Syllabus", icon: BookOpen, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
    { id: "gate", label: "GATE Hub", icon: Award, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
    { id: "bot-materials", label: "Bot Uploads", icon: Bot, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" },
    { id: "lectures", label: "Lectures", icon: Video, color: "text-red-500 bg-red-50 dark:bg-red-950/30" },
    { id: "notices", label: "Notices", icon: Bell, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
    { id: "results", label: "Results", icon: Trophy, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30" },
    { id: "sgpa", label: "SGPA Calc", icon: Calculator, color: "text-sky-500 bg-sky-50 dark:bg-sky-950/30" },
    { id: "about", label: "About Us", icon: Info, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" },
    { id: "contact", label: "Contact", icon: Phone, color: "text-teal-500 bg-teal-50 dark:bg-teal-950/30" },
    { id: "privacy", label: "Privacy", icon: Shield, color: "text-slate-500 bg-slate-50 dark:bg-slate-900/30" },
  ];

  const handleNav = (tabId: string) => {
    setPage(tabId);
    setMoreOpen(false);
  };

  return (
    <div id="android-mobile-shell" className="lg:hidden flex flex-col w-full sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      
      {/* 2. Material Design 3 Top App Bar */}
      <div className="h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <button
              onClick={handleBack}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition active:scale-90 cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
              <img
                src="https://i.ibb.co/SwwsnFM2/logo2.png"
                alt="Logo"
                className="w-full h-full object-contain p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {getPageTitle()}
          </span>
        </div>

        {/* Action icons on Top App Bar */}
        <div className="flex items-center gap-1.5">
          {/* Quick toggle dark mode */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Admin portal short path indicator */}
          {isAdmin ? (
            <button
              onClick={() => handleNav("admin-dashboard")}
              className="flex items-center gap-1 p-1 px-2.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          ) : (
            <button
              onClick={() => handleNav("admin-login")}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
              title="Admin Login"
            >
              <LogIn className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Material Design 3 Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 pb-safe shadow-2xl">
        <div className="max-w-md mx-auto flex justify-around items-center px-2">
          {[
            primaryTabs[0], // Home
            primaryTabs[1], // Notes
            { id: "more", label: "More", icon: Grid, isMore: true },
            primaryTabs[2], // PYQs
            primaryTabs[3]  // Routine
          ].map((item) => {
            if ("isMore" in item) {
              return (
                <button
                  key="more"
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="flex flex-col items-center justify-center flex-1 py-1.5 relative group cursor-pointer focus:outline-none"
                >
                  <div className="relative h-7 flex items-center justify-center mb-1">
                    <AnimatePresence initial={false}>
                      {moreOpen && (
                        <motion.div
                          layoutId="activeTabPill"
                          className="absolute inset-0 bg-indigo-100 dark:bg-indigo-950/60 rounded-full -mx-4 z-0"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>
                    <Grid className={`w-5 h-5 relative z-10 transition-colors duration-200 ${
                      moreOpen 
                        ? "text-indigo-600 dark:text-indigo-400 scale-105" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${
                    moreOpen 
                      ? "text-indigo-600 dark:text-indigo-400 font-extrabold" 
                      : "text-slate-500 dark:text-slate-400"
                  }`}>
                    More
                  </span>
                </button>
              );
            }

            const Icon = item.icon;
            const active = isTabActive(item.id) && !moreOpen;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="flex flex-col items-center justify-center flex-1 py-1.5 relative group cursor-pointer focus:outline-none"
              >
                {/* Active Pill Background Indicator */}
                <div className="relative h-7 flex items-center justify-center mb-1">
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-blue-100 dark:bg-blue-950/60 rounded-full -mx-4 z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                  <Icon className={`w-5 h-5 relative z-10 transition-colors duration-200 ${
                    active 
                      ? "text-blue-600 dark:text-blue-400 scale-105" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`} />
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${
                  active 
                    ? "text-blue-600 dark:text-blue-400 font-extrabold" 
                    : "text-slate-500 dark:text-slate-400"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Android Bottom Sheet Drawer */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Bottom Sheet Modal Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-[28px] shadow-2xl border-t border-slate-200 dark:border-slate-800 overflow-hidden max-w-md mx-auto"
              style={{ maxHeight: "85vh" }}
            >
              {/* Drag Handle Top */}
              <div className="w-full flex justify-center pt-3 pb-2 cursor-pointer" onClick={() => setMoreOpen(false)}>
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full transition-colors group-hover:bg-slate-400" />
              </div>

              {/* Drawer Header */}
              <div className="px-6 pb-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    More Services
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Explore additional BEU resources
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      onLogout();
                      setMoreOpen(false);
                    }}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 cursor-pointer"
                  >
                    Logout Admin
                  </button>
                )}
              </div>

              {/* Drawer Grid Body */}
              <div className="px-5 py-6 overflow-y-auto max-h-[55vh] pb-12">
                <div className="grid grid-cols-2 gap-3.5">
                  {auxiliaryServices.map((service) => {
                    const Icon = service.icon;
                    const isActive = currentPage === service.id;
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleNav(service.id)}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl text-left transition duration-150 border cursor-pointer active:scale-95 ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${service.color}`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-xs font-bold tracking-tight">
                          {service.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Simulated Android Help Card */}
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-800/20 border border-blue-100/50 dark:border-slate-700/50">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Official Student Portal
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    This platform serves Bihar Engineering University students with syllabus updates, hand-written notes, and curated lectures. Send resources via Telegram to collaborate!
                  </p>

                  {/* PWA Guide Reset option */}
                  <div className="pt-3 border-t border-slate-200/40 dark:border-slate-700/40 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Mobile App Installation
                    </span>
                    <button
                      onClick={() => {
                        localStorage.removeItem("nexusbeu_pwa_dismissed");
                        window.location.reload();
                      }}
                      className="w-full text-center text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 py-2 px-3 rounded-xl hover:bg-blue-100/50 dark:hover:bg-blue-900/40 transition active:scale-95 cursor-pointer"
                    >
                      Show Install Guide & Banner
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
