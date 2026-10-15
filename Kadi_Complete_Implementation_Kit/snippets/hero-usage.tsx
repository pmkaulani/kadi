/* Example integration in src/app/page.tsx. Keep the content below the hero. */
import { KadiFullViewportHero } from '@/components/landing/KadiFullViewportHero';
import { KADI_HERO_SLIDES } from '@/lib/templates/landing-hero-slides';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function HomePage() {
  return (
    <div className="kadi-page">
      <KadiFullViewportHero slides={KADI_HERO_SLIDES} />
      <main>
        {/* Replace these comments with actual category rails and real catalogue cards. */}
        <section className="kadi-content" aria-labelledby="popular-occasions">
          <p className="kadi-kicker">A design for your kind of day</p>
          <h2 id="popular-occasions" className="kadi-display">Every occasion has its own feel.</h2>
          {/* Render OccasionRail + a template grid from TEMPLATES; do not hardcode mock records. */}
        </section>
        {/* Continue with how-it-works, product benefits and closing CTA. */}
      </main>
      <PublicFooter />
    </div>
  );
}
