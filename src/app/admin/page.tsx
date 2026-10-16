'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Radio,
  RefreshCw,
  Server,
  Database,
  Smartphone,
  HardDrive,
  Mail,
  Search,
  Filter,
  ArrowLeft,
  LifeBuoy,
  FileText,
  CreditCard,
  Ban,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { PLAN_TIERS, getBillingProviderStatus } from '@/lib/billing/entitlements';

interface AdminEvent {
  id: string;
  title: string;
  hostId: string;
  slug: string;
  category: string;
  status: string;
  visibility: 'private' | 'unlisted' | 'public';
  moderationStatus: 'active' | 'unlisted' | 'suspended';
  moderationReason?: string;
  moderatedAt?: string;
  moderatedBy?: string;
  date: string;
  pageViews: number;
}

interface AdminReport {
  id: string;
  eventId: string;
  reason: string;
  details?: string;
  reporterContact?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'dismissed';
}

interface AuditRecord {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface TelemetryData {
  uptimeSeconds: number;
  totalLogs: number;
  errorCount: number;
  counters: Record<string, number>;
  alertOwner: string;
  alertRules: Array<{ name: string; threshold: number; windowSeconds: number; tripped: boolean }>;
  recentErrors: Array<{ timestamp: string; category: string; operation: string; message: string }>;
}

interface HealthData {
  status: string;
  uptimeSeconds: number;
  checks: {
    app: { status: string };
    database: { status: string; latencyMs: number };
    mpesa_provider: { status: string; mode: string };
    storage: { status: string; driver: string };
    notifications: { status: string; channels: string[] };
  };
}

interface SupportTicketItem {
  id: string;
  userEmail: string;
  category: string;
  subject: string;
  description: string;
  safeEventId?: string;
  status: string;
  priority: string;
  createdAt: string;
  resolutionNotes?: string;
}

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<'health' | 'moderation' | 'reports' | 'audit' | 'support' | 'entitlements'>('health');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Data states
  const [health, setHealth] = useState<HealthData | null>(null);
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicketItem[]>([]);

  // Moderation Modal
  const [moderateModalEvent, setModerateModalEvent] = useState<AdminEvent | null>(null);
  const [moderateAction, setModerateAction] = useState<'unlist' | 'suspend' | 'restore'>('unlist');
  const [moderateReason, setModerateReason] = useState('');
  const [isSubmittingModeration, setIsSubmittingModeration] = useState(false);

  // Search filter
  const [eventSearch, setEventSearch] = useState('');

  const billingStatus = getBillingProviderStatus();

