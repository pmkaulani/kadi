'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, CircleHelp, Plus, SwatchBook } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { WorkspaceBottomNav } from '@/components/app/WorkspaceBottomNav';

const NAV_ITEMS = [
  { label: 'Your events', href: '/app/events', Icon: CalendarDays },
  { label: 'Design library', href: '/templates', Icon: SwatchBook },
];

type KadiWorkspaceShellProps = { children: ReactNode };

/**
 * Shared creator shell example. Integrate into src/app/app/layout.tsx only after
 * migrating its current route/auth helpers; do not create a second nested shell.
 */
export function KadiWorkspaceShell({ children }: KadiWorkspaceShellProps) {
  const pathname = usePathname();
  const pageTitle = pathname.includes('/new')
    ? 'Create an invitation'
    : pathname.includes('/events/') && pathname !== '/app/events'
      ? 'Event studio'
      : pathname.startsWith('/templates')
        ? 'Design library'
        : 'Your events';

  return (
    <div className="kadi-app-shell">
      <aside className="kadi-workspace-sidebar">
        <Link href="/app/events" className="kadi-workspace-brand" aria-label="Kadi workspace home">
          <Logo size="md" variant="monochrome" />
        </Link>
        <p className="kadi-workspace-sidebar__label">WORKSPACE</p>
        <nav className="kadi-workspace-sidebar__nav" aria-label="Main workspace navigation">
          {NAV_ITEMS.map(({ label, href, Icon }) => {
            const active = href === '/app/events'
              ? pathname.startsWith('/app/events')
              : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className="kadi-app-nav-link" aria-current={active ? 'page' : undefined}>
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="kadi-workspace-sidebar__bottom">
          <Link href="/faq"><CircleHelp size={16} aria-hidden="true" /> Help and guidance</Link>
          <Link href="/"><span aria-hidden="true">↗</span> Public website</Link>
        </div>
      </aside>

      <div className="kadi-workspace-main">
        <header className="kadi-app-topbar kadi-workspace-topbar">
          <div className="kadi-workspace-mobile-brand"><Link href="/app/events"><Logo size="sm" /></Link></div>
          <div className="kadi-workspace-breadcrumb"><span>Workspace</span><span aria-hidden="true">/</span><strong>{pageTitle}</strong></div>
          <Link href="/app/events/new" className="kadi-btn kadi-workspace-create"><Plus size={16} aria-hidden="true" /> <span>New invitation</span></Link>
        </header>
        <main className="kadi-workspace-content">{children}</main>
        <WorkspaceBottomNav />
      </div>
    </div>
  );
}
