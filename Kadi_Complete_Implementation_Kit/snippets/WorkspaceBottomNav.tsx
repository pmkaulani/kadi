'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Plus, SwatchBook } from 'lucide-react';

const ITEMS = [
  { label: 'Events', href: '/app/events', Icon: CalendarDays },
  { label: 'Templates', href: '/templates', Icon: SwatchBook },
];

/** Mobile-only navigation using routes already present in this Kadi source snapshot. */
export function WorkspaceBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="kadi-mobile-bottom-nav" aria-label="Workspace navigation">
      {ITEMS.map(({ label, href, Icon }) => {
        const active = pathname === href || (href !== '/app/events' && pathname.startsWith(href));
        return (
          <Link key={href} href={href} aria-current={active ? 'page' : undefined} className="kadi-mobile-bottom-nav__item">
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
      <Link href="/app/events/new" className="kadi-mobile-bottom-nav__create" aria-label="Create invitation">
        <Plus size={23} strokeWidth={2} aria-hidden="true" />
      </Link>
      <Link href="/faq" className="kadi-mobile-bottom-nav__item">
        <span className="kadi-mobile-bottom-nav__help-mark" aria-hidden="true">?</span>
        <span>Help</span>
      </Link>
    </nav>
  );
}
