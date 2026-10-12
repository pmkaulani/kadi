'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="purple" size="sm">
            Here to Help
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-charcoal mt-3">
            Contact Kadi Support
          </h1>
          <p className="text-sm text-brand-slate mt-3 leading-relaxed">
            Have questions about your event suite, custom template requests, or RSVP troubleshooting? Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-brand-charcoal">
              Get in Touch
            </h2>
            <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
              We provide rapid assistance for upcoming weddings, memorial coordinators, and corporate summit organizers.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-mist border border-slate-200/80">
                <Mail className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-brand-charcoal block">Email Inquiries</span>
                  <span className="text-xs text-brand-slate">support@kadi.co.ke</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-mist border border-slate-200/80">
                <MessageCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-brand-charcoal block">WhatsApp Concierge</span>
                  <span className="text-xs text-brand-slate">+254 700 000 000 (Mon–Sat 8am–7pm EAT)</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-mist border border-slate-200/80">
                <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-brand-charcoal block">Location</span>
                  <span className="text-xs text-brand-slate">Westlands, Nairobi, Kenya</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 rounded-3xl bg-brand-mist border border-slate-200/80">
            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-brand-charcoal">
                  Message Received
                </h3>
                <p className="text-xs text-brand-slate">
                  Thank you for reaching out. A representative will respond to your inquiry within 4 business hours.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name *"
                  placeholder="e.g. Grace Njoki"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="e.g. grace@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-1">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your event date, template questions, or assistance needed..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
                  />
                </div>
                <Button type="submit" variant="primary" size="md" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
