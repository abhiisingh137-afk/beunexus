import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EyeOff, ShieldAlert, Lock } from "lucide-react";

interface ScreenProtectionHandlerProps {
  showToast: (text: string, type: "success" | "error" | "info" | "warning") => void;
}

export default function ScreenProtectionHandler({ showToast }: ScreenProtectionHandlerProps) {
  const [isShielded, setIsShielded] = useState<boolean>(false);

  useEffect(() => {
    // 1. Tab Focus / Document Visibility change listeners
    const handleBlur = () => {
      setIsShielded(true);
    };

    const handleFocus = () => {
      setIsShielded(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsShielded(true);
      } else {
        // Give a slight delay before unshielding to thwart quick screenshot capture tools
        setTimeout(() => {
          if (!document.hidden) {
            setIsShielded(false);
          }
        }, 150);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 2. Intercept Screen Capture / Print / Save hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
      // Intercept PrintScreen
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.preventDefault();
        showToast("Screenshots are restricted on this secure portal.", "error");
        
        // Temporarily flash screen shield as defense
        setIsShielded(true);
        setTimeout(() => setIsShielded(false), 1000);
        return false;
      }

      // Intercept Cmd+P / Ctrl+P (Print)
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      if (cmdOrCtrl && (e.key === "P" || e.key === "p" || e.keyCode === 80)) {
        e.preventDefault();
        showToast("Printing and PDF exporting are disabled for security.", "error");
        return false;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    // 3. Inject CSS to completely hide screen during print actions
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @media print {
        body {
          display: none !important;
        }
        #print-shield-warning {
          display: block !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: #ffffff !important;
          color: #ef4444 !important;
          text-align: center !important;
          padding: 100px 20px !important;
          font-family: sans-serif !important;
          font-size: 24px !important;
          z-index: 9999999 !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    // 4. Overwrite Clipboard on Screen Print Event to disrupt screenshot buffers if captured
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        navigator.clipboard?.writeText?.("Protected content. Screenshots are prohibited.").catch(() => {});
      }
    };
    window.addEventListener("keyup", handleKeyUp, true);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, [showToast]);

  return (
    <>
      {/* 1. Print Shield Element (Hidden in UI, only visible during printer triggers) */}
      <div id="print-shield-warning" className="hidden">
        ❌ Security Blocked: Printing and PDF exporting are prohibited on this platform.
      </div>

      {/* 2. Passive Tiled Diagonal Security Watermark */}
      <div 
        id="security-watermark-overlay" 
        className="fixed inset-0 z-40 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.015] select-none grid grid-cols-3 grid-rows-6 gap-8 text-center p-4"
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div 
            key={i} 
            className="flex items-center justify-center font-mono text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase transform -rotate-30 select-none whitespace-nowrap"
          >
            PROTECTED SYSTEM • NO CAPTURE
          </div>
        ))}
      </div>

      {/* 3. Screen Obscure Shield on Focus/Tab Blur */}
      <AnimatePresence>
        {isShielded && (
          <motion.div
            id="screen-shield-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-slate-950/95 text-slate-100 p-6 text-center select-none backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="max-w-md flex flex-col items-center"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-blue-500">
                  <Lock className="h-6 w-6 animate-pulse" />
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-4 uppercase tracking-wider">
                <ShieldAlert className="h-3.5 w-3.5" />
                Screen Shield Active
              </span>

              <h2 className="font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">
                Content is Securely Hidden
              </h2>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                To prevent unauthorized screen recording or capture, the application interface is hidden while this browser tab is out of focus.
              </p>
              <p className="mt-6 text-xs text-slate-500 flex items-center gap-1">
                <EyeOff className="h-3 w-3" />
                <span>Return focus to this browser window to resume viewing.</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
