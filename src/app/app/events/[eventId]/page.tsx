'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventService } from '@/lib/services/event-service';
import { GuestService } from '@/lib/services/guest-service';
import { RSVPService } from '@/lib/services/rsvp-service';
import { getTemplateById } from '@/lib/templates/catalogue';
import { EnvelopeRenderer } from '@/components/animation/EnvelopeRenderer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Users,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Plus,
  FileSpreadsheet,
  Download,
  Trash2,
  Sparkles,
  Palette,
  Eye,
  Smartphone,
  Info,
  ArrowLeft,
  Utensils,
  Music,
} from 'lucide-react';

type TabType = 'overview' | 'guests' | 'rsvps' | 'design' | 'share' | 'contributions';

export default function EventCommandCenterPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  // Load Domain Entities
  const [event, setEvent] = useState(() => EventService.getEventById(eventId));
  const [design, setDesign] = useState(() => EventService.getEventDesign(eventId));
  const [guests, setGuests] = useState(() => GuestService.listGuests(eventId));
  const [rsvps, setRsvps] = useState(() => RSVPService.listRSVPs(eventId));
  const [summary, setSummary] = useState(() => RSVPService.getRSVPSummary(eventId));

  // Guest Search & Filter
  const [guestSearch, setGuestSearch] = useState('');
  const [guestGroupFilter, setGuestGroupFilter] = useState('all');

  // Add Guest Modal State
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestGroup, setNewGuestGroup] = useState('Guests');
  const [newGuestPlusOnes, setNewGuestPlusOnes] = useState(1);

  // CSV Import Modal State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvText, setCsvText] = useState(
    'Name,Phone,Group,PlusOnes\nDr. Peter Otieno,+254712345678,Family,2\nGrace Mwangi,+254722987654,Friends,1\nHon. Kiprono,+254733112233,VIP,1'
  );

  // Design Editor Local State
  const [editorLiner, setEditorLiner] = useState(design?.linerId || 'gold-foil');
  const [editorSealMonogram, setEditorSealMonogram] = useState(design?.sealMonogram || 'K&W');
  const [editorSealColor, setEditorSealColor] = useState(design?.sealColor || '#D4AF37');
  const [editorEnvelopeColor, setEditorEnvelopeColor] = useState(
    design?.palette?.envelope || '#252042'
  );
  const [isDesignSaved, setIsDesignSaved] = useState(false);

  if (!event) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-serif font-bold text-brand-charcoal">Event not found</h2>
        <Link href="/app/events">
          <Button variant="primary" className="mt-4">Back to Events</Button>
        </Link>
      </div>
    );
  }

  const template = getTemplateById(event.templateId) || getTemplateById('savannah-twilight')!;
  const canonicalUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/e/${event.slug}`;

  const refreshData = () => {
    setEvent(EventService.getEventById(eventId));
    setDesign(EventService.getEventDesign(eventId));
    setGuests(GuestService.listGuests(eventId, guestSearch, guestGroupFilter));
    setRsvps(RSVPService.listRSVPs(eventId));
    setSummary(RSVPService.getRSVPSummary(eventId));
  };

  const handlePublish = () => {
    EventService.publishEvent(eventId);
    refreshData();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Add Guest Handler
  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    GuestService.addGuest(eventId, {
      displayName: newGuestName,
      contactPhone: newGuestPhone || undefined,
      contactEmail: newGuestEmail || undefined,
      group: newGuestGroup,
      allowedPlusOnes: Number(newGuestPlusOnes),
    });

    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestEmail('');
    setIsAddGuestOpen(false);
    refreshData();
  };

  // CSV Import Handler
  const handleImportCsv = () => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      alert('Please provide a header line and at least one guest row.');
      return;
    }

    const rows = lines.slice(1).map((line) => {
      const parts = line.split(',');
      return {
        name: parts[0]?.trim(),
        phone: parts[1]?.trim(),
        group: parts[2]?.trim() || 'Guests',
        plusOnes: Number(parts[3]) || 1,
      };
    });

    const result = GuestService.importGuests(eventId, rows);
    alert(`Successfully imported ${result.importedCount} guest households!`);
    setIsCsvModalOpen(false);
    refreshData();
  };

  const handleDeleteGuest = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from guest list?`)) {
      GuestService.deleteGuest(id);
      refreshData();
    }
  };

  const handleSaveDesign = () => {
    EventService.updateDesign(eventId, {
      linerId: editorLiner,
      sealMonogram: editorSealMonogram,
      sealColor: editorSealColor,
      palette: {
        ...design?.palette,
        envelope: editorEnvelopeColor,
        primary: design?.palette?.primary || '#6B4EFF',
        secondary: design?.palette?.secondary || '#F5B942',
        accent: design?.palette?.accent || '#E85D75',
        flap: editorEnvelopeColor,
        cardBackground: design?.palette?.cardBackground || '#FCFCF9',
      },
    });
    refreshData();
    setIsDesignSaved(true);
    setTimeout(() => setIsDesignSaved(false), 3000);
  };

  const filteredGuests = GuestService.listGuests(eventId, guestSearch, guestGroupFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner / Event Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/app/events"
              className="text-xs text-brand-slate hover:text-brand-charcoal flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Events</span>
            </Link>
            <span className="text-slate-300">/</span>
            <Badge
              variant={event.status === 'published' ? 'success' : 'warning'}
              size="sm"
            >
              {event.status}
            </Badge>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {event.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-slate mt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-purple" /> {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-purple" /> {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-purple" /> {event.venue}
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          {event.status === 'draft' ? (
            <Button variant="primary" size="md" onClick={handlePublish}>
              Publish Live Invitation
            </Button>
          ) : (
            <Link href={`/e/${event.slug}`} target="_blank">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ExternalLink className="w-4 h-4" />}
                className="shadow-md shadow-brand-purple/20"
              >
                View Live Link
              </Button>
            </Link>
          )}

          <Button
            variant="secondary"
            size="md"
            onClick={handleCopyLink}
            leftIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          >
            {copiedLink ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-brand-purple text-white shadow-sm'
              : 'text-brand-slate hover:text-brand-charcoal hover:bg-white'
          }`}
        >
          Overview & Stats
        </button>
        <button
          onClick={() => setActiveTab('guests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'guests'
              ? 'bg-brand-purple text-white shadow-sm'
              : 'text-brand-slate hover:text-brand-charcoal hover:bg-white'
          }`}
        >
          Guest Households ({summary.totalHouseholds})
        </button>
        <button
          onClick={() => setActiveTab('rsvps')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'rsvps'
              ? 'bg-brand-purple text-white shadow-sm'
              : 'text-brand-slate hover:text-brand-charcoal hover:bg-white'
          }`}
        >
          RSVP Responses ({summary.attendingAttendeeCount} Attending)
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'design'
              ? 'bg-brand-purple text-white shadow-sm'
              : 'text-brand-slate hover:text-brand-charcoal hover:bg-white'
          }`}
        >
          Design & 3D Envelope Studio
        </button>
        <button
          onClick={() => setActiveTab('share')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'share'
              ? 'bg-brand-purple text-white shadow-sm'
              : 'text-brand-slate hover:text-brand-charcoal hover:bg-white'
          }`}
        >
          WhatsApp & Share Hub
        </button>
        <button
          onClick={() => setActiveTab('contributions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'contributions'
              ? 'bg-brand-purple text-white shadow-sm'
              : 'text-brand-slate hover:text-brand-charcoal hover:bg-white'
          }`}
        >
          Direct M-Pesa Setup
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate block">
                Households Invited
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal mt-1 block">
                {summary.totalHouseholds}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Up to {summary.totalHeadcountExpected} people
              </span>
            </Card>

            <Card className="p-5 text-center bg-emerald-50/50 border-emerald-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Confirmed Attending
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 mt-1 block">
                {summary.attendingAttendeeCount}
              </span>
              <span className="text-[11px] text-emerald-600 mt-1 block">
                {summary.attendingHouseholds} households
              </span>
            </Card>

            <Card className="p-5 text-center bg-amber-50/50 border-amber-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Awaiting Response
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 mt-1 block">
                {summary.pendingHouseholds}
              </span>
              <span className="text-[11px] text-amber-600 mt-1 block">
                Pending invitations
              </span>
            </Card>

            <Card className="p-5 text-center bg-slate-50 border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Dietary Requests
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal mt-1 block">
                {summary.dietaryCount}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Special meal needs
              </span>
            </Card>
          </div>

          {/* Canonical Share Link Card */}
          <Card className="p-6">
            <h3 className="font-serif font-bold text-base text-brand-charcoal mb-2">
              Shareable Invitation Link
            </h3>
            <p className="text-xs text-brand-slate mb-4">
              Send this canonical link to guests. Guests can open the 3D envelope and submit an RSVP immediately.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                readOnly
                value={canonicalUrl}
                className="w-full rounded-xl border border-slate-200 bg-brand-mist px-4 py-2.5 font-mono text-xs text-brand-charcoal select-all"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  size="md"
                  variant="primary"
                  onClick={handleCopyLink}
                  leftIcon={copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copiedLink ? 'Copied' : 'Copy'}
                </Button>
                <Link href={`/e/${event.slug}`} target="_blank">
                  <Button size="md" variant="secondary" leftIcon={<Eye className="w-4 h-4" />}>
                    Open
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: GUESTS & HOUSEHOLDS */}
      {activeTab === 'guests' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-brand-charcoal">
                Guest Households & Invitations
              </h2>
              <p className="text-xs text-brand-slate mt-0.5">
                Each household has a unique secure invitation link and plus-one allowance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsCsvModalOpen(true)}
                leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
              >
                Import CSV
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddGuestOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Household
              </Button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by name, phone, or email..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
              />
            </div>
            <select
              value={guestGroupFilter}
              onChange={(e) => setGuestGroupFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-brand-charcoal"
            >
              <option value="all">All Groups</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="VIP">VIP</option>
              <option value="Guests">General Guests</option>
            </select>
          </div>

          {/* Guests Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-brand-slate uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Household / Guest Name</th>
                    <th className="p-4">Group</th>
                    <th className="p-4">Max Attendees</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Personal Token Link</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-brand-slate">
                        No guests found. Click &ldquo;Add Household&rdquo; or &ldquo;Import CSV&rdquo; above.
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((g) => {
                      const personalUrl = `${canonicalUrl}?tok=${g.token}`;
                      return (
                        <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <span className="font-semibold text-brand-charcoal block">
                              {g.displayName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {g.contactPhone || g.contactEmail || 'No contact specified'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600 text-[10px]">
                              {g.group}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-brand-charcoal">
                            {1 + g.allowedPlusOnes} {g.allowedPlusOnes === 0 ? 'person' : 'people'}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                g.status === 'attending'
                                  ? 'success'
                                  : g.status === 'no'
                                  ? 'error'
                                  : 'warning'
                              }
                              size="sm"
                            >
                              {g.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                                ?tok={g.token.substring(0, 10)}...
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(personalUrl);
                                  alert('Personal link copied to clipboard!');
                                }}
                                className="p-1 hover:text-brand-purple text-slate-400"
                                title="Copy personal link"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteGuest(g.id, g.displayName)}
                              className="p-1.5 text-slate-400 hover:text-status-error rounded-lg hover:bg-red-50"
                              title="Delete guest"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RSVPS & RESPONSES */}
      {activeTab === 'rsvps' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-brand-charcoal">
                RSVP Headcount & Preferences
              </h2>
              <p className="text-xs text-brand-slate mt-0.5">
                Real-time responses submitted by guests through the live invitation link.
              </p>
            </div>

            <a
              href={`/api/events/${eventId}/rsvps/export`}
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV for Caterer</span>
            </a>
          </div>

          {/* Submissions List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-brand-slate uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Guest Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Response</th>
                    <th className="p-4">Headcount</th>
                    <th className="p-4">Dietary Notes</th>
                    <th className="p-4">Song Request</th>
                    <th className="p-4">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rsvps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-brand-slate">
                        No RSVPs received yet. Share your invitation link to start collecting responses!
                      </td>
                    </tr>
                  ) : (
                    rsvps.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-brand-charcoal">
                          {r.primaryName}
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">
                          {r.contact}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={r.status === 'yes' ? 'success' : 'error'}
                            size="sm"
                          >
                            {r.status === 'yes' ? 'Attending' : 'Declined'}
                          </Badge>
                        </td>
                        <td className="p-4 font-bold text-brand-charcoal">
                          {r.attendeeCount}
                        </td>
                        <td className="p-4 text-brand-slate">
                          {r.dietaryRequirements ? (
                            <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg w-fit text-[11px]">
                              <Utensils className="w-3 h-3 flex-shrink-0" />
                              <span>{r.dietaryRequirements}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="p-4 text-brand-slate">
                          {r.songRequest ? (
                            <span className="flex items-center gap-1.5 text-brand-purple bg-brand-purple-light px-2 py-0.5 rounded-lg w-fit text-[11px]">
                              <Music className="w-3 h-3 flex-shrink-0" />
                              <span>{r.songRequest}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="p-4 text-slate-400 text-[11px]">
                          {new Date(r.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DESIGN & 3D STUDIO */}
      {activeTab === 'design' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-brand-charcoal">
                Design & 3D Envelope Studio
              </h2>
              <p className="text-xs text-brand-slate mt-0.5">
                Customize your liner pattern, wax seal monogram, and envelope colors with real-time preview.
              </p>
            </div>

            <Button
              size="md"
              variant="primary"
              onClick={handleSaveDesign}
              leftIcon={isDesignSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
            >
              {isDesignSaved ? 'Design Saved!' : 'Save Changes'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Controls */}
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
              {/* Liner Pattern */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-2">
                  Envelope Liner Pattern
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'gold-foil', label: 'Gold Foil' },
                    { id: 'floral', label: 'Blush Floral' },
                    { id: 'botanical', label: 'Botanical' },
                    { id: 'geometric', label: 'Geometric' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setEditorLiner(l.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                        editorLiner === l.id
                          ? 'border-brand-purple bg-brand-purple-light text-brand-purple font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-brand-charcoal'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seal Monogram */}
              <div>
                <Input
                  label="Wax Seal Monogram / Text"
                  value={editorSealMonogram}
                  onChange={(e) => setEditorSealMonogram(e.target.value.toUpperCase())}
                  placeholder="e.g. K&W"
                  maxLength={5}
                />
              </div>

              {/* Seal Color */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-2">
                  Wax Seal Color
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { color: '#D4AF37', label: 'Champagne Gold' },
                    { color: '#E85D75', label: 'Rose Red' },
                    { color: '#6B4EFF', label: 'Royal Purple' },
                    { color: '#7A8B7A', label: 'Sage Olive' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setEditorSealColor(c.color)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        editorSealColor === c.color ? 'scale-110 border-brand-charcoal ring-2 ring-brand-purple' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Envelope Body Color */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-2">
                  Envelope Paper Color
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { color: '#252042', label: 'Deep Royal' },
                    { color: '#1A1A2E', label: 'Charcoal Midnight' },
                    { color: '#3A2E33', label: 'Burgundy Plum' },
                    { color: '#2D352D', label: 'Forest Sage' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setEditorEnvelopeColor(c.color)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        editorEnvelopeColor === c.color ? 'scale-110 border-brand-charcoal ring-2 ring-brand-purple' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Live Real-Time Preview Stage */}
            <div className="lg:col-span-2 rounded-3xl border border-slate-200 overflow-hidden shadow-xl bg-black/30">
              <EnvelopeRenderer
                template={{
                  ...template,
                  palette: {
                    ...template.palette,
                    envelope: editorEnvelopeColor,
                    flap: editorEnvelopeColor,
                  },
                  liner: {
                    id: editorLiner as any,
                    name: editorLiner,
                    className: `bg-liner-${editorLiner}`,
                  },
                  seal: {
                    ...template.seal,
                    monogram: editorSealMonogram,
                    color: editorSealColor,
                  },
                  sampleData: {
                    ...template.sampleData,
                    title: event.title,
                    hosts: event.hosts,
                    venue: event.venue,
                    date: event.date,
                    time: event.time,
                  },
                }}
                guestName="Guest Preview"
                isDemo={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SHARE & WHATSAPP HUB */}
      {activeTab === 'share' && (
        <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-brand-charcoal">
                  WhatsApp & Native Share Hub
                </h2>
                <p className="text-xs text-brand-slate mt-0.5">
                  Share directly using your phone&apos;s WhatsApp without intermediary sending costs.
                </p>
              </div>
            </div>

            {/* Pre-filled Message Template */}
            <div className="my-6 p-4 rounded-2xl bg-brand-mist border border-slate-200 text-xs text-brand-charcoal space-y-2 leading-relaxed">
              <p className="font-semibold text-brand-purple">Pre-filled WhatsApp Message:</p>
              <p className="italic font-serif">
                &ldquo;You are warmly invited to {event.title}! Please open your digital envelope invitation and let us know if you can join us: {canonicalUrl}&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `You are warmly invited to ${event.title}! Please open your digital envelope invitation: ${canonicalUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </a>

              <Button
                variant="secondary"
                size="md"
                onClick={handleCopyLink}
                leftIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              >
                {copiedLink ? 'Copied Invitation Link!' : 'Copy Invitation Link'}
              </Button>
            </div>

            {/* Decision Gate Note */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-3 text-xs text-brand-slate">
              <Info className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
              <p>
                <strong>Architecture Decision Gate:</strong> Automated background WhatsApp Cloud API dispatch is disabled until Meta Business Manager verification and explicit consent logging workflows are confirmed. Native WhatsApp sharing is instant, reliable, and completely free.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 6: DIRECT M-PESA SETUP */}
      {activeTab === 'contributions' && (
        <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl">
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-serif font-bold text-brand-charcoal mb-2">
              Direct M-Pesa Gift Instructions (Kenya)
            </h2>
            <p className="text-xs text-brand-slate mb-6">
              Guests can send contributions directly to your verified Paybill, Till number, or Send Money line.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1">
                  M-Pesa Account Type
                </label>
                <select
                  value={event.mpesaType || 'till'}
                  onChange={(e) => {
                    EventService.updateEvent(eventId, { mpesaType: e.target.value as any });
                    refreshData();
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-brand-charcoal"
                >
                  <option value="till">Buy Goods (Till Number)</option>
                  <option value="paybill">Paybill Number</option>
                  <option value="send_money">Send Money (Phone Number)</option>
                </select>
              </div>

              <Input
                label="M-Pesa Number *"
                placeholder="e.g. 8249102"
                value={event.mpesaNumber || ''}
                onChange={(e) => {
                  EventService.updateEvent(eventId, { mpesaNumber: e.target.value });
                  refreshData();
                }}
              />

              <Input
                label="Recipient / Account Name *"
                placeholder="e.g. Kevin Kamau"
                value={event.mpesaRecipient || ''}
                onChange={(e) => {
                  EventService.updateEvent(eventId, { mpesaRecipient: e.target.value });
                  refreshData();
                }}
              />

              <Input
                label="Account Reference (For Paybills)"
                placeholder="e.g. Kevin & Wanjiku Wedding"
                value={event.mpesaReference || ''}
                onChange={(e) => {
                  EventService.updateEvent(eventId, { mpesaReference: e.target.value });
                  refreshData();
                }}
              />
            </div>
          </Card>
        </div>
      )}

      {/* MODAL: ADD GUEST */}
      <Modal
        isOpen={isAddGuestOpen}
        onClose={() => setIsAddGuestOpen(false)}
        title="Add Guest Household"
        description="Add a family or individual to this event."
      >
        <form onSubmit={handleAddGuest} className="space-y-4 pt-2">
          <Input
            label="Household or Guest Name *"
            placeholder="e.g. Dr. Peter Otieno & Family"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number (WhatsApp)"
              placeholder="e.g. +254 712 345 678"
              value={newGuestPhone}
              onChange={(e) => setNewGuestPhone(e.target.value)}
            />

            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="e.g. peter@example.com"
              value={newGuestEmail}
              onChange={(e) => setNewGuestEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1">
                Group / Category
              </label>
              <select
                value={newGuestGroup}
                onChange={(e) => setNewGuestGroup(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-brand-charcoal"
              >
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
                <option value="VIP">VIP</option>
                <option value="Bridal Party">Bridal Party</option>
                <option value="Guests">General Guests</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1">
                Allowed Plus-Ones
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={newGuestPlusOnes}
                onChange={(e) => setNewGuestPlusOnes(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-brand-charcoal"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddGuestOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Household
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CSV IMPORT */}
      <Modal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        title="Import Guests via CSV / Spreadsheet"
        description="Paste your comma-separated guest records below. First row must be headers."
        maxWidth="lg"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1">
              CSV Data (Name, Phone, Group, PlusOnes)
            </label>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 font-mono text-xs p-3 text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
            <strong>Note:</strong> Importing contacts will NOT send any messages automatically. You control exactly when and how to share links.
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsCsvModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="md" onClick={handleImportCsv}>
              Parse & Import Guests
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
