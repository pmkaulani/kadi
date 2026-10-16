'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, AlertCircle, Users, Utensils, Heart, Music, ShieldCheck } from 'lucide-react';

export interface RSVPSectionProps {
  eventId: string;
  deadline?: string;
  guestToken?: string;
  defaultGuestName?: string;
  allowedPlusOnes?: number;
  previewMode?: boolean;
  customQuestions?: import('@/lib/db/types').CustomRSVPQuestion[];
}

export function RSVPSection({
  eventId,
  deadline = '1 November 2026',
  guestToken,
  defaultGuestName = '',
  allowedPlusOnes = 1,
  previewMode = false,
  customQuestions = [],
}: RSVPSectionProps) {
  const [attending, setAttending] = useState<'yes' | 'no' | 'maybe' | null>(null);
  const [fullName, setFullName] = useState(defaultGuestName);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [additionalGuestNames, setAdditionalGuestNames] = useState<string[]>([]);
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [noteToHost, setNoteToHost] = useState('');
  const [customAnswers, setCustomAnswers] = useState<Record<string, string | string[]>>({});
  const [hasConsent, setHasConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSimulatedPreview, setIsSimulatedPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const maxAllowed = 1 + allowedPlusOnes;

  // Sync additional guest name inputs when attendee count changes
  const handleAttendeeCountChange = (count: number) => {
    setAttendeeCount(count);
    const extraCount = Math.max(0, count - 1);
    setAdditionalGuestNames((prev) => {
      const next = [...prev];
      while (next.length < extraCount) {
        next.push('');
      }
      return next.slice(0, extraCount);
    });
  };

  const handleAdditionalNameChange = (index: number, name: string) => {
    setAdditionalGuestNames((prev) => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Honeypot spam trap check
    if (honeypot.trim().length > 0) {
      setErrorMessage('Spam activity detected.');
      return;
    }

    if (!attending) {
      setErrorMessage('Please indicate whether you will be joining us.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMessage('Please provide an email or phone number for confirmation.');
      return;
    }
    if (attending === 'yes' && attendeeCount > maxAllowed) {
      setErrorMessage(`Your invitation includes up to ${maxAllowed} attendees.`);
      return;
    }
    if (!hasConsent) {
      setErrorMessage('Please accept the consent checkbox to share your details with the host.');
      return;
    }

    // Custom RSVP Questions validation
    if (customQuestions && customQuestions.length > 0) {
      for (const q of customQuestions) {
        if (q.required) {
          const ans = customAnswers[q.id];
          const isEmpty =
            ans === undefined ||
            ans === null ||
            (typeof ans === 'string' && ans.trim() === '') ||
            (Array.isArray(ans) && ans.length === 0);
          if (isEmpty) {
            setErrorMessage(`Please answer required question: "${q.prompt}"`);
            return;
          }
        }
      }
    }

    // Preview mode: In-memory simulation only, never hit network API
    if (previewMode) {
      setIsSimulatedPreview(true);
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const attendeeNames =
        attending === 'yes'
          ? [fullName.trim(), ...additionalGuestNames.map((n) => n.trim()).filter(Boolean)]
          : [];

      const res = await fetch('/api/public/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          guestToken,
          status: attending,
          primaryName: fullName.trim(),
          contact: emailOrPhone.trim(),
          attendeeCount: attending === 'yes' ? attendeeCount : 0,
          attendeeNames,
          dietaryRequirements: dietaryRequirements.trim() || undefined,
          songRequest: songRequest.trim() || undefined,
          noteToHost: noteToHost.trim() || undefined,
          customAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit RSVP. Please try again.');
      }

      setIsSimulatedPreview(false);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp-section"
      aria-label="RSVP Form"
      className="w-full py-8 sm:py-12 bg-transparent border-t border-[#B99A62]/30"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--event-primary,#934638)]">
            RSVP Information
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-[var(--event-ink,#272620)] mt-1.5">
            Will you be joining us?
          </h2>
          <p className="text-xs sm:text-sm text-[#8C8375] mt-1">
            Kindly respond by <strong className="text-[var(--event-ink,#272620)]">{deadline}</strong>
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 sm:p-8 rounded-sm bg-transparent border border-[#B99A62]/35 text-center animate-in fade-in duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
            <h3 className="text-2xl font-serif font-semibold text-[#272620]">
              {attending === 'yes' ? 'Your RSVP is Confirmed!' : 'Response Recorded'}
            </h3>
            <p className="text-xs sm:text-sm text-[#756F64] mt-2">
              Thank you, <strong>{fullName}</strong>. We have recorded your attendance response as{' '}
              <strong className="capitalize">{attending === 'yes' ? `${attendeeCount} attending` : attending}</strong>.
            </p>

            {attending === 'yes' && additionalGuestNames.filter(Boolean).length > 0 && (
              <p className="text-xs text-[#756F64] mt-1">
                Named guests: {additionalGuestNames.filter(Boolean).join(', ')}
              </p>
            )}

            {isSimulatedPreview && (
              <div className="mt-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                ✨ <strong>Studio Preview Simulation:</strong> This simulated response was kept in-memory only. Your production guests will submit to the live database.
              </div>
            )}

            <p className="text-xs text-[#8C8375] mt-4">
              A confirmation has been logged. You may return to this invitation link anytime to update your response.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-6 border-[#934638] text-[#934638] hover:bg-[#FAF4EB]"
              onClick={() => setIsSubmitted(false)}
            >
              Update Response
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-transparent p-0 relative">
            {/* Hidden honeypot field */}
            <input
              type="text"
              name="company_fax"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {errorMessage && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Attendance Choice Buttons */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C8375] mb-2">
                Your Response *
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`p-3 sm:p-3.5 rounded-xl text-center border transition-all text-xs sm:text-sm flex flex-col items-center gap-1 ${
                    attending === 'yes'
                      ? 'border-[var(--event-primary,#934638)] bg-[var(--event-primary,#934638)] text-white font-semibold shadow-xs'
                      : 'border-[rgba(39,38,32,0.14)] bg-[#FAF8F5] text-[#272620] hover:bg-[#F2EFE9]'
                  }`}
                >
                  <span className="text-base sm:text-lg">✓</span>
                  <span>Joyfully Accept</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`p-3 sm:p-3.5 rounded-xl text-center border transition-all text-xs sm:text-sm flex flex-col items-center gap-1 ${
                    attending === 'no'
                      ? 'border-[#272620] bg-[#272620] text-white font-semibold shadow-xs'
                      : 'border-[rgba(39,38,32,0.14)] bg-[#FAF8F5] text-[#272620] hover:bg-[#F2EFE9]'
                  }`}
                >
                  <span className="text-base sm:text-lg">✕</span>
                  <span>Regretfully Decline</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('maybe')}
                  className={`p-3 sm:p-3.5 rounded-xl text-center border transition-all text-xs sm:text-sm flex flex-col items-center gap-1 ${
                    attending === 'maybe'
                      ? 'border-amber-600 bg-amber-600 text-white font-semibold shadow-xs'
                      : 'border-[rgba(39,38,32,0.14)] bg-[#FAF8F5] text-[#272620] hover:bg-[#F2EFE9]'
                  }`}
                >
                  <span className="text-base sm:text-lg">?</span>
                  <span>Tentative / Maybe</span>
                </button>
              </div>
            </div>

            {/* Attendee Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Guest Full Name *"
                placeholder="e.g. Dr. Peter Otieno"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="Email or WhatsApp Phone *"
                placeholder="e.g. +254 712 345 678"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            {attending === 'yes' && (
              <div className="space-y-4 pt-4 border-t border-[rgba(39,38,32,0.08)]">
                {/* Headcount selector */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#272620] flex items-center gap-2">
                      <Users className="w-4 h-4 text-[var(--event-primary,#934638)]" />
                      <span>Number of Attendees</span>
                    </label>
                    <p className="text-[11px] text-[#8C8375] mt-0.5">
                      Your invitation includes up to {maxAllowed} {maxAllowed === 1 ? 'attendee' : 'attendees'}.
                    </p>
                  </div>

                  <select
                    value={attendeeCount}
                    onChange={(e) => handleAttendeeCountChange(Number(e.target.value))}
                    className="rounded-xl border border-[rgba(39,38,32,0.2)] bg-[#FAF8F5] px-3.5 py-2 text-xs font-semibold text-[#272620] focus:outline-none focus:border-[var(--event-primary,#934638)]"
                  >
                    {Array.from({ length: maxAllowed }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Named Guests */}
                {attendeeCount > 1 && (
                  <div className="space-y-3 pt-2 pl-2 border-l-2 border-[var(--event-primary,#934638)]/30">
                    <p className="text-xs font-medium text-[#272620]">
                      Please provide the names of your accompanying guests:
                    </p>
                    {Array.from({ length: attendeeCount - 1 }).map((_, idx) => (
                      <Input
                        key={idx}
                        label={`Guest ${idx + 2} Full Name`}
                        placeholder={`e.g. Grace Otieno`}
                        value={additionalGuestNames[idx] || ''}
                        onChange={(e) => handleAdditionalNameChange(idx, e.target.value)}
                      />
                    ))}
                  </div>
                )}

                {/* Dietary Requirements */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C8375] mb-1 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[var(--event-primary,#934638)]" />
                    <span>Dietary Requirements or Allergies</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian, Halal, Nut allergy, None"
                    value={dietaryRequirements}
                    onChange={(e) => setDietaryRequirements(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(39,38,32,0.18)] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#272620] placeholder:text-[#8C8375]/60 focus:outline-none focus:border-[var(--event-primary,#934638)]"
                  />
                </div>

                {/* Song Request */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C8375] mb-1 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-[var(--event-primary,#934638)]" />
                    <span>Song Request for the Celebration</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Artist — Song Title"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(39,38,32,0.18)] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#272620] placeholder:text-[#8C8375]/60 focus:outline-none focus:border-[var(--event-primary,#934638)]"
                  />
                </div>
              </div>
            )}

            {/* Custom Host Questions */}
            {customQuestions && customQuestions.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-[rgba(39,38,32,0.08)]">
                {customQuestions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C8375] mb-1.5 flex items-center gap-1.5">
                      <span>{q.prompt}</span>
                      {q.required && <span className="text-rose-600 font-bold">*</span>}
                    </label>

                    {q.type === 'text' && (
                      <input
                        type="text"
                        placeholder="Your response..."
                        value={(customAnswers[q.id] as string) || ''}
                        onChange={(e) =>
                          setCustomAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        className="w-full rounded-xl border border-[rgba(39,38,32,0.18)] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#272620] placeholder:text-[#8C8375]/60 focus:outline-none focus:border-[var(--event-primary,#934638)]"
                      />
                    )}

                    {q.type === 'choice' && (
                      <select
                        value={(customAnswers[q.id] as string) || ''}
                        onChange={(e) =>
                          setCustomAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        className="w-full rounded-xl border border-[rgba(39,38,32,0.18)] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#272620] focus:outline-none focus:border-[var(--event-primary,#934638)]"
                      >
                        <option value="">Select an option...</option>
                        {q.options?.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {q.type === 'checkboxes' && (
                      <div className="space-y-2 pt-1">
                        {q.options?.map((opt, i) => {
                          const currentArr = (customAnswers[q.id] as string[]) || [];
                          const checked = currentArr.includes(opt);
                          return (
                            <label key={i} className="flex items-center gap-2 text-xs text-[#272620] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  const nextArr = e.target.checked
                                    ? [...currentArr, opt]
                                    : currentArr.filter((item) => item !== opt);
                                  setCustomAnswers((prev) => ({ ...prev, [q.id]: nextArr }));
                                }}
                                className="h-4 w-4 rounded border-stone-300 text-[#934638] focus:ring-[#934638]"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Note to Host */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C8375] mb-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[var(--event-primary,#934638)]" />
                <span>Message or Blessing to the Hosts</span>
              </label>
              <textarea
                rows={3}
                placeholder="Share warm wishes, advice, or a blessing..."
                value={noteToHost}
                onChange={(e) => setNoteToHost(e.target.value)}
                className="w-full rounded-xl border border-[rgba(39,38,32,0.18)] bg-white p-3 text-xs sm:text-sm text-[#272620] placeholder:text-[#8C8375]/60 focus:outline-none focus:border-[var(--event-primary,#934638)] resize-none"
              />
            </div>

            {/* Consent & Privacy Checkbox */}
            <div className="pt-2 flex items-start gap-3">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={hasConsent}
                onChange={(e) => setHasConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[rgba(39,38,32,0.3)] bg-[#FAF8F5] accent-[#934638] focus:ring-[#934638] cursor-pointer"
              />
              <label htmlFor="consent-checkbox" className="text-xs text-[#8C8375] leading-relaxed cursor-pointer select-none">
                I agree to share my attendance response and contact information with the event hosts for planning and event coordination.
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full py-3.5 text-sm font-semibold shadow-md"
              isLoading={isSubmitting}
            >
              Submit RSVP Response
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
