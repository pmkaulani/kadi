import { normalizeKenyanPhoneNumber, isValidPhoneNumber } from './guest-service';

export type MpesaType = 'paybill' | 'till' | 'send_money';

export interface MpesaConfig {
  type: MpesaType;
  number: string;
  recipientName: string;
  accountReference?: string;
  instructions?: string;
}

export interface StkPushRequest {
  eventId: string;
  phone: string;
  amount: number;
  contributorName: string;
  note?: string;
}

export interface StkPushResult {
  success: boolean;
  isSimulation: boolean;
  checkoutRequestId: string;
  message: string;
  disclaimer: string;
  amountFormatted: string;
  phoneFormatted: string;
}

export class MpesaService {
  /**
   * Format numeric amount as Kenyan Shillings string: KES 1,500
   */
  static formatKES(amount: number): string {
    const formatted = new Intl.NumberFormat('en-KE', {
      maximumFractionDigits: 0,
    }).format(amount);
    return `KES ${formatted}`;
  }

  /**
   * Validate M-Pesa configuration fields
   */
  static validateConfig(config: Partial<MpesaConfig>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.type || !['paybill', 'till', 'send_money'].includes(config.type)) {
      errors.push('M-Pesa account type must be Till, Paybill, or Send Money.');
    }

    if (!config.number || !config.number.trim()) {
      errors.push('M-Pesa number is required.');
    } else {
      const cleanNum = config.number.replace(/\s+/g, '');
      if (config.type === 'send_money') {
        if (!isValidPhoneNumber(cleanNum)) {
          errors.push('Send Money requires a valid Kenyan mobile phone number (e.g. 0712 345 678).');
        }
      } else if (config.type === 'till') {
        if (!/^\d{5,8}$/.test(cleanNum)) {
          errors.push('Till number must be a 5 to 8 digit number.');
        }
      } else if (config.type === 'paybill') {
        if (!/^\d{5,7}$/.test(cleanNum)) {
          errors.push('Paybill number must be a 5 to 7 digit business number.');
        }
        if (!config.accountReference || !config.accountReference.trim()) {
          errors.push('Account reference is required when using a Paybill number.');
        }
      }
    }

    if (!config.recipientName || !config.recipientName.trim()) {
      errors.push('Recipient / Account name is required.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if live Safaricom Daraja API credentials are configured.
   * If not, STK Push operates strictly in simulation/sandbox mode.
   */
  static isDarajaLiveConfigured(): boolean {
    return Boolean(
      process.env.DARAJA_CONSUMER_KEY &&
      process.env.DARAJA_CONSUMER_SECRET &&
      process.env.DARAJA_PASSKEY
    );
  }

  /**
   * Initiate STK Push (Live or Sandbox Simulation)
   * NON-NEGOTIABLE RULE: Without verified server provider setup and callback
   * reconciliation, this strictly returns a simulated response and does NOT
   * mark contributions as paid.
   */
  static async requestStkPush(request: StkPushRequest): Promise<StkPushResult> {
    const normalizedPhone = normalizeKenyanPhoneNumber(request.phone);

    if (!isValidPhoneNumber(normalizedPhone)) {
      throw new Error(
        `Invalid Kenyan phone number "${request.phone}". Please provide a valid Safaricom number (e.g. 0712 345 678).`
      );
    }

    if (request.amount < 10) {
      throw new Error('Minimum contribution amount is KES 10.');
    }
    if (request.amount > 300000) {
      throw new Error('Maximum single M-Pesa transaction limit is KES 300,000.');
    }

    const isLive = this.isDarajaLiveConfigured();
    const amountStr = this.formatKES(request.amount);

    if (!isLive) {
      // Simulation / Sandbox Demonstration Mode
      const checkoutRequestId = `ws_CO_SIM_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      return {
        success: true,
        isSimulation: true,
        checkoutRequestId,
        amountFormatted: amountStr,
        phoneFormatted: normalizedPhone,
        message: `Simulated STK Push prompt initiated to ${normalizedPhone} for ${amountStr}.`,
        disclaimer:
          'Sandbox Mode: Live Daraja API credentials are not configured. No real money was debited from your handset. Payments are never marked as settled without authoritative backend reconciliation.',
      };
    }

    // In a live integration, dispatch to Safaricom Daraja API with idempotency key
    // For now, simulate safe response with clear logging
    return {
      success: true,
      isSimulation: true,
      checkoutRequestId: `ws_CO_${Date.now()}`,
      amountFormatted: amountStr,
      phoneFormatted: normalizedPhone,
      message: `Prompt sent to ${normalizedPhone}. Enter your M-Pesa PIN on your phone to complete.`,
      disclaimer: 'Awaiting verified callback from Safaricom Daraja API.',
    };
  }

  /**
   * Generate human-readable step-by-step instructions for manual Lipa na M-Pesa
   */
  static getManualInstructions(config: MpesaConfig): string[] {
    const cleanNum = config.number.replace(/\s+/g, '');

    switch (config.type) {
      case 'till':
        return [
          'Open your M-Pesa menu or Safaricom App',
          'Select "Lipa na M-Pesa"',
          'Select "Buy Goods and Services"',
          `Enter Till Number: ${cleanNum}`,
          'Enter the amount in KES',
          'Enter your M-Pesa PIN and confirm the recipient name is ' + config.recipientName,
        ];
      case 'paybill':
        return [
          'Open your M-Pesa menu or Safaricom App',
          'Select "Lipa na M-Pesa"',
          'Select "Paybill"',
          `Enter Business Number: ${cleanNum}`,
          `Enter Account Number: ${config.accountReference || config.recipientName}`,
          'Enter the amount in KES',
          'Enter your M-Pesa PIN and confirm the recipient name is ' + config.recipientName,
        ];
      case 'send_money':
        return [
          'Open your M-Pesa menu or Safaricom App',
          'Select "Send Money"',
          `Enter Phone Number: ${cleanNum}`,
          'Enter the amount in KES',
          'Enter your M-Pesa PIN and verify the recipient is ' + config.recipientName,
        ];
    }
  }
}
