'use client';

import React from 'react';
import { MovingInvitationGallery } from '@/components/landing/MovingInvitationGallery';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function KadiReferenceLanding() {
  return (
    <main className="w-full min-h-screen bg-[#284753]">
      {/* ── 1  THE MOVING INVITATION GALLERY CANVAS (SCROLLABLE CANVAS, MOVING UP AND DOWN) ── */}
      <MovingInvitationGallery />

      {/* ── 2  THE FOOTER SHOWING WHAT IT NEEDS TO SHOW ── */}
      <PublicFooter />
    </main>
  );
}
