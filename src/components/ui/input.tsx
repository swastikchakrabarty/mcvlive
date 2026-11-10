import React, { forwardRef, useId } from "react";
import { AlertCircleIcon } from "./icons";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      iconLeft,
      iconRight,
      id: customId,
      disabled,
      required,
      className = "",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            {label}
            {required && <span className="ml-1 text-indigo-400">*</span>}
          </label>
        )}

        <div className="relative rounded-lg shadow-sm">
          {iconLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {iconLeft}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`w-full rounded-lg border bg-slate-900/90 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${
              iconLeft ? "pl-10" : "pl-3.5"
            } ${iconRight || error ? "pr-10" : "pr-3.5"} ${
              error
                ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/60"
                : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/50"
            } ${className}`}
            {...props}
          />

          {error ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-rose-400">
              <AlertCircleIcon className="w-4 h-4" />
            </div>
          ) : (
            iconRight && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                {iconRight}
              </div>
            )
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-rose-400 font-medium">
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={hintId} className="text-xs text-slate-400">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
