export interface MpesaConfig {
  environment: 'sandbox' | 'production';
  consumerKey?: string;
  consumerSecret?: string;
  passkey?: string;
  shortcode?: string;
  directCollectionEnabled: boolean;
}

export interface MpesaSTKPushRequest {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export interface MpesaSTKPushResponse {
  status: 'sandbox_simulated' | 'disabled_pending_compliance' | 'submitted' | 'failed';
  message: string;
  checkoutRequestId?: string;
  merchantRequestId?: string;
}

export class MpesaAdapter {
  private config: MpesaConfig;
  private processedCallbacks = new Set<string>();

  constructor(config?: Partial<MpesaConfig>) {
    this.config = {
      environment: (process.env.MPESA_ENVIRONMENT as any) || 'sandbox',
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET,
      passkey: process.env.MPESA_PASSKEY,
      shortcode: process.env.MPESA_SHORTCODE || '174379',
      directCollectionEnabled: process.env.MPESA_DIRECT_COLLECTION_ENABLED === 'true',
      ...config,
    };
  }

  /**
   * Evaluates STK Push readiness under decision gates.
   * NON-NEGOTIABLE RULE: When credentials or account approval are missing,
   * build an adapter with honest disabled states. Never label simulated data as live.
   */
  async initiateSTKPush(request: MpesaSTKPushRequest): Promise<MpesaSTKPushResponse> {
    if (!this.config.directCollectionEnabled) {
      return {
        status: 'disabled_pending_compliance',
        message:
          'Direct M-Pesa collection is currently disabled pending Safaricom merchant account approval and legal compliance review. Hosts must use direct payment instructions (Paybill/Till).',
      };
    }

    if (!this.config.consumerKey || !this.config.consumerSecret) {
      return {
        status: 'disabled_pending_compliance',
        message: 'Daraja API credentials are not configured.',
      };
    }

    // In sandbox test mode
    return {
      status: 'sandbox_simulated',
      message: 'STK push simulated in Daraja Sandbox environment (TEST ONLY).',
      checkoutRequestId: `ws_CO_${Date.now()}_sandbox`,
      merchantRequestId: `req_${Date.now()}`,
    };
  }

  /**
   * Idempotent webhook callback handler with duplicate detection.
   */
  handleCallback(callbackPayload: {
    checkoutRequestId: string;
    resultCode: number;
    resultDesc: string;
    amount?: number;
    mpesaReceiptNumber?: string;
  }) {
    if (this.processedCallbacks.has(callbackPayload.checkoutRequestId)) {
      return { status: 'duplicate_ignored', checkoutRequestId: callbackPayload.checkoutRequestId };
    }

    this.processedCallbacks.add(callbackPayload.checkoutRequestId);

    const isSuccess = callbackPayload.resultCode === 0;

    return {
      status: isSuccess ? 'succeeded' : 'failed',
      checkoutRequestId: callbackPayload.checkoutRequestId,
      receiptNumber: callbackPayload.mpesaReceiptNumber,
      amount: callbackPayload.amount,
      description: callbackPayload.resultDesc,
    };
  }
}
