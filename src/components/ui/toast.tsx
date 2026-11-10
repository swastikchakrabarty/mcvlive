"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckIcon, AlertCircleIcon, AlertTriangleIcon, InfoIcon, XIcon } from "./icons";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: Omit<ToastMessage, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, description, duration = 4000 }: Omit<ToastMessage, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastMessage = { id, type, title, description, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast viewport */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex max-w-sm w-full flex-col gap-2.5 pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} message={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastItem({ message, onDismiss }: { message: ToastMessage; onDismiss: () => void }) {
  const isError = message.type === "error";

  const typeConfig = {
    success: {
      icon: <CheckIcon className="w-5 h-5 text-emerald-400" />,
      border: "border-emerald-500/40",
      bg: "bg-slate-900/95",
      titleColor: "text-emerald-300",
    },
    error: {
      icon: <AlertCircleIcon className="w-5 h-5 text-rose-400" />,
      border: "border-rose-500/40",
      bg: "bg-slate-900/95",
      titleColor: "text-rose-300",
    },
    warning: {
      icon: <AlertTriangleIcon className="w-5 h-5 text-amber-400" />,
      border: "border-amber-500/40",
      bg: "bg-slate-900/95",
      titleColor: "text-amber-300",
    },
    info: {
      icon: <InfoIcon className="w-5 h-5 text-indigo-400" />,
      border: "border-indigo-500/40",
      bg: "bg-slate-900/95",
      titleColor: "text-indigo-300",
    },
  };

  const config = typeConfig[message.type];

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl shadow-slate-950/60 backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-2 ${config.bg} ${config.border}`}
    >
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-semibold ${config.titleColor}`}>{message.title}</h4>
        {message.description && (
          <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">{message.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 rounded p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
