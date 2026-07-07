import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WifiOff, RefreshCw, AlertCircle } from "lucide-react";

interface NetworkStatusHandlerProps {
  showToast: (text: string, type: "success" | "error" | "info" | "warning") => void;
}

export default function NetworkStatusHandler({ showToast }: NetworkStatusHandlerProps) {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("Internet connection restored. You are back online!", "success");
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast("You are offline. Some features may not be available.", "warning");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showToast]);

  const checkConnectivity = async () => {
    setIsChecking(true);
    
    // Simulate slight delay for professional feel/loader visibility
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!navigator.onLine) {
      setIsChecking(false);
      showToast("Still offline. Please check your physical connection.", "error");
      return;
    }

    try {
      // Actively probe a lightweight endpoint to confirm actual internet access
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        setIsOnline(true);
        showToast("Internet connection verified. Welcome back!", "success");
      } else {
        throw new Error("Local gateway accessible, but no external route.");
      }
    } catch (err) {
      console.warn("Connection verification failed: ", err);
      // Fallback: if browser says we are online, but proxy check fails, we might still be online
      if (navigator.onLine) {
        setIsOnline(true);
        showToast("Reconnected to local network.", "info");
      } else {
        showToast("Unable to reach servers. Please try again.", "error");
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          id="offline-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
        >
          <motion.div
            id="offline-card"
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-2xl text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400">
              <WifiOff className="h-8 w-8 animate-pulse" />
            </div>

            <h2 className="font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              No Internet Connection
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We couldn't connect to our servers. Please check your network cables, Wi-Fi settings, or mobile data configuration.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 p-3 text-xs font-medium text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Offline features are restricted until reconnected.</span>
            </div>

            <button
              id="retry-connection-btn"
              onClick={checkConnectivity}
              disabled={isChecking}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium py-3 px-4 shadow-lg shadow-blue-500/20 transition duration-150 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
              {isChecking ? "Verifying..." : "Retry Connection"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
