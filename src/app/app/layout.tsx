'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Logo } from '@/components/ui/Logo';
import {
  Home,
  Mail,
  Compass,
  Users,
  MessageSquare,
  TrendingUp,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Plus,
  CircleHelp,
  ArrowUpRight,
  User,
  LogOut,
  CheckCircle2,
  X,
  LifeBuoy,
  Shield,
} from 'lucide-react';
import { WorkspaceBottomNav } from '@/components/app/WorkspaceBottomNav';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { SupportInquiryModal } from '@/components/ui/SupportInquiryModal';

const NAV_ITEMS = [
  { label: 'Home', href: '/app/events', icon: Home, key: 'home' },
  { label: 'Invitations', href: '/app/events?tab=invitations', icon: Mail, key: 'invitations' },
  { label: 'Explore Templates', href: '/app/templates', icon: Compass, key: 'templates' },
  { label: 'Guests & RSVPs', href: '/app/events?tab=guests', icon: Users, key: 'guests' },
  { label: 'Messages', href: '/app/events?tab=messages', icon: MessageSquare, key: 'messages' },
  { label: 'Insights', href: '/app/events?tab=insights', icon: TrendingUp, key: 'insights' },
  { label: 'Settings', href: '/app/events?tab=settings', icon: Settings, key: 'settings' },
];

