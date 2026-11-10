import React, { forwardRef } from "react";
import { SpinnerIcon } from "./icons";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "emerald";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      iconLeft,
      iconRight,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-md gap-1.5",
      md: "h-10 px-4 text-sm rounded-lg gap-2",
      lg: "h-12 px-6 text-base font-semibold rounded-xl gap-2.5",
    };

    const variantStyles = {
      // 10% High-Contrast Focal Accent (Electric Indigo)
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-950/50 hover:shadow-indigo-500/25 border border-indigo-500/40 focus-visible:ring-indigo-500",
      // 30% Structural Surface Tone (Charcoal / Slate Surface)
      secondary:
        "bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white border border-slate-700/80 shadow-sm focus-visible:ring-slate-400",
      // Outline Border Surface
      outline:
        "bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white border border-slate-700 hover:border-slate-500 focus-visible:ring-slate-400",
      // Ghost Minimal
      ghost:
        "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 focus-visible:ring-slate-400",
      // Danger / High Alert
      danger:
        "bg-rose-600/90 text-white hover:bg-rose-500 border border-rose-500/40 shadow-sm shadow-rose-950/50 focus-visible:ring-rose-500",
      // High-Contrast Cyber Emerald Accent
      emerald:
        "bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-500/40 shadow-sm shadow-emerald-950/50 focus-visible:ring-emerald-500",
    };

    const isButtonDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isButtonDisabled}
        aria-busy={isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && <SpinnerIcon className="w-4 h-4 text-current animate-spin" />}
        {!isLoading && iconLeft && <span className="inline-flex shrink-0">{iconLeft}</span>}
        <span>{children}</span>
        {!isLoading && iconRight && <span className="inline-flex shrink-0">{iconRight}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
