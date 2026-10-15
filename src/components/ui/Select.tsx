import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  variant?: 'enclosed' | 'underline';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      variant = 'enclosed',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;

    const baseSelectStyles =
      'w-full appearance-none text-[14px] text-[#1D1D1F] transition-colors disabled:cursor-not-allowed disabled:opacity-50 pr-10 cursor-pointer';

    const variantStyles =
      variant === 'enclosed'
        ? `min-h-[44px] px-3.5 py-2.5 bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#794A32] ${
            error
              ? 'border-[#B3261E] focus:ring-[#B3261E]'
              : 'border-[rgba(29,29,31,0.12)] focus:border-[#794A32]'
          }`
        : `min-h-[44px] rounded-none border-0 border-b bg-transparent px-0 py-3 shadow-none focus:outline-none focus:ring-0 ${
            error
              ? 'border-[#B3261E] focus:border-[#B3261E]'
              : 'border-[rgba(29,29,31,0.18)] focus:border-[#794A32]'
          }`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#1D1D1F]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId || helperId}
            className={`${baseSelectStyles} ${variantStyles} ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#6E6E73]" aria-hidden="true">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && (
          <p id={errorId} className="text-xs text-[#B3261E]">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-[#6E6E73] leading-relaxed">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
