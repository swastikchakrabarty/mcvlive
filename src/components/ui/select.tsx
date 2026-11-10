import React, { forwardRef, useId } from "react";
import { ChevronDownIcon, AlertCircleIcon } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      children,
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
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`w-full appearance-none rounded-lg border bg-slate-900/90 py-2.5 pl-3.5 pr-10 text-sm text-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${
              error
                ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/60"
                : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/50"
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-slate-900 text-slate-100 py-1"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            {error ? (
              <AlertCircleIcon className="w-4 h-4 text-rose-400" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            )}
          </div>
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

Select.displayName = "Select";
