'use client';

import React, { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { getTemplateById } from '@/lib/templates/catalogue';
import { InvitationRenderer } from '@/components/invitations/InvitationRenderer';
import { buildTemplatePreviewInvitationConfig } from '@/lib/invitations/config';
import type { AnimationPhase } from '@/components/animation/EnvelopeRenderer';
import { Logo } from '@/components/ui/Logo';
import { ArrowLeft, Sparkles } from 'lucide-react';

function TemplateDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const templateId = params?.templateId as string;
  const phaseParam = searchParams.get('phase') as AnimationPhase | null;
  const template = getTemplateById(templateId);

  const config = useMemo(() => {
    if (!template) return null;
    return buildTemplatePreviewInvitationConfig(template, {
      guestName: 'Hon. & Mrs. Anyango',
      initialPhase: phaseParam || undefined,
    });
  }, [template, phaseParam]);

  if (!template || !config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F6F2EA] text-center text-[#272620]">
        <Logo size="lg" />
        <p className="kadi-eyebrow text-[#934638] mt-12">Design not found</p>
        <h1 className="font-serif text-4xl sm:text-5xl mt-4">This invitation has moved.</h1>
        <p className="text-sm text-[#756F64] mt-3 mb-7 max-w-md leading-6">The design may have been renamed or removed from the collection.</p>
        <Link href="/templates" className="kadi-button">Return to the collection <ArrowLeft size={15} /></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Lightweight controls keep the invitation itself as the focus */}
      <div className="sticky top-0 z-50 w-full bg-[#F6F2EA]/95 backdrop-blur-md text-[#272620] border-b border-[rgba(39,38,32,.16)] px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/templates" aria-label="Back to invitation collection" className="w-9 h-9 shrink-0 border border-[rgba(39,38,32,.2)] flex items-center justify-center hover:border-[#934638] hover:text-[#934638] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/" className="hidden sm:block shrink-0"><Logo size="sm" /></Link>
          <div className="min-w-0 sm:ml-3 sm:pl-5 sm:border-l sm:border-[rgba(39,38,32,.17)]">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base sm:text-lg truncate">{template.name}</h2>
              <span className="hidden md:inline text-[9px] uppercase tracking-[.16em] text-[#934638] border-l border-[rgba(39,38,32,.2)] pl-2">Live preview</span>
            </div>
            <p className="text-[10px] text-[#756F64] hidden sm:block">{template.liner.name} liner · {template.category} suite</p>
          </div>
        </div>
        <Link href={`/app/events/new?template=${template.id}`} className="kadi-button !min-h-[40px] !py-2 !px-3 sm:!px-4 text-xs shrink-0"><Sparkles className="w-3.5 h-3.5" /><span className="hidden sm:inline">Make it yours</span><span className="sm:hidden">Use design</span></Link>
      </div>

      {/* Flagship Canonical Invitation Experience */}
      <div className="flex-1">
        <InvitationRenderer config={config} />
      </div>
    </div>
  );
}

export default function TemplateDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F6F2EA]">
          <div className="w-8 h-8 border-2 border-brand-terracotta border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TemplateDetailContent />
    </Suspense>
  );
}
