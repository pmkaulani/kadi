import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function WorkspaceLoading() {
  return (
    <div
      className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-pulse"
      aria-label="Loading workspace data"
      aria-busy="true"
    >
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(39,38,32,0.12)]">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-64 bg-[#E5DFD5]" />
          <Skeleton variant="text" className="h-4 w-96 bg-[#EDE7DD]" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton variant="rectangular" className="h-10 w-28 rounded-md bg-[#E5DFD5]" />
          <Skeleton variant="rectangular" className="h-10 w-36 rounded-md bg-[#D9D1C5]" />
        </div>
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-[rgba(39,38,32,0.12)] bg-white/60 space-y-3">
            <Skeleton variant="text" className="h-3 w-20 bg-[#EDE7DD]" />
            <Skeleton variant="text" className="h-8 w-16 bg-[#E5DFD5]" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl border border-[rgba(39,38,32,0.12)] bg-white/70 space-y-5">
            <Skeleton variant="rectangular" className="h-48 w-full rounded-xl bg-[#E5DFD5]" />
            <Skeleton variant="text" className="h-6 w-3/4 bg-[#E5DFD5]" />
            <Skeleton variant="text" className="h-4 w-1/2 bg-[#EDE7DD]" />
            <div className="flex gap-3 pt-2">
              <Skeleton variant="rectangular" className="h-9 w-24 rounded-md bg-[#E5DFD5]" />
              <Skeleton variant="rectangular" className="h-9 w-24 rounded-md bg-[#EDE7DD]" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border border-[rgba(39,38,32,0.12)] bg-white/70 space-y-4">
            <Skeleton variant="text" className="h-5 w-32 bg-[#E5DFD5]" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-3 py-3 border-b border-[rgba(39,38,32,0.06)] last:border-0">
                <Skeleton variant="circular" className="w-8 h-8 bg-[#E5DFD5]" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton variant="text" className="h-3.5 w-40 bg-[#E5DFD5]" />
                  <Skeleton variant="text" className="h-3 w-24 bg-[#EDE7DD]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
