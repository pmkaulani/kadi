'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/Input';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { ArrowUpRight, Mail, Lock, User, ShieldCheck, ArrowLeft } from 'lucide-react';

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
      const payload =
        mode === 'signin'
          ? { email: email.trim(), password }
          : { email: email.trim(), name: name.trim(), password };

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
    <main className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#F8FAFC] text-[#0F172A] grid lg:grid-cols-2">
      {/* Left Column: Visual Brand & Editorial Preview */}
      <section className="relative bg-[#0B1A1D] text-white overflow-hidden flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12">
        <Link href="/" aria-label="Kadi home" className="relative z-10 self-start">
          <Logo size="md" color="#D4AF37" />
        </Link>

        <div className="relative z-10 max-w-lg py-4 my-auto">
          <p className="kadi-eyebrow text-[#D4AF37] mb-2 text-[10px] tracking-[0.2em] font-bold uppercase">
            Your Private Invitation Studio
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
            Make room for <em className="text-[#14B8A6] italic font-normal">the moment.</em>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mt-3">
            Design the letter. Gather your people. Keep every important detail in one place.
          </p>

          <div className="mt-6 max-w-[320px] p-2.5 bg-white/10 shadow-2xl rounded-xl -rotate-1 border border-white/15 backdrop-blur-md">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-800 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.sampleData.heroImage || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80'}
                alt="Stationery aesthetic flatlay"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[9px] uppercase tracking-wider text-white/80 font-medium">Fine Digital Stationery</p>
                <p className="font-serif text-lg mt-0.5 leading-none">The day begins here.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[.15em] text-slate-400">
          <span>Invitations, with feeling.</span>
          <span>Kenya · Mobile first</span>
        </div>
      </section>

      {/* Right Column: Clean, Screen-Fitting Form Container */}
      <section className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-6 lg:py-8 overflow-y-auto bg-white">
        <div className="w-full max-w-[380px] mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0D9488] mb-3 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Kadi</span>
          </Link>

          <div className="border-b border-slate-200 pb-3 mb-4">
            <div className="flex gap-4 border-b border-slate-100 pb-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`text-xs uppercase tracking-wider font-semibold pb-1 border-b-2 transition-colors ${
                  mode === 'signin'
                    ? 'border-[#0D9488] text-[#0D9488]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
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
                    ? 'border-[#0D9488] text-[#0D9488]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Workspace
              </button>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-slate-900">
              {mode === 'signin' ? 'Welcome back.' : 'Begin your invitation.'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              {mode === 'signin'
                ? 'Your invitations, guest replies and event details are waiting.'
                : 'Create a host workspace to design invitations and manage guest lists.'}
            </p>
          </div>

          {error && (
            <p role="alert" className="text-xs text-rose-600 border-l-2 border-rose-600 pl-2.5 py-1 mb-3 bg-rose-50/50">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <Input
                label="Full Name or Host Title"
                type="text"
                placeholder="e.g. Peter Kaulani"
                value={name}
                onChange={(event) => setName(event.target.value)}
                leftIcon={<User className="w-3.5 h-3.5" />}
                required
              />
            )}
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              leftIcon={<Mail className="w-3.5 h-3.5" />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              leftIcon={<Lock className="w-3.5 h-3.5" />}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="kadi-button w-full justify-between mt-2 py-2.5 !min-h-[42px] text-xs font-semibold disabled:opacity-60 shadow-sm bg-[#0F766E] hover:bg-[#0D5F58]"
            >
              <span>
                {isLoading
                  ? 'Verifying session…'
                  : mode === 'signin'
                    ? 'Sign in to Studio'
                    : 'Create Workspace'}
              </span>
              <ArrowUpRight size={15} />
            </button>
          </form>

          {/* Quick Demo Access Box */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Demo Access
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                <ShieldCheck size={11} className="text-emerald-600" />
                Verified Peter Kaulani
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight mb-2">
              Explore the studio as <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">host@kadi.co.ke</code>.
            </p>
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={isLoading}
              className="kadi-button kadi-button--quiet w-full justify-between py-2 !min-h-[38px] text-xs disabled:opacity-60 border-slate-200 hover:bg-slate-50"
            >
              <span>Sign in with demo credentials</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <p className="text-[10px] text-slate-400 mt-3 leading-tight text-center">
            Secured with encrypted HTTP-only session cookies.
          </p>
        </div>
      </section>
    </main>
  );
}