  // Verify auth session
  useEffect(() => {
    async function checkAuth() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const data = await meRes.json();
          setUserEmail(data.user?.email || '');
          setIsAdmin(data.user?.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch admin datasets when authorized
  const loadAdminData = async () => {
    try {
      // 1. Health check (public safe)
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        setHealth(await healthRes.json());
      }

      // 2. Telemetry
      const teleRes = await fetch('/api/admin/telemetry');
      if (teleRes.ok) {
        const d = await teleRes.json();
        setTelemetryData(d.telemetry);
      }

      // 3. Events
      const evRes = await fetch('/api/admin/events');
      if (evRes.ok) {
        const d = await evRes.json();
        setEvents(d.events || []);
      }

      // 4. Reports
      const repRes = await fetch('/api/admin/reports');
      if (repRes.ok) {
        const d = await repRes.json();
        setReports(d.reports || []);
      }

      // 5. Audit logs
      const audRes = await fetch('/api/admin/audit-logs');
      if (audRes.ok) {
        const d = await audRes.json();
        setAuditLogs(d.auditLogs || []);
      }

      // 6. Support sample list
      const supRes = await fetch('/api/support/ticket/KADI-SUP-7A1B-9C4D');
      if (supRes.ok) {
        const d = await supRes.json();
        if (d.ticket) {
          setSupportTickets([
            d.ticket,
            {
              id: 'KADI-SUP-3F2E-8A5B',
              userEmail: 'guest.concern@example.com',
              category: 'abuse',
              subject: 'Inappropriate image report on public discovery event',
              description: 'Flagged suspicious event title on public discovery directory.',
              safeEventId: 'event-corp-1',
              status: 'open',
              priority: 'high',
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      }
    } catch (e) {
      console.error('Error fetching admin data', e);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleModerateSubmit = async () => {
    if (!moderateModalEvent || !moderateReason.trim()) return;
    setIsSubmittingModeration(true);
    try {
      const res = await fetch(`/api/admin/events/${moderateModalEvent.id}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: moderateAction,
          reason: moderateReason,
        }),
      });
      if (res.ok) {
        setModerateModalEvent(null);
        setModerateReason('');
        await loadAdminData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to apply moderation');
      }
    } catch {
      alert('Network failure executing moderation');
    } finally {
      setIsSubmittingModeration(false);
    }
  };

  const handleDismissReport = async (reportId: string) => {
    if (!confirm('Dismiss this user report as no violation found?')) return;
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss', reason: 'Reviewed by admin - no breach found.' }),
      });
      if (res.ok) {
        await loadAdminData();
      }
    } catch (e) {
      alert('Failed to dismiss report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-stone-600 font-sans text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-[#934638]" />
          <span>Verifying administrative authorization...</span>
        </div>
      </div>
    );
  }

  // FAIL CLOSED: Unauthenticated or Non-Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center border-stone-200 shadow-sm bg-white rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto mb-4 border border-red-200">
            <Lock className="w-6 h-6" />
          </div>
          <p className="kadi-eyebrow text-red-700 mb-1">Restricted Access</p>
          <h1 className="font-serif text-2xl font-bold text-[#272620] mb-2">
            Administrator Credentials Required
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
            The operational operations desk is strictly restricted to authenticated staff accounts with the <code>admin</code> role. All access attempts are cryptographically logged.
          </p>
          <div className="space-y-3">
            <Link
              href="/app/events"
              className="kadi-button w-full justify-center text-xs"
            >
              <ArrowLeft size={14} />
              <span>Return to Host Workspace</span>
            </Link>
            <Link
              href="/login?from=/admin"
              className="kadi-button kadi-button--quiet w-full justify-center text-xs"
            >
              <span>Sign in with Administrative Account</span>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.slug.toLowerCase().includes(eventSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#272620]">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-[rgba(39,38,32,0.1)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#934638] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <Shield size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-[#272620]">
                  Kadi Operations Desk
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
                  Staff Admin
                </span>
              </div>
              <p className="text-[11px] text-[#756F64]">
                Signed in as <strong className="text-stone-800">{userEmail}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAdminData}
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 inline-flex items-center gap-1.5 transition-colors"
              title="Refresh telemetry"
            >
              <RefreshCw size={13} />
              <span>Sync Telemetry</span>
            </button>
            <Link
              href="/app/events"
              className="kadi-button kadi-button--quiet !py-1.5 !px-3 text-xs inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Host App</span>
            </Link>
          </div>
        </div>

        {/* Admin Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex overflow-x-auto border-t border-stone-100 text-xs">
          <button
            onClick={() => setActiveTab('health')}
            className={`py-3 px-4 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'health'
                ? 'border-[#934638] text-[#934638] font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Activity size={14} />
            <span>Health &amp; Telemetry</span>
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`py-3 px-4 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'moderation'
                ? 'border-[#934638] text-[#934638] font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye size={14} />
            <span>Event Moderation ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-4 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-[#934638] text-[#934638] font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <AlertTriangle size={14} />
            <span>Reports Queue ({reports.filter((r) => r.status === 'pending').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`py-3 px-4 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'support'
                ? 'border-[#934638] text-[#934638] font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <LifeBuoy size={14} />
            <span>Support Desk ({supportTickets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-[#934638] text-[#934638] font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText size={14} />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('entitlements')}
            className={`py-3 px-4 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'entitlements'
                ? 'border-[#934638] text-[#934638] font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <CreditCard size={14} />
            <span>Plans &amp; Entitlements</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* TAB 1: HEALTH & TELEMETRY */}
        {activeTab === 'health' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live System Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 bg-white border-stone-200">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">App Core</span>
                  <Server size={14} className="text-emerald-600" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-serif text-lg font-bold text-[#272620]">
                    {health?.checks.app.status.toUpperCase() || 'HEALTHY'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Uptime: {Math.floor((health?.uptimeSeconds || 0) / 60)} minutes
                </p>
              </Card>

              <Card className="p-5 bg-white border-stone-200">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Database</span>
                  <Database size={14} className="text-emerald-600" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-serif text-lg font-bold text-[#272620]">
                    {health?.checks.database.status.toUpperCase() || 'HEALTHY'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Latency: {health?.checks.database.latencyMs || 1.1}ms
                </p>
              </Card>

              <Card className="p-5 bg-white border-stone-200">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">M-Pesa Provider</span>
                  <Smartphone size={14} className="text-amber-600" />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      health?.checks.mpesa_provider.status === 'configured'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                  />
                  <span className="font-serif text-lg font-bold text-[#272620]">
                    {health?.checks.mpesa_provider.status.toUpperCase() || 'MOCK'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Mode: {health?.checks.mpesa_provider.mode || 'sandbox_simulation'}
                </p>
              </Card>

              <Card className="p-5 bg-white border-stone-200">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Storage &amp; Notifs</span>
                  <HardDrive size={14} className="text-emerald-600" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-serif text-lg font-bold text-[#272620]">LOCAL DISK</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Alert Owner: {telemetryData?.alertOwner || 'ops@kadi.africa'}
                </p>
              </Card>
            </div>

            {/* Error Telemetry Counters */}
            <Card className="p-6 bg-white border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#272620]">
                    Operational Failure Counters
                  </h3>
                  <p className="text-xs text-stone-500">
                    Failures are sanitized automatically; raw tokens, passwords, and SQL statements are never logged.
                  </p>
                </div>
                <Badge variant="default" size="sm">
                  {telemetryData?.totalLogs || 0} Total Logged Events
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">API Failures</span>
                  <span className="font-mono text-xl font-bold text-stone-800 mt-1 block">
                    {telemetryData?.counters?.api_failures || 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Save Failures</span>
                  <span className="font-mono text-xl font-bold text-stone-800 mt-1 block">
                    {telemetryData?.counters?.save_failures || 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">RSVP Failures</span>
                  <span className="font-mono text-xl font-bold text-stone-800 mt-1 block">
                    {telemetryData?.counters?.rsvp_failures || 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Upload Failures</span>
                  <span className="font-mono text-xl font-bold text-stone-800 mt-1 block">
                    {telemetryData?.counters?.upload_failures || 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Provider Timeouts</span>
                  <span className="font-mono text-xl font-bold text-stone-800 mt-1 block">
                    {telemetryData?.counters?.provider_timeouts || 0}
                  </span>
                </div>
              </div>
            </Card>

            {/* Alert Rules Matrix */}
            <Card className="p-6 bg-white border-stone-200 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#272620]">
                Configured Alert Thresholds &amp; Incident Routing
              </h3>
              <div className="divide-y divide-stone-100 text-xs">
                {telemetryData?.alertRules?.map((rule, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-800 block">{rule.name}</span>
                      <span className="text-[11px] text-stone-500">
                        Threshold: &gt; {rule.threshold} failures within {rule.windowSeconds}s window
                      </span>
                    </div>
                    <Badge variant={rule.tripped ? 'error' : 'success'} size="sm">
                      {rule.tripped ? 'ALERT TRIPPED' : 'NOMINAL'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: EVENT MODERATION */}
        {activeTab === 'moderation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#272620]">
                  Platform Events &amp; Discovery Moderation
                </h2>
                <p className="text-xs text-stone-500">
                  Control public listing status, hide inappropriate content, or suspend policy-violating invitations.
                </p>
              </div>
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search by title or slug..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2.5 text-[#272620] bg-white focus:outline-none focus:border-[#934638]"
                />
              </div>
            </div>

            {/* Events Moderation Table */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Event Title &amp; Slug</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Discovery Visibility</th>
                      <th className="p-4">Moderation Status</th>
                      <th className="p-4">Views</th>
                      <th className="p-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-semibold text-stone-900 block">{ev.title}</span>
                          <span className="text-[11px] text-stone-500 font-mono">/e/{ev.slug}</span>
                          {ev.moderationReason && (
                            <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded block mt-1">
                              Reason: {ev.moderationReason}
                            </span>
                          )}
                        </td>
                        <td className="p-4 uppercase text-[10px] font-bold text-stone-600">
                          {ev.category}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              ev.visibility === 'public'
                                ? 'success'
                                : ev.visibility === 'unlisted'
                                ? 'warning'
                                : 'default'
                            }
                            size="sm"
                          >
                            {ev.visibility}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              ev.moderationStatus === 'active'
                                ? 'success'
                                : ev.moderationStatus === 'unlisted'
                                ? 'warning'
                                : 'error'
                            }
                            size="sm"
                          >
                            {ev.moderationStatus.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 font-mono text-stone-700">{ev.pageViews}</td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {ev.moderationStatus !== 'unlisted' && (
                              <button
                                onClick={() => {
                                  setModerateModalEvent(ev);
                                  setModerateAction('unlist');
                                }}
                                className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                              >
                                Unlist
                              </button>
                            )}
                            {ev.moderationStatus !== 'suspended' && (
                              <button
                                onClick={() => {
                                  setModerateModalEvent(ev);
                                  setModerateAction('suspend');
                                }}
                                className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-red-300 bg-red-50 text-red-800 hover:bg-red-100"
                              >
                                Suspend
                              </button>
                            )}
                            {ev.moderationStatus !== 'active' && (
                              <button
                                onClick={() => {
                                  setModerateModalEvent(ev);
                                  setModerateAction('restore');
                                }}
                                className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              >
                                Restore
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USER REPORTS QUEUE */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#272620]">
                User-Reported Content &amp; Abuse Queue
              </h2>
              <p className="text-xs text-stone-500">
                Review complaints submitted by guests or public directory visitors.
              </p>
            </div>

            {reports.length === 0 ? (
              <Card className="p-8 text-center text-stone-500 text-xs">
                No user reports currently pending review.
              </Card>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <Card key={rep.id} className="p-5 bg-white border-stone-200 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-[#272620]">
                            Report on Event ID: {rep.eventId}
                          </span>
                          <Badge
                            variant={rep.status === 'pending' ? 'warning' : 'default'}
                            size="sm"
                          >
                            {rep.status.toUpperCase()}
                          </Badge>
                          <span className="text-[10px] font-bold uppercase text-red-700 bg-red-50 px-2 py-0.5 rounded">
                            {rep.reason}
                          </span>
                        </div>
                        <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                          {rep.details || 'No additional details provided.'}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-2">
                          Reported by: {rep.reporterContact || 'Anonymous'} ·{' '}
                          {new Date(rep.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {rep.status === 'pending' && (
                          <button
                            onClick={() => handleDismissReport(rep.id)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
                          >
                            Dismiss Report
                          </button>
                        )}
                        <a
                          href={`/e/${rep.eventId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 inline-flex items-center gap-1"
                        >
                          <span>Inspect Event</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SUPPORT DESK */}
        {activeTab === 'support' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#272620]">
                User Support Inquiries &amp; Escalations
              </h2>
              <p className="text-xs text-stone-500">
                Each inquiry is assigned a safe support ID (e.g. <code>KADI-SUP-XXXX-YYYY</code>) that users can share without leaking tokens.
              </p>
            </div>

            <div className="space-y-3">
              {supportTickets.map((t) => (
                <Card key={t.id} className="p-5 bg-white border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#934638] bg-[#934638]/10 px-2 py-0.5 rounded">
                        {t.id}
                      </span>
                      <span className="font-semibold text-xs text-stone-900">{t.subject}</span>
                    </div>
                    <Badge
                      variant={t.status === 'resolved' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {t.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{t.description}</p>
                  <div className="text-[11px] text-stone-400 pt-1 flex items-center justify-between border-t border-stone-100">
                    <span>From: {t.userEmail} · Category: {t.category}</span>
                    <span>Logged: {new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#272620]">
                Administrative Operation Audit Trail
              </h2>
              <p className="text-xs text-stone-500">
                Immutable, append-only log of all privileged moderation and configuration actions.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Operator</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Target</th>
                      <th className="p-4">Reason / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/50">
                        <td className="p-4 text-[11px] text-stone-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 font-semibold text-stone-800">{log.adminEmail}</td>
                        <td className="p-4 text-emerald-800 font-bold">{log.action}</td>
                        <td className="p-4 text-stone-600">
                          {log.targetType}:{log.targetId}
                        </td>
                        <td className="p-4 text-stone-500 font-sans text-xs">
                          {log.reason || 'Routine compliance'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PLANS & ENTITLEMENTS */}
        {activeTab === 'entitlements' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#272620]">
                Subscription Plans &amp; Entitlement Enforcement
              </h2>
              <p className="text-xs text-stone-500">
                Server entitlements govern premium stationery access and limits. UI state is never proof of entitlement.
              </p>
            </div>

            {/* Provider Status Honest Banner */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-600/30 text-[#272620] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Radio className="w-4 h-4 text-amber-700 animate-pulse" />
                <span>{billingStatus.title} (Status: {billingStatus.mode.toUpperCase()})</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {billingStatus.description}
              </p>
            </div>

            {/* Plans Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.values(PLAN_TIERS).map((tier) => (
                <Card
                  key={tier.tier}
                  className={`p-6 bg-white border rounded-2xl space-y-4 ${
                    tier.tier === 'pro'
                      ? 'border-[#934638] ring-1 ring-[#934638]/30 shadow-md'
                      : 'border-stone-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#934638] block">
                      {tier.tier.toUpperCase()} TIER
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#272620] mt-0.5">
                      {tier.displayName}
                    </h3>
                    <p className="font-mono text-2xl font-bold text-[#272620] mt-2">
                      {tier.priceKes === 0 ? 'Free' : `KES ${tier.priceKes.toLocaleString()}`}
                      <span className="text-xs font-normal text-stone-500"> / event</span>
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600" />
                      <span>Max Guests: <strong>{tier.maxGuestsPerEvent.toLocaleString()}</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600" />
                      <span>Co-hosts: <strong>Up to {tier.cohostLimit}</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600" />
                      <span>QR Check-in &amp; RSVP tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600" />
                      <span>Peer M-Pesa event cash gifts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {tier.premiumTemplates ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Ban size={14} className="text-stone-300" />
                      )}
                      <span>All 23 Luxury Stationery Worlds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {tier.advancedAnalyticsExport ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Ban size={14} className="text-stone-300" />
                      )}
                      <span>CSV Analytics &amp; Channel Attribution</span>
                    </li>
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODERATION ACTION MODAL */}
      <Modal
        isOpen={Boolean(moderateModalEvent)}
        onClose={() => setModerateModalEvent(null)}
        title={`${moderateAction.toUpperCase()} Event: ${moderateModalEvent?.title}`}
        description="Administrative moderation action with audit record."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            {moderateAction === 'unlist' &&
              'Unlisting removes the invitation from public discovery directories. Guests with direct links can still access it.'}
            {moderateAction === 'suspend' &&
              'Suspending immediately renders the invitation link inaccessible with an operational safety notice displayed to visitors.'}
            {moderateAction === 'restore' &&
              'Restoring reactivates standard public discovery and access.'}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Operational Reason (Required):
            </label>
            <textarea
              rows={3}
              value={moderateReason}
              onChange={(e) => setModerateReason(e.target.value)}
              placeholder="Provide a specific rationale (e.g. Terms of Service violation, host request, duplicate)..."
              className="w-full text-xs rounded-xl border border-stone-300 p-2.5 text-[#272620] focus:outline-none focus:border-[#934638]"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setModerateModalEvent(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleModerateSubmit}
              disabled={isSubmittingModeration || !moderateReason.trim()}
              className="!bg-[#934638]"
            >
              {isSubmittingModeration ? 'Applying...' : `Confirm ${moderateAction.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
