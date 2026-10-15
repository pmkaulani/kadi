import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { TemplateDefinition } from '@/lib/templates/types';
import { OCCASION_BY_ID } from '@/lib/templates/occasion-art-direction';

type ResponsiveTemplateCardProps = {
  template: TemplateDefinition;
  index?: number;
  priority?: boolean;
};

/** Shared card for homepage, /templates and related template sections. */
export function ResponsiveTemplateCard({ template, index = 0, priority = false }: ResponsiveTemplateCardProps) {
  const category = OCCASION_BY_ID[template.category as keyof typeof OCCASION_BY_ID];
  const label = category?.label ?? template.category.replace(/-/g, ' ');
  const priorityImage = priority || index === 0;

  return (
    <article className="kadi-template-card">
      <Link href={`/templates/${template.id}`} className="kadi-template-card__image-link" aria-label={`Preview ${template.name}`}>
        <div className="kadi-template-card__image">
          <Image
            src={template.sampleData.heroImage}
            alt={`${label} invitation design: ${template.name}`}
            fill
            sizes="(max-width: 560px) 82vw, (max-width: 900px) 46vw, (max-width: 1320px) 30vw, 400px"
            {...(priorityImage ? { priority: true } : { loading: 'lazy' as const })}
            quality={82}
            unoptimized
          />
          <span className="kadi-template-card__occasion">{label}</span>
          <span className="kadi-template-card__open" aria-hidden="true"><ArrowUpRight size={18} /></span>
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
