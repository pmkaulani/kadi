'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Sparkles,
  Users,
  Settings,
  Plus,
  ExternalLink,
  LogOut,
} from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'My Events', href: '/app/events', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Browse Templates', href: '/templates', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      {/* Host App Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/app/events">
            <Logo size="md" />
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-purple-light text-brand-purple'
                      : 'text-brand-slate hover:text-brand-charcoal hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/app/events/new">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              New Event
            </Button>
          </Link>

          <Link href="/login">
            <button
              className="p-2 text-slate-400 hover:text-brand-charcoal rounded-xl hover:bg-slate-100 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
