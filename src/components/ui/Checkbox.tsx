import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, id, checked, disabled, className = '', onChange, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);

    return (
      <div className={`flex items-start gap-3 py-1 ${className}`}>
        <div className="flex items-center h-6">
          <div className="relative flex items-center justify-center">
            <input
              id={inputId}
              ref={ref}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={onChange}
              className="peer sr-only"
              {...props}
            />
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150 cursor-pointer select-none peer-focus-visible:ring-2 peer-focus-visible:ring-[#794A32] peer-focus-visible:ring-offset-2 ${
                checked
                  ? 'bg-[#794A32] border-[#794A32] text-white shadow-sm'
                  : 'bg-white border-[rgba(29,29,31,0.2)] hover:border-[#794A32]/60'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (!disabled && onChange) {
                  const event = {
                    target: { checked: !checked },
                  } as React.ChangeEvent<HTMLInputElement>;
                  onChange(event);
                }
              }}
            >
              {checked && <Check size={13} strokeWidth={2.75} />}
            </div>
          </div>
        </div>

        {label && (
          <div className="select-none">
            <label
              htmlFor={inputId}
              className={`text-sm font-medium leading-6 ${
                disabled ? 'text-[#8E8E93]' : 'text-[#1D1D1F] cursor-pointer'
              }`}
            >
              {label}
            </label>
            {description && (
              <p className="text-xs text-[#6E6E73] leading-relaxed">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
