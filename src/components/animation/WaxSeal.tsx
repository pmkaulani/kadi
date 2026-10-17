'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WaxSealProps {
  monogram?: string;
  color?: string;
  shape?: 'circle' | 'diamond' | 'shield' | 'oval';
  isPressed?: boolean;
  isBreaking?: boolean;
  className?: string;
  size?: number;
}

/**
 * Palette generator for authentic sealing wax:
 * Returns realistic lighting tones (base, deep shadow, subsurface glow, specular sheen, and embossed relief).
 */
function getWaxTonalValues(inputColor: string) {
  const c = inputColor.toLowerCase();

  // Antique Gold Foil Wax
  if (c.includes('d4af37') || c.includes('gold') || c.includes('b99a62') || c.includes('c5a059')) {
    return {
      base: '#B88E3E',
      sheen: '#FFF3DB',
      highlight: '#FFE8B2',
      bed: '#825F22',
      shadow: '#3E2B0C',
      reliefText: '#FFF6DF',
      reliefShadow: '#2E1E07',
      beadRim: '#CF9E45',
    };
  }

  // Deep Oxblood / Tuscan Terracotta Wax
  if (c.includes('934638') || c.includes('a51f31') || c.includes('red') || c.includes('a94f51') || c.includes('851e28')) {
    return {
      base: '#87232B',
      sheen: '#FFB8BF',
      highlight: '#D94A56',
      bed: '#5E131A',
      shadow: '#2B0609',
      reliefText: '#FFE5E8',
      reliefShadow: '#220407',
      beadRim: '#9E2A34',
    };
  }

  // Sage / Eucalyptus Botanical Wax
  if (c.includes('747d62') || c.includes('sage') || c.includes('green') || c.includes('5a6650')) {
    return {
      base: '#536B4F',
      sheen: '#E4F2E1',
      highlight: '#7EA278',
      bed: '#374B34',
      shadow: '#192518',
      reliefText: '#F0F8EE',
      reliefShadow: '#131D12',
      beadRim: '#64825F',
    };
  }

  // Default Warm Clay Wax
  return {
    base: inputColor,
    sheen: '#FFF2E6',
    highlight: '#E59B88',
    bed: '#6A2E24',
    shadow: '#290E0A',
    reliefText: '#FFF0EA',
    reliefShadow: '#1F0B08',
    beadRim: '#8E3E32',
  };
}

