'use client';

import React, { useState } from 'react';
import { LifeBuoy, Check, Copy, AlertCircle, Send } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface SupportInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'issue' | 'abuse' | 'payment' | 'invite_failure';
  safeEventId?: string;
  userEmail?: string;
}

export function SupportInquiryModal({
  isOpen,
  onClose,
  defaultCategory = 'issue',
  safeEventId,
  userEmail = '',
}: SupportInquiryModalProps) {
  const [category, setCategory] = useState<'issue' | 'abuse' | 'payment' | 'invite_failure'>(
    defaultCategory
  );
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(userEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setErrorMsg('Please provide a subject and a description of your inquiry.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          subject,
          description,
          safeEventId,
          contactEmail: email || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedTicketId(data.ticket.id);
      } else {
        setErrorMsg(data.message || 'Unable to submit your support inquiry.');
      }
    } catch {
      setErrorMsg('Network error submitting inquiry. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicketId = () => {
    if (!submittedTicketId) return;
    navigator.clipboard.writeText(submittedTicketId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleReset = () => {
    setSubmittedTicketId(null);
    setSubject('');
    setDescription('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={submittedTicketId ? 'Inquiry Logged' : 'Kadi Operations & Host Support'}
      description={
        submittedTicketId
          ? 'Your safe reference code has been generated.'
          : 'Reach our platform desk for questions, technical help, or content reports.'
      }
      maxWidth="md"
    >
      {submittedTicketId ? (
        <div className="space-y-5 py-3 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <Check className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#272620]">
              Inquiry Registered Successfully
            </h3>
            <p className="text-xs text-[#756F64] mt-1 max-w-sm mx-auto">
              Our operations desk has received your report. Please quote this non-sensitive reference code in any correspondence:
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 inline-flex items-center gap-3">
            <span className="font-mono text-base font-bold text-[#934638] tracking-wider select-all">
              {submittedTicketId}
            </span>
            <button
              type="button"
              onClick={handleCopyTicketId}
              className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
              title="Copy Reference Code"
              aria-label="Copy Reference Code"
            >
              {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
          </div>

          <p className="text-[11px] text-[#756F64]">
            Never share passwords, verification SMS codes, or payment PINs with anyone.
          </p>

          <div className="pt-2">
            <Button type="button" variant="primary" size="sm" onClick={handleReset} className="w-full sm:w-auto">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#272620] mb-1">Inquiry Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full text-xs rounded-xl border border-stone-300 p-2.5 text-[#272620] bg-white focus:outline-none focus:border-[#934638]"
            >
              <option value="issue">Technical Issue / Bug</option>
              <option value="payment">M-Pesa or Contribution Question</option>
              <option value="invite_failure">Invitation Link or Guest RSVP Issue</option>
              <option value="abuse">Report Policy Violation / Inappropriate Content</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#272620] mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your inquiry..."
              className="w-full text-xs rounded-xl border border-stone-300 p-2.5 text-[#272620] bg-white focus:outline-none focus:border-[#934638]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#272620] mb-1">Description &amp; Details</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, any error messages seen, or details for the operations team..."
              className="w-full text-xs rounded-xl border border-stone-300 p-2.5 text-[#272620] bg-white focus:outline-none focus:border-[#934638]"
              required
            />
          </div>

          {!userEmail && (
            <div>
              <label className="block text-xs font-semibold text-[#272620] mb-1">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full text-xs rounded-xl border border-stone-300 p-2.5 text-[#272620] bg-white focus:outline-none focus:border-[#934638]"
                required
              />
            </div>
          )}

          <div className="pt-3 border-t border-[rgba(39,38,32,0.1)] flex justify-end gap-2.5">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || !subject.trim() || !description.trim()}
              className="!bg-[#934638] inline-flex items-center gap-1.5"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send size={13} />
                  <span>Submit Inquiry</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
