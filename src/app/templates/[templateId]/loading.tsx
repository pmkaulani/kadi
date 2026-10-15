import React from 'react';
import { Logo } from '@/components/ui/Logo';

export default function TemplateDetailLoading() {
  return (
    <div
      className="min-h-screen bg-[#F6F2EA] flex flex-col items-center justify-center p-6 text-center select-none"
      aria-label="Loading design preview"
      aria-busy="true"
    >
      <div className="relative mb-6">
        <Logo size="md" />
        <div className="absolute -inset-4 rounded-full border border-[#934638]/20 animate-ping opacity-30" />
      </div>

      <div className="w-32 h-0.5 bg-[#EDE5D9] overflow-hidden rounded-full mb-4">
        <div className="w-full h-full bg-[#934638] origin-left animate-pulse" />
      </div>

      <p className="kadi-eyebrow text-[#8D867A] text-[10px] tracking-[0.2em]">
        Loading stationery preview…
      </p>
    </div>
  );
}
