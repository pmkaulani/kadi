'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, AlertCircle, Users, Utensils, Heart } from 'lucide-react';

interface RSVPSectionProps {
  eventId: string;
  deadline?: string;
  guestToken?: string;
  defaultGuestName?: string;
  allowedPlusOnes?: number;
}

export function RSVPSection({
  eventId,
  deadline = '1 November 2026',
  guestToken,
  defaultGuestName = '',
  allowedPlusOnes = 1,
}: RSVPSectionProps) {
  const [attending, setAttending] = useState<'yes' | 'no' | 'maybe' | null>(null);
  const [fullName, setFullName] = useState(defaultGuestName);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [noteToHost, setNoteToHost] = useState('');

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const maxAllowed = 1 + allowedPlusOnes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!attending) {
      setErrorMessage('Please select whether you will attend.');
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

    setIsSubmitting(true);

    try {
      // Post to authoritative API endpoint
      const res = await fetch('/api/public/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          guestToken,
          status: attending,
          primaryName: fullName,
          contact: emailOrPhone,
          attendeeCount: attending === 'yes' ? attendeeCount : 0,
          dietaryRequirements,
          songRequest,
          noteToHost,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit RSVP. Please try again.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp-section" className="w-full p-6 sm:p-12 bg-white border-t border-slate-100">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-purple bg-brand-purple-light px-3 py-1 rounded-full">
            RSVP Information
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal mt-3">
            Will you be joining us?
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate mt-1">
            Kindly respond by <strong className="text-brand-charcoal">{deadline}</strong>
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-emerald-900">
              Thank You! Your RSVP is Confirmed
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 mt-2">
              We have recorded your response for{' '}
              <strong>{fullName}</strong> ({attending === 'yes' ? `${attendeeCount} attending` : 'Declined'}).
            </p>
            <p className="text-xs text-emerald-700/80 mt-1">
              A confirmation has been logged with the hosts. You may return to this link anytime to update your response.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 border-emerald-600 text-emerald-800 hover:bg-emerald-100"
              onClick={() => setIsSubmitted(false)}
            >
              Edit Response
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Attendance Choice Buttons */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-2">
                Your Response *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`p-3 sm:p-4 rounded-xl text-center border-2 transition-all font-semibold text-xs sm:text-sm flex flex-col items-center gap-1.5 ${
                    attending === 'yes'
                      ? 'border-brand-purple bg-brand-purple text-white shadow-md'
                      : 'border-slate-200 bg-slate-50 text-brand-charcoal hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base sm:text-lg">✓</span>
                  <span>Joyfully Accept</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`p-3 sm:p-4 rounded-xl text-center border-2 transition-all font-semibold text-xs sm:text-sm flex flex-col items-center gap-1.5 ${
                    attending === 'no'
                      ? 'border-brand-slate bg-brand-slate text-white shadow-md'
                      : 'border-slate-200 bg-slate-50 text-brand-charcoal hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base sm:text-lg">✕</span>
                  <span>Regretfully Decline</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('maybe')}
                  className={`p-3 sm:p-4 rounded-xl text-center border-2 transition-all font-semibold text-xs sm:text-sm flex flex-col items-center gap-1.5 ${
                    attending === 'maybe'
                      ? 'border-brand-gold bg-brand-gold text-brand-charcoal shadow-md'
                      : 'border-slate-200 bg-slate-50 text-brand-charcoal hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base sm:text-lg">?</span>
                  <span>Tentative / Maybe</span>
                </button>
              </div>
            </div>

            {/* Attendee Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="e.g. Dr. Peter Otieno"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="Email or Mobile Phone *"
                placeholder="e.g. +254 712 345 678"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            {attending === 'yes' && (
              <div className="space-y-4 p-5 rounded-2xl bg-brand-mist border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-purple" />
                      <span>Number of Guests Attending</span>
                    </label>
                    <p className="text-[11px] text-brand-slate mt-0.5">
                      Your invitation includes up to {maxAllowed} {maxAllowed === 1 ? 'person' : 'attendees'}.
                    </p>
                  </div>

                  <select
                    value={attendeeCount}
                    onChange={(e) => setAttendeeCount(Number(e.target.value))}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  >
                    {Array.from({ length: maxAllowed }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dietary Requirements */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Dietary Needs or Allergies</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian, Halal, Nut allergy, None"
                    value={dietaryRequirements}
                    onChange={(e) => setDietaryRequirements(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-brand-charcoal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                {/* Song Request */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1">
                    Song Request for the Dancefloor
                  </label>
                  <input
                    type="text"
                    placeholder="Artist — Song Title"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-brand-charcoal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
              </div>
            )}

            {/* Note to Host */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-event-rose" />
                <span>Message or Blessing to the Hosts</span>
              </label>
              <textarea
                rows={3}
                placeholder="Write a warm note to the hosts..."
                value={noteToHost}
                onChange={(e) => setNoteToHost(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm text-brand-charcoal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full text-base py-3.5 shadow-lg"
              isLoading={isSubmitting}
            >
              Submit My RSVP Response
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
