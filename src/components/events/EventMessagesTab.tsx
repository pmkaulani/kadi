'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Users,
  CheckCircle2,
  XCircle,
  Smartphone,
  Mail,
  QrCode as QrIcon,
  Info,
  Calendar,
  Shield,
  Eye,
  Sliders,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { QrCode } from '@/components/ui/QrCode';
import { EventEntity, GuestHouseholdEntity, MessageJobEntity, MessageAuditRecordEntity, MessageChannel } from '@/lib/db/types';
import { MessagingService } from '@/lib/services/messaging-service';
import { NotificationService } from '@/lib/services/notification-service';

interface EventMessagesTabProps {
  event: EventEntity;
  guests: GuestHouseholdEntity[];
  userRole?: string;
  onRefresh?: () => void;
}

const TEMPLATE_PRESETS = [
  {
    name: 'Official Invitation',
    subject: 'Official Invitation: {EventTitle}',
    body: 'Dear {GuestName},\n\nYou are warmly invited to celebrate with us for {Celebrants} on {Date} at {Venue}.\n\nPlease view your personalized digital invitation and RSVP below:\n{InvitationLink}',
  },
  {
    name: 'RSVP Deadline Reminder',
    subject: 'RSVP Reminder: {EventTitle}',
    body: 'Dear {GuestName},\n\nWe hope to celebrate with you! A gentle reminder that RSVPs for {EventTitle} close on {RsvpDeadline}.\n\nPlease let us know if you can join us:\n{InvitationLink}',
  },
  {
    name: 'Programme & Venue Update',
    subject: 'Important Update: {EventTitle}',
    body: 'Dear {GuestName},\n\nPlease note an update regarding {EventTitle} on {Date}.\n\nVenue: {Venue}\nTime: {Time}\n\nReview the updated programme and directions:\n{InvitationLink}',
  },
  {
    name: 'Day-of-Event Arrival & Directions',
    subject: 'Today: {EventTitle} Arrival Information',
    body: 'Dear {GuestName},\n\nToday is the day! We look forward to welcoming you to {Venue} at {Time}.\n\nPlease have your check-in pass ready on your invitation page:\n{InvitationLink}',
  },
  {
    name: 'Thank You & Photo Gallery',
    subject: 'Thank You for Celebrating With Us!',
    body: 'Dear {GuestName},\n\nThank you so much for being part of our special celebration! Your presence made it unforgettable.\n\nYou can view the highlights and photo gallery here:\n{InvitationLink}',
  },
];

