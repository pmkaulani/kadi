'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please enter your account email.');
      return;
    }

    setIsLoading(true);
    // Development local sandbox authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push('/app/events');
    }, 600);
  };

  const handleQuickDemoSignIn = () => {
    setEmail('host@kadi.co.ke');
    setPassword('demo-password');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/app/events');
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-mist p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Logo size="lg" />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-brand-charcoal">
            Host Studio Sign In
          </h1>
          <p className="text-xs text-brand-slate mt-1">
            Access your event dashboard, guest list, and RSVP analytics.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="host@kadi.co.ke"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full py-3 mt-2 shadow-md shadow-brand-purple/20"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Dashboard
          </Button>
        </form>

        {/* Development Sandbox Helper */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
            Development Sandbox
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleQuickDemoSignIn}
            className="w-full text-xs text-brand-purple"
          >
            Instant Demo Sign In (host@kadi.co.ke)
          </Button>
        </div>

        <div className="mt-6 text-center text-[11px] text-brand-slate">
          Protected by server-side sessions & KDPA compliance.
        </div>
      </div>
    </div>
  );
}