export function WaxSeal({
  monogram = 'K',
  color = '#934638',
  shape = 'circle',
  isPressed = false,
  isBreaking = false,
  className = '',
  size = 64,
}: WaxSealProps) {
  const tones = getWaxTonalValues(color);

  // Organic fluid melted wax contour (12 natural lobes with subtle asymmetrical pooling)
  const organicCirclePath =
    'M 60,6 C 76,5 89,10 100,21 C 111,32 117,47 115,64 C 113,80 106,94 93,105 C 80,115 63,117 48,114 C 33,111 20,102 12,88 C 4,74 4,57 9,42 C 14,27 25,15 40,9 C 47,6 54,7 60,6 Z';

  // Soft baroque lozenge with melted organic overflow
  const organicLozengePath =
    'M 60,6 C 74,15 90,30 106,47 C 114,56 113,64 105,73 C 90,90 74,105 60,114 C 46,105 30,90 15,73 C 7,64 6,56 14,47 C 30,30 46,15 60,6 Z';

  // Organic heraldic shield with natural wax puddling
  const organicShieldPath =
    'M 60,6 C 80,6 98,11 106,23 C 112,39 110,64 96,87 C 84,103 71,112 60,116 C 49,112 36,103 24,87 C 10,64 8,39 14,23 C 22,11 40,6 60,6 Z';

  const waxOutline =
    shape === 'diamond' ? organicLozengePath : shape === 'shield' ? organicShieldPath : organicCirclePath;

  const idSuffix = React.useId().replace(/:/g, '');

  return (
    <motion.span
      className={`relative block select-none ${className}`}
      style={{
        width: size,
        height: size,
        filter: isPressed
          ? 'drop-shadow(0 2px 4px rgba(25,12,10,0.5))'
          : 'drop-shadow(0 8px 16px rgba(25,12,10,0.32)) drop-shadow(0 2px 4px rgba(25,12,10,0.22))',
      }}
      animate={
        isPressed
          ? { scale: 0.92, y: 1.5 }
          : isBreaking
          ? { scale: 1.15, opacity: 0, rotate: 10 }
          : { scale: 1, y: 0 }
      }
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          {/* Main 3D Volume Gradient */}
          <radialGradient
            id={`wax-body-${idSuffix}`}
            cx="40%"
            cy="35%"
            r="60%"
            fx="35%"
            fy="30%"
          >
            <stop offset="0%" stopColor={tones.highlight} />
            <stop offset="35%" stopColor={tones.base} />
            <stop offset="85%" stopColor={tones.bed} />
            <stop offset="100%" stopColor={tones.shadow} />
          </radialGradient>

          {/* Meniscus / Top Rim Specular Arc */}
          <linearGradient
            id={`wax-specular-${idSuffix}`}
            x1="25%"
            y1="15%"
            x2="75%"
            y2="85%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="35%" stopColor={tones.sheen} stopOpacity="0.25" />
            <stop offset="70%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor={tones.shadow} stopOpacity="0.55" />
          </linearGradient>

          {/* Sunken Bed Debossed Gradient */}
          <radialGradient
            id={`wax-bed-${idSuffix}`}
            cx="48%"
            cy="46%"
            r="50%"
          >
            <stop offset="0%" stopColor={tones.base} />
            <stop offset="72%" stopColor={tones.bed} />
            <stop offset="100%" stopColor={tones.shadow} />
          </radialGradient>

          {/* Raised Bead Meniscus */}
          <linearGradient
            id={`wax-bead-light-${idSuffix}`}
            x1="30%"
            y1="20%"
            x2="70%"
            y2="80%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="40%" stopColor={tones.beadRim} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
          </linearGradient>
        </defs>

        {/* 1. Underlying Contact Shadow inside SVG for crisp grounding */}
        <path
          d={waxOutline}
          fill={tones.shadow}
          opacity="0.38"
          transform="translate(1.5, 3.5)"
          filter="blur(2px)"
        />

        {/* 2. Poured Molten Wax Base Pool */}
        <path
          d={waxOutline}
          fill={`url(#wax-body-${idSuffix})`}
          stroke={tones.shadow}
          strokeWidth="0.75"
          strokeOpacity="0.4"
        />

        {/* 3. Surface Sheen / Luster on Wax Flange */}
        <path
          d={waxOutline}
          fill={`url(#wax-specular-${idSuffix})`}
          style={{ mixBlendMode: 'screen' }}
          opacity="0.7"
        />

        {/* 4. Raised Outer Ring / Meniscus Bead (displaced by metal stamp) */}
        <circle
          cx="60"
          cy="60"
          r="41"
          fill="none"
          stroke={`url(#wax-bead-light-${idSuffix})`}
          strokeWidth="3.2"
        />

        {/* 5. Deep Sunken Bed Stamped by Matrix */}
        <circle
          cx="60"
          cy="60"
          r="38"
          fill={`url(#wax-bed-${idSuffix})`}
        />

        {/* 6. Inner Bed Shadow (Debossed Cavity Rim) */}
        <circle
          cx="60"
          cy="60"
          r="37.5"
          fill="none"
          stroke={tones.shadow}
          strokeWidth="1.6"
          opacity="0.75"
        />

        {/* 7. Classic Beaded Matrix Ring (Victorian Pearl Border) */}
        <circle
          cx="60"
          cy="60"
          r="34"
          fill="none"
          stroke={tones.highlight}
          strokeWidth="1.2"
          strokeDasharray="1.2 3.8"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* 8. Fine Hairline Inset Ring */}
        <circle
          cx="60"
          cy="60"
          r="30.5"
          fill="none"
          stroke={tones.highlight}
          strokeWidth="0.6"
          opacity="0.45"
        />

        {/* 9. Embossed Monogram / Crest with Dual-Chiseled Lighting */}
        {/* Under-shadow: Deep carved relief shadow offset downward */}
        <text
          x="60.8"
          y={monogram.length > 2 ? '65.2' : '67.2'}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-playfair), Georgia, serif"
          fontSize={monogram.length > 2 ? '17' : monogram.length === 2 ? '21' : '27'}
          fontWeight="600"
          fontStyle="italic"
          letterSpacing="-0.02em"
          fill={tones.reliefShadow}
          opacity="0.85"
        >
          {monogram}
        </text>

        {/* Upper-highlight: Top-left light catch on metal stamp relief */}
        <text
          x="59.4"
          y={monogram.length > 2 ? '63.6' : '65.6'}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-playfair), Georgia, serif"
          fontSize={monogram.length > 2 ? '17' : monogram.length === 2 ? '21' : '27'}
          fontWeight="600"
          fontStyle="italic"
          letterSpacing="-0.02em"
          fill="#FFFFFF"
          opacity="0.45"
        >
          {monogram}
        </text>

        {/* Crisp Stamped Face */}
        <text
          x="60"
          y={monogram.length > 2 ? '64.5' : '66.5'}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-playfair), Georgia, serif"
          fontSize={monogram.length > 2 ? '17' : monogram.length === 2 ? '21' : '27'}
          fontWeight="600"
          fontStyle="italic"
          letterSpacing="-0.02em"
          fill={tones.reliefText}
        >
          {monogram}
        </text>

        {/* 10. Heraldic Asterisms for Single / Double Monograms */}
        {monogram.length <= 2 && (
          <>
            <path
              d="M 60,34 L 60.8,36.5 L 63.5,36.5 L 61.3,38 L 62.1,40.5 L 60,39 L 57.9,40.5 L 58.7,38 L 56.5,36.5 L 59.2,36.5 Z"
              fill={tones.reliefText}
              opacity="0.75"
              transform="scale(0.8) translate(15, 6)"
            />
            <path
              d="M 60,82 L 60.8,84.5 L 63.5,84.5 L 61.3,86 L 62.1,88.5 L 60,87 L 57.9,88.5 L 58.7,86 L 56.5,84.5 L 59.2,84.5 Z"
              fill={tones.reliefText}
              opacity="0.75"
              transform="scale(0.8) translate(15, -4)"
            />
          </>
        )}
      </svg>
    </motion.span>
  );
}
