import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'underline' | 'enclosed';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'underline',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const baseInputStyles =
      'w-full text-[14px] text-[#1D1D1F] transition-colors placeholder:text-[#8E8E93] disabled:cursor-not-allowed disabled:opacity-50';

    const variantStyles =
      variant === 'enclosed'
        ? `min-h-[44px] px-3.5 py-2.5 bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#794A32] ${
            error
              ? 'border-[#B3261E] focus:ring-[#B3261E]'
              : 'border-[rgba(29,29,31,0.12)] focus:border-[#794A32]'
          } ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`
        : `min-h-[44px] rounded-none border-0 border-b bg-transparent px-0 py-3 shadow-none focus:outline-none focus:ring-0 ${
            leftIcon ? 'pl-7' : ''
          } ${rightIcon ? 'pr-7' : ''} ${
            error
              ? 'border-[#B3261E] focus:border-[#B3261E]'
              : 'border-[rgba(29,29,31,0.18)] focus:border-[#794A32]'
          }`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#1D1D1F]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E6E73]" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId || helperId}
            className={`${baseInputStyles} ${variantStyles} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#6E6E73]" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-[#B3261E] flex items-center gap-1">
            <span>{error}</span>
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
Input.displayName = 'Input';
