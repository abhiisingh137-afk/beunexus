import React, { useState } from "react";
import { KeyRound, ShieldAlert, LogIn, Lock, User } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  setPage: (page: string) => void;
  showToast: (text: string, type: "success" | "error" | "info" | "warning") => void;
}

export default function AdminLogin({ onLoginSuccess, setPage, showToast }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated short delay for premium UX feedback
    setTimeout(() => {
      if (username.trim() === "admin" && password === "apnaBEU@admin2026") {
        onLoginSuccess();
        showToast("Welcome Administrator! Session initialized.", "success");
        setPage("admin-dashboard");
      } else {
        showToast("Invalid administrative credentials. Access Denied.", "error");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div id="admin-login-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl max-w-md w-full relative overflow-hidden transition-colors duration-200">
        {/* Absolute Background Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 p-4 rounded-2xl mb-4 shadow-sm border border-indigo-100/30 dark:border-indigo-900/30">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            Administrative Gateway
          </h1>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide uppercase">
            Authorized Personnel Only
          </p>
        </div>

        {/* Security Warning */}
        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 mb-6">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
            This workspace holds course syllabus overrides, lecture catalogs, notes repositories, and previous year papers. Unauthorized entry attempts are logged.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="pl-10 pr-4 py-2.5 w-full border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/30 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pl-10 pr-4 py-2.5 w-full border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/30 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all duration-150 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Authenticating session..." : "Authorize Gateway Connection"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6 text-center">
          <button
            onClick={() => setPage("home")}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold transition focus:outline-none cursor-pointer"
          >
            &larr; Return to Student Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
