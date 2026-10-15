import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

/**
 * Kadi brand logo matching reference/landing-page-target.png and reference/app-workspace-target.png:
 * Symmetrical 7-leaf botanical sprig + tracked Roman serif "K A D I".
 */
export function Logo({
  className = '',
  variant = 'full',
  size = 'md',
  color = '#c4a16a',
}: LogoProps) {
  const dimensions = {
    sm: { icon: 20, text: 'text-xs', tracking: 'tracking-[0.24em]' },
    md: { icon: 26, text: 'text-sm sm:text-base', tracking: 'tracking-[0.28em]' },
    lg: { icon: 34, text: 'text-lg sm:text-xl', tracking: 'tracking-[0.3em]' },
  }[size];

  const fillColor = variant === 'monochrome' ? 'currentColor' : color;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Kadi">
      {/* Botanical Sprig Emblem */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon * 1.15}
        viewBox="0 0 32 38"
        fill="none"
        role="img"
        aria-label="Kadi botanical emblem"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        {/* Central stem */}
        <line
          x1="16"
          y1="13"
          x2="16"
          y2="36"
          stroke={fillColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Center top vertical leaf */}
        <path
          d="M16 2 C14.6 5.8 14.6 10.2 16 13 C17.4 10.2 17.4 5.8 16 2 Z"
          fill={fillColor}
        />
        {/* Upper right leaf */}
        <path
          d="M16 13 C17.8 9.2 21.8 6.5 23.8 7.8 C24.2 10 20.8 13.2 16 13 Z"
          fill={fillColor}
        />
        {/* Upper left leaf */}
        <path
          d="M16 13 C14.2 9.2 10.2 6.5 8.2 7.8 C7.8 10 11.2 13.2 16 13 Z"
          fill={fillColor}
        />
        {/* Middle right leaf */}
        <path
          d="M16 14.5 C19.5 12.8 25.5 13.2 26.8 15 C25 17.2 19 16.8 16 14.5 Z"
          fill={fillColor}
        />
        {/* Middle left leaf */}
        <path
          d="M16 14.5 C12.5 12.8 6.5 13.2 5.2 15 C7 17.2 13 16.8 16 14.5 Z"
          fill={fillColor}
        />
        {/* Lower right leaf */}
        <path
          d="M16 16.5 C18.2 16.5 22 18.2 22.8 20.2 C21 21.2 17.8 19.5 16 16.5 Z"
          fill={fillColor}
        />
        {/* Lower left leaf */}
        <path
          d="M16 16.5 C13.8 16.5 10 18.2 9.2 20.2 C11 21.2 14.2 19.5 16 16.5 Z"
          fill={fillColor}
        />
      </svg>

      {/* Brand Name "K A D I" in Tracked Serif Caps */}
      {variant !== 'mark' && (
        <span
          className={`font-serif uppercase font-semibold ${dimensions.text} ${dimensions.tracking} leading-none select-none`}
          style={{ color: fillColor }}
        >
          K A D I
        </span>
      )}
    </span>
  );
}
