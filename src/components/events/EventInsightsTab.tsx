'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  Utensils,
  Share2,
  Shield,
  Globe,
  Lock,
  EyeOff,
  HelpCircle,
  TrendingUp,
  Tag,
  AlertCircle,
  Copy,
  Check,
  QrCode,
  Send,
  MessageCircle,
  Info,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EventInsightsData } from '@/lib/services/insights-service';

interface EventInsightsTabProps {
  eventId: string;
  eventSlug: string;
  onRefresh?: () => void;
}

export function EventInsightsTab({ eventId, eventSlug, onRefresh }: EventInsightsTabProps) {
  const [insights, setInsights] = useState<EventInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Privacy & Discovery Form State
  const [visibility, setVisibility] = useState<'private' | 'unlisted' | 'public'>('private');
  const [hideExactVenue, setHideExactVenue] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const [privacySuccessMsg, setPrivacySuccessMsg] = useState(false);

  // Link copy feedback state
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/events/${eventId}/insights`);
      if (!res.ok) {
        throw new Error('Failed to fetch event insights');
      }
      const payload = await res.json();
      const data: EventInsightsData = payload.insights || payload;
      setInsights(data);
      setVisibility(data.visibility);
      setHideExactVenue(data.hideExactVenueUntilRsvp);
      setTagsInput(data.referralSources ? '' : '');
    } catch (err: any) {
      setError(err.message || 'Unable to load event insights');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleSavePrivacy = async () => {
    setIsSavingPrivacy(true);
    setPrivacySuccessMsg(false);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await fetch(`/api/events/${eventId}/insights`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visibility,
          hideExactVenueUntilRsvp: hideExactVenue,
          tags: tags.length > 0 ? tags : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update privacy settings');
      }

      setPrivacySuccessMsg(true);
      setTimeout(() => setPrivacySuccessMsg(false), 3000);
      await fetchInsights();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  const getChannelShareUrl = (channelKey: string) => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    return `${origin}/e/${eventSlug}?src=${channelKey}`;
  };

  const handleCopyChannelLink = (channelKey: string) => {
    const url = getChannelShareUrl(channelKey);
    navigator.clipboard.writeText(url);
    setCopiedChannel(channelKey);
    setTimeout(() => setCopiedChannel(null), 2500);
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-[#756F64] space-y-3 animate-in fade-in">
        <div className="w-8 h-8 mx-auto border-2 border-[#934638] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-wider font-medium">Loading Verified Event Insights...</p>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-600/30 text-[#272620] space-y-3">
        <div className="flex items-center gap-2 font-medium text-sm text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700" />
          <span>Could not retrieve verified insights</span>
        </div>
        <p className="text-xs text-stone-700">{error || 'An unexpected error occurred while loading insights.'}</p>
        <Button variant="secondary" size="sm" onClick={fetchInsights}>
          Try Again
        </Button>
      </div>
    );
  }

  const { overview, checkInStats, referralSources, dietarySummary, metricDefinitions } = insights;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* SECTION 1: HEADER & INTEGRITY COMMITMENT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(39,38,32,0.1)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#934638]">
              Host Intelligence &amp; Privacy
            </span>
            <Badge variant="default" size="sm" className="font-mono text-[10px]">
              Strictly Verified Data
            </Badge>
          </div>
          <h2 className="text-2xl font-serif font-medium text-[#272620] tracking-tight">
            Event Insights &amp; Attribution
          </h2>
          <p className="text-xs text-[#756F64] mt-0.5 max-w-2xl leading-relaxed">
            All counts reflect strictly authentic RSVPs and check-in scans recorded in Kadi. Zero synthetic graphs, zero covert tracking, and zero behavioral profiling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchInsights}
            leftIcon={<TrendingUp className="w-3.5 h-3.5 text-[#934638]" />}
          >
            Refresh Metrics
          </Button>
        </div>
      </div>

      {/* SECTION 2: CORE OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 border-[rgba(39,38,32,0.12)] bg-[#FDFBF7]">
          <div className="flex items-center justify-between text-[#756F64] mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Total Invited</span>
            <Users className="w-4 h-4 text-[#934638]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-[#272620]">
            {overview.totalHouseholdsInvited}
          </div>
          <div className="text-[11px] text-[#756F64] mt-1">
            Expected: <strong className="text-[#272620]">{overview.totalHeadcountExpected}</strong> people
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-[rgba(39,38,32,0.12)] bg-[#FDFBF7]">
          <div className="flex items-center justify-between text-[#756F64] mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Attending</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-emerald-800">
            {overview.attendingHeadcount}
          </div>
          <div className="text-[11px] text-[#756F64] mt-1">
            Across <strong className="text-[#272620]">{overview.attendingHouseholds}</strong> households
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-[rgba(39,38,32,0.12)] bg-[#FDFBF7]">
          <div className="flex items-center justify-between text-[#756F64] mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Response Rate</span>
            <TrendingUp className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-[#272620]">
            {overview.householdResponseRate}%
          </div>
          <div className="text-[11px] text-[#756F64] mt-1">
            Pending replies: <strong className="text-[#272620]">{overview.pendingHouseholds}</strong>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-[rgba(39,38,32,0.12)] bg-[#FDFBF7]">
          <div className="flex items-center justify-between text-[#756F64] mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Attending Ratio</span>
            <BarChart3 className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-[#272620]">
            {overview.attendanceApprovalRatio}%
          </div>
          <div className="text-[11px] text-[#756F64] mt-1">
            Declined: <strong className="text-[#272620]">{overview.declinedHouseholds}</strong> · Waitlist: <strong className="text-[#272620]">{overview.waitlistedHouseholds}</strong>
          </div>
        </Card>
      </div>

      {/* SECTION 3: RECEPTION CHECK-IN PROGRESS (Only shown if physical reception desk active) */}
      <Card className="p-5 sm:p-6 border-[rgba(39,38,32,0.12)] bg-[#FDFBF7]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#272620]">Reception Desk Arrival Rate</h3>
              <p className="text-[11px] text-[#756F64]">
                Directly synchronized with live check-in scans at the entrance desk.
              </p>
            </div>
          </div>
          <Badge
            variant={checkInStats.hasCheckIns ? 'success' : 'default'}
            size="sm"
            className="self-start sm:self-auto"
          >
            {checkInStats.hasCheckIns ? `${checkInStats.checkedInCount} Guests Checked In` : 'Awaiting Reception Scans'}
          </Badge>
        </div>

        {checkInStats.hasCheckIns ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#272620]">
                {checkInStats.checkedInCount} of {checkInStats.attendingHeadcount} confirmed attendees arrived
              </span>
              <span className="font-bold text-emerald-800">{checkInStats.checkInRate}%</span>
            </div>
            <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, checkInStats.checkInRate)}%` }}
              />
            </div>
            <p className="text-[11px] text-[#756F64]">
              Arrival rate updates instantly whenever co-hosts or ushers scan a guest&apos;s QR pass or look up their household.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 leading-relaxed">
            No guests have arrived at the reception desk yet. As co-hosts scan attendee QR codes on event day using the <strong>Check-in</strong> tab, real-time arrival counts will appear here.
          </div>
        )}
      </Card>

      {/* SECTION 4: PRIVACY-SAFE CHANNEL REFERRAL ATTRIBUTION */}
      <Card className="p-5 sm:p-6 border-[rgba(39,38,32,0.12)] bg-[#FDFBF7] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#934638]" />
              <h3 className="text-base font-serif font-medium text-[#272620]">
                Campaign &amp; Referral Conversion Tracking
              </h3>
            </div>
            <p className="text-xs text-[#756F64] mt-0.5">
              Compare RSVP replies generated across WhatsApp, physical printed cards, social bio, and emails.
            </p>
          </div>
          <div className="text-xs text-[#756F64]">
            Total Raw Visits: <strong className="text-[#272620]">{insights.totalPageVisits}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[rgba(39,38,32,0.12)] text-[#756F64] uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Channel / Medium</th>
                <th className="py-2.5 px-3">Tracking Tag</th>
                <th className="py-2.5 px-3 text-right">Page Visits</th>
                <th className="py-2.5 px-3 text-right">RSVP Submissions</th>
                <th className="py-2.5 px-3 text-right">Conversion Rate</th>
                <th className="py-2.5 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(39,38,32,0.06)] text-[#272620]">
              {referralSources.map((stat) => (
                <tr key={stat.source} className="hover:bg-black/[0.02] transition-colors">
                  <td className="py-3 px-3 font-medium">
                    <div className="flex items-center gap-2">
                      {stat.source === 'wa' && <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}
                      {stat.source === 'qr' && <QrCode className="w-3.5 h-3.5 text-indigo-600" />}
                      {stat.source === 'email' && <Send className="w-3.5 h-3.5 text-blue-600" />}
                      {stat.source === 'ig' && <Globe className="w-3.5 h-3.5 text-pink-600" />}
                      {stat.source === 'direct' && <Share2 className="w-3.5 h-3.5 text-stone-500" />}
                      <span>{stat.label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#756F64]">
                    ?src={stat.source}
                  </td>
                  <td className="py-3 px-3 text-right font-medium">{stat.visits}</td>
                  <td className="py-3 px-3 text-right font-semibold text-emerald-800">{stat.rsvps}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        stat.conversionRate > 30
                          ? 'bg-emerald-100 text-emerald-800'
                          : stat.conversionRate > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {stat.conversionRate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleCopyChannelLink(stat.source)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-[#272620] transition-colors"
                      title="Copy tracked link for this channel"
                    >
                      {copiedChannel === stat.source ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-stone-500" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-600">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <p leading-relaxed>
            <strong>Privacy Guarantee:</strong> Campaign tags only record anonymous channel aggregations. Kadi never stores visitor IP addresses, browser fingerprint signatures, or personal identity until a guest willingly submits their RSVP.
          </p>
        </div>
      </Card>

      {/* SECTION 5: DIETARY RESTRICTIONS AGGREGATE */}
      <Card className="p-5 sm:p-6 border-[rgba(39,38,32,0.12)] bg-[#FDFBF7] space-y-4">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-[#934638]" />
          <h3 className="text-base font-serif font-medium text-[#272620]">
            Catering &amp; Dietary Requirements
          </h3>
        </div>
        <p className="text-xs text-[#756F64]">
          Summarized directly from attending RSVP forms to pass along to your caterer and hospitality team.
        </p>

        {dietarySummary.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {dietarySummary.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border border-[rgba(39,38,32,0.1)] rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#934638]" />
                  <span className="text-xs font-medium text-[#272620]">{item.requirement}</span>
                </div>
                <Badge variant="default" size="sm" className="font-semibold text-xs">
                  {item.count} {item.count === 1 ? 'guest' : 'guests'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-500">
            No specific dietary allergies or restrictions specified by attending guests yet.
          </div>
        )}
      </Card>

      {/* SECTION 6: PRIVACY, DISCOVERY & VENUE MASKING CONTROLS */}
      <Card className="p-5 sm:p-6 border-[rgba(39,38,32,0.12)] bg-[#FDFBF7] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#934638]" />
            <div>
              <h3 className="text-base font-serif font-medium text-[#272620]">
                Event Privacy &amp; Discovery Controls
              </h3>
              <p className="text-xs text-[#756F64]">
                Choose who can find and view your event invitation.
              </p>
            </div>
          </div>
          <Badge
            variant={visibility === 'public' ? 'success' : visibility === 'unlisted' ? 'warning' : 'default'}
            size="md"
            className="uppercase tracking-wider font-semibold text-[10px]"
          >
            {visibility === 'public' ? 'Public Discovery' : visibility === 'unlisted' ? 'Unlisted' : 'Private by Default'}
          </Badge>
        </div>

        {privacySuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Privacy and discovery preferences saved successfully.</span>
          </div>
        )}

        {/* Visibility Options Radio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <label
            onClick={() => setVisibility('private')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              visibility === 'private'
                ? 'border-[#934638] bg-[#934638]/5 ring-1 ring-[#934638]'
                : 'border-[rgba(39,38,32,0.15)] bg-white hover:border-[#934638]/40'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Lock className={`w-4 h-4 ${visibility === 'private' ? 'text-[#934638]' : 'text-stone-500'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Default</span>
              </div>
              <p className="font-semibold text-xs text-[#272620]">Private (Invite Only)</p>
              <p className="text-[11px] text-[#756F64] leading-relaxed">
                Never listed anywhere. Only people with your direct personal link or QR pass can view the card.
              </p>
            </div>
          </label>

          <label
            onClick={() => setVisibility('unlisted')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              visibility === 'unlisted'
                ? 'border-[#934638] bg-[#934638]/5 ring-1 ring-[#934638]'
                : 'border-[rgba(39,38,32,0.15)] bg-white hover:border-[#934638]/40'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <EyeOff className={`w-4 h-4 ${visibility === 'unlisted' ? 'text-[#934638]' : 'text-stone-500'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Link-Only</span>
              </div>
              <p className="font-semibold text-xs text-[#272620]">Unlisted</p>
              <p className="text-[11px] text-[#756F64] leading-relaxed">
                Hidden from public discovery searches, but anyone who receives the URL can open and view it.
              </p>
            </div>
          </label>

          <label
            onClick={() => setVisibility('public')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              visibility === 'public'
                ? 'border-[#934638] bg-[#934638]/5 ring-1 ring-[#934638]'
                : 'border-[rgba(39,38,32,0.15)] bg-white hover:border-[#934638]/40'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Globe className={`w-4 h-4 ${visibility === 'public' ? 'text-[#934638]' : 'text-stone-500'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Opt-in</span>
              </div>
              <p className="font-semibold text-xs text-[#272620]">Public Discovery</p>
              <p className="text-[11px] text-[#756F64] leading-relaxed">
                Discoverable on Kadi Explore and open community searches. Perfect for public conferences, summits, and open gatherings.
              </p>
            </div>
          </label>
        </div>

        {/* Venue Masking Switch */}
        <div className="p-4 bg-white border border-[rgba(39,38,32,0.12)] rounded-xl flex items-start gap-3">
          <input
            id="hideExactVenueToggle"
            type="checkbox"
            checked={hideExactVenue}
            onChange={(e) => setHideExactVenue(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded text-[#934638] focus:ring-[#934638] border-stone-300"
          />
          <div className="text-xs">
            <label htmlFor="hideExactVenueToggle" className="font-semibold text-[#272620] cursor-pointer">
              Protect Venue Address (Disclose Exact Location Only After Confirmed RSVP)
            </label>
            <p className="text-[#756F64] mt-0.5 leading-relaxed">
              When checked, visitors browsing the public link will only see the general city (e.g. &ldquo;Nairobi, Kenya&rdquo;). The exact venue address and navigation directions are strictly unlocked after RSVP confirmation.
            </p>
          </div>
        </div>

        {/* Discovery Tags (Only if public) */}
        {visibility === 'public' && (
          <div className="space-y-2 pt-2 border-t border-[rgba(39,38,32,0.08)]">
            <label className="block text-xs font-semibold text-[#272620]">
              Discovery Tags (Comma-separated)
            </label>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="e.g. conference, summit, tech, nairobi, entrepreneurship"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 bg-white p-2.5 text-[#272620] focus:outline-none focus:border-[#934638]"
              />
            </div>
            <p className="text-[11px] text-[#756F64]">
              Tags help visitors discover relevant public gatherings on the community directory.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            size="md"
            disabled={isSavingPrivacy}
            onClick={handleSavePrivacy}
          >
            {isSavingPrivacy ? 'Saving Preferences...' : 'Save Privacy & Discovery Settings'}
          </Button>
        </div>
      </Card>

      {/* SECTION 7: WRITTEN DEFINITIONS & AUDIT TRANSPARENCY */}
      <Card className="p-5 sm:p-6 border-[rgba(39,38,32,0.12)] bg-[#FDFBF7] space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#934638]" />
          <h3 className="text-base font-serif font-medium text-[#272620]">
            Metric Definitions &amp; Audit Trail
          </h3>
        </div>
        <p className="text-xs text-[#756F64]">
          How Kadi calculates every figure shown in this dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {Object.entries(metricDefinitions).map(([key, def]) => (
            <div key={key} className="p-3 bg-white border border-[rgba(39,38,32,0.08)] rounded-xl text-xs space-y-1">
              <span className="font-semibold text-[#272620] capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <p className="text-stone-600 text-[11px] leading-relaxed">{def.definition}</p>
              <div className="text-[10px] text-stone-500 font-mono pt-1">
                Source: {def.dataSource}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
