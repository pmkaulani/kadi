'use client';

import React from 'react';
import { MovingInvitationGallery } from '@/components/landing/MovingInvitationGallery';
import { EnvelopeAtelier } from '@/components/landing/EnvelopeAtelier';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function KadiReferenceLanding() {
  return (
    <main className="w-full min-h-screen bg-[#F7F2EA]">
      {/* ── 1  THE MOVING INVITATION GALLERY CANVAS (SCROLLABLE CANVAS, MOVING UP AND DOWN) ── */}
      <MovingInvitationGallery />

      {/* A working envelope, liner and portrait-letter opening experience. */}
      <EnvelopeAtelier />

      {/* ── 3  THE FOOTER SHOWING WHAT IT NEEDS TO SHOW ── */}
      <PublicFooter />
    </main>
  );
}
