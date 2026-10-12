import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { ShieldCheck, Heart } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="w-full bg-brand-charcoal text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" className="text-white" />
            <p className="text-xs text-brand-slate leading-relaxed">
              Invitations that feel like an occasion. Animated 3D envelopes, live event details, and effortless RSVP management in one shareable link.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>KDPA 2019 Compliant</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/templates" className="hover:text-white transition-colors">
                  Wedding Invitations
                </Link>
              </li>
              <li>
                <Link href="/templates?category=birthday" className="hover:text-white transition-colors">
                  Milestone Birthdays
                </Link>
              </li>
              <li>
                <Link href="/templates?category=memorial" className="hover:text-white transition-colors">
                  Dignified Memorials
                </Link>
              </li>
              <li>
                <Link href="/templates?category=baby-shower" className="hover:text-white transition-colors">
                  Baby Showers & Welcomes
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  Animated Envelope Opening
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Kadi
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing & Entitlements
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Privacy & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/data-protection" className="hover:text-white transition-colors">
                  Kenya Data Protection Act
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Practices
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Kadi. All rights reserved. Made for Kenya and beyond.</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Crafted with reverence & care</span>
            <Heart className="w-3.5 h-3.5 text-event-rose fill-event-rose" />
          </div>
        </div>
      </div>
    </footer>
  );
}
