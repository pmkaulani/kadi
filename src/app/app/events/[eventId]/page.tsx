'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventService } from '@/lib/services/event-service';
import { GuestService } from '@/lib/services/guest-service';
import { RSVPService } from '@/lib/services/rsvp-service';
import { MpesaService } from '@/lib/services/mpesa-service';
import { NotificationService } from '@/lib/services/notification-service';
import { getTemplateById, TEMPLATES } from '@/lib/templates/catalogue';
import { KadiStudioEditor } from '@/components/studio/KadiStudioEditor';
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
  EyeOff,
  Smartphone,
  Info,
  ArrowLeft,
  Utensils,
  Music,
  ChevronUp,
  ChevronDown,
  Layers,
  RefreshCw,
  Shield,
  Archive,
} from 'lucide-react';
import { QrCode } from '@/components/ui/QrCode';
import { ScheduleSection } from '@/components/invitations/ScheduleSection';
import { VenueSection } from '@/components/invitations/VenueSection';
import { CeremonyReceptionSection } from '@/components/invitations/CeremonyReceptionSection';
import { StorySection } from '@/components/invitations/StorySection';
import { GallerySection } from '@/components/invitations/GallerySection';
import { FAQSection } from '@/components/invitations/FAQSection';
import { BirthdayAboutSection } from '@/components/invitations/BirthdayAboutSection';
import { BirthdayActivitiesSection } from '@/components/invitations/BirthdayActivitiesSection';
import { MemorialObituarySection } from '@/components/invitations/MemorialObituarySection';
import { MemorialServiceSection } from '@/components/invitations/MemorialServiceSection';
import { MemorialTributesCandlesSection } from '@/components/invitations/MemorialTributesCandlesSection';
import { MemorialLivestreamSection } from '@/components/invitations/MemorialLivestreamSection';
import { CondolencesSection } from '@/components/invitations/CondolencesSection';
import { RSVPSection } from '@/components/invitations/RSVPSection';
import { RegistrySection } from '@/components/invitations/RegistrySection';
import { ClosingSection } from '@/components/invitations/ClosingSection';
import { EventCheckInTab } from '@/components/events/EventCheckInTab';
import { EventSettingsTab } from '@/components/events/EventSettingsTab';
import { EventCsvImportModal } from '@/components/events/EventCsvImportModal';

export type TabType =
  | 'overview'
  | 'design'
  | 'guests'
  | 'rsvps'
  | 'messages'
  | 'contributions'
  | 'checkin'
  | 'settings'
  | 'share';

