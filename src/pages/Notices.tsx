import React, { useState } from "react";
import { ExternalLink, ShieldAlert, RefreshCw, Globe, Monitor, Smartphone } from "lucide-react";

export default function Notices() {
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const reloadIframe = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div id="notices-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            Official BEU Notification Portal
          </h1>
          <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
            Live embed of the official Bihar Engineering University notification board.
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
            href="https://beu-bih.ac.in/notification"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition focus:outline-none"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in New Tab
          </a>
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
            Some browsers or network configurations block third-party university portals (such as 
            <code className="mx-1 px-1 py-0.5 bg-amber-100/50 dark:bg-amber-950/50 rounded font-mono text-[11px] text-amber-900 dark:text-amber-300">beu-bih.ac.in</code>) 
            from rendering inside an embedded frame due to security headers (<code className="font-mono">X-Frame-Options</code>). 
            If the board does not appear below or says "Refused to connect", please click the <strong>Open in New Tab</strong> button above to load the official site directly.
          </p>
        </div>
      </div>

      {/* Iframe Browser/Device Shell */}
      <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-lg overflow-hidden transition-all duration-300">
        {/* Browser Top Bar / Emulator Controls */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Address Bar Emulator */}
          <div className="flex items-center gap-2 w-full sm:max-w-md bg-white dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate select-all">
              https://beu-bih.ac.in/notification
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
                  Loading notifications...
                </p>
              </div>
            )}
            
            <iframe
              key={`${viewMode}-${iframeKey}`}
              src={`/api/beu-proxy/notification?mode=${viewMode}&v=${iframeKey}`}
              className="w-full h-full border-0 bg-white"
              title="BEU Notification Portal"
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
    </div>
  );
}
