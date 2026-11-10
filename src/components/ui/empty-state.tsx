import React from "react";
import { DatabaseIcon } from "./icons";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`relative flex min-h-[320px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center transition-all duration-150 ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/80 text-indigo-400 shadow-inner shadow-slate-950/50">
        {icon || <DatabaseIcon className="w-7 h-7" />}
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-100 tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-400">{description}</p>

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
