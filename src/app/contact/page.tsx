'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, MessageCircle, MapPin, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please provide your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    // Simulate brief network dispatch
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="kadi-page min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="bg-[#EDE5D9] pt-16 md:pt-24 pb-12 md:pb-16">
          <div className="kadi-container grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8"><div className="flex items-center gap-3 mb-6"><span className="kadi-ornament" /><p className="kadi-eyebrow text-[#934638]">A real person, on the other end</p></div><h1 className="kadi-display text-6xl sm:text-7xl md:text-[6.5rem]">Tell us what<br /><em className="text-[#934638]">you need.</em></h1></div>
            <p className="md:col-span-4 text-sm leading-7 text-[#756F64] max-w-sm md:pb-2">A question about an invitation, an idea for a template or a hand with your event? Send us a note.</p>
          </div>
        </section>
        <section className="bg-[#F6F2EA] py-14 md:py-20">
          <div className="kadi-container grid md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-4">
              <p className="kadi-eyebrow text-[#934638] mb-5">Contact details</p>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-.035em]">We would be glad to hear from you.</h2>
              <div className="mt-9 border-t border-[rgba(39,38,32,.2)]">
                <div className="flex gap-4 py-5 border-b border-[rgba(39,38,32,.16)]"><Mail className="w-5 h-5 text-[#934638] mt-1 shrink-0" strokeWidth={1.5} /><div><p className="font-serif text-xl">Email</p><p className="text-sm text-[#756F64] mt-1">support@kadi.co.ke</p></div></div>
                <div className="flex gap-4 py-5 border-b border-[rgba(39,38,32,.16)]"><MessageCircle className="w-5 h-5 text-[#934638] mt-1 shrink-0" strokeWidth={1.5} /><div><p className="font-serif text-xl">WhatsApp</p><p className="text-sm text-[#756F64] mt-1">+254 700 000 000</p><p className="text-xs text-[#8D867A] mt-1">Monday–Saturday, 8am–7pm EAT</p></div></div>
                <div className="flex gap-4 py-5 border-b border-[rgba(39,38,32,.16)]"><MapPin className="w-5 h-5 text-[#934638] mt-1 shrink-0" strokeWidth={1.5} /><div><p className="font-serif text-xl">Nairobi, Kenya</p><p className="text-sm text-[#756F64] mt-1">Westlands</p></div></div>
              </div>
              <p className="text-[11px] text-[#8D867A] leading-5 mt-5">The contact information above is placeholder information for this prototype and should be verified before public launch.</p>
            </div>

            <div className="md:col-span-7 md:col-start-6">
              {submitted ? (
                <div className="py-10 border-y border-[rgba(39,38,32,.2)]">
                  <CheckCircle2 className="w-8 h-8 text-[#747D62] mb-5" strokeWidth={1.4} />
                  <h3 className="font-serif text-3xl md:text-4xl">Your note is ready.</h3>
                  <p className="text-sm text-[#756F64] mt-3 leading-6 max-w-lg">Thank you for reaching out. This prototype has recorded the submitted state locally; a real contact delivery service still needs to be connected before launch.</p>
                  <button className="kadi-link inline-flex items-center gap-2 text-sm mt-6" onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); }}>Write another note <ArrowUpRight size={14} /></button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="border-y border-[rgba(39,38,32,.2)] py-6 md:py-8">
                  <div className="mb-7">
                    <p className="kadi-eyebrow text-[#934638] mb-3">Send a message</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-[-.035em]">What is on your mind?</h2>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-[#934638]/10 border border-[#934638]/20 text-[#934638] text-xs rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                    <Input
                      label="Your name"
                      placeholder="Name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                    <Input
                      label="Email address"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="mt-7">
                    <label htmlFor="contact-message" className="block text-[12px] font-medium text-[#625D53] mb-2">
                      Your message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell us a little about what you need…"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      required
                      disabled={isSubmitting}
                      className="w-full rounded-none border-0 border-b border-[rgba(39,38,32,.25)] bg-transparent px-0 py-3 text-sm text-[#272620] placeholder:text-[#A39B8E] focus:outline-none focus:ring-0 focus:border-[#934638] resize-y disabled:opacity-50"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-8">
                    <p className="text-[11px] text-[#8D867A] max-w-xs leading-5">
                      Please avoid including sensitive personal or payment information in your message.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="kadi-button self-start disabled:opacity-60"
                    >
                      <span>{isSubmitting ? 'Sending your note…' : 'Send your note'}</span>
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
