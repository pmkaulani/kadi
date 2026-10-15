import { TEMPLATES } from '@/lib/templates/catalogue';
import { EVENT_CATEGORY_LABELS } from '@/lib/events/categories';
import type { KadiHeroSlide } from '@/components/landing/KadiFullViewportHero';

/**
 * Lead with the Kadi envelope image, then show genuinely different occasions.
 * Once template entries grow, one slide per available category is selected;
 * no category is silently represented by the first wedding template.
 */
export const KADI_HERO_SLIDES: KadiHeroSlide[] = (() => {
  const representativeTemplates = TEMPLATES.filter((template, index, all) =>
    all.findIndex((candidate) => candidate.category === template.category) === index,
  ).slice(0, 6);

  return [
    {
      id: 'kadi-signature',
      image: '/kadi/hero-envelope.webp',
      category: 'The Kadi experience',
      alt: 'A burgundy invitation envelope with a detailed wax seal in warm candlelight',
      objectPosition: '68% 50%',
    },
    ...representativeTemplates.map((template) => ({
      id: `occasion-${template.category}`,
      image: template.sampleData.heroImage,
      category: EVENT_CATEGORY_LABELS[template.category],
      alt: `${EVENT_CATEGORY_LABELS[template.category]} invitation inspiration: ${template.name}`,
      objectPosition: '65% 50%',
    })),
  ];
})();