export function EventMessagesTab({
  event,
  guests,
  userRole = 'owner',
  onRefresh,
}: EventMessagesTabProps) {
  const [subTab, setSubTab] = useState<'compose' | 'history' | 'share' | 'preferences'>('compose');

  // Form State
  const [channel, setChannel] = useState<MessageChannel>('manual_whatsapp');
  const [audienceFilter, setAudienceFilter] = useState<string>('pending');
  const [subject, setSubject] = useState(`Invitation: ${event.title}`);
  const [body, setBody] = useState(TEMPLATE_PRESETS[0].body);
  const [scheduledFor, setScheduledFor] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  // Live Audience Calculation State
  const [liveAudience, setLiveAudience] = useState<GuestHouseholdEntity[]>([]);
  const [selectedSampleGuest, setSelectedSampleGuest] = useState<GuestHouseholdEntity | null>(null);

  // Feedback State
  const [copiedLink, setCopiedLink] = useState(false);
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Jobs and Audits
  const [jobs, setJobs] = useState<MessageJobEntity[]>(() => MessagingService.listMessageJobs(event.id));
  const [audits, setAudits] = useState<MessageAuditRecordEntity[]>(() => MessagingService.listAuditLogs(event.id));
  const [isSending, setIsSending] = useState(false);

  // Modals
  const [isConfirmSendOpen, setIsConfirmSendOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState('+254712345678');
  const [testResult, setTestResult] = useState<string | null>(null);

  // Manual Share Guest Picker
  const [shareGuestId, setShareGuestId] = useState<string>('');

  // Re-calculate audience when filter or guests change
  useEffect(() => {
    const audience = MessagingService.getAudienceGuests(event.id, audienceFilter);
    setLiveAudience(audience);
    if (audience.length > 0) {
      setSelectedSampleGuest(audience[0]);
    } else {
      setSelectedSampleGuest(guests[0] || null);
    }
  }, [event.id, audienceFilter, guests]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const selectedShareGuest = guests.find((g) => g.id === shareGuestId);
  const currentShareUrl = NotificationService.generateShareUrl(event, {
    baseUrl: origin,
    guestToken: selectedShareGuest?.token,
    guestName: selectedShareGuest?.displayName,
  });
  const currentWhatsAppDirectUrl = NotificationService.getWhatsAppDirectUrl(
    event,
    currentShareUrl,
    selectedShareGuest?.contactPhone,
    selectedShareGuest?.displayName
  );

  // Interpolated Preview
  const previewText = MessagingService.renderTemplate(
    body,
    event,
    selectedSampleGuest || undefined,
    currentShareUrl
  );

  // Handle Preset Select
  const handleSelectPreset = (preset: typeof TEMPLATE_PRESETS[0]) => {
    setSubject(preset.subject.replace('{EventTitle}', event.title));
    setBody(preset.body);
  };

  // Insert Variable Token
  const insertToken = (token: string) => {
    setBody((prev) => `${prev} ${token}`);
  };

  // Send or Schedule Message Job
  const handleCreateAndSendJob = async () => {
    setIsSending(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const idempotencyKey = `idem_${event.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newJob = MessagingService.createMessageJob(event.id, {
        idempotencyKey,
        subject,
        body,
        channel,
        audienceFilter,
        scheduledFor: isScheduling && scheduledFor ? new Date(scheduledFor).toISOString() : undefined,
        createdBy: userRole,
      });

      if (newJob.status === 'scheduled') {
        setStatusMessage(`Reminder successfully scheduled for ${new Date(scheduledFor).toLocaleString()} (${event.timezone}).`);
      } else {
        const dispatched = await MessagingService.dispatchJob(newJob.id);
        if (dispatched.status === 'delivered') {
          setStatusMessage(`Message delivered to ${dispatched.successfulGuestIds.length} recipients.`);
        } else if (dispatched.status === 'partial') {
          setStatusMessage(`Partially sent: ${dispatched.successfulGuestIds.length} succeeded, ${dispatched.failedGuestIds.length} failed. You can safely retry failed recipients.`);
        } else if (dispatched.status === 'unconfigured') {
          setStatusMessage(`Automated provider for ${channel} is unconfigured. Manual WhatsApp handoff is recommended.`);
        }
      }

      setJobs(MessagingService.listMessageJobs(event.id));
      setAudits(MessagingService.listAuditLogs(event.id));
      setIsConfirmSendOpen(false);
      onRefresh?.();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch message.');
    } finally {
      setIsSending(false);
    }
  };

  // Retry Failed Recipients Only
  const handleRetryFailedOnly = async (jobId: string) => {
    setIsSending(true);
    setErrorMessage(null);
    try {
      const retried = await MessagingService.retryFailedRecipients(jobId);
      setStatusMessage(`Retry completed. Total delivered: ${retried.successfulGuestIds.length} recipients. Zero duplicate messages sent.`);
      setJobs(MessagingService.listMessageJobs(event.id));
      setAudits(MessagingService.listAuditLogs(event.id));
      onRefresh?.();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to retry failed recipients.');
    } finally {
      setIsSending(false);
    }
  };

  // Cancel Scheduled Job
  const handleCancelScheduled = (jobId: string) => {
    try {
      MessagingService.cancelScheduledJob(jobId, userRole);
      setStatusMessage('Scheduled reminder cancelled.');
      setJobs(MessagingService.listMessageJobs(event.id));
      setAudits(MessagingService.listAuditLogs(event.id));
      onRefresh?.();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to cancel reminder.');
    }
  };

  // Send Test Preview
  const handleSendTestPreview = async () => {
    try {
      const res = await MessagingService.sendTestPreview(
        event.id,
        { subject, body, channel, testRecipient },
      );
      setTestResult(`Test preview dispatched to ${res.recipient}. Check your inbox or phone.`);
    } catch (err: any) {
      setTestResult(`Test failed: ${err.message}`);
    }
  };

  // Distinct groups for audience filtering
  const distinctGroups = Array.from(new Set(guests.map((g) => g.group).filter(Boolean)));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Messages Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(39,38,32,.2)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-[#272620]">
              Messages, Reminders &amp; Share
            </h2>
            <Badge variant="success" size="sm">
              Zero-Cost WhatsApp Ready
            </Badge>
          </div>
          <p className="text-xs text-[#756F64] mt-0.5">
            Deliver invitations, track RSVPs, schedule reminders, and broadcast event updates with verifiable delivery logs.
          </p>
        </div>

        {/* Sub-tab Pills */}
        <div className="inline-flex p-1 bg-[#F4EFEA] rounded-xl border border-[rgba(39,38,32,.15)] text-xs font-semibold">
          <button
            onClick={() => setSubTab('compose')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'compose'
                ? 'bg-white text-[#934638] shadow-sm font-bold'
                : 'text-[#756F64] hover:text-[#272620]'
            }`}
          >
            Compose &amp; Broadcast
          </button>
          <button
            onClick={() => setSubTab('share')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'share'
                ? 'bg-white text-[#934638] shadow-sm font-bold'
                : 'text-[#756F64] hover:text-[#272620]'
            }`}
          >
            Direct Share &amp; QR
          </button>
          <button
            onClick={() => setSubTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'history'
                ? 'bg-white text-[#934638] shadow-sm font-bold'
                : 'text-[#756F64] hover:text-[#272620]'
            }`}
          >
            Delivery History ({jobs.length})
          </button>
        </div>
      </div>

      {/* Status or Error Notifications */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-700 hover:text-rose-900 font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* VIEW 1: COMPOSE & BROADCAST */}
      {subTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-5 sm:p-6 space-y-5">
              {/* Audience Segmentation Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#272620]">
                    1. Recipient Audience Filter
                  </label>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAE4DC] text-[#272620]">
                    {liveAudience.length} households calculated
                  </span>
                </div>
                <select
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(39,38,32,.2)] bg-white p-2.5 text-xs font-medium text-[#272620] focus:outline-none focus:ring-2 focus:ring-[#934638]"
                >
                  <option value="pending">Awaiting Response (Pending RSVPs only)</option>
                  <option value="all">All Invited Households (Entire Guest List)</option>
                  <option value="attending">Confirmed Attending (Yes)</option>
                  <option value="declined">Regretfully Declined (No)</option>
                  <option value="waitlisted">Waitlisted / Pending Approval</option>
                  <option value="checked_in">Checked In at Event</option>
                  {distinctGroups.map((g) => (
                    <option key={g} value={`group:${g}`}>
                      Group: {g}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#756F64]">
                  Audience is recalculated in real time. Unsubscribed or opted-out guests are automatically omitted.
                </p>
              </div>

              {/* Delivery Channel Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#272620]">
                  2. Delivery Channel
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('manual_whatsapp')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                      channel === 'manual_whatsapp'
                        ? 'border-[#934638] bg-[#FDF9F7] ring-1 ring-[#934638]'
                        : 'border-[rgba(39,38,32,.15)] bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#272620]">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp wa.me</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-medium">Free • Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                      channel === 'sms'
                        ? 'border-[#934638] bg-[#FDF9F7] ring-1 ring-[#934638]'
                        : 'border-[rgba(39,38,32,.15)] bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#272620]">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>SMS Broadcast</span>
                    </div>
                    <span className="text-[10px] text-[#756F64]">Africa&apos;s Talking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                      channel === 'email'
                        ? 'border-[#934638] bg-[#FDF9F7] ring-1 ring-[#934638]'
                        : 'border-[rgba(39,38,32,.15)] bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#272620]">
                      <Mail className="w-3.5 h-3.5 text-purple-600" />
                      <span>Email Delivery</span>
                    </div>
                    <span className="text-[10px] text-[#756F64]">Resend / SendGrid</span>
                  </button>
                </div>
              </div>

              {/* Template Presets Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#272620]">
                  3. Template Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATE_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F4EFEA] hover:bg-[#EAE4DC] text-[#272620] border border-[rgba(39,38,32,.15)] transition-all"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject (for Email & Logs) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#272620]">
                  Subject Line
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line..."
                />
              </div>

              {/* Message Body with Variable Chips */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#272620]">
                    Message Body
                  </label>
                  <span className="text-[11px] text-[#756F64]">Markdown supported</span>
                </div>
                <textarea
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(39,38,32,.2)] bg-white p-3 text-xs text-[#272620] font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#934638]"
                />

                {/* Variable Token Chips */}
                <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="text-[#756F64] font-semibold">Insert tags:</span>
                  {['{GuestName}', '{EventTitle}', '{Date}', '{Time}', '{Venue}', '{RsvpDeadline}', '{InvitationLink}'].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertToken(tag)}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Schedule Reminder Toggle */}
              <div className="pt-2 border-t border-[rgba(39,38,32,.15)] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#272620] flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isScheduling}
                      onChange={(e) => setIsScheduling(e.target.checked)}
                      className="w-4 h-4 rounded text-[#934638] focus:ring-[#934638]"
                    />
                    <span>Schedule for automated later dispatch</span>
                  </label>
                  <span className="text-[11px] text-[#756F64] font-medium">
                    Timezone: {event.timezone || 'Africa/Nairobi'}
                  </span>
                </div>

                {isScheduling && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                    <label className="block text-[11px] font-semibold text-amber-900">
                      Pick send date and time ({event.timezone}):
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                      className="w-full rounded-lg border border-amber-300 p-2 text-xs bg-white text-slate-900"
                    />
                    <p className="text-[10px] text-amber-800">
                      Scheduled reminders can be inspected, rescheduled, or cancelled at any time in the Delivery History tab.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[rgba(39,38,32,.15)]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsTestModalOpen(true)}
                  leftIcon={<Eye className="w-4 h-4" />}
                >
                  Send Test Preview
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsConfirmSendOpen(true)}
                  disabled={liveAudience.length === 0 || !body.trim()}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  {isScheduling ? 'Review & Schedule' : `Dispatch to ${liveAudience.length} Recipients`}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Live Message Preview Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5 space-y-4 bg-[#FBF9F5] border-[rgba(39,38,32,.15)]">
              <div className="flex items-center justify-between border-b border-[rgba(39,38,32,.1)] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#934638]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#272620]">
                    Live Recipient Preview
                  </h3>
                </div>
                {selectedSampleGuest && (
                  <span className="text-[10px] font-medium text-[#756F64]">
                    Simulating: {selectedSampleGuest.displayName}
                  </span>
                )}
              </div>

              {/* Simulated Phone WhatsApp Bubble */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-emerald-700">Kadi Wedding Concierge</span>
                  <span>10:45 AM</span>
                </div>
                <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                  {previewText}
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Delivered via {channel}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>

              {/* Sample Recipient Selector */}
              {liveAudience.length > 1 && (
                <div className="space-y-1 text-xs">
                  <label className="text-[11px] font-semibold text-[#756F64]">
                    Switch sample recipient to test variable merge:
                  </label>
                  <select
                    value={selectedSampleGuest?.id || ''}
                    onChange={(e) => {
                      const found = liveAudience.find((g) => g.id === e.target.value);
                      if (found) setSelectedSampleGuest(found);
                    }}
                    className="w-full rounded-lg border border-[rgba(39,38,32,.2)] bg-white p-1.5 text-xs text-[#272620]"
                  >
                    {liveAudience.slice(0, 15).map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.displayName} ({g.group})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Provider Honesty Info Card */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>Provider Delivery Policy</span>
                </div>
                <p className="text-[11px] leading-snug text-amber-800">
                  Direct WhatsApp sharing opens your local WhatsApp client with 100% deliverability and zero fees. Automated background SMS/WhatsApp requires verified business credentials.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW 2: DIRECT SHARE & PRINTABLE QR HUB */}
      {subTab === 'share' && (
        <div className="max-w-4xl space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[rgba(39,38,32,.15)] pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#272620]">
                    Direct WhatsApp &amp; Native Share Hub
                  </h3>
                  <p className="text-xs text-[#756F64]">
                    Zero-cost distribution using device click-to-chat, QR codes, or personalized guest links.
                  </p>
                </div>
              </div>

              {event.status === 'draft' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  Draft (Private Preview Token)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Published &amp; Live
                </span>
              )}
            </div>

            {/* Guest Personalization Selector */}
            <div className="bg-[#F8F5F0] p-4 rounded-xl border border-[rgba(39,38,32,.15)] space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#272620]">
                Personalize Link for Specific Household (Optional)
              </label>
              <select
                value={shareGuestId}
                onChange={(e) => setShareGuestId(e.target.value)}
                className="w-full rounded-xl border border-[rgba(39,38,32,.2)] bg-white p-2.5 text-xs font-medium text-[#272620] focus:outline-none focus:ring-2 focus:ring-[#934638]"
              >
                <option value="">General Public Invitation (Untokenized)</option>
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.displayName} ({g.group} — {1 + g.allowedPlusOnes} max)
                  </option>
                ))}
              </select>
              {selectedShareGuest && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ Token active for {selectedShareGuest.displayName}. Responses will automatically link to this household.
                </p>
              )}
            </div>

            {/* Active Link Box */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#272620]">
                Active Invitation Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentShareUrl}
                  className="flex-1 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(currentShareUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  leftIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                >
                  {copiedLink ? 'Link copied' : 'Copy'}
                </Button>
              </div>
              {copiedLink && (
                <p className="text-[11px] text-emerald-700 font-semibold animate-in fade-in">
                  ✓ Link copied to clipboard
                </p>
              )}
            </div>

            {/* QR Code and WhatsApp Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-4 border-t border-[rgba(39,38,32,.15)]">
              {/* QR Code */}
              <div className="flex flex-col items-center p-6 bg-[#F8F5F0] rounded-2xl border border-[rgba(39,38,32,.15)] text-center space-y-3">
                <p className="text-xs font-bold text-[#272620] uppercase tracking-wider">
                  Printable Event QR Code
                </p>
                <QrCode value={currentShareUrl} title={event.title} />
                <p className="text-[11px] text-[#756F64] max-w-xs">
                  Download or print to place on physical place cards, signage, or printed inserts.
                </p>
              </div>

              {/* Direct WhatsApp Share */}
              <div className="flex flex-col justify-between h-full space-y-4">
                <div>
                  <p className="text-xs font-bold text-[#272620] uppercase tracking-wider mb-2">
                    Direct WhatsApp Message Preview
                  </p>
                  <div className="p-3.5 rounded-xl border border-[rgba(39,38,32,.15)] bg-white text-xs text-[#272620] whitespace-pre-line leading-relaxed font-sans">
                    {NotificationService.generateWhatsAppMessage(
                      event,
                      currentShareUrl,
                      selectedShareGuest?.displayName
                    )}
                  </div>
                </div>

                <div>
                  <a
                    href={currentWhatsAppDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setWhatsappOpened(true);
                      setTimeout(() => setWhatsappOpened(false), 3500);
                    }}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Open in WhatsApp</span>
                  </a>
                  {whatsappOpened && (
                    <p className="text-[11px] text-emerald-700 font-semibold text-center mt-2 animate-in fade-in">
                      ✓ WhatsApp opened in new window
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 3: DELIVERY HISTORY & AUDIT LOG */}
      {subTab === 'history' && (
        <div className="space-y-6">
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(39,38,32,.15)] pb-3">
              <div>
                <h3 className="text-sm font-serif font-bold text-[#272620]">
                  Message Dispatch Jobs ({jobs.length})
                </h3>
                <p className="text-xs text-[#756F64]">
                  Verifiable records with delivery states, audience tracking, and failed recipient retry.
                </p>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#756F64]">
                No messages dispatched yet. Use the Compose tab to send your first announcement.
              </div>
            ) : (
              <div className="divide-y divide-[rgba(39,38,32,.1)]">
                {jobs.map((job) => (
                  <div key={job.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#272620]">
                          {job.subject || 'Message Announcement'}
                        </span>
                        <Badge
                          variant={
                            job.status === 'delivered'
                              ? 'success'
                              : job.status === 'partial'
                              ? 'warning'
                              : job.status === 'scheduled'
                              ? 'purple'
                              : 'error'
                          }
                          size="sm"
                        >
                          {job.status.toUpperCase()}
                        </Badge>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                          {job.channel}
                        </span>
                      </div>

                      <span className="text-[11px] text-[#756F64]">
                        {new Date(job.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 font-sans bg-slate-50 p-2.5 rounded-lg">
                      {job.body}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
                      <div className="flex items-center gap-3 text-[11px] text-[#756F64]">
                        <span>Audience: <strong>{job.audienceFilter}</strong></span>
                        <span>Target: <strong>{job.targetGuestIds.length}</strong></span>
                        <span>Delivered: <strong className="text-emerald-700">{job.successfulGuestIds.length}</strong></span>
                        {job.failedGuestIds.length > 0 && (
                          <span>Failed: <strong className="text-rose-700">{job.failedGuestIds.length}</strong></span>
                        )}
                        {job.scheduledFor && (
                          <span>Scheduled for: <strong>{new Date(job.scheduledFor).toLocaleString()}</strong></span>
                        )}
                      </div>

                      {/* Actions for Failed / Partial or Scheduled Jobs */}
                      <div className="flex items-center gap-2">
                        {(job.status === 'partial' || job.status === 'failed') && job.failedGuestIds.length > 0 && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRetryFailedOnly(job.id)}
                            disabled={isSending}
                            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                          >
                            Retry Failed Only ({job.failedGuestIds.length})
                          </Button>
                        )}

                        {job.status === 'scheduled' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelScheduled(job.id)}
                            leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-600" />}
                          >
                            Cancel Reminder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Audit Event Trail */}
          <Card className="p-5 sm:p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#272620]">
              Audit Trail &amp; Delivery Evidence ({audits.length})
            </h4>
            <div className="divide-y divide-[rgba(39,38,32,.08)] max-h-60 overflow-y-auto pr-2">
              {audits.map((a) => (
                <div key={a.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{a.action.replace('_', ' ').toUpperCase()}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">{a.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* CONFIRM SEND MODAL */}
      <Modal
        isOpen={isConfirmSendOpen}
        onClose={() => setIsConfirmSendOpen(false)}
        title="Confirm Message Dispatch"
      >
        <div className="space-y-4 text-xs text-[#272620]">
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
            <span className="font-bold text-amber-900 block">Verified Audience &amp; Channel Gate</span>
            <p className="text-amber-800 text-[11px]">
              You are about to dispatch this message to <strong>{liveAudience.length} households</strong> via <strong>{channel}</strong>.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#756F64] uppercase tracking-wider block">
              Message Preview
            </span>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 whitespace-pre-line text-xs font-sans max-h-40 overflow-y-auto">
              {previewText}
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            A unique idempotency key will be assigned to prevent duplicate deliveries in case of network retry.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsConfirmSendOpen(false)}>
              Back to Edit
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateAndSendJob}
              disabled={isSending}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              {isSending ? 'Sending...' : 'Confirm & Dispatch'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* TEST PREVIEW MODAL */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => {
          setIsTestModalOpen(false);
          setTestResult(null);
        }}
        title="Send Test Message Preview"
      >
        <div className="space-y-4 text-xs text-[#272620]">
          <p className="text-[11px] text-[#756F64]">
            Test this message on your own device without notifying any guests on your guest list.
          </p>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#272620]">Test Recipient (Phone or Email)</label>
            <Input
              value={testRecipient}
              onChange={(e) => setTestRecipient(e.target.value)}
              placeholder="+254712345678 or host@kadi.africa"
            />
          </div>

          {testResult && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
              {testResult}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsTestModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={handleSendTestPreview}>
              Send Test
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
