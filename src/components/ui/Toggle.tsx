import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
  className = '',
}: ToggleProps) {
  const toggleId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);

  return (
    <div className={`flex items-start justify-between gap-4 py-1.5 ${className}`}>
      {label && (
        <div className="flex-1 select-none pr-2">
          <label
            htmlFor={toggleId}
            className={`text-sm font-medium ${
              disabled ? 'text-[#8E8E93]' : 'text-[#1D1D1F] cursor-pointer'
            }`}
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-[#6E6E73] leading-relaxed mt-0.5">{description}</p>
          )}
        </div>
      )}
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#794A32] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
          checked ? 'bg-[#794A32]' : 'bg-[#D1D1D6]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