export default function EventCommandCenterPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tab = searchParams.get('tab') as TabType;
      if (
        tab &&
        ['overview', 'design', 'guests', 'rsvps', 'messages', 'contributions', 'checkin', 'settings', 'share'].includes(tab)
      ) {
        setActiveTab(tab);
      }
    }
  }, []);

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };
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

  // RSVP Sub-tab View (Submissions vs Named Attendees)
  const [rsvpSubTab, setRsvpSubTab] = useState<'submissions' | 'attendees'>('submissions');

  // Share Hub Guest Personalization State
  const [shareSelectedGuestId, setShareSelectedGuestId] = useState<string>('');

  // STK Push Simulation Test State
  const [isStkTestModalOpen, setIsStkTestModalOpen] = useState(false);
  const [testPhone, setTestPhone] = useState('254712345678');
  const [testAmount, setTestAmount] = useState('1000');
  const [stkSimulating, setStkSimulating] = useState(false);
  const [stkSimResult, setStkSimResult] = useState<{
    success: boolean;
    checkoutRequestId?: string;
    customerMessage?: string;
    instructions?: string[];
  } | null>(null);

  // Lifecycle Modals
  const [isPublishSuccessOpen, setIsPublishSuccessOpen] = useState(false);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);

  // Design Editor Local State
  const defaultSectionsByCategory: Record<string, string[]> = {
    wedding: ['story', 'ceremony', 'schedule', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
    birthday: ['about', 'activities', 'schedule', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
    memorial: ['obituary', 'services', 'livestream', 'candles', 'rsvp', 'registry', 'closing'],
    funeral: ['obituary', 'services', 'livestream', 'candles', 'rsvp', 'closing'],
    housewarming: ['story', 'schedule', 'gallery', 'faq', 'rsvp', 'closing'],
    graduation: ['story', 'ceremony', 'schedule', 'gallery', 'faq', 'rsvp', 'closing'],
    corporate: ['schedule', 'faq', 'rsvp', 'closing'],
    anniversary: ['story', 'ceremony', 'schedule', 'gallery', 'rsvp', 'closing'],
    'baby-shower': ['about', 'activities', 'registry', 'rsvp', 'closing'],
    holiday: ['activities', 'schedule', 'rsvp', 'closing'],
  };

  const [editorLiner, setEditorLiner] = useState(design?.linerId || 'gold-foil');
  const [editorSealMonogram, setEditorSealMonogram] = useState(design?.sealMonogram || 'K&W');
  const [editorSealColor, setEditorSealColor] = useState(design?.sealColor || '#D4AF37');
  const [editorEnvelopeColor, setEditorEnvelopeColor] = useState(
    design?.palette?.envelope || '#4A0E17'
  );
  const [editorSections, setEditorSections] = useState<string[]>(() => {
    return (
      design?.sectionOrder ||
      design?.visibleSections ||
      (event ? defaultSectionsByCategory[event.category] : undefined) || [
        'venue',
        'schedule',
        'gallery',
        'faq',
        'registry',
        'rsvp',
        'closing',
      ]
    );
  });
  const [isDesignSaved, setIsDesignSaved] = useState(false);

  if (!event) {
    return (
      <div className="p-8 sm:p-16 max-w-lg mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-[#934638]/10 text-[#934638] flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-6 h-6" />
        </div>
        <p className="kadi-eyebrow text-[#934638] mb-2">Event Not Found</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#272620] mb-3">
          Occasion record unavailable.
        </h1>
        <p className="text-xs sm:text-sm text-[#756F64] leading-relaxed mb-6">
          This celebration may have been removed, archived, or was created under a different host workspace.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/app/events" className="kadi-button w-full sm:w-auto">
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </Link>
          <Link href="/app/events/new" className="kadi-button kadi-button--quiet w-full sm:w-auto">
            <Plus size={14} />
            <span>New Invitation</span>
          </Link>
        </div>
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
    setIsPublishSuccessOpen(true);
  };

  const handleArchive = () => {
    EventService.archiveEvent(eventId);
    refreshData();
    setIsArchiveConfirmOpen(false);
  };

  const handleUnarchive = () => {
    EventService.unarchiveEvent(eventId);
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
    const rows = GuestService.parseCsvText(csvText);
    if (rows.length === 0) {
      alert('Please provide a header line and at least one valid guest row.');
      return;
    }

    const result = GuestService.importGuests(eventId, rows);
    let msg = `Import Summary:\n• ${result.importedCount} households added.`;
    if (result.duplicateCount > 0) {
      msg += `\n• ${result.duplicateCount} duplicate contacts detected.`;
    }
    if (result.errorCount > 0) {
      msg += `\n• ${result.errorCount} row errors:\n  ${result.errors.map((e) => `Row ${e.row}: ${e.reason}`).join('\n  ')}`;
    }
    alert(msg);
    setIsCsvModalOpen(false);
    refreshData();
  };

  const handleRotateToken = (id: string, name: string) => {
    if (confirm(`Rotate personal invitation link for "${name}"? The previous link will stop working immediately.`)) {
      GuestService.rotateGuestToken(id);
      refreshData();
      alert(`Link rotated for ${name}. A fresh private token has been generated.`);
    }
  };

  const handleRevokeToken = (id: string, name: string) => {
    if (confirm(`Revoke invitation access for "${name}"? They will no longer be able to open or RSVP.`)) {
      GuestService.revokeGuestToken(id);
      refreshData();
      alert(`Invitation revoked for ${name}.`);
    }
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
      visibleSections: editorSections,
      sectionOrder: editorSections,
      palette: {
        ...design?.palette,
        envelope: editorEnvelopeColor,
        primary: design?.palette?.primary || '#934638',
        secondary: design?.palette?.secondary || '#B99A62',
        accent: design?.palette?.accent || '#A94F51',
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
      {/* Archive Warning Banner */}
      {event.status === 'archived' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-600/30 text-[#272620]">
          <div className="flex items-center gap-3">
            <Archive className="w-5 h-5 text-amber-700 shrink-0" />
            <div className="text-xs">
              <strong className="font-semibold text-amber-900">Event is currently archived.</strong>{' '}
              Public visitors will see an archived notice and cannot RSVP. You can restore this event to draft state at any time.
            </div>
          </div>
          <button
            type="button"
            onClick={handleUnarchive}
            className="kadi-button !py-1.5 !px-3 text-xs shrink-0 self-start sm:self-auto"
          >
            <span>Restore to Draft</span>
          </button>
        </div>
      )}

      {/* Top Banner / Event Title */}
      <div className="bg-transparent py-5 sm:py-7 border-y border-[rgba(39,38,32,.18)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Link
              href="/app/events"
              className="text-xs text-brand-slate hover:text-brand-charcoal flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Events</span>
            </Link>
            <span className="text-slate-300">/</span>
            <Badge
              variant={event.status === 'published' ? 'success' : event.status === 'archived' ? 'default' : 'warning'}
              size="sm"
            >
              {event.status}
            </Badge>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {event.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-[-.04em] text-brand-charcoal">
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
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {event.status === 'draft' && (
            <>
              <Button variant="primary" size="md" onClick={handlePublish}>
                Publish Live Invitation
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsArchiveConfirmOpen(true)}
                leftIcon={<Archive className="w-4 h-4 text-stone-600" />}
              >
                Archive
              </Button>
            </>
          )}

          {event.status === 'published' && (
            <>
              <Link href={`/e/${event.slug}`} target="_blank">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ExternalLink className="w-4 h-4" />}
                >
                  View Live Link
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsArchiveConfirmOpen(true)}
                leftIcon={<Archive className="w-4 h-4 text-stone-600" />}
              >
                Archive
              </Button>
            </>
          )}

          {event.status === 'archived' && (
            <Button variant="primary" size="md" onClick={handleUnarchive}>
              Restore to Draft
            </Button>
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

      {/* Tabs Navigation (Desktop & Mobile) */}
      <div className="flex items-center gap-1 sm:gap-6 overflow-x-auto whitespace-nowrap border-b border-[rgba(39,38,32,.2)] scrollbar-none pb-px">
        <button
          onClick={() => switchTab('overview')}
          className={`px-3 sm:px-0 py-3 sm:py-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'border-[#934638] text-[#934638] font-semibold'
              : 'border-transparent text-[#756F64] hover:text-[#272620]'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => switchTab('design')}
          className={`px-3 sm:px-0 py-3 sm:py-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'design'
              ? 'border-[#934638] text-[#934638] font-semibold'
              : 'border-transparent text-[#756F64] hover:text-[#272620]'
          }`}
        >
          Invitation &amp; Design
        </button>
        <button
          onClick={() => switchTab('guests')}
          className={`px-3 sm:px-0 py-3 sm:py-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'guests'
              ? 'border-[#934638] text-[#934638] font-semibold'
              : 'border-transparent text-[#756F64] hover:text-[#272620]'
          }`}
        >
          Guests ({summary.totalHouseholds})
        </button>
        <button
          onClick={() => switchTab('rsvps')}
          className={`px-3 sm:px-0 py-3 sm:py-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'rsvps'
              ? 'border-[#934638] text-[#934638] font-semibold'
              : 'border-transparent text-[#756F64] hover:text-[#272620]'
          }`}
        >
          RSVPs ({summary.attendingAttendeeCount})
        </button>
        <button
          onClick={() => switchTab('share')}
          className={`px-3 sm:px-0 py-3 sm:py-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'share' || (activeTab as any) === 'messages'
              ? 'border-[#934638] text-[#934638] font-semibold'
              : 'border-transparent text-[#756F64] hover:text-[#272620]'
          }`}
        >
          Messages &amp; Share
        </button>
        <button
          onClick={() => switchTab('contributions')}
          className={`px-3 sm:px-0 py-3 sm:py-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'contributions'
              ? 'border-[#934638] text-[#934638] font-semibold'
              : 'border-transparent text-[#756F64] hover:text-[#272620]'
          }`}
        >
          Contributions
        </button>
        <button
          onClick={() => switchTab('checkin')}
          className={`px-3 sm:px-0 py-3 sm:py-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all inline-flex items-center gap-1.5 ${
            activeTab === 'checkin'
              ? 'border-[#934638] text-[#934638] font-semibold'
              : 'border-transparent text-[#756F64] hover:text-[#272620]'
          }`}
        >
          <span>Check-in</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>
        <button
          onClick={() => switchTab('settings')}
          className={`px-3 sm:px-0 py-3 sm:py-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'settings'
              ? 'border-[#934638] text-[#934638] font-semibold'
              : 'border-transparent text-[#756F64] hover:text-[#272620]'
          }`}
        >
          Settings
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-y border-[rgba(39,38,32,.2)]">
            <Card className="!bg-transparent !border-0 !shadow-none p-5 text-left border-r border-[rgba(39,38,32,.15)]">
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

            <Card className="!bg-transparent !border-0 !shadow-none p-5 text-left border-r border-[rgba(39,38,32,.15)]">
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

            <Card className="!bg-transparent !border-0 !shadow-none p-5 text-left border-r border-[rgba(39,38,32,.15)]">
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

            <Card className="!bg-transparent !border-0 !shadow-none p-5 text-left">
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
          <Card className="!bg-transparent !border-0 !shadow-none border-t border-b border-[rgba(39,38,32,.2)] p-6">
            <h3 className="font-serif font-medium text-xl text-brand-charcoal mb-2">
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
                className="w-full rounded-none border-0 border-b border-[rgba(39,38,32,.25)] bg-transparent px-1 py-3 font-mono text-xs text-brand-charcoal select-all focus:outline-none focus:border-brand-purple"
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

          {/* Mobile Stacked Guest Cards (< 640px) */}
          <div className="sm:hidden space-y-3">
            {filteredGuests.length === 0 ? (
              <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 text-center text-xs text-brand-slate">
                No guests found. Click &ldquo;Add Household&rdquo; or &ldquo;Import CSV&rdquo; above.
              </div>
            ) : (
              filteredGuests.map((g) => {
                const personalUrl = `${canonicalUrl}?tok=${g.token}`;
                return (
                  <div
                    key={g.id}
                    className="bg-white border border-[rgba(39,38,32,0.12)] rounded-xl p-4 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-semibold text-sm text-brand-charcoal block truncate">
                          {g.displayName}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                          {g.contactPhone || g.contactEmail || 'No contact specified'}
                        </span>
                      </div>
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
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-brand-slate pt-1 border-t border-[rgba(39,38,32,0.06)]">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600 text-[10px]">
                        {g.group}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-brand-charcoal">
                        {1 + g.allowedPlusOnes} {g.allowedPlusOnes === 0 ? 'person' : 'people'} max
                      </span>
                    </div>

                    {/* Mobile Actions Cluster */}
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(39,38,32,0.06)]">
                      {!(g as any).tokenRevoked ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(personalUrl);
                              alert(`Personal link for ${g.displayName} copied!`);
                            }}
                            className="flex-1 sm:flex-none min-h-[38px] px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#F0EAE0] border border-[rgba(39,38,32,0.14)] rounded-lg text-xs font-semibold text-brand-charcoal inline-flex items-center justify-center gap-1.5 active:scale-[0.98]"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy link</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRotateToken(g.id, g.displayName)}
                            className="min-h-[38px] px-3 py-1.5 bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-[rgba(39,38,32,0.14)] rounded-lg text-xs font-medium inline-flex items-center gap-1.5"
                            title="Rotate link"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Rotate</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-1 rounded font-semibold">
                          Link Revoked
                        </span>
                      )}

                      <div className="flex items-center gap-1 ml-auto">
                        {!(g as any).tokenRevoked && (
                          <button
                            type="button"
                            onClick={() => handleRevokeToken(g.id, g.displayName)}
                            className="p-2 text-slate-400 hover:text-amber-700 rounded-lg hover:bg-amber-50 min-h-[38px] min-w-[38px] flex items-center justify-center"
                            title="Revoke access"
                            aria-label={`Revoke link for ${g.displayName}`}
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteGuest(g.id, g.displayName)}
                          className="p-2 text-slate-400 hover:text-status-error rounded-lg hover:bg-red-50 min-h-[38px] min-w-[38px] flex items-center justify-center"
                          title="Delete guest"
                          aria-label={`Delete ${g.displayName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Guests Table (>= 640px) */}
          <div className="hidden sm:block bg-transparent border-y border-[rgba(39,38,32,.18)] overflow-hidden">
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
                            {(g as any).tokenRevoked ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-semibold">
                                Link Revoked
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
                                  ?tok={g.token.substring(0, 10)}...
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(personalUrl);
                                    alert(`Personal link for ${g.displayName} copied!`);
                                  }}
                                  className="p-1 text-slate-400 hover:text-brand-purple rounded"
                                  title="Copy personal invitation link"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRotateToken(g.id, g.displayName)}
                                  className="p-1 text-slate-400 hover:text-amber-600 rounded"
                                  title="Rotate token (generates new link, invalidates old)"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {!(g as any).tokenRevoked && (
                                <button
                                  type="button"
                                  onClick={() => handleRevokeToken(g.id, g.displayName)}
                                  className="p-1.5 text-slate-400 hover:text-amber-700 rounded-lg hover:bg-amber-50"
                                  title="Revoke link access"
                                >
                                  <EyeOff className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteGuest(g.id, g.displayName)}
                                className="p-1.5 text-slate-400 hover:text-status-error rounded-lg hover:bg-red-50"
                                title="Delete guest"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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

          {/* Sub-tab Switcher: Submissions vs Named Attendees */}
          <div className="flex items-center gap-2 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setRsvpSubTab('submissions')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                rsvpSubTab === 'submissions'
                  ? 'border-brand-purple text-brand-purple'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Household Submissions ({rsvps.length})
            </button>
            <button
              type="button"
              onClick={() => setRsvpSubTab('attendees')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                rsvpSubTab === 'attendees'
                  ? 'border-brand-purple text-brand-purple'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Named Attendees List ({summary.namedAttendeesList.length})
            </button>
          </div>

          {/* Submissions List */}
          {rsvpSubTab === 'submissions' && (
            <div>
              {/* Mobile Stacked RSVP Cards (< 640px) */}
              <div className="sm:hidden space-y-3">
                {rsvps.length === 0 ? (
                  <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 text-center text-xs text-brand-slate">
                    No RSVPs received yet. Share your invitation link to start collecting responses!
                  </div>
                ) : (
                  rsvps.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white border border-[rgba(39,38,32,0.12)] rounded-xl p-4 shadow-sm space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-semibold text-sm text-brand-charcoal block truncate">
                            {r.primaryName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono block truncate mt-0.5">
                            {r.contact}
                          </span>
                        </div>
                        <Badge
                          variant={r.status === 'yes' ? 'success' : 'error'}
                          size="sm"
                        >
                          {r.status === 'yes' ? 'Attending' : 'Declined'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-brand-slate pt-1 border-t border-[rgba(39,38,32,0.06)]">
                        <span className="font-semibold text-brand-charcoal">
                          Headcount: {r.attendeeCount}
                        </span>
                        <span>·</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(r.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {(r.dietaryRequirements || r.songRequest) && (
                        <div className="space-y-1.5 pt-1 border-t border-[rgba(39,38,32,0.06)] text-xs">
                          {r.dietaryRequirements && (
                            <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2 py-1 rounded text-[11px]">
                              <Utensils className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">Diet: {r.dietaryRequirements}</span>
                            </div>
                          )}
                          {r.songRequest && (
                            <div className="flex items-center gap-1.5 text-brand-purple bg-brand-purple-light px-2 py-1 rounded text-[11px]">
                              <Music className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">Song: {r.songRequest}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Submissions Table (>= 640px) */}
              <div className="hidden sm:block bg-transparent border-y border-[rgba(39,38,32,.18)] overflow-hidden">
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

          {/* Named Attendees Table */}
          {rsvpSubTab === 'attendees' && (
            <div>
              {/* Mobile Stacked Attendees Cards (< 640px) */}
              <div className="sm:hidden space-y-3">
                {summary.namedAttendeesList.length === 0 ? (
                  <div className="bg-white border border-[rgba(39,38,32,0.12)] rounded-lg p-6 text-center text-xs text-brand-slate">
                    No named individual attendees recorded yet. RSVPs with attendee names will appear here.
                  </div>
                ) : (
                  summary.namedAttendeesList.map((att) => (
                    <div
                      key={att.id}
                      className="bg-white border border-[rgba(39,38,32,0.12)] rounded-xl p-4 shadow-sm space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-brand-charcoal block truncate">
                          {att.name}
                        </span>
                        <Badge variant="success" size="sm">
                          Attending
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-[rgba(39,38,32,0.06)]">
                        <span>{att.householdName || 'General / Unlinked'}</span>
                        <span className="text-[11px] text-amber-800 font-medium">
                          {att.dietary ? att.dietary : 'Standard Menu'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Attendees Table (>= 640px) */}
              <div className="hidden sm:block bg-transparent border-y border-[rgba(39,38,32,.18)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-brand-slate uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Attendee Full Name</th>
                        <th className="p-4">Parent Household</th>
                        <th className="p-4">Attendance Status</th>
                        <th className="p-4">Dietary Preference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {summary.namedAttendeesList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-brand-slate">
                            No named individual attendees recorded yet. RSVPs with attendee names will appear here.
                          </td>
                        </tr>
                      ) : (
                        summary.namedAttendeesList.map((att) => (
                          <tr key={att.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 font-semibold text-brand-charcoal">
                              {att.name}
                            </td>
                            <td className="p-4 text-slate-600">
                              {att.householdName || 'General / Unlinked'}
                            </td>
                            <td className="p-4">
                              <Badge variant="success" size="sm">
                                Attending
                              </Badge>
                            </td>
                            <td className="p-4 text-brand-slate">
                              {att.dietary ? (
                                <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg w-fit text-[11px]">
                                  <Utensils className="w-3 h-3 flex-shrink-0" />
                                  <span>{att.dietary}</span>
                                </span>
                              ) : (
                                'Standard Menu'
                              )}
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
        </div>
      )}

      {/* TAB 4: DESIGN & 3D STUDIO */}
      {/* TAB 4: DESIGN & 3D STUDIO */}
      {activeTab === 'design' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <KadiStudioEditor
            initialEvent={event}
            initialDesign={design}
            template={template}
            availableTemplates={TEMPLATES}
            guests={
              guests.length > 0
                ? guests.map((g) => ({ id: g.id, label: g.displayName }))
                : undefined
            }
            onSaveDraft={async (draft) => {
              EventService.updateEvent(eventId, {
                title: draft.values.title,
                hosts: draft.values.hosts,
                celebrants: draft.values.celebrants,
                category: draft.category as any,
                templateId: draft.templateId,
                date: draft.values.date,
                time: draft.values.time,
                venue: draft.values.venue,
                city: draft.values.city,
                heroImage: draft.values.heroImage,
                rsvpDeadline: draft.values.rsvpDeadline,
                dressCode: draft.values.dressCode,
                audioUrl: draft.values.audioUrl,
                mpesaType: draft.values.mpesaType,
                mpesaNumber: draft.values.mpesaNumber,
                mpesaRecipient: draft.values.mpesaRecipient,
                mpesaReference: draft.values.mpesaReference,
              });
              EventService.updateDesign(eventId, draft.design);
              refreshData();
            }}
            onPublish={async () => {
              handlePublish();
            }}
            publicSlug={event.slug}
          />
        </div>
      )}

      {/* TAB 5: SHARE & WHATSAPP HUB */}
      {activeTab === 'share' && (() => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const selectedShareGuest = guests.find((g) => g.id === shareSelectedGuestId);
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
        const currentWhatsAppMessage = NotificationService.generateWhatsAppMessage(
          event,
          currentShareUrl,
          selectedShareGuest?.displayName
        );

        return (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
            <Card className="p-6 sm:p-8">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 border-l-2 border-emerald-800 text-emerald-800">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-brand-charcoal">
                      WhatsApp & Native Share Hub
                    </h2>
                    <p className="text-xs text-brand-slate mt-0.5">
                      Distribute invitations via WhatsApp, QR code, or personal guest links.
                    </p>
                  </div>
                </div>

                {event.status === 'draft' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    Draft Mode (Expiring Private Preview Link)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Published & Live
                  </span>
                )}
              </div>

              {/* Guest Personalization Selector */}
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate">
                  Personalize Share Link for a Specific Guest (Optional)
                </label>
                <select
                  value={shareSelectedGuestId}
                  onChange={(e) => setShareSelectedGuestId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-purple"
                >
                  <option value="">General Public Invitation (No Household Token)</option>
                  {guests.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.displayName} ({g.group} — {1 + g.allowedPlusOnes} max)
                    </option>
                  ))}
                </select>
                {selectedShareGuest && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Personalized token active for {selectedShareGuest.displayName}. RSVP responses will automatically link to this household.
                  </p>
                )}
              </div>

              {/* Link Display and Copy */}
              <div className="mb-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate">
                  Active Invitation Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentShareUrl}
                    className="flex-1 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-brand-charcoal"
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
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* QR Code and WhatsApp Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start my-6 pt-6 border-t border-slate-100">
                {/* SVG QR Code */}
                <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-4">
                    Printable QR Code
                  </p>
                  <QrCode value={currentShareUrl} title={event.title} />
                  <p className="text-[11px] text-brand-slate mt-4 max-w-xs">
                    Scan with any smartphone camera to open the invitation instantly.
                  </p>
                </div>

                {/* Pre-filled WhatsApp Share */}
                <div className="flex flex-col justify-between h-full space-y-4">
                  <div>
                    <p className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                      WhatsApp Message Preview
                    </p>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 text-xs text-brand-charcoal whitespace-pre-line leading-relaxed font-sans">
                      {currentWhatsAppMessage}
                    </div>
                  </div>

                  <a
                    href={currentWhatsAppDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Open in WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Provider Status & Decision Gate */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-start gap-3 text-xs text-brand-slate">
                  <Info className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Native Share Delivery:</strong> Native WhatsApp sharing runs client-side through your device with zero per-message cost, 100% deliverability, and no template pre-approvals required.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <span className="font-medium text-slate-700">Meta WhatsApp Cloud API:</span>
                    <Badge variant={NotificationService.isProviderConfigured('whatsapp_cloud') ? 'success' : 'default'} size="sm">
                      {NotificationService.isProviderConfigured('whatsapp_cloud') ? 'Active' : 'Unconfigured'}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <span className="font-medium text-slate-700">Africa&apos;s Talking SMS:</span>
                    <Badge variant={NotificationService.isProviderConfigured('sms') ? 'success' : 'default'} size="sm">
                      {NotificationService.isProviderConfigured('sms') ? 'Active' : 'Unconfigured'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      })()}

      {/* TAB 6: DIRECT M-PESA SETUP */}
      {activeTab === 'contributions' && (() => {
        const manualSteps = MpesaService.getManualInstructions({
          type: event.mpesaType || 'till',
          number: event.mpesaNumber || '',
          recipientName: event.mpesaRecipient || '',
          accountReference: event.mpesaReference,
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl">
            <Card className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-serif font-bold text-brand-charcoal">
                    Direct M-Pesa Gift Instructions (Kenya)
                  </h2>
                  <p className="text-xs text-brand-slate mt-0.5">
                    Guests can send contributions directly to your verified Paybill, Till number, or Send Money line.
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setStkSimResult(null);
                    setIsStkTestModalOpen(true);
                  }}
                  leftIcon={<Sparkles className="w-4 h-4 text-emerald-600" />}
                >
                  Test STK Push Simulation
                </Button>
              </div>

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

                {event.mpesaType === 'paybill' && (
                  <Input
                    label="Account Reference (For Paybills) *"
                    placeholder="e.g. Kevin & Wanjiku Wedding"
                    value={event.mpesaReference || ''}
                    onChange={(e) => {
                      EventService.updateEvent(eventId, { mpesaReference: e.target.value });
                      refreshData();
                    }}
                  />
                )}
              </div>

              {/* Live Guest Instructions Preview */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3">
                  Live Guest Instruction Card Preview
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Method: {event.mpesaType === 'paybill' ? 'Paybill' : event.mpesaType === 'send_money' ? 'Send Money' : 'Buy Goods (Till)'}
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-700">
                      {event.mpesaNumber || 'No number set'}
                    </span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-brand-charcoal font-sans">
                    {manualSteps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </Card>
          </div>
        );
      })()}

      {/* TAB 7: CHECK-IN DESK */}
      {activeTab === 'checkin' && (
        <EventCheckInTab
          eventId={eventId}
          eventTitle={event.title}
          guests={guests}
          onRefresh={refreshData}
        />
      )}

      {/* TAB 8: SETTINGS & POLICIES */}
      {activeTab === 'settings' && (
        <EventSettingsTab
          event={event}
          onRefresh={refreshData}
        />
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

      {/* ENHANCED MODAL: CSV IMPORT WITH LIVE VALIDATION PREVIEW */}
      <EventCsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        eventId={eventId}
        existingGuests={guests}
        onImportSuccess={() => {
          refreshData();
          setIsCsvModalOpen(false);
        }}
      />

      {/* MODAL: TEST STK PUSH SIMULATION */}
      <Modal
        isOpen={isStkTestModalOpen}
        onClose={() => setIsStkTestModalOpen(false)}
        title="Test M-Pesa STK Push Simulation"
        description="Verify how guests experience the STK push prompt without triggering real bank deductions."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Sandbox Demonstration Protocol</p>
              <p className="mt-0.5 leading-relaxed">
                Live Daraja credentials are not active. STK Push runs in simulation mode and will never debit funds or mark payments settled without webhook confirmation.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label="Kenyan Mobile Phone Number"
              placeholder="e.g. 254712345678 or 0712345678"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
            />
            <Input
              label="Amount in Kenyan Shillings (KES)"
              type="number"
              min="10"
              max="150000"
              placeholder="e.g. 1000"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
            />
          </div>

          {stkSimResult && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Badge variant={stkSimResult.success ? 'success' : 'error'} size="sm">
                  {stkSimResult.success ? 'Simulation Dispatched' : 'Failed'}
                </Badge>
                {stkSimResult.checkoutRequestId && (
                  <span className="font-mono text-[10px] text-slate-500">
                    ID: {stkSimResult.checkoutRequestId.slice(0, 18)}...
                  </span>
                )}
              </div>
              <p className="text-slate-700">{stkSimResult.customerMessage}</p>
              {stkSimResult.instructions && (
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pt-1">
                  {stkSimResult.instructions.map((ins: string, idx: number) => (
                    <li key={idx}>{ins}</li>
                  ))}
                </ol>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsStkTestModalOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={stkSimulating}
              onClick={async () => {
                setStkSimulating(true);
                try {
                  const res = await fetch('/api/mpesa/stk-push', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      eventId,
                      phone: testPhone,
                      amount: Number(testAmount),
                      contributorName: 'Test Host Simulator',
                      note: 'Host dashboard test',
                    }),
                  });
                  const data = await res.json();
                  setStkSimResult(data);
                } catch (err: any) {
                  setStkSimResult({
                    success: false,
                    customerMessage: err.message || 'Network error simulating STK push',
                  });
                } finally {
                  setStkSimulating(false);
                }
              }}
            >
              {stkSimulating ? 'Simulating Push...' : 'Send Test STK Push'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: PUBLISH SUCCESS CONFIRMATION */}
      <Modal
        isOpen={isPublishSuccessOpen}
        onClose={() => setIsPublishSuccessOpen(false)}
        title="Invitation Published & Live!"
        description="Your gathering is now open for guests to view and reply."
        maxWidth="md"
      >
        <div className="space-y-5 py-2">
          <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <div className="text-xs leading-relaxed">
              <strong>{event.title}</strong> is now live! Guests visiting your invitation link can open the envelope and submit RSVPs.
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8D867A] mb-1.5">
              Live Public Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={canonicalUrl}
                className="flex-1 text-xs bg-black/5 border border-[rgba(39,38,32,0.15)] rounded-lg px-3 py-2 text-[#272620] select-all font-mono"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="kadi-button !py-2 !px-3 text-xs shrink-0"
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[rgba(39,38,32,0.1)] flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                setIsPublishSuccessOpen(false);
                setActiveTab('guests');
              }}
              className="kadi-button flex-1 justify-center text-xs"
            >
              <span>Manage Guests &amp; Share</span>
            </button>
            <a
              href={`/e/${event.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="kadi-button kadi-button--quiet flex-1 justify-center text-xs inline-flex items-center gap-1.5"
            >
              <span>View Live Invitation</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </Modal>

      {/* MODAL: ARCHIVE CONFIRMATION */}
      <Modal
        isOpen={isArchiveConfirmOpen}
        onClose={() => setIsArchiveConfirmOpen(false)}
        title="Archive This Invitation?"
        description="Seals this invitation from public RSVP submissions."
        maxWidth="sm"
      >
        <div className="space-y-4 py-2">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed">
            Archiving <strong>{event.title}</strong> will immediately close public RSVPs and display an archived notice to anyone visiting the link. Your guest records, headcounts, and custom stationery designs remain completely preserved in your workspace.
          </div>
          <p className="text-xs text-[#756F64]">
            You can restore this event to draft state at any time from this command center.
          </p>
          <div className="pt-3 border-t border-[rgba(39,38,32,0.1)] flex justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsArchiveConfirmOpen(false)}
            >
              Keep Active
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="!bg-[#934638] hover:!bg-[#79362a]"
              onClick={handleArchive}
            >
              Archive Event
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
