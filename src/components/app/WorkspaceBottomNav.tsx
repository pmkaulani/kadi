'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, Mail, Plus, Users, User } from 'lucide-react';

function BottomNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'overview';
  const isEvents = pathname === '/app/events' || pathname === '/app';
  const isTemplates = pathname.startsWith('/app/templates') || pathname.startsWith('/templates');

  const isHomeActive = isEvents && (!currentTab || currentTab === 'overview');
  const isInvitationsActive = (isEvents && currentTab === 'invitations') || isTemplates;
  const isGuestsActive = isEvents && currentTab === 'guests';
  const isProfileActive = isEvents && currentTab === 'settings';

  return (
    <nav className="kadi-mobile-bottom-nav" aria-label="Workspace navigation">
      {/* 1. Home */}
      <Link
        href="/app/events"
        aria-current={isHomeActive ? 'page' : undefined}
        className="kadi-mobile-bottom-nav__item"
      >
        <Home size={20} strokeWidth={isHomeActive ? 2.2 : 1.8} aria-hidden="true" />
        <span>Home</span>
      </Link>

      {/* 2. Invitations */}
      <Link
        href="/app/events?tab=invitations"
        aria-current={isInvitationsActive ? 'page' : undefined}
        className="kadi-mobile-bottom-nav__item"
      >
        <Mail size={20} strokeWidth={isInvitationsActive ? 2.2 : 1.8} aria-hidden="true" />
        <span>Invitations</span>
      </Link>

      {/* 3. Center FAB: Create */}
      <Link
        href="/app/events/new"
        className="kadi-mobile-bottom-nav__create"
        aria-label="Create invitation"
      >
        <Plus size={24} strokeWidth={2.4} aria-hidden="true" />
      </Link>

      {/* 4. Guests */}
      <Link
        href="/app/events?tab=guests"
        aria-current={isGuestsActive ? 'page' : undefined}
        className="kadi-mobile-bottom-nav__item"
      >
        <Users size={20} strokeWidth={isGuestsActive ? 2.2 : 1.8} aria-hidden="true" />
        <span>Guests</span>
      </Link>

      {/* 5. Profile */}
      <Link
        href="/app/events?tab=settings"
        aria-current={isProfileActive ? 'page' : undefined}
        className="kadi-mobile-bottom-nav__item"
      >
        <User size={20} strokeWidth={isProfileActive ? 2.2 : 1.8} aria-hidden="true" />
        <span>Profile</span>
      </Link>
    </nav>
  );
}

/** Mobile-only navigation matching 5-item reference design */
export function WorkspaceBottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavContent />
    </Suspense>
  );
}

