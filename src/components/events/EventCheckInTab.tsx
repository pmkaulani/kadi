'use client';

import React, { useState } from 'react';
import { GuestHouseholdEntity } from '@/lib/db/types';
import { CheckInService, CheckInStatusSummary } from '@/lib/services/checkin-service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  UserCheck,
  Search,
  QrCode,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Copy,
  Check,
  Users,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface EventCheckInTabProps {
  eventId: string;
  eventTitle: string;
  guests: GuestHouseholdEntity[];
  onRefresh: () => void;
  userRole?: string;
}

export function EventCheckInTab({
  eventId,
  eventTitle,
  guests,
  onRefresh,
  userRole,
}: EventCheckInTabProps) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'not_checked_in' | 'checked_in'>('all');
  const [passInput, setPassInput] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);
  const [loadingPass, setLoadingPass] = useState(false);
  const [copiedPassId, setCopiedPassId] = useState<string | null>(null);

  // Compute live statistics
  const totalHouseholds = guests.length;
  const checkedInHouseholds = guests.filter((g) => g.checkedIn).length;
  const percentage = totalHouseholds > 0 ? Math.round((checkedInHouseholds / totalHouseholds) * 100) : 0;

  const totalHeadcount = guests
    .filter((g) => g.status === 'attending' || g.status === 'yes')
    .reduce((sum, g) => sum + 1 + (g.allowedPlusOnes || 0), 0);

  const checkedInHeadcount = guests
    .filter((g) => g.checkedIn)
    .reduce((sum, g) => sum + 1 + (g.allowedPlusOnes || 0), 0);

  // Filtered guest list
  const filteredGuests = guests.filter((g) => {
    if (filterMode === 'not_checked_in' && g.checkedIn) return false;
    if (filterMode === 'checked_in' && !g.checkedIn) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = g.displayName.toLowerCase().includes(q);
      const matchPhone = g.contactPhone?.toLowerCase().includes(q) ?? false;
      const matchPass = g.passCode?.toLowerCase().includes(q) ?? false;
      const matchGroup = g.group?.toLowerCase().includes(q) ?? false;
      if (!matchName && !matchPhone && !matchPass && !matchGroup) return false;
    }
    return true;
  });

  const handleCheckInByPass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passInput.trim()) return;

    setLoadingPass(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/events/${eventId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passCode: passInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.alreadyCheckedIn) {
          setFeedback({
            type: 'warning',
            message: `Notice: ${data.guest?.displayName || 'Guest'} is already checked in.`,
          });
        } else {
          setFeedback({
            type: 'error',
            message: data.error || 'Pass code was not recognized.',
          });
        }
      } else {
        setFeedback({
          type: 'success',
          message: `Success: Checked in ${data.guest?.displayName}! Welcome to the celebration.`,
        });
        setPassInput('');
        onRefresh();
      }
    } catch {
      // Local service fallback for sandbox development
      const result = CheckInService.checkIn(eventId, { passCode: passInput.trim() }, 'Host Desk');
      if (result.success) {
        setFeedback({
          type: 'success',
          message: `Success: Checked in ${result.guest?.displayName}!`,
        });
        setPassInput('');
        onRefresh();
      } else {
        setFeedback({
          type: result.alreadyCheckedIn ? 'warning' : 'error',
          message: result.message,
        });
      }
    } finally {
      setLoadingPass(false);
    }
  };

  const handleQuickCheckIn = async (guest: GuestHouseholdEntity) => {
    setFeedback(null);
    try {
      const res = await fetch(`/api/events/${eventId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId: guest.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({
          type: data.alreadyCheckedIn ? 'warning' : 'error',
          message: data.error || 'Could not complete check-in.',
        });
      } else {
        setFeedback({
          type: 'success',
          message: `Checked in ${guest.displayName}!`,
        });
        onRefresh();
      }
    } catch {
      // Local fallback
      const result = CheckInService.checkIn(eventId, { guestId: guest.id }, 'Host Desk');
      if (result.success) {
        setFeedback({
          type: 'success',
          message: `Checked in ${guest.displayName}!`,
        });
        onRefresh();
      } else {
        setFeedback({
          type: 'warning',
          message: result.message,
        });
      }
    }
  };

  const handleUndoCheckIn = async (guest: GuestHouseholdEntity) => {
    if (!confirm(`Undo check-in for "${guest.displayName}"?`)) return;

    setFeedback(null);
    try {
      const res = await fetch(`/api/events/${eventId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId: guest.id, action: 'undo' }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({
          type: 'error',
          message: data.error || 'Could not undo check-in.',
        });
      } else {
        setFeedback({
          type: 'warning',
          message: `Check-in reversed for ${guest.displayName}.`,
        });
        onRefresh();
      }
    } catch {
      const result = CheckInService.undoCheckIn(eventId, guest.id, 'Host Desk');
      if (result.success) {
        setFeedback({
          type: 'warning',
          message: result.message,
        });
        onRefresh();
      }
    }
  };

  const copyPassCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedPassId(code);
    setTimeout(() => setCopiedPassId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Check-in Stats */}
      <div className="p-6 rounded-2xl bg-[#FCFCF9] border border-[rgba(39,38,32,.18)] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-5 border-b border-[rgba(39,38,32,.12)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="kadi-eyebrow text-[#934638] uppercase">On-The-Day Operations</span>
            </div>
            <h2 className="text-2xl font-serif font-medium text-[#272620]">
              Guest Check-In Desk
            </h2>
            <p className="text-xs text-[#756F64] mt-0.5">
              Verify attendance, scan QR guest passes, or search by name. Prevents duplicate entries.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#756F64] block">
                Households Present
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#272620]">
                {checkedInHouseholds}{' '}
                <span className="text-xs font-normal text-[#756F64]">/ {totalHouseholds}</span>
              </span>
              <span className="text-[11px] text-emerald-700 block font-medium">
                {percentage}% Arrival Rate
              </span>
            </div>

            <div className="h-10 w-px bg-[rgba(39,38,32,.15)] hidden sm:block" />

            <div className="text-left sm:text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#756F64] block">
                Estimated Headcount
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#934638]">
                {checkedInHeadcount}{' '}
                <span className="text-xs font-normal text-[#756F64]">/ {totalHeadcount}</span>
              </span>
              <span className="text-[11px] text-[#756F64] block">
                With plus-ones
              </span>
            </div>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full bg-[#934638] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feedback Toast / Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : feedback.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {feedback.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
            {feedback.type === 'error' && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-[11px] text-stone-500 hover:text-stone-800 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Pass Code / Scanner Simulation Entry Form */}
      <div className="p-4 sm:p-5 rounded-xl bg-stone-50 border border-[rgba(39,38,32,.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#934638]/10 text-[#934638] flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#272620]">Scan or Enter Pass Code</h3>
            <p className="text-[11px] text-[#756F64]">
              Enter the unique pass ID from the guest&apos;s physical pass or QR invitation link.
            </p>
          </div>
        </div>

        <form onSubmit={handleCheckInByPass} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="e.g. pass_peter_otieno_84a9f"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            className="w-full md:w-72 rounded-lg border border-[rgba(39,38,32,.25)] bg-white px-3 py-2 text-xs font-mono text-[#272620] focus:outline-none focus:border-[#934638]"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={loadingPass || !passInput.trim()}
          >
            {loadingPass ? 'Checking In...' : 'Check In'}
          </Button>
        </form>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, phone, group, or pass ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[rgba(39,38,32,.2)] bg-transparent text-xs text-[#272620] focus:outline-none focus:border-[#934638]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterMode === 'all'
                ? 'bg-[#272620] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All ({guests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('not_checked_in')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterMode === 'not_checked_in'
                ? 'bg-amber-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Awaiting Arrival ({totalHouseholds - checkedInHouseholds})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('checked_in')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterMode === 'checked_in'
                ? 'bg-emerald-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Checked In ({checkedInHouseholds})
          </button>
        </div>
      </div>

      {/* Guest Check-In Table / Card View */}
      {filteredGuests.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[rgba(39,38,32,.2)] rounded-xl bg-stone-50/50">
          <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p className="text-xs font-medium text-stone-600">No guests found matching your search filter.</p>
        </div>
      ) : (
        <div className="border border-[rgba(39,38,32,.18)] rounded-xl overflow-hidden bg-white shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-[#272620]">
              <thead className="bg-stone-50 border-b border-[rgba(39,38,32,.12)] text-[10px] font-bold uppercase tracking-wider text-[#756F64]">
                <tr>
                  <th className="py-3 px-4">Guest / Household</th>
                  <th className="py-3 px-4">Party Size</th>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4">Pass ID</th>
                  <th className="py-3 px-4">Check-In Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(39,38,32,.08)]">
                {filteredGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className={`transition-colors ${
                      guest.checkedIn ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-stone-50/60'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#272620]">{guest.displayName}</div>
                      {guest.contactPhone && (
                        <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                          {guest.contactPhone}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">1</span>
                      {guest.allowedPlusOnes > 0 && (
                        <span className="text-stone-400 text-[11px]"> + {guest.allowedPlusOnes} plus-ones</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default" size="sm">
                        {guest.group || 'Guests'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => copyPassCode(guest.passCode)}
                        className="flex items-center gap-1.5 font-mono text-[11px] text-stone-500 hover:text-stone-900 group"
                        title="Copy Pass Code"
                      >
                        <span>{guest.passCode || 'pass_default'}</span>
                        {copiedPassId === guest.passCode ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      {guest.checkedIn ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            Arrived{' '}
                            {guest.checkedInAt
                              ? new Date(guest.checkedInAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 text-stone-600">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>Not checked in</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {guest.checkedIn ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUndoCheckIn(guest)}
                          leftIcon={<RotateCcw className="w-3.5 h-3.5 text-stone-500" />}
                          className="!text-stone-500 hover:!text-rose-700"
                        >
                          Undo
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleQuickCheckIn(guest)}
                          leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                          className="!bg-emerald-700 hover:!bg-emerald-800 !text-white"
                        >
                          Check In
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Row View */}
          <div className="md:hidden divide-y divide-[rgba(39,38,32,.1)]">
            {filteredGuests.map((guest) => (
              <div
                key={guest.id}
                className={`p-4 transition-colors ${
                  guest.checkedIn ? 'bg-emerald-50/30' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-sm text-[#272620]">{guest.displayName}</div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                      <span>{guest.group || 'Guests'}</span>
                      <span>•</span>
                      <span>Party of {1 + (guest.allowedPlusOnes || 0)}</span>
                    </div>
                    {guest.passCode && (
                      <div className="text-[10px] font-mono text-stone-400 mt-1">
                        Pass: {guest.passCode}
                      </div>
                    )}
                  </div>

                  <div>
                    {guest.checkedIn ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Arrived</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600">
                        <span>Awaiting</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[rgba(39,38,32,.08)] flex items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400 font-mono">
                    {guest.contactPhone || 'No phone'}
                  </span>
                  <div>
                    {guest.checkedIn ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUndoCheckIn(guest)}
                        leftIcon={<RotateCcw className="w-3 h-3 text-stone-500" />}
                        className="!text-stone-500 !py-1 !px-2.5 text-xs"
                      >
                        Undo
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleQuickCheckIn(guest)}
                        leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                        className="!bg-emerald-700 hover:!bg-emerald-800 !text-white !py-1 !px-3 text-xs"
                      >
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
