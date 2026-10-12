import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', variant = 'full', size = 'md' }: LogoProps) {
  const dimensions = {
    sm: { icon: 24, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 32, text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 44, text: 'text-2xl', gap: 'gap-3' },
  }[size];

  return (
    <div className={`inline-flex items-center font-bold tracking-tight ${dimensions.gap} ${className}`}>
      {/* Precision Geometric SVG Icon: Folding envelope geometry & diamond crest */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="kadiGradPrimary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6B4EFF" />
            <stop offset="1" stopColor="#583BD9" />
          </linearGradient>
          <linearGradient id="kadiGradGold" x1="12" y1="8" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5B942" />
            <stop offset="1" stopColor="#E5A830" />
          </linearGradient>
          <filter id="kadiDrop" x="0" y="2" width="48" height="46" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1A1A2E" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Envelope Base Body */}
        <rect
          x="6"
          y="12"
          width="36"
          height="26"
          rx="5"
          fill="url(#kadiGradPrimary)"
          filter="url(#kadiDrop)"
        />

        {/* Inner Card Emergence Silhouette */}
        <rect
          x="10"
          y="7"
          width="28"
          height="16"
          rx="3"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />

        {/* Envelope Fold Facets */}
        <path
          d="M6 38L24 24L42 38"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />

        {/* Gold Seal Diamond Crest */}
        <path
          d="M24 19L29 25L24 31L19 25Z"
          fill="url(#kadiGradGold)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <circle cx="24" cy="25" r="1.5" fill="#1A1A2E" fillOpacity="0.3" />
      </svg>

      {variant !== 'mark' && (
        <span className={`${dimensions.text} font-serif tracking-wide text-brand-charcoal font-bold`}>
          Kadi<span className="text-brand-purple">.</span>
        </span>
      )}
    </div>
  );
}
