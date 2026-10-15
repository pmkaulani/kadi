import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

const steps = [
  { number: '01', title: 'Choose the feeling', description: 'Browse invitation suites for weddings, birthdays, baby showers, graduations, memorials and the gatherings that do not fit neatly into a category.' },
  { number: '02', title: 'Make it yours', description: 'Bring in your names, photographs, date, venue and words. Colours, paper details and motion are designed to belong together.' },
  { number: '03', title: 'Gather your people', description: 'Add guests one at a time or import a list. Give households their own invitation link and collect the answers you need.' },
  { number: '04', title: 'Send the letter', description: 'Share the invitation by WhatsApp or link. Guests open it in their browser — no app download, account or installation required.' },
  { number: '05', title: 'Keep the details together', description: 'Review replies, manage the guest list and update the practical information in one place.' },
];

export default function HowItWorksPage() {
  return (
    <div className="kadi-page min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="bg-[#EDE5D9] pt-16 md:pt-24 pb-14 md:pb-20">
          <div className="kadi-container grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6"><span className="kadi-ornament" /><p className="kadi-eyebrow text-[#934638]">From idea to opened letter</p></div>
              <h1 className="kadi-display text-6xl sm:text-7xl md:text-[6.6rem]">A few thoughtful<br /><em className="text-[#934638]">little steps.</em></h1>
            </div>
            <p className="md:col-span-4 text-sm md:text-base leading-7 text-[#756F64] max-w-sm md:pb-2">The invitation does the welcoming. Kadi takes care of the practical details that come after.</p>
          </div>
          <div className="kadi-container mt-12"><a href="#the-process" className="kadi-link inline-flex items-center gap-2 text-sm">Follow the process <ArrowDown size={14} /></a></div>
        </section>

        <section id="the-process" className="bg-[#F6F2EA] py-10 md:py-16">
          <div className="kadi-container">
            {steps.map((step, index) => (
              <article key={step.number} className="grid grid-cols-[44px_minmax(0,1fr)] md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 border-b border-[rgba(39,38,32,.18)]">
                <span className="font-serif italic text-2xl md:text-3xl text-[#B99A62] md:col-span-1">{step.number}</span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-[-.035em] md:col-span-4">{step.title}</h2>
                <div className="col-start-2 md:col-start-7 md:col-span-5 flex items-start justify-between gap-5">
                  <p className="text-sm leading-7 text-[#756F64] max-w-xl">{step.description}</p>
                  {index === 0 && <span className="hidden lg:block font-serif italic text-2xl text-[#934638]">begin</span>}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="bg-[#272620] text-[#F6F2EA] py-16 md:py-20">
          <div className="kadi-container grid md:grid-cols-12 gap-7 items-end">
            <div className="md:col-span-8"><p className="kadi-eyebrow text-[#B99A62] mb-5">Start with the moment</p><h2 className="kadi-display text-5xl md:text-6xl">The rest can unfold from there.</h2></div>
            <div className="md:col-span-4"><Link href="/templates" className="kadi-button bg-[#F6F2EA] !text-[#272620] !border-[#F6F2EA] hover:!bg-[#E8DDCE] hover:!border-[#E8DDCE]">Explore the collection <ArrowUpRight size={15} /></Link></div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
