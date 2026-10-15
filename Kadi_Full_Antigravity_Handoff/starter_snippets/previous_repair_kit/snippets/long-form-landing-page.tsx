'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2, MessageCircle, ShieldCheck, Users } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { KadiFullViewportHero } from '@/components/landing/KadiFullViewportHero';
import { KADI_HERO_SLIDES } from '@/lib/landing-hero-slides';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { EVENT_CATEGORY_LABELS } from '@/lib/events/categories';

const templateImage = (category: string, fallback: string) =>
  TEMPLATES.find((template) => template.category === category)?.sampleData.heroImage || fallback;

const occasions = [
  { title: 'Weddings', description: 'Ceremonies, receptions and the story behind them.', image: templateImage('wedding', '/kadi/category-wedding.webp'), imageAlt: 'Wedding invitation design', href: '/templates?category=wedding' },
  { title: 'Birthdays', description: 'Playful, colourful, elegant or all-out party.', image: templateImage('birthday', '/kadi/category-velvet.webp'), imageAlt: 'Birthday invitation design', href: '/templates?category=birthday' },
  { title: 'Graduations', description: 'Celebrate the work behind the milestone.', image: templateImage('graduation', '/kadi/category-celestial.webp'), imageAlt: 'Graduation invitation design', href: '/templates?category=graduation' },
  { title: 'Housewarmings', description: 'Open the door to a new chapter.', image: templateImage('housewarming', '/kadi/category-botanical.webp'), imageAlt: 'Housewarming invitation design', href: '/templates?category=housewarming' },
  { title: 'Memorials', description: 'Gather with care to honour a life.', image: templateImage('memorial', '/kadi/category-letter.webp'), imageAlt: 'Memorial invitation design', href: '/templates?category=memorial' },
  { title: 'Funerals', description: 'Share service details with dignity and clarity.', image: templateImage('funeral', '/kadi/category-letter.webp'), imageAlt: 'Funeral service announcement design', href: '/templates?category=funeral' },
  { title: 'Baby showers', description: 'A warm welcome for a little one.', image: templateImage('baby-shower', '/kadi/category-blush.webp'), imageAlt: 'Baby shower invitation design', href: '/templates?category=baby-shower' },
  { title: 'Work & community', description: 'Launches, reunions, fundraisers and more.', image: templateImage('corporate', '/kadi/category-celestial.webp'), imageAlt: 'Corporate gathering invitation design', href: '/templates?category=corporate' },
];

const featuredCategories = ['birthday', 'graduation', 'housewarming', 'funeral', 'baby-shower', 'corporate'];
const featuredTemplates = featuredCategories
  .map((category) => TEMPLATES.find((template) => template.category === category))
  .filter((template): template is (typeof TEMPLATES)[number] => Boolean(template));


