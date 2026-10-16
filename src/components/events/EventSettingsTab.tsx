'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventEntity, CustomRSVPQuestion, CoHostEntity, CoHostRole } from '@/lib/db/types';
import { EventService } from '@/lib/services/event-service';
import { CoHostService, ROLE_DESCRIPTIONS } from '@/lib/services/cohost-service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  SlidersHorizontal,
  Users,
  Shield,
  Copy,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  Archive,
  RefreshCw,
  Mail,
  UserCheck,
  Lock,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface EventSettingsTabProps {
  event: EventEntity;
  onRefresh: () => void;
  userRole?: string;
}

export function EventSettingsTab({ event, onRefresh, userRole }: EventSettingsTabProps) {
  const router = useRouter();

  // Policy Form State
  const [rsvpEnabled, setRsvpEnabled] = useState(event.rsvpEnabled ?? true);
  const [rsvpDeadline, setRsvpDeadline] = useState(event.rsvpDeadline || '');
  const [maxCapacity, setMaxCapacity] = useState(event.maxCapacity ? String(event.maxCapacity) : '');
  const [capacityWaitlist, setCapacityWaitlist] = useState(event.capacityWaitlist ?? true);
  const [requireApproval, setRequireApproval] = useState(event.requireApproval ?? false);
  const [allowUntokenizedRsvp, setAllowUntokenizedRsvp] = useState(event.allowUntokenizedRsvp ?? true);
  const [allowedPlusOnesDefault, setAllowedPlusOnesDefault] = useState(
    event.allowedPlusOnesDefault ?? 1
  );

  // Custom Questions State
  const [customQuestions, setCustomQuestions] = useState<CustomRSVPQuestion[]>(
    event.customQuestions || []
  );
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [newQPrompt, setNewQPrompt] = useState('');
  const [newQType, setNewQType] = useState<'text' | 'choice' | 'checkboxes'>('text');
  const [newQOptions, setNewQOptions] = useState('');
  const [newQRequired, setNewQRequired] = useState(false);

  // Co-Hosts State
  const [cohosts, setCohosts] = useState<CoHostEntity[]>(() =>
    CoHostService.listCoHosts(event.id)
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<CoHostRole>('manager');
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Event Duplication State
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [duplicateCopyDates, setDuplicateCopyDates] = useState(true);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Lifecycle States
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingPolicy, setSavingPolicy] = useState(false);

  // Save Policy Handler
  const handleSavePolicy = async () => {
    setSavingPolicy(true);
    setSaveSuccess(false);

    try {
      const updates: Partial<EventEntity> = {
        rsvpEnabled,
        rsvpDeadline,
        maxCapacity: maxCapacity ? parseInt(maxCapacity, 10) : undefined,
        capacityWaitlist,
        requireApproval,
        allowUntokenizedRsvp,
        allowedPlusOnesDefault: Number(allowedPlusOnesDefault) || 1,
        customQuestions,
      };

      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        // Fallback for local service
        EventService.updateEvent(event.id, updates);
      }
      setSaveSuccess(true);
      onRefresh();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      EventService.updateEvent(event.id, {
        rsvpEnabled,
        rsvpDeadline,
        maxCapacity: maxCapacity ? parseInt(maxCapacity, 10) : undefined,
        capacityWaitlist,
        requireApproval,
        allowUntokenizedRsvp,
        allowedPlusOnesDefault: Number(allowedPlusOnesDefault) || 1,
        customQuestions,
      });
      setSaveSuccess(true);
      onRefresh();
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSavingPolicy(false);
    }
  };

  // Add Custom Question Handler
  const handleAddQuestion = () => {
    if (!newQPrompt.trim()) return;

    let optionsArray: string[] | undefined = undefined;
    if (newQType === 'choice' || newQType === 'checkboxes') {
      optionsArray = newQOptions
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    const newQuestion: CustomRSVPQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      prompt: newQPrompt.trim(),
      type: newQType,
      options: optionsArray,
      required: newQRequired,
    };

    const updated = [...customQuestions, newQuestion];
    setCustomQuestions(updated);
    EventService.updateEvent(event.id, { customQuestions: updated });
    setIsQuestionModalOpen(false);
    setNewQPrompt('');
    setNewQOptions('');
    setNewQRequired(false);
    onRefresh();
  };

  const handleDeleteQuestion = (qId: string) => {
    const updated = customQuestions.filter((q) => q.id !== qId);
    setCustomQuestions(updated);
    EventService.updateEvent(event.id, { customQuestions: updated });
    onRefresh();
  };

  // Invite Co-Host Handler
  const handleInviteCoHost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      const res = await fetch(`/api/events/${event.id}/cohosts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim() || undefined,
          role: inviteRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to send co-host invite.');
        return;
      }

      const inviteLink = `${window.location.origin}/app/events/${event.id}?cohost_token=${data.cohost?.inviteToken}`;
      setGeneratedInviteLink(inviteLink);
      setCohosts(CoHostService.listCoHosts(event.id));
      onRefresh();
    } catch {
      // Local fallback
      try {
        const cohost = CoHostService.inviteCoHost(event.id, {
          email: inviteEmail.trim(),
          name: inviteName.trim() || undefined,
          role: inviteRole,
        });
        const inviteLink = `${window.location.origin}/app/events/${event.id}?cohost_token=${cohost.inviteToken}`;
        setGeneratedInviteLink(inviteLink);
        setCohosts(CoHostService.listCoHosts(event.id));
        onRefresh();
      } catch (err: any) {
        alert(err.message || 'Error inviting cohost.');
      }
    }
  };

  const handleRevokeCoHost = async (cohostId: string) => {
    if (!confirm('Revoke access for this co-host?')) return;
    try {
      await fetch(`/api/events/${event.id}/cohosts/${cohostId}`, { method: 'DELETE' });
    } catch {
      CoHostService.revokeCoHost(cohostId);
    }
    setCohosts(CoHostService.listCoHosts(event.id));
    onRefresh();
  };

  // Duplicate Event Handler (Safe Reset)
  const handleDuplicateEvent = async () => {
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/events/${event.id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ copyDates: duplicateCopyDates }),
      });
      const data = await res.json();
      if (res.ok && data.event?.id) {
        router.push(`/app/events/${data.event.id}`);
      } else {
        // Local service fallback
        const duplicated = EventService.duplicateEvent(event.id, {
          copyDates: duplicateCopyDates,
        });
        router.push(`/app/events/${duplicated.id}`);
      }
    } catch {
      const duplicated = EventService.duplicateEvent(event.id, {
        copyDates: duplicateCopyDates,
      });
      router.push(`/app/events/${duplicated.id}`);
    } finally {
      setIsDuplicating(false);
    }
  };

  // Archive / Delete Handlers
  const handleToggleArchive = async () => {
    if (event.status === 'archived') {
      EventService.unarchiveEvent(event.id);
    } else {
      EventService.archiveEvent(event.id);
    }
    setIsArchiveModalOpen(false);
    onRefresh();
  };

  const handleDeleteEvent = async () => {
    EventService.deleteEvent(event.id);
    router.push('/app/events');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* SECTION 1: REGISTRATION & RSVP POLICY */}
      <div className="p-6 rounded-2xl bg-[#FCFCF9] border border-[rgba(39,38,32,.18)] shadow-sm">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[rgba(39,38,32,.12)]">
          <div>
            <span className="kadi-eyebrow text-[#934638] uppercase">Attendance Controls</span>
            <h2 className="text-xl font-serif font-medium text-[#272620]">
              Registration & RSVP Policy
            </h2>
            <p className="text-xs text-[#756F64] mt-0.5">
              Configure submission rules, response deadlines, plus-one limits, and capacity waitlists.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={handleSavePolicy}
            disabled={savingPolicy}
          >
            {savingPolicy ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Policy'}
          </Button>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Registration policy updated successfully.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Toggle: RSVP Submissions Enabled */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white border border-[rgba(39,38,32,.12)]">
            <div>
              <span className="text-sm font-semibold text-[#272620] block">
                RSVP Submissions Open
              </span>
              <p className="text-[11px] text-[#756F64] mt-0.5">
                When disabled, guests can view the invitation but cannot submit responses.
              </p>
            </div>
            <input
              type="checkbox"
              checked={rsvpEnabled}
              onChange={(e) => setRsvpEnabled(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-stone-300 text-[#934638] focus:ring-[#934638]"
            />
          </div>

          {/* Toggle: Require Approval */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white border border-[rgba(39,38,32,.12)]">
            <div>
              <span className="text-sm font-semibold text-[#272620] block">
                Require Host Approval
              </span>
              <p className="text-[11px] text-[#756F64] mt-0.5">
                New RSVPs remain pending until explicitly confirmed by an event manager.
              </p>
            </div>
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-stone-300 text-[#934638] focus:ring-[#934638]"
            />
          </div>

          {/* Input: RSVP Deadline */}
          <div className="p-4 rounded-xl bg-white border border-[rgba(39,38,32,.12)]">
            <label className="text-sm font-semibold text-[#272620] block mb-1">
              Response Deadline
            </label>
            <p className="text-[11px] text-[#756F64] mb-2">
              Submissions submitted after this date will be politely closed.
            </p>
            <input
              type="text"
              placeholder="e.g. 1 November 2026 or 2026-11-01"
              value={rsvpDeadline}
              onChange={(e) => setRsvpDeadline(e.target.value)}
              className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-stone-50 px-3 py-2 text-xs text-[#272620] focus:outline-none focus:border-[#934638]"
            />
          </div>

          {/* Input: Maximum Capacity & Waitlist */}
          <div className="p-4 rounded-xl bg-white border border-[rgba(39,38,32,.12)]">
            <label className="text-sm font-semibold text-[#272620] block mb-1">
              Maximum Guest Capacity
            </label>
            <p className="text-[11px] text-[#756F64] mb-2">
              Total number of attending guests permitted before triggering waitlist or closing.
            </p>
            <input
              type="number"
              min="1"
              placeholder="e.g. 250 (leave empty for unlimited)"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-stone-50 px-3 py-2 text-xs text-[#272620] focus:outline-none focus:border-[#934638]"
            />

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
              <input
                type="checkbox"
                id="capacityWaitlistToggle"
                checked={capacityWaitlist}
                onChange={(e) => setCapacityWaitlist(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-[#934638] focus:ring-[#934638]"
              />
              <label htmlFor="capacityWaitlistToggle" className="text-xs text-[#272620] font-medium">
                Enable Waitlist when capacity is reached
              </label>
            </div>
          </div>

          {/* Toggle: Open Link vs Token Required */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white border border-[rgba(39,38,32,.12)]">
            <div>
              <span className="text-sm font-semibold text-[#272620] block">
                Allow Open Link RSVPs
              </span>
              <p className="text-[11px] text-[#756F64] mt-0.5">
                When enabled, visitors with the canonical link can register without a personal household token.
              </p>
            </div>
            <input
              type="checkbox"
              checked={allowUntokenizedRsvp}
              onChange={(e) => setAllowUntokenizedRsvp(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-stone-300 text-[#934638] focus:ring-[#934638]"
            />
          </div>

          {/* Input: Default Plus-One Allowance */}
          <div className="p-4 rounded-xl bg-white border border-[rgba(39,38,32,.12)]">
            <label className="text-sm font-semibold text-[#272620] block mb-1">
              Default Plus-One Allowance
            </label>
            <p className="text-[11px] text-[#756F64] mb-2">
              Default additional guest seats allowed per household when adding new contacts.
            </p>
            <input
              type="number"
              min="0"
              max="10"
              value={allowedPlusOnesDefault}
              onChange={(e) => setAllowedPlusOnesDefault(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-stone-50 px-3 py-2 text-xs text-[#272620] focus:outline-none focus:border-[#934638]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: CUSTOM RSVP QUESTIONS BUILDER */}
      <div className="p-6 rounded-2xl bg-[#FCFCF9] border border-[rgba(39,38,32,.18)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(39,38,32,.12)]">
          <div>
            <span className="kadi-eyebrow text-[#934638] uppercase">Questionnaire</span>
            <h2 className="text-xl font-serif font-medium text-[#272620]">
              Custom RSVP Questions
            </h2>
            <p className="text-xs text-[#756F64] mt-0.5">
              Ask guests about travel plans, shuttle buses, dietary preferences, or song requests.
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsQuestionModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4 text-[#934638]" />}
          >
            Add Question
          </Button>
        </div>

        {customQuestions.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[rgba(39,38,32,.2)] rounded-xl mt-6">
            <HelpCircle className="w-6 h-6 text-stone-400 mx-auto mb-2" />
            <p className="text-xs text-stone-500">No custom questions added yet.</p>
            <button
              type="button"
              onClick={() => setIsQuestionModalOpen(true)}
              className="mt-2 text-xs font-semibold text-[#934638] hover:underline"
            >
              + Create your first custom question
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(39,38,32,.1)] mt-4">
            {customQuestions.map((q, idx) => (
              <div key={q.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-400 font-mono">#{idx + 1}</span>
                    <span className="text-xs font-semibold text-[#272620]">{q.prompt}</span>
                    {q.required && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-3">
                    <span className="capitalize font-mono text-[10px] bg-stone-100 px-2 py-0.5 rounded">
                      {q.type}
                    </span>
                    {q.options && q.options.length > 0 && (
                      <span>Options: {q.options.join(', ')}</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                  title="Remove Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: CO-HOSTS & TEAM PERMISSIONS */}
      <div className="p-6 rounded-2xl bg-[#FCFCF9] border border-[rgba(39,38,32,.18)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(39,38,32,.12)]">
          <div>
            <span className="kadi-eyebrow text-[#934638] uppercase">Team & Security</span>
            <h2 className="text-xl font-serif font-medium text-[#272620]">
              Co-Hosts & Permissions
            </h2>
            <p className="text-xs text-[#756F64] mt-0.5">
              Delegate responsibilities to partners, planners, and usher staff with narrowly scoped roles.
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setGeneratedInviteLink(null);
              setIsInviteModalOpen(true);
            }}
            leftIcon={<Users className="w-4 h-4 text-[#934638]" />}
          >
            Invite Co-Host
          </Button>
        </div>

        {/* Roles overview pill legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="p-3 rounded-xl bg-white border border-[rgba(39,38,32,.1)]">
            <span className="text-xs font-bold text-[#272620] block">Event Manager</span>
            <span className="text-[11px] text-[#756F64] mt-0.5 block">
              Can edit details, invite guests, and perform check-ins.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[rgba(39,38,32,.1)]">
            <span className="text-xs font-bold text-[#272620] block">Guest List Manager</span>
            <span className="text-[11px] text-[#756F64] mt-0.5 block">
              Can manage contacts, view RSVPs, and export data.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[rgba(39,38,32,.1)]">
            <span className="text-xs font-bold text-[#272620] block">Check-In Staff</span>
            <span className="text-[11px] text-[#756F64] mt-0.5 block">
              On-the-day search and pass check-in only. Zero export access.
            </span>
          </div>
        </div>

        {/* Co-Hosts List */}
        <div className="divide-y divide-[rgba(39,38,32,.1)]">
          {/* Primary Owner Row */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#934638]/10 text-[#934638] flex items-center justify-center font-bold text-xs">
                OW
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#272620]">Primary Event Host</span>
                  <Badge variant="success" size="sm">
                    Owner
                  </Badge>
                </div>
                <span className="text-[11px] text-[#756F64] block">Full administrative ownership</span>
              </div>
            </div>
            <span className="text-[11px] text-stone-400 font-mono">Permanent</span>
          </div>

          {cohosts.map((c) => (
            <div key={c.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                  {c.name ? c.name.slice(0, 2).toUpperCase() : 'CH'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#272620]">
                      {c.name || c.email}
                    </span>
                    <Badge variant="default" size="sm">
                      {c.role.replace('_', ' ')}
                    </Badge>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        c.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-800'
                          : c.status === 'pending'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#756F64] block">{c.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {c.status !== 'revoked' && (
                  <button
                    type="button"
                    onClick={() => handleRevokeCoHost(c.id)}
                    className="text-xs text-stone-400 hover:text-rose-700 font-medium transition-colors"
                  >
                    Revoke Access
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: DUPLICATE EVENT (SAFE RESET) */}
      <div className="p-6 rounded-2xl bg-[#FCFCF9] border border-[rgba(39,38,32,.18)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="kadi-eyebrow text-[#934638] uppercase">Templates & Clones</span>
            <h2 className="text-xl font-serif font-medium text-[#272620]">
              Duplicate Event as New Draft
            </h2>
            <p className="text-xs text-[#756F64] mt-0.5">
              Copy design styling, layout sections, venue, and FAQ. Guests, tokens, and responses are safely wiped.
            </p>
          </div>

          <Button
            size="md"
            variant="secondary"
            onClick={() => setIsDuplicateModalOpen(true)}
            leftIcon={<Copy className="w-4 h-4 text-stone-700" />}
          >
            Duplicate Event
          </Button>
        </div>
      </div>

      {/* SECTION 5: DANGER ZONE */}
      <div className="p-6 rounded-2xl bg-rose-50/30 border border-rose-200">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-rose-700" />
          <h2 className="text-base font-serif font-bold text-rose-900">Danger Zone</h2>
        </div>
        <p className="text-xs text-rose-700/80 mb-4">
          Irreversible actions for archiving or permanently removing this celebration.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsArchiveModalOpen(true)}
            leftIcon={<Archive className="w-4 h-4" />}
            className="!border !border-rose-300 !text-rose-900 hover:!bg-rose-100"
          >
            {event.status === 'archived' ? 'Restore from Archive' : 'Archive Event'}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4 text-rose-600" />}
            className="!border !border-rose-300 !text-rose-700 hover:!bg-rose-100"
          >
            Delete Event
          </Button>
        </div>
      </div>

      {/* MODAL: ADD CUSTOM QUESTION */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title="Add Custom RSVP Question"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#272620] block mb-1">
              Question Prompt
            </label>
            <input
              type="text"
              placeholder="e.g. Which song gets you on the dancefloor?"
              value={newQPrompt}
              onChange={(e) => setNewQPrompt(e.target.value)}
              className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-white px-3 py-2 text-xs text-[#272620] focus:outline-none focus:border-[#934638]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#272620] block mb-1">
              Answer Type
            </label>
            <select
              value={newQType}
              onChange={(e: any) => setNewQType(e.target.value)}
              className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-white px-3 py-2 text-xs text-[#272620] focus:outline-none focus:border-[#934638]"
            >
              <option value="text">Single Line Text</option>
              <option value="choice">Single Choice (Dropdown / Radio)</option>
              <option value="checkboxes">Multiple Choices (Checkboxes)</option>
            </select>
          </div>

          {(newQType === 'choice' || newQType === 'checkboxes') && (
            <div>
              <label className="text-xs font-semibold text-[#272620] block mb-1">
                Options (One per line)
              </label>
              <textarea
                rows={3}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                value={newQOptions}
                onChange={(e) => setNewQOptions(e.target.value)}
                className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-white px-3 py-2 text-xs text-[#272620] focus:outline-none focus:border-[#934638]"
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="newQRequiredToggle"
              checked={newQRequired}
              onChange={(e) => setNewQRequired(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-[#934638] focus:ring-[#934638]"
            />
            <label htmlFor="newQRequiredToggle" className="text-xs text-[#272620] font-medium">
              Require an answer from guests before submission
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(39,38,32,.1)]">
            <Button variant="ghost" size="sm" onClick={() => setIsQuestionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddQuestion}
              disabled={!newQPrompt.trim()}
            >
              Add Question
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: INVITE CO-HOST */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Event Co-Host"
      >
        {generatedInviteLink ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900">
              <span className="font-bold block mb-1">Invitation link generated!</span>
              Share this personal link with your co-host so they can join this celebration team.
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedInviteLink}
                className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-stone-50 px-3 py-2 text-xs font-mono select-all focus:outline-none"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(generatedInviteLink);
                  setCopiedInvite(true);
                  setTimeout(() => setCopiedInvite(false), 2000);
                }}
                leftIcon={copiedInvite ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedInvite ? 'Copied' : 'Copy'}
              </Button>
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="ghost" size="sm" onClick={() => setIsInviteModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInviteCoHost} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#272620] block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="cohost@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-white px-3 py-2 text-xs text-[#272620] focus:outline-none focus:border-[#934638]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#272620] block mb-1">
                Name / Role Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Planner, Best Man, Head Usher"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-white px-3 py-2 text-xs text-[#272620] focus:outline-none focus:border-[#934638]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#272620] block mb-1">
                Role & Permissions
              </label>
              <select
                value={inviteRole}
                onChange={(e: any) => setInviteRole(e.target.value)}
                className="w-full rounded-lg border border-[rgba(39,38,32,.25)] bg-white px-3 py-2 text-xs text-[#272620] focus:outline-none focus:border-[#934638]"
              >
                <option value="manager">Event Manager (Edit event, manage guests, check in)</option>
                <option value="guest_manager">Guest List Manager (Manage guests, export data)</option>
                <option value="check_in_staff">Check-In Staff (Search & check in passes only)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(39,38,32,.1)]">
              <Button variant="ghost" size="sm" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Generate Invite Link
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL: DUPLICATE CONFIRMATION (SAFE RESET) */}
      <Modal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        title="Duplicate Event as New Draft"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#756F64] leading-relaxed">
            Create a clean copy of &ldquo;{event.title}&rdquo; as a new draft invitation.
          </p>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-[rgba(39,38,32,.1)] space-y-2 text-xs">
            <div className="text-emerald-800 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Will Copy: Design styling, 3D envelope, venue, story, FAQ, schedule & questions</span>
            </div>
            <div className="text-amber-800 font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Safely Reset: Guests, invitation tokens, RSVPs, check-in history, and M-Pesa records</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="copyDatesToggle"
              checked={duplicateCopyDates}
              onChange={(e) => setDuplicateCopyDates(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-[#934638] focus:ring-[#934638]"
            />
            <label htmlFor="copyDatesToggle" className="text-xs text-[#272620] font-medium">
              Keep original event dates & times (uncheck to reset to TBD)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(39,38,32,.1)]">
            <Button variant="ghost" size="sm" onClick={() => setIsDuplicateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDuplicateEvent}
              disabled={isDuplicating}
            >
              {isDuplicating ? 'Duplicating...' : 'Confirm & Create Draft'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: ARCHIVE CONFIRMATION */}
      <Modal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        title={event.status === 'archived' ? 'Restore Event to Draft?' : 'Archive Event?'}
      >
        <div className="space-y-4">
          <p className="text-xs text-[#756F64] leading-relaxed">
            {event.status === 'archived'
              ? 'Restoring this event will return it to draft state where it can be edited and re-published.'
              : 'Archiving hides the invitation from live guests and halts new RSVP responses. You can restore it to draft state at any time.'}
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsArchiveModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleToggleArchive}>
              {event.status === 'archived' ? 'Restore to Draft' : 'Confirm Archive'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: DELETE CONFIRMATION */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Permanently Delete Event?"
      >
        <div className="space-y-4">
          <p className="text-xs text-rose-700 leading-relaxed font-medium">
            Warning: This action is permanent and cannot be undone. All event details, designs, and records will be deleted.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteEvent}
              className="!bg-rose-700 hover:!bg-rose-800 !text-white"
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
