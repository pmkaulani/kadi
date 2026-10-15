'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: ModalProps) {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const modalBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      previousActiveElement.current = (document.activeElement as HTMLElement) || null;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Focus the modal box or first interactive element
      requestAnimationFrame(() => {
        modalBoxRef.current?.focus?.();
      });
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        ref={modalBoxRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-desc' : undefined}
        className={`relative w-full ${maxWidths[maxWidth]} max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 transition-all transform scale-100 p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-200 outline-none`}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-brand-slate hover:text-brand-charcoal rounded-xl hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#934638]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <div className="mb-4 pr-10 shrink-0">
            <h3 id="modal-title" className="text-lg sm:text-xl font-serif font-bold text-brand-charcoal leading-snug">
              {title}
            </h3>
            {description && (
              <p id="modal-desc" className="text-xs sm:text-sm text-brand-slate mt-1">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="overflow-y-auto flex-1 overscroll-contain pb-[env(safe-area-inset-bottom)]">
          {children}
        </div>
      </div>
    </div>
  );
}
