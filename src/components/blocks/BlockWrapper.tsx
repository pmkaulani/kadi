'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { CommonBlockSettings } from '@/lib/blocks/types';

interface BlockWrapperProps {
  settings: CommonBlockSettings;
  children: React.ReactNode;
  className?: string;
  id?: string;
  previewMode?: boolean;
}

export function BlockWrapper({
  settings,
  children,
  className = '',
  id,
  previewMode = false,
}: BlockWrapperProps) {
  // Padding map
  const paddingClass =
    settings.padding === 'compact'
      ? 'py-6 px-4 sm:px-6'
      : settings.padding === 'spacious'
        ? 'py-14 sm:py-20 px-4 sm:px-8'
        : 'py-10 sm:py-14 px-4 sm:px-6'; // comfortable

  // Max width map
  const maxWidthClass =
    settings.maxWidth === 'narrow'
      ? 'max-w-xl'
      : settings.maxWidth === 'wide'
        ? 'max-w-5xl'
        : settings.maxWidth === 'full'
          ? 'max-w-full'
          : 'max-w-3xl'; // standard

  // Text align map
  const textAlignClass =
    settings.textAlign === 'left'
      ? 'text-left'
      : settings.textAlign === 'right'
        ? 'text-right'
        : 'text-center'; // center

  // Corner radius map
  const cornerClass =
    settings.cornerStyle === 'square'
      ? 'rounded-none'
      : settings.cornerStyle === 'round'
        ? 'rounded-2xl'
        : settings.cornerStyle === 'pill'
          ? 'rounded-full'
          : 'rounded-lg'; // soft

  // Border style map
  const borderClass =
    settings.borderStyle === 'thin'
      ? 'border border-[rgba(39,38,32,0.12)]'
      : settings.borderStyle === 'thick'
        ? 'border-2 border-[rgba(39,38,32,0.2)]'
        : settings.borderStyle === 'dotted'
          ? 'border border-dashed border-[rgba(39,38,32,0.18)]'
          : 'border-0'; // none

  // Motion variants: in previewMode or with scrollMotion === 'none', do not hide behind opacity: 0
  const motionProps =
    settings.scrollMotion === 'none' || previewMode
      ? {
          initial: false,
          animate: { opacity: 1, y: 0, scale: 1, x: 0 },
        }
      : {
          initial: {
            opacity: 0,
            y: settings.scrollMotion === 'fade-up' ? 24 : 0,
            scale: settings.scrollMotion === 'scale-in' ? 0.95 : 1,
            x: settings.scrollMotion === 'slide-in' ? -20 : 0,
          },
          whileInView: { opacity: 1, y: 0, scale: 1, x: 0 },
          viewport: { once: true, amount: 0.05 },
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <motion.section
      id={id}
      className={`w-full mx-auto iv-stationery-page ${paddingClass} ${className}`.trim()}
      style={settings.background ? { backgroundColor: settings.background } : undefined}
      {...motionProps}
    >
      <div
        className={`w-full mx-auto ${maxWidthClass} ${textAlignClass} ${cornerClass} ${borderClass} transition-all`}
      >
        {children}
      </div>
    </motion.section>
  );
}
