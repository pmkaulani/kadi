export interface WhatsAppShareConfig {
  phoneNumberId?: string;
  accessToken?: string;
  automatedEnabled: boolean;
}

export class WhatsAppAdapter {
  private config: WhatsAppShareConfig;

  constructor() {
    this.config = {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
      automatedEnabled: process.env.WHATSAPP_AUTOMATED_ENABLED === 'true',
    };
  }

  /**
   * Generates a native WhatsApp deep-link that opens the host's own device WhatsApp.
   * Free, instant, zero credentials required, 100% compliant with KDPA.
   */
  generateNativeShareLink(eventTitle: string, invitationUrl: string, customNote?: string): string {
    const baseText = customNote
      ? `${customNote}\n\n${invitationUrl}`
      : `You're warmly invited to ${eventTitle}! Please tap the link to open your 3D digital invitation and RSVP:\n${invitationUrl}`;

    return `https://wa.me/?text=${encodeURIComponent(baseText)}`;
  }

  /**
   * Automated Cloud API dispatch gate check.
   * NON-NEGOTIABLE RULE: Meta WhatsApp Cloud API is a later release gate.
   * Do not infer consent from an uploaded phone number.
   */
  canSendAutomatedMessage(consentLogged: boolean): { allowed: boolean; reason: string } {
    if (!this.config.automatedEnabled) {
      return {
        allowed: false,
        reason:
          'Automated Meta WhatsApp Cloud API dispatch is disabled in platform configuration. Use native WhatsApp sharing.',
      };
    }

    if (!consentLogged) {
      return {
        allowed: false,
        reason:
          'Explicit affirmative consent record is absent. Under KDPA 2019 and Meta policy, automated messages require pre-logged consent.',
      };
    }

    return { allowed: true, reason: 'Ready for queue dispatch.' };
  }
}
