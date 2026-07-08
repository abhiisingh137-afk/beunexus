import React, { useState, useEffect } from "react";
import { Download, X, Share, PlusSquare, Smartphone, Laptop, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InstallPwaBannerProps {
  forceShow?: boolean;
  onClose?: () => void;
}

export default function InstallPwaBanner({ forceShow = false, onClose }: InstallPwaBannerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem("nexusbeu_pwa_dismissed") === "true";
  });
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone (PWA) mode
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 2. Detect iOS
    const detectiOS = () => {
      const uAgent = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(uAgent);
      setIsIOS(isApple);
    };

    detectiOS();

    // 3. Listen to browser PWA install event (Android / Chrome / PC)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("PWA beforeinstallprompt event captured!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Listen to app installed event
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setInstallSuccess(true);
      localStorage.setItem("nexusbeu_pwa_installed", "true");
      console.log("nexusBEU installed successfully!");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If we don't have the captured event, fallback to standard guide
      alert("Please use your browser's menu (three dots) and tap 'Install' or 'Add to Home screen' to save nexusBEU.");
      return;
    }

    // Show the native browser prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User installation decision: ${outcome}`);

    if (outcome === "accepted") {
      setInstallSuccess(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const dismissBanner = () => {
    setIsDismissed(true);
    localStorage.setItem("nexusbeu_pwa_dismissed", "true");
    if (onClose) onClose();
  };

  // If already standalone (running as installed app), do not show
  if (isStandalone && !forceShow) return null;

  // If dismissed and not forced, do not show
  if (isDismissed && !forceShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        id="pwa-install-banner"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-blue-200/20 dark:border-slate-800 transition duration-300">
          
          {/* Accent radial gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent)] pointer-events-none" />

          {/* Dismiss button */}
          {!forceShow && (
            <button
              onClick={dismissBanner}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {installSuccess ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold">nexusBEU Successfully Installed!</h3>
              <p className="text-xs text-blue-100/80 mt-1 max-w-md">
                You can now launch the app directly from your home screen or app drawer for a seamless native app experience.
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              
              {/* Info Text Column */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white tracking-wider uppercase mb-3">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  Install App Experience
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Install nexusBEU App on your Device
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-blue-100/95 max-w-2xl leading-relaxed">
                  Convert this website into a fast, offline-ready Android/iOS app. Launches instantly, works offline, saves screen space, and uses absolutely no storage!
                </p>
              </div>

              {/* Action Column */}
              <div className="shrink-0 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {isIOS ? (
                  /* iOS Installation Instructions Guide */
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 max-w-md">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" />
                      iOS Safari Instructions:
                    </h4>
                    <ol className="text-xs space-y-1.5 text-blue-50/90 leading-snug list-decimal list-inside">
                      <li>Open this page in the <strong className="text-white">Safari Browser</strong>.</li>
                      <li>
                        Tap the <strong className="text-white inline-flex items-center gap-0.5 bg-white/20 px-1 rounded">Share <Share className="w-3 h-3 inline" /></strong> button.
                      </li>
                      <li>
                        Scroll down and tap <strong className="text-white inline-flex items-center gap-0.5 bg-white/20 px-1 rounded">Add to Home Screen <PlusSquare className="w-3 h-3 inline" /></strong>.
                      </li>
                    </ol>
                  </div>
                ) : isInstallable ? (
                  /* Standard Android / Chrome Auto Prompt */
                  <button
                    onClick={handleInstallClick}
                    className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-extrabold px-5 py-3 rounded-2xl text-sm shadow-md active:scale-95 transition duration-150 cursor-pointer text-center"
                  >
                    <Download className="w-4 h-4" />
                    Install Web App (PWA)
                  </button>
                ) : (
                  /* Custom Help Manual Fallback Instructions */
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 max-w-sm">
                    <h4 className="text-xs font-bold text-blue-100 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5" />
                      How to Install:
                    </h4>
                    <p className="text-xs text-blue-50/95 leading-normal">
                      Click your browser's <strong className="text-white">menu (3 dots)</strong> at the top right, then select <strong className="text-white">"Install App"</strong> or <strong className="text-white">"Add to Home screen"</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
