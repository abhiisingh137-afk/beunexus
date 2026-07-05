import React, { useState } from "react";
import { ExternalLink, ShieldAlert, RefreshCw, Globe, Monitor, Smartphone, Trophy, Sparkles } from "lucide-react";

export default function Results() {
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [useBackupMode, setUseBackupMode] = useState(false);

  const resultsUrl = "https://beu-bih.ac.in/result-one";

  const reloadIframe = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const recentResults = [
    { title: "B.Tech 8th Semester Exam Results 2025 (Regular/Back)", date: "Published: June 18, 2026" },
    { title: "B.Pharma 4th Semester Exam Results 2025", date: "Published: June 10, 2026" },
    { title: "B.Tech 5th Semester Exam Results 2025", date: "Published: May 28, 2026" },
    { title: "M.Tech 2nd Semester Exam Results 2025", date: "Published: May 20, 2026" }
  ];

  return (
    <div id="results-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            BEU Examination Results
          </h1>
          <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
            Live embed of the official Bihar Engineering University semester results portal.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={reloadIframe}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition focus:outline-none cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Portal
          </button>
          <a
            href={resultsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition focus:outline-none"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in New Tab
          </a>
          <button
            onClick={() => setUseBackupMode(!useBackupMode)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition focus:outline-none cursor-pointer"
          >
            {useBackupMode ? "View Live Portal" : "Toggle Guide Solver"}
          </button>
        </div>
      </div>

      {/* Frame Alert Warning */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-3xl p-5 mb-8 flex gap-4 transition-all">
        <div className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 p-2.5 rounded-2xl h-fit shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-1">
            Browser Security & Frame Constraints
          </h4>
          <p className="text-xs text-amber-800/80 dark:text-amber-400/80 leading-relaxed font-medium">
            Some browsers block third-party university portals (such as 
            <code className="mx-1 px-1 py-0.5 bg-amber-100/50 dark:bg-amber-950/50 rounded font-mono text-[11px] text-amber-900 dark:text-amber-300">beu-bih.ac.in</code>) 
            from rendering inside embedded frames. If the page below does not load or displays an error, click the <strong>Open in New Tab</strong> button above to load the official site directly, or switch to the <strong>Guide Solver</strong>.
          </p>
        </div>
      </div>

      {useBackupMode ? (
        /* SOLVER GUIDE PORTAL */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-colors duration-200">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 mb-4 border border-amber-100 dark:border-amber-900/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Easy Result Guide
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">How to Check Results on BEU?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed font-medium">
              BEU publishes transcripts in an encryption-secured database. Follow these exact steps on the portal to retrieve your report cards:
            </p>

            <ol className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex gap-3 font-medium">
                <span className="flex items-center justify-center bg-blue-50 dark:bg-blue-950/45 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 shrink-0 font-bold text-xs">1</span>
                <span>Click the <strong>Open in New Tab</strong> button to bypass iframe blocks.</span>
              </li>
              <li className="flex gap-3 font-medium">
                <span className="flex items-center justify-center bg-blue-50 dark:bg-blue-950/45 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 shrink-0 font-bold text-xs">2</span>
                <span>Enter your 7 or 11-digit <strong>Registration Number</strong> in the form input.</span>
              </li>
              <li className="flex gap-3 font-medium">
                <span className="flex items-center justify-center bg-blue-50 dark:bg-blue-950/45 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 shrink-0 font-bold text-xs">3</span>
                <span>Click <strong>Search / Submit</strong>. Your results details will download or draw as a printable PDF.</span>
              </li>
            </ol>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Recently Released Results
            </h3>
            <div className="space-y-3">
              {recentResults.map((res, index) => (
                <div key={index} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{res.title}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block font-medium">{res.date}</span>
                  </div>
                  <a
                    href={resultsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Iframe Browser/Device Shell */
        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-lg overflow-hidden transition-all duration-300">
          {/* Browser Top Bar / Emulator Controls */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Address Bar Emulator */}
            <div className="flex items-center gap-2 w-full sm:max-w-md bg-white dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate select-all">
                {resultsUrl}
              </span>
            </div>
            
            {/* Viewport Emulator Toggles */}
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
              <button
                onClick={() => {
                  setIsLoading(true);
                  setViewMode("desktop");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "desktop"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop View
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setViewMode("mobile");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "mobile"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile View
              </button>
            </div>
          </div>

          {/* Device Wrapper and Iframe viewport */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 flex justify-center items-center transition-all duration-300">
            <div
              className={`relative bg-white shadow-2xl transition-all duration-300 ${
                viewMode === "mobile"
                  ? "w-[375px] h-[667px] rounded-[40px] border-[12px] border-slate-900 dark:border-slate-800 ring-4 ring-slate-200 dark:ring-slate-900/50 overflow-hidden"
                  : "w-full h-[700px] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              }`}
            >
              {/* Mobile Top Sensor if in mobile view */}
              {viewMode === "mobile" && (
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 dark:bg-slate-800 flex justify-center items-center z-20">
                  <div className="w-16 h-4 bg-black rounded-b-xl"></div>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-10 transition-all duration-300">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                  <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500 animate-pulse" /> Connecting to BEU...
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5 font-medium">
                    Loading results board...
                  </p>
                </div>
              )}
              
              <iframe
                key={`${viewMode}-${iframeKey}`}
                src={`/api/beu-proxy/result-one?mode=${viewMode}&v=${iframeKey}`}
                className="w-full h-full border-0 bg-white"
                title="BEU Results Page"
                onLoad={() => setIsLoading(false)}
              />

              {/* Mobile Bottom Bar indicator */}
              {viewMode === "mobile" && (
                <div className="absolute bottom-1 inset-x-0 flex justify-center z-20 pointer-events-none">
                  <div className="w-28 h-1 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
