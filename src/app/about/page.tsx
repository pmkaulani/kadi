import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ArrowUpRight } from 'lucide-react';

const principles = [
  { number: '01', title: 'The feeling comes first', text: 'Digital does not have to mean disposable. We are interested in the anticipation of opening something made with care.' },
  { number: '02', title: 'Useful should feel effortless', text: 'Once the letter has opened, event details, replies and guest logistics should be clear and simple to use.' },
  { number: '03', title: 'Every occasion deserves its own voice', text: 'A wedding, a birthday and a memorial should never be forced into the same tone. The design and motion should respect the moment.' },
  { number: '04', title: 'Made for how people gather here', text: 'Kadi is being shaped around familiar ways of sharing invitations in Kenya, with mobile-first experiences and practical local event needs.' },
];

export default function AboutPage() {
  return (
    <div className="kadi-page min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="bg-[#EDE5D9] pt-16 md:pt-24 pb-16 md:pb-24">
          <div className="kadi-container grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6"><span className="kadi-ornament" /><p className="kadi-eyebrow text-[#934638]">Why we are making Kadi</p></div>
              <h1 className="kadi-display text-6xl sm:text-7xl md:text-[6.6rem]">An invitation is<br />a small act of <em className="text-[#934638]">care.</em></h1>
            </div>
            <div className="md:col-span-4 md:pt-24">
              <p className="font-serif text-2xl leading-snug tracking-[-.025em]">Not just an image in a chat. Not just another link. A moment of anticipation before someone discovers they are wanted there.</p>
              <p className="text-sm text-[#756F64] leading-7 mt-5">Kadi is being built to bring the tactility and thoughtfulness of printed stationery into the everyday reach of the web.</p>
            </div>
          </div>
        </section>
        <section className="bg-[#F6F2EA] py-16 md:py-24">
          <div className="kadi-container grid md:grid-cols-12 gap-9 md:gap-14">
            <div className="md:col-span-4">
              <p className="kadi-eyebrow text-[#934638] mb-5">The point of view</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight tracking-[-.04em]">Beautiful is not the opposite of useful.</h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="text-base md:text-lg text-[#756F64] leading-8">Printed invitations have presence and ceremony, but they take time to deliver and are difficult to update. Digital invitations are immediate, but too often they look like a form or a poster. We believe there is room for something more considered: an invitation with an opening, a story, and the details people need to be there.</p>
              <p className="text-base md:text-lg text-[#756F64] leading-8 mt-5">That means building the animation and the practical product together. The envelope is the first gesture; the guest list, event details, RSVP and accessible mobile experience are what make the gesture useful.</p>
            </div>
          </div>
        </section>
        <section className="bg-[#EDE5D9] py-16 md:py-24">
          <div className="kadi-container">
            <p className="kadi-eyebrow text-[#934638] mb-6">Our principles</p>
            <div className="border-t border-[rgba(39,38,32,.2)]">
              {principles.map((item) => <article key={item.number} className="grid grid-cols-[45px_minmax(0,1fr)] md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-[rgba(39,38,32,.2)]"><span className="font-serif italic text-2xl text-[#B99A62] md:col-span-1">{item.number}</span><h3 className="font-serif text-2xl md:text-3xl tracking-[-.03em] md:col-span-4">{item.title}</h3><p className="col-start-2 md:col-start-7 md:col-span-5 text-sm leading-7 text-[#756F64]">{item.text}</p></article>)}
            </div>
            <Link href="/templates" className="kadi-link inline-flex items-center gap-2 text-sm mt-9">Explore the invitation collection <ArrowUpRight size={15} /></Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
