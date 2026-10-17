'use client';

import React, { useState } from 'react';
import { Gift, Copy, Check, Smartphone, ExternalLink, HelpCircle, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MpesaService, type MpesaType } from '@/lib/services/mpesa-service';

export interface RegistrySectionProps {
  mpesaType?: 'paybill' | 'till' | 'send_money';
  mpesaNumber?: string;
  accountReference?: string;
  recipientName?: string;
  note?: string;
  externalRegistryUrl?: string;
  previewMode?: boolean;
}

export function RegistrySection({
  mpesaType = 'till',
  mpesaNumber = '8249102',
  accountReference = 'Kevin & Wanjiku Wedding',
  recipientName = 'Kevin Kamau',
  note = 'Your presence and prayers are the greatest gifts. For those who wish to bless the celebrants with a monetary contribution towards their new chapter, details are below.',
  externalRegistryUrl,
  previewMode = false,
}: RegistrySectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [isStkModalOpen, setIsStkModalOpen] = useState(false);

  // STK Simulation form state
  const [stkPhone, setStkPhone] = useState('');
  const [stkAmount, setStkAmount] = useState('1000');
  const [stkContributorName, setStkContributorName] = useState('');
  const [stkStep, setStkStep] = useState<'idle' | 'initiating' | 'sent' | 'completed'>('idle');
  const [stkResult, setStkResult] = useState<any>(null);
  const [stkError, setStkError] = useState<string | null>(null);

  // If no details configured at all, do not render
  if (!mpesaNumber && !recipientName && !externalRegistryUrl) {
    return null;
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const typeLabels: Record<MpesaType, string> = {
    paybill: 'M-Pesa Paybill Number',
    till: 'M-Pesa Buy Goods (Till Number)',
    send_money: 'M-Pesa Phone Number',
  };

  const manualInstructions = MpesaService.getManualInstructions({
    type: mpesaType,
    number: mpesaNumber,
    recipientName: recipientName || 'Host',
    accountReference,
  });

  const handleStkSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setStkError(null);

    const amountNum = Number(stkAmount);
    if (isNaN(amountNum) || amountNum < 10) {
      setStkError('Please enter a valid amount of at least KES 10.');
      return;
    }
    if (!stkPhone.trim()) {
      setStkError('Please enter your Safaricom mobile phone number.');
      return;
    }

    setStkStep('initiating');

    // Simulate network delay / STK prompt initiation
    await new Promise((r) => setTimeout(r, 800));
    setStkStep('sent');

    await new Promise((r) => setTimeout(r, 1200));

    try {
      const result = await MpesaService.requestStkPush({
        eventId: 'simulated-event',
        phone: stkPhone,
        amount: amountNum,
        contributorName: stkContributorName || 'Guest Contributor',
      });
      setStkResult(result);
      setStkStep('completed');
    } catch (err: any) {
      setStkError(err.message || 'Simulation error.');
      setStkStep('idle');
    }
  };

  const resetStkModal = () => {
    setIsStkModalOpen(false);
    setStkStep('idle');
    setStkResult(null);
    setStkError(null);
  };

  return (
    <section
      aria-label="Gift Registry and Contributions"
      className="w-full py-8 sm:py-12 bg-transparent border-t border-[#B99A62]/30"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-10 h-10 rounded-full bg-[var(--event-primary,#934638)]/10 text-[var(--event-primary,#934638)] flex items-center justify-center mx-auto mb-2.5">
          <Gift className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--event-primary,#934638)]">
          Gift Registry & Harambee
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-[var(--event-ink,#272620)] mt-1.5">
          Blessings & Contributions
        </h2>
        <p className="text-xs sm:text-sm text-[#8C8375] mt-1.5 max-w-lg mx-auto leading-relaxed">
          {note}
        </p>

        {/* Direct M-Pesa Instructions */}
        <div className="mt-6 p-4 sm:p-6 rounded-sm bg-transparent border-t border-b border-[#B99A62]/30 text-left relative">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(39,38,32,0.08)]">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-semibold text-[#272620]">
                Direct M-Pesa (Kenya)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Host Details
            </span>
          </div>

          <div className="divide-y divide-[rgba(39,38,32,0.06)]">
            {/* Number Row */}
            <div className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8375] block">
                  {typeLabels[mpesaType]}
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#272620]">
                  {mpesaNumber}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(mpesaNumber, 'number')}
                leftIcon={copiedField === 'number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedField === 'number' ? 'Copied' : 'Copy'}
              </Button>
            </div>

            {/* Account / Recipient Row */}
            <div className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8375] block">
                  Account Name / Reference
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#272620]">
                  {recipientName} {accountReference ? `(${accountReference})` : ''}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(recipientName || '', 'account')}
                leftIcon={copiedField === 'account' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedField === 'account' ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Action CTAs: STK Simulation & Manual Steps */}
          <div className="pt-4 border-t border-[rgba(39,38,32,0.08)] flex flex-col sm:flex-row items-center gap-3">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsStkModalOpen(true)}
              className="w-full sm:w-auto shadow-xs bg-[var(--event-primary,#934638)] text-white hover:bg-[#7b3226]"
              leftIcon={<Smartphone className="w-3.5 h-3.5 text-white" />}
            >
              Test M-Pesa Prompt (STK Push)
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowManualGuide((prev) => !prev)}
              className="w-full sm:w-auto text-[#8C8375] hover:text-[#272620]"
              leftIcon={<HelpCircle className="w-3.5 h-3.5" />}
            >
              {showManualGuide ? 'Hide Step-by-Step Guide' : 'How to Pay via Sim Toolkit'}
            </Button>
          </div>

          {/* Expandable Manual Instructions */}
          {showManualGuide && (
            <div className="mt-4 p-4 rounded-xl bg-[#FAF8F5] border border-[rgba(39,38,32,0.08)] text-xs text-[#272620] space-y-2 animate-in fade-in duration-150">
              <span className="font-bold block text-[11px] uppercase tracking-wider text-[#8C8375]">
                Manual M-Pesa Step-by-Step:
              </span>
              <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-[#272620]/90">
                {manualInstructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <p className="text-[10px] text-[#8C8375] mt-4 text-center">
            Contributions go directly to the host&apos;s verified M-Pesa account. Kadi does not hold or deduct from gifts.
          </p>
        </div>

        {/* External Wishlist / Registry Link */}
        {externalRegistryUrl && (
          <div className="mt-5">
            <a
              href={externalRegistryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--event-primary,#934638)] hover:underline"
            >
              <span>View Online Wishlist / Bridal Registry</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* STK Push Sandbox / Simulation Modal */}
      <Modal
        isOpen={isStkModalOpen}
        onClose={resetStkModal}
        title="M-Pesa STK Push Demonstration"
        description="Experience the mobile contribution flow. Without live Daraja credentials, this runs strictly in sandbox demonstration mode."
      >
        <div className="space-y-4 pt-2">
          {/* Simulation Notice Banner */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Sandbox Demonstration Mode</span>
              <span className="text-[11px] text-amber-800 leading-relaxed block mt-0.5">
                No real money will be debited from your handset. In production, payments require verified server provider setup and automated callback reconciliation.
              </span>
            </div>
          </div>

          {stkError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {stkError}
            </div>
          )}

          {stkStep === 'idle' && (
            <form onSubmit={handleStkSimulation} className="space-y-3.5">
              <Input
                label="Your Name (Optional)"
                placeholder="e.g. Amani Kamau"
                value={stkContributorName}
                onChange={(e) => setStkContributorName(e.target.value)}
              />

              <Input
                label="Safaricom Mobile Phone *"
                placeholder="e.g. 0712 345 678"
                value={stkPhone}
                onChange={(e) => setStkPhone(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-medium text-[#272620] mb-1">
                  Amount in Kenyan Shillings (KES) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#8C8375]">
                    KES
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="300000"
                    step="100"
                    value={stkAmount}
                    onChange={(e) => setStkAmount(e.target.value)}
                    className="w-full pl-12 pr-3 py-2 rounded-xl border border-[rgba(39,38,32,0.2)] bg-white text-xs font-semibold text-[#272620]"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={resetStkModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Simulated STK Push
                </Button>
              </div>
            </form>
          )}

          {stkStep === 'initiating' && (
            <div className="py-8 text-center space-y-3 animate-in fade-in">
              <div className="w-8 h-8 border-2 border-[var(--event-primary,#934638)] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-[#272620]">
                Contacting Safaricom Daraja Gateway simulation...
              </p>
            </div>
          )}

          {stkStep === 'sent' && (
            <div className="py-8 text-center space-y-3 animate-in fade-in">
              <Smartphone className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-sm font-semibold text-[#272620]">
                Simulated USSD Prompt Sent to Handset!
              </h4>
              <p className="text-xs text-[#8C8375] max-w-xs mx-auto">
                &ldquo;Do you want to pay {MpesaService.formatKES(Number(stkAmount))} to {recipientName}? Enter PIN:&rdquo;
              </p>
            </div>
          )}

          {stkStep === 'completed' && stkResult && (
            <div className="py-4 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-bold text-emerald-950">
                Simulation Complete!
              </h4>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                {stkResult.message}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-[11px] font-mono text-slate-700 space-y-1">
                <div><strong>Checkout ID:</strong> {stkResult.checkoutRequestId}</div>
                <div><strong>Recipient:</strong> {recipientName} ({mpesaNumber})</div>
                <div><strong>Notice:</strong> {stkResult.disclaimer}</div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={resetStkModal} className="mt-2">
                Done
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </section>
  );
}
