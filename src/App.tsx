import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast, { ToastMessage } from "./components/Toast";

// Pages
import Home from "./pages/Home";
import Syllabus from "./pages/Syllabus";
import Notes from "./pages/Notes";
import PYQs from "./pages/PYQs";
import Lectures from "./pages/Lectures";
import Results from "./pages/Results";
import Notices from "./pages/Notices";
import SGPACalculator from "./pages/SGPACalculator";
import RoutineMaker from "./pages/RoutineMaker";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";
import Sitemap from "./pages/Sitemap";

export default function App() {
  const [page, setPage] = useState<string>("home");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("apnabeu_dark_mode");
    if (saved !== null) {
      return saved === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Handle dark mode side effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("apnabeu_dark_mode", String(darkMode));
  }, [darkMode]);

  // Check if admin session exists
  useEffect(() => {
    const adminSession = localStorage.getItem("apnabeu_admin_auth");
    if (adminSession === "true") {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    localStorage.setItem("apnabeu_admin_auth", "true");
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("apnabeu_admin_auth");
    showToast("Session terminated successfully.", "info");
    setPage("home");
  };

  const showToast = (text: string, type: ToastMessage["type"]) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const handleCloseToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Safe navigation guard for protected admin portal page
  const navigateToPage = (targetPage: string) => {
    if (targetPage === "admin-dashboard" && !isAdmin) {
      showToast("Access Denied: Administrative authorization required.", "error");
      setPage("admin-login");
    } else {
      setPage(targetPage);
    }
  };

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-200">
      {/* Toast Alert Core */}
      <Toast toasts={toasts} onClose={handleCloseToast} />

      {/* Navbar Header */}
      <Navbar
        currentPage={page}
        setPage={navigateToPage}
        isAdmin={isAdmin}
        onLogout={handleAdminLogout}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-grow">
        {page === "home" && <Home setPage={navigateToPage} />}
        {page === "syllabus" && <Syllabus />}
        {page === "notes" && <Notes />}
        {page === "pyqs" && <PYQs />}
        {page === "lectures" && <Lectures />}
        {page === "results" && <Results />}
        {page === "notices" && <Notices />}
        {page === "sgpa" && <SGPACalculator />}
        {page === "routine" && <RoutineMaker />}
        {page === "about" && <AboutUs />}
        {page === "privacy" && <PrivacyPolicy />}
        {page === "contact" && <ContactUs />}
        {page === "sitemap" && <Sitemap setPage={navigateToPage} />}
        
        {page === "admin-login" && (
          <AdminLogin
            onLoginSuccess={handleAdminLogin}
            setPage={navigateToPage}
            showToast={showToast}
          />
        )}
        
        {page === "admin-dashboard" && (
          <AdminDashboard
            showToast={showToast}
            onLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Footer Block */}
      <Footer setPage={navigateToPage} />
    </div>
  );
}
