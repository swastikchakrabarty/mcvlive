import React from "react";
import { AlertTriangleIcon, RefreshCwIcon } from "./icons";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  errorCode?: string;
  onRetry?: () => void;
  homeAction?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "System Operation Failed",
  message,
  errorCode = "OPERATION_FAILED",
  onRetry,
  homeAction,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`relative flex min-h-[320px] w-full flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-950/10 p-8 text-center transition-all duration-150 ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/40 bg-rose-900/30 text-rose-400 shadow-inner">
        <AlertTriangleIcon className="w-7 h-7" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-rose-300">
          {errorCode}
        </span>
      </div>

      <h3 className="mt-2 text-base font-semibold text-slate-100 tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-400">{message}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            onClick={onRetry}
            iconLeft={<RefreshCwIcon className="w-4 h-4" />}
          >
            Retry Request
          </Button>
        )}
        {homeAction}
      </div>
    </div>
  );
}
