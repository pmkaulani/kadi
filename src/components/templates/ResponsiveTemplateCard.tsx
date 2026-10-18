import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { TemplateDefinition } from '@/lib/templates/types';
import type { DraftInvitationValues } from '@/lib/invitations/config';
import { getTemplateCanvasElements } from '@/lib/templates/canvas-defaults';
import { OCCASION_BY_ID } from '@/lib/templates/occasion-art-direction';
import { CanvasCardView } from '@/components/studio/canvas/CanvasCardView';

type ResponsiveTemplateCardProps = {
  template: TemplateDefinition;
  index?: number;
  priority?: boolean;
};

/**
 * Shared card for homepage, /templates and related template sections.
 * Show the real, art-directed portrait invitation—not just its source photo—
 * so the library previews the actual design the host will use.
 */
export function ResponsiveTemplateCard({ template }: ResponsiveTemplateCardProps) {
  const category = OCCASION_BY_ID[template.category as keyof typeof OCCASION_BY_ID];
  const label = category?.label ?? template.category.replace(/-/g, ' ');

  const previewValues: DraftInvitationValues = {
    title: template.sampleData.title,
    hosts: template.sampleData.hosts,
    celebrants: template.sampleData.celebrants,
    date: template.sampleData.date,
    time: template.sampleData.time,
    timezone: 'Africa/Nairobi',
    venue: template.sampleData.venue,
    city: template.sampleData.city,
    heroImage: template.sampleData.heroImage,
    galleryImages: template.sampleData.galleryImages || [],
    story: template.sampleData.story || '',
  };
  const canvasElements = getTemplateCanvasElements(template, previewValues);

  return (
    <article className="kadi-template-card">
      <Link
        href={`/templates/${template.id}`}
        className="kadi-template-card__image-link"
        aria-label={`Preview ${template.name}`}
      >
        <div
          className="kadi-template-card__image kadi-template-card__image--canvas"
          style={{ '--card-accent': template.palette.secondary || '#B99A62' } as CSSProperties}
        >
          <div className="kadi-template-card__canvas" aria-hidden="true">
            <CanvasCardView
              elements={canvasElements}
              cardBackground={template.palette.cardBackground}
              palette={{
                primary: template.palette.primary,
                secondary: template.palette.secondary,
                text: template.palette.text,
                cardBackground: template.palette.cardBackground,
              }}
              fit="contain"
            />
          </div>
          <span className="kadi-template-card__occasion">{label}</span>
          <span className="kadi-template-card__open" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
      <div className="kadi-template-card__copy">
        <div>
          <h3><Link href={`/templates/${template.id}`}>{template.name}</Link></h3>
          <p>{template.description}</p>
        </div>
        <Link className="kadi-template-card__action" href={`/app/events/new?template=${encodeURIComponent(template.id)}`}>
          Use design <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
