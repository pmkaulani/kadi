import React from 'react';
import { Logo } from '@/components/ui/Logo';

export default function GuestInvitationLoading() {
  return (
    <div
      className="min-h-screen bg-[#1F1916] text-[#FBF6ED] flex flex-col items-center justify-center p-6 text-center select-none"
      aria-label="Opening invitation..."
      aria-busy="true"
    >
      <div className="relative mb-6">
        <Logo size="md" variant="monochrome" className="text-[#EDE5D9]" />
        <div className="absolute -inset-6 rounded-full border border-[#D4AF37]/30 animate-ping opacity-25" />
      </div>

      {/* Envelope Silhouette Silhouette Skeleton */}
      <div className="w-64 h-40 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent animate-pulse" />
        <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center">
          <span className="font-serif italic text-xs text-[#D4AF37]">k.</span>
        </div>
      </div>

      <p className="kadi-eyebrow text-[#D4AF37] text-[10px] tracking-[0.25em]">
        Opening your invitation…
      </p>
    </div>
  );
}
