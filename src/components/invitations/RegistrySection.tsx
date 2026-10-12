'use client';

import React, { useState } from 'react';
import { Gift, Copy, Check, Smartphone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RegistrySectionProps {
  mpesaType?: 'paybill' | 'till' | 'send_money';
  mpesaNumber?: string;
  accountReference?: string;
  recipientName?: string;
  note?: string;
  externalRegistryUrl?: string;
}

export function RegistrySection({
  mpesaType = 'till',
  mpesaNumber = '8249102',
  accountReference = 'Kevin & Wanjiku Wedding',
  recipientName = 'Kevin Kamau',
  note = 'Your presence and prayers are the greatest gifts. For those who wish to bless the couple with a monetary gift towards our new home, details are below.',
  externalRegistryUrl,
}: RegistrySectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const typeLabels = {
    paybill: 'M-Pesa Paybill Number',
    till: 'M-Pesa Buy Goods (Till Number)',
    send_money: 'M-Pesa Phone Number',
  };

  return (
    <section className="w-full p-6 sm:p-12 bg-brand-mist border-t border-slate-200/80">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-event-rose-light text-event-rose mx-auto flex items-center justify-center mb-3">
          <Gift className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-slate bg-white px-3 py-1 rounded-full border border-slate-200">
          Gift Registry & Contributions
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal mt-3">
          Blessings & Gifts
        </h2>
        <p className="text-xs sm:text-sm text-brand-slate mt-2 max-w-md mx-auto leading-relaxed">
          {note}
        </p>

        {/* Direct Host M-Pesa Instructions Card */}
        <div className="my-6 p-6 rounded-2xl bg-white shadow-sm border border-slate-200/90 text-left">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-brand-charcoal font-sans">
              Direct M-Pesa Contribution (Kenya)
            </h3>
          </div>

          <div className="space-y-4 pt-4">
            {/* Number Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-slate block">
                  {typeLabels[mpesaType]}
                </span>
                <span className="font-mono text-base font-bold text-brand-charcoal">
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
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-slate block">
                  Account Name / Reference
                </span>
                <span className="text-xs sm:text-sm font-semibold text-brand-charcoal">
                  {recipientName} {accountReference ? `(${accountReference})` : ''}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(recipientName, 'account')}
                leftIcon={copiedField === 'account' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedField === 'account' ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-4 text-center">
            Contributions go directly to the host&apos;s verified M-Pesa line. Kadi does not hold or deduct from your gift.
          </p>
        </div>

        {externalRegistryUrl && (
          <a
            href={externalRegistryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-purple hover:underline"
          >
            <span>View Wishlist / Bridal Registry Online</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </section>
  );
}