export default function KadiReferenceLanding() {

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.documentElement.classList.add('kr-motion-ready');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    document.querySelectorAll<HTMLElement>('[data-kr-reveal]').forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('kr-motion-ready');
    };
  }, []);

  return (
    <main className="kr-site">
      <KadiFullViewportHero slides={KADI_HERO_SLIDES} />

      <section id="kr-occasions" className="kr-occasions" aria-labelledby="kr-occasions-title">
        <div className="kr-container">
          <div className="kr-section-heading" data-kr-reveal>
            <p className="kr-eyebrow">Templates for every occasion</p>
            <h2 id="kr-occasions-title">Choose a style that tells your story</h2>
          </div>
          <div className="kr-occasion-rail" aria-label="Browse invitation occasions">
            {occasions.map((occasion, index) => (
              <article className="kr-occasion" data-kr-reveal key={occasion.title} style={{ '--kr-delay': `${index * 80}ms` } as CSSProperties & { '--kr-delay': string }}>
                <Link href={occasion.href} className="kr-occasion__link">
                  <div className="kr-occasion__image-wrap">
                    <Image src={occasion.image} alt={occasion.imageAlt} fill sizes="(max-width: 680px) 46vw, (max-width: 1024px) 23vw, 18vw" loading="lazy" quality={78} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="kr-occasion__body">
                    <h3>{occasion.title}</h3>
                    <p>{occasion.description}</p>
                    <span className="kr-occasion__action">View Templates <ArrowRight size={13} /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kr-featured" aria-labelledby="kr-featured-title">
        <div className="kr-container">
          <div className="kr-featured__heading" data-kr-reveal>
            <div>
              <p className="kr-eyebrow">A growing design collection</p>
              <h2 id="kr-featured-title">Different moments. Different moods.</h2>
              <p>Start with a design that already feels right, then make it yours.</p>
            </div>
            <Link href="/templates" className="kr-text-link">Explore all templates <ArrowUpRight size={15} /></Link>
          </div>
          <div className="kr-featured__rail">
            {featuredTemplates.map((template, index) => (
              <article className="kr-featured__item" data-kr-reveal key={template.id} style={{ '--kr-delay': `${index * 65}ms` } as CSSProperties & { '--kr-delay': string }}>
                <Link href={`/templates/${template.id}`} className="kr-featured__visual">
                  <Image src={template.sampleData.heroImage} alt={`${template.name} invitation template`} fill sizes="(max-width: 680px) 78vw, (max-width: 1024px) 32vw, 30vw" loading="lazy" quality={78} style={{ objectFit: 'cover' }} />
                  <span className="kr-featured__category">{EVENT_CATEGORY_LABELS[template.category] || template.category}</span>
                </Link>
                <div className="kr-featured__meta">
                  <div><h3>{template.name}</h3><p>{template.description}</p></div>
                  <Link href={`/app/events/new?template=${template.id}`} className="kr-featured__use" aria-label={`Use ${template.name}`}><ArrowRight size={15} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="kr-how" aria-labelledby="kr-how-title">
        <div className="kr-how__image" data-kr-reveal>
          <Image src="/kadi/hero-phone.webp" alt="A mobile invitation displayed beside a sealed cream envelope and flowers" fill sizes="(max-width: 680px) 100vw, 50vw" loading="lazy" quality={82} style={{ objectFit: 'cover' }} />
          <Link href="/templates" className="kr-how__image-link" aria-label="Explore invitations"><ArrowUpRight size={18} /></Link>
        </div>
        <div className="kr-how__copy" data-kr-reveal>
          <p className="kr-eyebrow">How it works</p>
          <h2 id="kr-how-title">From envelope to experience</h2>
          <ol className="kr-steps">
            <li><span className="kr-step-number">01</span><div><h3>Choose your template</h3><p>Pick a style and customise it with your details.</p></div></li>
            <li><span className="kr-step-number">02</span><div><h3>Add your content</h3><p>Share your story, photos, venue, schedule and more.</p></div></li>
            <li><span className="kr-step-number">03</span><div><h3>Send & celebrate</h3><p>Get a unique link and share it with your guests.</p></div></li>
          </ol>
          <Link href="/app/events/new" className="kr-button kr-button--dark">Start Creating <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="kr-hosts" aria-labelledby="kr-hosts-title">
        <div className="kr-hosts__intro" data-kr-reveal>
          <p className="kr-eyebrow">Thoughtful from both sides</p>
          <h2 id="kr-hosts-title">Easy for the host.<br /><em>Lovely for the guest.</em></h2>
          <p>Create a personal invitation with the details guests actually need. They open the link, explore the event, and respond without having to create a Kadi account.</p>
          <Link href="/app/events/new" className="kr-button kr-button--dark">Create an invitation <ArrowRight size={15} /></Link>
        </div>
        <div className="kr-hosts__features">
          <article data-kr-reveal><span className="kr-hosts__icon"><Users size={18} /></span><div><h3>Know who&apos;s coming</h3><p>Keep guest lists, household invitations and responses together.</p></div></article>
          <article data-kr-reveal><span className="kr-hosts__icon"><MessageCircle size={18} /></span><div><h3>Share where people are</h3><p>Send a link through WhatsApp, SMS, email or a printed QR code.</p></div></article>
          <article data-kr-reveal><span className="kr-hosts__icon"><CalendarDays size={18} /></span><div><h3>Make the details useful</h3><p>Dates, venue directions and schedules are easy to find on a phone.</p></div></article>
          <article data-kr-reveal><span className="kr-hosts__icon"><ShieldCheck size={18} /></span><div><h3>Keep the experience clear</h3><p>Guest access is simple, with RSVP forms designed for the event.</p></div></article>
        </div>
      </section>

      <section className="kr-kenya" aria-labelledby="kr-kenya-title">
        <div className="kr-kenya__image" data-kr-reveal>
          <Image src="/kadi/hero-phone.webp" alt="A mobile digital invitation ready to share with family and friends" fill sizes="(max-width: 680px) 100vw, 46vw" loading="lazy" quality={82} style={{ objectFit: 'cover' }} />
        </div>
        <div className="kr-kenya__copy" data-kr-reveal>
          <p className="kr-eyebrow">Made for how we gather</p>
          <h2 id="kr-kenya-title">Local details.<br /><em>Personal touches.</em></h2>
          <p>From family celebrations in Nairobi to gatherings by the coast and upcountry, Kadi brings the invitation and the practical details into one place.</p>
          <ul>
            <li><CheckCircle2 size={16} /> Time and dates suited to East Africa</li>
            <li><CheckCircle2 size={16} /> M-Pesa contribution details when the host chooses to include them</li>
            <li><CheckCircle2 size={16} /> Mobile-first pages guests can open from a message</li>
          </ul>
          <Link href="/templates" className="kr-text-link">Find your occasion <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="kr-faq" aria-labelledby="kr-faq-title">
        <div className="kr-faq__heading" data-kr-reveal>
          <p className="kr-eyebrow">Before you begin</p>
          <h2 id="kr-faq-title">A few helpful answers.</h2>
        </div>
        <div className="kr-faq__list">
          <details data-kr-reveal><summary>Can I make invitations for occasions other than weddings?</summary><p>Yes. Kadi is intended for birthdays, graduations, housewarmings, baby showers, memorials, funerals, work events, reunions and other gatherings. Each occasion should use a visual style that suits the event.</p></details>
          <details data-kr-reveal><summary>Do guests need to sign up?</summary><p>Guests should be able to open an invitation and submit an RSVP without creating a Kadi account.</p></details>
          <details data-kr-reveal><summary>Can I change the invitation after choosing a template?</summary><p>Choose a starting design, then customize the event details, visual palette, stationery and content before sharing it.</p></details>
          <details data-kr-reveal><summary>Can I manage responses after sharing?</summary><p>The host workspace is designed to bring guest details and RSVP responses together so you can check attendance and follow up.</p></details>
        </div>
      </section>

      <section className="kr-closing" aria-labelledby="kr-closing-title">
        <div className="kr-closing__art" aria-hidden="true" />
        <div className="kr-closing__content" data-kr-reveal>
          <h2 id="kr-closing-title">Good things are better when shared.</h2>
          <p>Join people creating beautiful invitations with Kadi.</p>
          <Link href="/app/events/new" className="kr-button kr-button--paper">Get Started <ArrowRight size={15} /></Link>
        </div>
        <footer className="kr-footer-line">
          <Link href="/" aria-label="Kadi home" className="flex items-center gap-2">
            <Logo size="sm" color="#e4cf9c" />
          </Link>
          <span>Beautiful invitations for life’s most memorable moments.</span>
          <span className="kr-footer-line__right">Invitations, with feeling.</span>
        </footer>
      </section>
    </main>
  );
}
