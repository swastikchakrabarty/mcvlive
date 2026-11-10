import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export function Skeleton({ variant = "rectangular", className = "", ...props }: SkeletonProps) {
  const variantStyles = {
    text: "h-4 w-full rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-800/80 ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton variant="circular" className="h-8 w-8" />
      </div>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <div className="pt-2 border-t border-slate-800/60 flex justify-between">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      aria-hidden="true"
      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2.5">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2.5"
    >
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-2.5 w-36" />
    </div>
  );
}
