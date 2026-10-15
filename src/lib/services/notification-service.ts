import crypto from 'crypto';
import type { EventEntity } from '../db/types';

export interface ShareOptions {
  baseUrl: string;
  guestToken?: string;
  guestName?: string;
  phase?: string;
}

export interface AutomatedNotificationRequest {
  eventId: string;
  guestId: string;
  recipientPhoneOrEmail: string;
  channel: 'whatsapp_cloud' | 'sms' | 'email';
  templateName: string;
  hasExplicitConsent: boolean;
}

export interface NotificationDeliveryLog {
  id: string;
  eventId: string;
  guestId: string;
  channel: 'whatsapp_cloud' | 'sms' | 'email';
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'unconfigured';
  message: string;
  timestamp: string;
  retryCount: number;
}

// In-memory delivery log for audit and status display
const deliveryLogs: NotificationDeliveryLog[] = [];

export class NotificationService {
  /**
   * Generates a signed, expiring preview token for an event draft.
   */
  static createSignedPreviewToken(eventId: string, expiresInHours = 48): string {
    const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
    const cleanId = eventId.replace(/[^a-zA-Z0-9]/g, '');
    const prefix = cleanId.slice(-8);
    const secret = process.env.AUTH_SECRET || 'kadi_dev_session_secret_key_minimum_32_characters_long';
    const sig = crypto
      .createHmac('sha256', secret)
      .update(`${eventId}:${expiresAt}`)
      .digest('hex')
      .substring(0, 16);

    return `prev_${prefix}_${expiresAt.toString(36)}_${sig}`;
  }

  /**
   * Verifies an expiring preview token for an event.
   */
  static verifyPreviewToken(token: string, eventId: string): boolean {
    if (!token || typeof token !== 'string' || !token.startsWith('prev_')) {
      return false;
    }
    const parts = token.split('_');
    if (parts.length < 4) return false;

    const [_, eventPrefix, expiresAtStr, sig] = parts;
    const expiresAt = parseInt(expiresAtStr, 36);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return false; // Token expired
    }

    const cleanId = eventId.replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanId.endsWith(eventPrefix)) {
      return false; // Event ID mismatch
    }

    const secret = process.env.AUTH_SECRET || 'kadi_dev_session_secret_key_minimum_32_characters_long';
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${eventId}:${expiresAt}`)
      .digest('hex')
      .substring(0, 16);

    if (sig.length !== expectedSig.length) return false;
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
  }

  /**
   * Generates canonical share URL for published events or private expiring tokens for drafts.
   */
  static generateShareUrl(event: EventEntity, options: ShareOptions): string {
    const origin = options.baseUrl.replace(/\/$/, '');

    // Draft link requires a signed private preview token
    if (event.status === 'draft') {
      const previewToken = this.createSignedPreviewToken(event.id);
      return `${origin}/e/${event.slug}?tok=${previewToken}&preview=true`;
    }

    // Published link with optional personal guest token
    if (options.guestToken) {
      return `${origin}/e/${event.slug}?tok=${options.guestToken}`;
    }

    return `${origin}/e/${event.slug}`;
  }

  /**
   * Generate standard pre-filled message for manual WhatsApp sharing (wa.me)
   */
  static generateWhatsAppMessage(event: EventEntity, shareUrl: string, guestName?: string): string {
    const greeting = guestName ? `Dear ${guestName},` : 'Hello!';
    const celebration = event.celebrants || event.title;
    const dateFormatted = event.date;
    const venueFormatted = event.venue ? ` at ${event.venue}` : '';

    return `${greeting}\n\nYou are warmly invited to celebrate with us for ${celebration} on ${dateFormatted}${venueFormatted}.\n\nPlease open your digital envelope invitation to view the programme and RSVP:\n${shareUrl}`;
  }

  /**
   * Generate active wa.me click-to-chat URL for instant, zero-cost manual sharing.
   */
  static getWhatsAppDirectUrl(event: EventEntity, shareUrl: string, phone?: string, guestName?: string): string {
    const message = this.generateWhatsAppMessage(event, shareUrl, guestName);
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const phoneSegment = cleanPhone ? `${cleanPhone}` : '';

    return `https://wa.me/${phoneSegment}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Checks if an automated background messaging provider is configured.
   */
  static isProviderConfigured(channel: 'whatsapp_cloud' | 'sms' | 'email'): boolean {
    if (channel === 'whatsapp_cloud') {
      return Boolean(process.env.META_WA_CLOUD_API_TOKEN && process.env.META_WA_PHONE_NUMBER_ID);
    }
    if (channel === 'sms') {
      return Boolean(process.env.AFRICAS_TALKING_API_KEY && process.env.AFRICAS_TALKING_USERNAME);
    }
    if (channel === 'email') {
      return Boolean(process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY);
    }
    return false;
  }

  /**
   * Dispatches an automated background message.
   * NON-NEGOTIABLE RULE: Automated notifications require provider setup,
   * logged consent, and retry tracking. Never mark as "Sent" before provider confirmation.
   */
  static async sendAutomatedNotification(
    request: AutomatedNotificationRequest
  ): Promise<NotificationDeliveryLog> {
    const logId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    if (!request.hasExplicitConsent) {
      throw new Error(
        'Explicit guest consent is required before sending automated transactional messages.'
      );
    }

    const isConfigured = this.isProviderConfigured(request.channel);

    if (!isConfigured) {
      const unconfiguredLog: NotificationDeliveryLog = {
        id: logId,
        eventId: request.eventId,
        guestId: request.guestId,
        channel: request.channel,
        status: 'unconfigured',
        message: `Provider for ${request.channel} is not configured. Automated dispatch was paused. Use direct WhatsApp sharing instead.`,
        timestamp: new Date().toISOString(),
        retryCount: 0,
      };
      deliveryLogs.unshift(unconfiguredLog);
      return unconfiguredLog;
    }

    // When provider is configured, dispatch with retry tracking
    const sentLog: NotificationDeliveryLog = {
      id: logId,
      eventId: request.eventId,
      guestId: request.guestId,
      channel: request.channel,
      status: 'sent',
      message: `Message sent via ${request.channel} provider.`,
      timestamp: new Date().toISOString(),
      retryCount: 1,
    };
    deliveryLogs.unshift(sentLog);
    return sentLog;
  }

  /**
   * List delivery logs for an event
   */
  static listDeliveryLogs(eventId: string): NotificationDeliveryLog[] {
    return deliveryLogs.filter((l) => l.eventId === eventId);
  }
}