function SidebarNavigation({ onOpenSupport }: { onOpenSupport?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'overview';
  const isEvents = pathname === '/app/events' || pathname === '/app';
  const isTemplates = pathname.startsWith('/app/templates') || pathname.startsWith('/templates');

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0 select-none">
      {/* Primary Navigation */}
      <nav className="flex flex-col px-3 pt-3 pb-1 gap-0.5 shrink-0" aria-label="Workspace navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          let active = false;
          if (item.key === 'templates') {
            active = isTemplates;
          } else if (isEvents) {
            if (item.key === 'home') {
              active = !currentTab || currentTab === 'overview';
            } else {
              active = currentTab === item.key;
            }
          }

          return (
            <Link
              key={item.key}
              href={item.href}
              data-active={active}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded text-[13px] transition-colors ${
                active
                  ? 'text-[#f5dfb8] bg-white/[0.08] font-medium shadow-sm'
                  : 'text-[#c8cbc4] hover:text-[#fffaf1] hover:bg-white/[0.04]'
              }`}
            >
              <Icon size={16} strokeWidth={1.7} className={active ? 'text-[#c4a16a]' : 'text-[#8b9188]'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Links */}
      <div className="mt-auto shrink-0 pt-4 pb-4 border-t border-white/[0.08] flex flex-col space-y-2.5">
        <button
          type="button"
          onClick={onOpenSupport}
          className="flex items-center gap-2 text-xs text-[#8c9288] hover:text-[#f5dfb8] transition-colors w-full text-left"
        >
          <LifeBuoy size={13} />
          <span>Support Desk</span>
        </button>
        <Link
          href="/faq"
          className="flex items-center gap-2 text-xs text-[#8c9288] hover:text-[#f5dfb8] transition-colors"
        >
          <CircleHelp size={13} />
          <span>Help & guidance</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-[#8c9288] hover:text-[#f5dfb8] transition-colors"
        >
          <ArrowUpRight size={13} />
          <span>View public website</span>
        </Link>
        <Link
          href="/admin"
          className="flex items-center gap-2 text-xs text-[#c4a16a]/80 hover:text-[#f5dfb8] transition-colors pt-1"
        >
          <Shield size={13} />
          <span>Operations Desk</span>
        </Link>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();


  // Interactive UI states for all controls
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // If this is a studio editor route (e.g. creating/customizing a new invitation),
  // render the standalone full-screen studio without dashboard navigation, headers, or sidebars.
  if (pathname?.startsWith('/app/events/new')) {
    return <>{children}</>;
  }
  const notifications = [
    { id: 1, title: 'Sarah Wanjiru RSVPed Yes', time: '2 hours ago', unread: true },
    { id: 2, title: 'David Mwangi sent a guest message', time: '4 hours ago', unread: true },
    { id: 3, title: 'Contribution received (KES 2,000)', time: '6 hours ago', unread: false },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/templates?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    setProfileOpen(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Continue to login
    }
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F2EA] text-[#292320] relative">
      {/* Dark Sidebar matching app-workspace-target.png - Fixed and persistent */}
      <aside className="kadi-workspace-sidebar hidden md:flex flex-col fixed inset-y-0 left-0 w-[250px] z-30 overflow-hidden bg-[#281F23] text-[#F5EFE5] border-r border-white/[0.09]">
        {/* Brand Header with Botanical Logo */}
        <div className="px-6 pt-7 pb-6 border-b border-white/[0.07] shrink-0">
          <Link href="/app/events" className="flex items-center gap-2 group">
            <Logo size="md" color="#D4AF37" />
          </Link>
        </div>

        {/* Primary Navigation */}
        <Suspense fallback={<div className="p-4 text-xs text-[#8c9288]">Loading navigation...</div>}>
          <SidebarNavigation onOpenSupport={() => setIsSupportOpen(true)} />
        </Suspense>
      </aside>

      {/* Workspace Main Surface offset by sidebar width on desktop */}
      <div className="md:pl-[250px] min-w-0 flex flex-col min-h-screen pb-16 md:pb-0">
        {/* Top Control Bar matching app-workspace-target.png */}
        <header className="h-[72px] px-4 sm:px-8 flex items-center justify-between gap-4 border-b border-[#D8CDC1]/80 bg-[#FBF8F2]/90 backdrop-blur-md sticky top-0 z-30">
          {/* Mobile Brand matching Phone 1 */}
          <div className="md:hidden">
            <Link href="/app/events" className="flex items-center gap-1.5">
              <Logo size="sm" color="#292320" />
            </Link>
          </div>

          {/* Search Bar on Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your events, templates or guests..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-full text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#7B3547] focus:bg-[#FFFCF7] transition-colors"
              />
            </div>
          </form>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto relative">
            {/* Mobile-only User Profile Avatar with interactive account sheet */}
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="sm:hidden relative w-8 h-8 rounded-full bg-[#7B3547] text-white flex items-center justify-center font-serif text-xs font-semibold tracking-wider border border-[#B99A62]/35 shadow-xs transition-transform active:scale-95 shrink-0 select-none"
              aria-label="User profile settings and sign out"
              aria-expanded={profileOpen}
            >
              PK
            </button>

            {/* Notification Bell with interactive dropdown (desktop/tablet) */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-black/[0.04]"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#7B3547] rounded-full" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[rgba(39,38,32,0.15)] rounded-lg shadow-xl z-50 p-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-[rgba(39,38,32,0.1)] pb-2 mb-3">
                    <span className="font-serif text-sm font-medium text-[#272620]">Activity & Updates</span>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[#8C8375] hover:text-[#272620]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div key={n.id} className="text-xs space-y-0.5">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-700 mt-0.5 shrink-0" />
                          <p className="text-[#272620] font-medium leading-tight">{n.title}</p>
                        </div>
                        <span className="text-[10px] text-[#9A9184] block pl-5">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown with interactive menu (desktop/tablet) */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1 bg-white/80 hover:bg-white border border-slate-200 rounded-full text-xs text-slate-800 transition-colors"
                aria-expanded={profileOpen}
              >
                <div className="w-6 h-6 rounded-full bg-[#7B3547] text-white flex items-center justify-center font-serif text-[10px] font-semibold select-none">
                  PK
                </div>
                <span className="font-medium">Peter Kaulani</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 text-xs divide-y divide-slate-100">
                  <div className="px-4 py-2">
                    <p className="font-medium text-slate-900">Peter Kaulani</p>
                    <p className="text-[10px] text-slate-400">peter@kaulani.com</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/app/events"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      <User size={13} />
                      <span>Host Studio</span>
                    </Link>
                    <Link
                      href="/app/events?tab=settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      <Settings size={13} />
                      <span>Account Settings</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setIsSupportOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 text-slate-700 text-left"
                    >
                      <LifeBuoy size={13} />
                      <span>Support Desk</span>
                    </button>
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 text-[#7B3547] font-medium"
                    >
                      <Shield size={13} />
                      <span>Operations Desk</span>
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-red-50 text-red-600 text-left"
                    >
                      <LogOut size={13} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Profile & Sign Out Bottom Sheet / Modal */}
            {profileOpen && (
              <div className="sm:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
                <div
                  className="fixed inset-0"
                  onClick={() => setProfileOpen(false)}
                  aria-hidden="true"
                />
                <div className="relative bg-white border-t border-slate-200 rounded-t-2xl p-5 shadow-2xl z-10 space-y-4 animate-in slide-in-from-bottom duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#7B3547] text-white flex items-center justify-center font-serif text-sm font-semibold tracking-wider">
                        PK
                      </div>
                      <div>
                        <p className="font-serif text-sm font-bold text-slate-900">Peter Kaulani</p>
                        <p className="text-xs text-slate-500">peter@kaulani.com</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfileOpen(false)}
                      className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                      aria-label="Close menu"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/app/events"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      <User size={15} className="text-[#7B3547]" />
                      <span>My Invitations & Events</span>
                    </Link>
                    <Link
                      href="/app/templates"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      <Compass size={15} className="text-[#7B3547]" />
                      <span>Explore Templates</span>
                    </Link>
                    <Link
                      href="/app/events?tab=settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      <Settings size={15} className="text-[#7B3547]" />
                      <span>Account Settings</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setIsSupportOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 text-left"
                    >
                      <LifeBuoy size={15} className="text-[#7B3547]" />
                      <span>Support &amp; Help Desk</span>
                    </button>
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-[#7B3547] hover:bg-slate-50"
                    >
                      <Shield size={15} className="text-[#7B3547]" />
                      <span>Operations Desk</span>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Prominent Create Action Button (desktop/tablet only, on mobile it is in the bottom bar) */}
            <div className="hidden sm:inline-flex">
              <Link
                href="/app/events/new"
                className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 text-xs font-semibold text-white bg-[#7B3547] hover:bg-[#622838] rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B3547] focus-visible:ring-offset-2 whitespace-nowrap"
              >
                <Plus size={15} />
                <span>Create Invitation</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Persistent Offline & Sync Status Banner */}
        <OfflineBanner />

        {/* Content Body */}
        <main className="flex-1 w-full px-4 sm:px-8 lg:px-10 py-5 sm:py-8 pb-28 sm:pb-8 bg-[#F7F2EA]">
          {children}
        </main>

        {/* Workspace Mobile Bottom Navigation */}
        <WorkspaceBottomNav />
      </div>

      {/* Safe Support & Content Reports Modal */}
      <SupportInquiryModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        userEmail="host@kadi.africa"
      />
    </div>
  );
}
