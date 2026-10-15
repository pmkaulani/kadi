'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/Input';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { ArrowUpRight, Mail, Lock, User, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preview = TEMPLATES.find((item) => item.category === 'wedding') || TEMPLATES[0];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name or host title.');
      return;
    }

    if (mode === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/signup';
      const payload = mode === 'signin' ? { email: email.trim(), password } : { email: email.trim(), name: name.trim(), password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Session cookie is set by server via Set-Cookie
      router.push('/app/events');
    } catch {
      setError('A connection error occurred. Please check your network and try again.');
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setEmail('host@kadi.co.ke');
    setPassword('KadiHost2026!');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'host@kadi.co.ke', password: 'KadiHost2026!' }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/app/events');
      } else {
        setError(data.error || 'Failed to authenticate demo workspace.');
        setIsLoading(false);
      }
    } catch {
      setError('A network error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F2EA] text-[#272620] grid lg:grid-cols-2">
      <section className="relative min-h-[290px] lg:min-h-screen bg-[#EDE5D9] overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16">
        <Link href="/" aria-label="Kadi home" className="relative z-10 self-start">
          <Logo size="lg" />
        </Link>
        <div className="relative z-10 max-w-xl py-8">
          <p className="kadi-eyebrow text-[#934638] mb-5">Your private invitation studio</p>
          <h1 className="kadi-display text-5xl sm:text-6xl xl:text-7xl">
            Make room for <em className="text-[#934638]">the moment.</em>
          </h1>
          <p className="text-sm sm:text-base text-[#756F64] leading-7 max-w-md mt-6">
            Design the letter. Gather your people. Keep every important detail in one place.
          </p>
          <div className="mt-10 max-w-[410px] p-3 bg-[#FBF8F1] shadow-[0_22px_60px_rgba(39,32,24,.12)] -rotate-[2deg]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#D9C8B6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.sampleData.heroImage}
                alt="Example invitation photography"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#272620]/65 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-[#fffaf2]">
                <p className="kadi-eyebrow text-white/75">A moment worth gathering for</p>
                <p className="font-serif text-3xl sm:text-4xl mt-2 leading-none">The day begins here.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 border-t border-[rgba(39,38,32,.18)] pt-4 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[.15em] text-[#756F64]">
          <span>Invitations, with feeling.</span>
          <span>Kenya · Mobile first</span>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 sm:px-10 lg:px-14 py-12 lg:py-20">
        <div className="w-full max-w-[430px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#756F64] hover:text-[#934638] mb-10"
          >
            <span aria-hidden="true">←</span> Back to Kadi
          </Link>

          <div className="border-b border-[rgba(39,38,32,.2)] pb-6 mb-7">
            <div className="flex gap-4 border-b border-[rgba(39,38,32,.12)] pb-3 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`text-xs uppercase tracking-wider font-semibold pb-1 border-b-2 transition-colors ${
                  mode === 'signin'
                    ? 'border-[#934638] text-[#934638]'
                    : 'border-transparent text-[#756F64] hover:text-[#272620]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`text-xs uppercase tracking-wider font-semibold pb-1 border-b-2 transition-colors ${
                  mode === 'signup'
                    ? 'border-[#934638] text-[#934638]'
                    : 'border-transparent text-[#756F64] hover:text-[#272620]'
                }`}
              >
                Create Workspace
              </button>
            </div>

            <p className="kadi-eyebrow text-[#934638] mb-2">
              {mode === 'signin' ? 'Welcome back' : 'Start your studio'}
            </p>
            <h2 className="kadi-display text-4xl sm:text-5xl">
              {mode === 'signin' ? 'Step back into your studio.' : 'Begin your invitation.'}
            </h2>
            <p className="text-sm text-[#756F64] leading-6 mt-3">
              {mode === 'signin'
                ? 'Your invitations, guest replies and event details are waiting.'
                : 'Create an isolated host workspace to design invitations and manage guest lists.'}
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-[#934638] border-l-2 border-[#934638] pl-3 py-1 mb-5">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <Input
                label="Full Name or Host Title"
                type="text"
                placeholder="e.g. Peter Kaulani"
                value={name}
                onChange={(event) => setName(event.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
            )}
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="kadi-button w-full justify-between mt-3 disabled:opacity-60"
            >
              <span>
                {isLoading
                  ? 'Verifying session…'
                  : mode === 'signin'
                    ? 'Sign in to your studio'
                    : 'Create your workspace'}
              </span>
              <ArrowUpRight size={16} />
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-[rgba(39,38,32,.15)]">
            <div className="flex items-center justify-between mb-2">
              <p className="kadi-eyebrow text-[#8D867A]">Quick demo access</p>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#756F64]">
                <ShieldCheck size={12} className="text-emerald-700" />
                Verified host-1 session
              </span>
            </div>
            <p className="text-xs text-[#756F64] leading-5 mb-3">
              Explore the studio as Peter Kaulani (<code className="text-[11px] bg-black/5 px-1 py-0.5 rounded">host@kadi.co.ke</code>).
            </p>
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={isLoading}
              className="kadi-button kadi-button--quiet w-full justify-between disabled:opacity-60"
            >
              <span>Sign in with demo credentials</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

          <p className="text-[11px] text-[#8D867A] mt-6 leading-5">
            Sessions are secured with encrypted HTTP-only cookies. Guests and invitees RSVP without accounts.
          </p>
        </div>
      </section>
    </main>
  );
}
