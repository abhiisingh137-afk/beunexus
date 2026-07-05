import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

interface ToastItemProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
  key?: string;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div
      id={`toast-${toast.id}`}
      className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl p-4 rounded-xl animate-fade-in text-slate-800 dark:text-slate-100 transition-all duration-300"
    >
      {toast.type === "success" && (
        <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
      )}
      {toast.type === "error" && (
        <AlertCircle className="text-rose-500 w-5 h-5 shrink-0" />
      )}
      {toast.type === "info" && (
        <Info className="text-blue-500 w-5 h-5 shrink-0" />
      )}
      {toast.type === "warning" && (
        <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0" />
      )}

      <div className="flex-1 text-sm font-medium">{toast.text}</div>

      <button
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none rounded-full p-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Toast({ toasts, onClose }: ToastProps) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
