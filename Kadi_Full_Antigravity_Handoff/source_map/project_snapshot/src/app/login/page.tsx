'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/Input';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { ArrowUpRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preview = TEMPLATES.find((item) => item.category === 'wedding') || TEMPLATES[0];

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Enter the email associated with your workspace.');
      return;
    }
    setIsLoading(true);
    // Prototype-only entry. Connect a verified authentication provider before launch.
    window.setTimeout(() => {
      setIsLoading(false);
      router.push('/app/events');
    }, 450);
  };

  const handleDemo = () => {
    setEmail('host@kadi.co.ke');
    setPassword('demo-password');
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      router.push('/app/events');
    }, 350);
  };

  return (
    <main className="min-h-screen bg-[#F6F2EA] text-[#272620] grid lg:grid-cols-2">
      <section className="relative min-h-[290px] lg:min-h-screen bg-[#EDE5D9] overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16">
        <Link href="/" aria-label="Kadi home" className="relative z-10 self-start"><Logo size="lg" /></Link>
        <div className="relative z-10 max-w-xl py-8">
          <p className="kadi-eyebrow text-[#934638] mb-5">Your private invitation studio</p>
          <h1 className="kadi-display text-5xl sm:text-6xl xl:text-7xl">Make room for <em className="text-[#934638]">the moment.</em></h1>
          <p className="text-sm sm:text-base text-[#756F64] leading-7 max-w-md mt-6">Design the letter. Gather your people. Keep every important detail in one place.</p>
          <div className="mt-10 max-w-[410px] p-3 bg-[#FBF8F1] shadow-[0_22px_60px_rgba(39,32,24,.12)] -rotate-[2deg]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#D9C8B6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.sampleData.heroImage} alt="Example invitation photography" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#272620]/65 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-[#fffaf2]">
                <p className="kadi-eyebrow text-white/75">A moment worth gathering for</p>
                <p className="font-serif text-3xl sm:text-4xl mt-2 leading-none">The day begins here.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 border-t border-[rgba(39,38,32,.18)] pt-4 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[.15em] text-[#756F64]">
          <span>Invitations, with feeling.</span><span>Kenya · Mobile first</span>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 sm:px-10 lg:px-14 py-12 lg:py-20">
        <div className="w-full max-w-[430px]">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#756F64] hover:text-[#934638] mb-12"><span aria-hidden="true">←</span> Back to Kadi</Link>
          <div className="border-b border-[rgba(39,38,32,.2)] pb-7 mb-8">
            <p className="kadi-eyebrow text-[#934638] mb-4">Welcome back</p>
            <h2 className="kadi-display text-4xl sm:text-5xl">Step back into your studio.</h2>
            <p className="text-sm text-[#756F64] leading-6 mt-4">Your invitations, guest replies and event details are waiting.</p>
          </div>

          {error && <p role="alert" className="text-sm text-[#934638] border-l-2 border-[#934638] pl-3 py-1 mb-5">{error}</p>}

          <form onSubmit={handleSignIn} className="space-y-6">
            <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} leftIcon={<Mail className="w-4 h-4" />} required />
            <Input label="Password" type="password" placeholder="Your password" value={password} onChange={(event) => setPassword(event.target.value)} leftIcon={<Lock className="w-4 h-4" />} required />
            <button type="submit" disabled={isLoading} className="kadi-button w-full justify-between mt-3 disabled:opacity-60">
              <span>{isLoading ? 'Opening your studio…' : 'Sign in to your studio'}</span><ArrowUpRight size={16} />
            </button>
          </form>

          <div className="mt-9 pt-6 border-t border-[rgba(39,38,32,.15)]">
            <p className="kadi-eyebrow text-[#8D867A] mb-3">Prototype access</p>
            <p className="text-xs text-[#756F64] leading-5 mb-4">Live authentication is not connected in this prototype. Use the demo workspace to explore the interface.</p>
            <button type="button" onClick={handleDemo} disabled={isLoading} className="kadi-button kadi-button--quiet w-full justify-between disabled:opacity-60">
              <span>Enter the demo studio</span><ArrowUpRight size={16} />
            </button>
          </div>
          <p className="text-[11px] text-[#8D867A] mt-7 leading-5">Authentication, account recovery and session security must be connected and verified before public launch.</p>
        </div>
      </section>
    </main>
  );
}
