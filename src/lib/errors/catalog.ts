/**
 * Authoritative Global Error & State Catalogue for Kadi
 * Reference: GLOBAL_APP_STATES_AND_ERROR_CATALOG.md
 */

export type ErrorCode =
  | 'DRAFT_SAVE_FAILED'
  | 'DRAFT_SAVE_PENDING'
  | 'NETWORK_OFFLINE'
  | 'SAVE_CONFLICT'
  | 'SESSION_EXPIRED'
  | 'FORM_REQUIRED'
  | 'EMAIL_INVALID'
  | 'PHONE_INVALID'
  | 'RSVP_CLOSED'
  | 'EVENT_FULL'
  | 'INVITATION_UNAVAILABLE'
  | 'UPLOAD_TOO_LARGE'
  | 'UPLOAD_TYPE_UNSUPPORTED'
  | 'MESSAGE_SEND_FAILED'
  | 'CALENDAR_EXPORT_FAILED'
  | 'MAP_UNAVAILABLE'
  | 'RSVP_SUBMIT_FAILED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_UNKNOWN'
  | 'PERMISSION_DENIED'
  | 'RATE_LIMITED'
  | 'TEMPLATE_UNAVAILABLE'
  | 'EVENT_CANCELLED'
  | 'NO_SEARCH_RESULTS'
  | 'IMPORT_PARTIAL'
  | 'UNEXPECTED_ERROR';

export interface ErrorDefinition {
  code: ErrorCode;
  userMessage: string;
  recoveryAction: string;
  isRetryable: boolean;
  httpStatus: number;
}

export const ERROR_CATALOGUE: Record<ErrorCode, ErrorDefinition> = {
  DRAFT_SAVE_FAILED: {
    code: 'DRAFT_SAVE_FAILED',
    userMessage: "Couldn't save your changes. Your latest edits are still here. Try saving again.",
    recoveryAction: 'Retry saving changes; local draft is preserved.',
    isRetryable: true,
    httpStatus: 500,
  },
  DRAFT_SAVE_PENDING: {
    code: 'DRAFT_SAVE_PENDING',
    userMessage: 'Saving changes…',
    recoveryAction: 'Keep latest revision queued.',
    isRetryable: false,
    httpStatus: 202,
  },
  NETWORK_OFFLINE: {
    code: 'NETWORK_OFFLINE',
    userMessage: "You're offline. Your changes may not have synced yet.",
    recoveryAction: 'Queue changes locally and retry once reconnected.',
    isRetryable: true,
    httpStatus: 503,
  },
  SAVE_CONFLICT: {
    code: 'SAVE_CONFLICT',
    userMessage: 'This invitation changed in another tab or device.',
    recoveryAction: 'Offer reload or compare before overwriting.',
    isRetryable: true,
    httpStatus: 409,
  },
  SESSION_EXPIRED: {
    code: 'SESSION_EXPIRED',
    userMessage: 'Your session has expired. Sign in to continue.',
    recoveryAction: 'Preserve recoverable draft and redirect to sign-in.',
    isRetryable: false,
    httpStatus: 401,
  },
  FORM_REQUIRED: {
    code: 'FORM_REQUIRED',
    userMessage: 'This field is required.',
    recoveryAction: 'Focus associated input field on submit.',
    isRetryable: false,
    httpStatus: 400,
  },
  EMAIL_INVALID: {
    code: 'EMAIL_INVALID',
    userMessage: 'Enter a valid email address.',
    recoveryAction: 'Preserve input value and highlight field.',
    isRetryable: false,
    httpStatus: 400,
  },
  PHONE_INVALID: {
    code: 'PHONE_INVALID',
    userMessage: 'Enter a valid mobile phone number (e.g. +254 712 345 678).',
    recoveryAction: 'Preserve input value and highlight format requirements.',
    isRetryable: false,
    httpStatus: 400,
  },
  RSVP_CLOSED: {
    code: 'RSVP_CLOSED',
    userMessage: 'RSVPs are closed for this event. Contact the host if you need to make a change.',
    recoveryAction: 'Display closed status and safe host contact information.',
    isRetryable: false,
    httpStatus: 403,
  },
  EVENT_FULL: {
    code: 'EVENT_FULL',
    userMessage: 'This event is full.',
    recoveryAction: 'Show waitlist registration option if enabled by host.',
    isRetryable: false,
    httpStatus: 409,
  },
  INVITATION_UNAVAILABLE: {
    code: 'INVITATION_UNAVAILABLE',
    userMessage: "We couldn't open this invitation. Check the link or ask the host to share it again.",
    recoveryAction: 'Provide return home link without leaking token details.',
    isRetryable: false,
    httpStatus: 404,
  },
  UPLOAD_TOO_LARGE: {
    code: 'UPLOAD_TOO_LARGE',
    userMessage: 'This file is too large. Choose a smaller file and try again.',
    recoveryAction: 'Display allowed maximum file size (e.g. 5 MB).',
    isRetryable: true,
    httpStatus: 413,
  },
  UPLOAD_TYPE_UNSUPPORTED: {
    code: 'UPLOAD_TYPE_UNSUPPORTED',
    userMessage: "This file type isn't supported.",
    recoveryAction: 'List allowed formats (JPEG, PNG, WebP).',
    isRetryable: true,
    httpStatus: 415,
  },
  MESSAGE_SEND_FAILED: {
    code: 'MESSAGE_SEND_FAILED',
    userMessage: "We couldn't send this message. Your guest list is unchanged.",
    recoveryAction: 'Retry only unverified or failed recipients.',
    isRetryable: true,
    httpStatus: 502,
  },
  CALENDAR_EXPORT_FAILED: {
    code: 'CALENDAR_EXPORT_FAILED',
    userMessage: "We couldn't create the calendar file. Try again.",
    recoveryAction: 'Provide manual date, time, and venue copy options.',
    isRetryable: true,
    httpStatus: 500,
  },
  MAP_UNAVAILABLE: {
    code: 'MAP_UNAVAILABLE',
    userMessage: "We couldn't load the map. You can still use the venue address or open directions.",
    recoveryAction: 'Fallback gracefully to plain address and Google/Apple Maps links.',
    isRetryable: true,
    httpStatus: 503,
  },
  RSVP_SUBMIT_FAILED: {
    code: 'RSVP_SUBMIT_FAILED',
    userMessage: "Your response wasn't confirmed. Please try again.",
    recoveryAction: 'Idempotent retry preserving submitted guest selections.',
    isRetryable: true,
    httpStatus: 500,
  },
  PAYMENT_PENDING: {
    code: 'PAYMENT_PENDING',
    userMessage: "We're waiting for payment confirmation. Don't pay again yet.",
    recoveryAction: 'Poll reconciliation endpoint without debiting twice.',
    isRetryable: false,
    httpStatus: 202,
  },
  PAYMENT_FAILED: {
    code: 'PAYMENT_FAILED',
    userMessage: "The payment wasn't completed.",
    recoveryAction: 'Retry only after final payment provider failure is confirmed.',
    isRetryable: true,
    httpStatus: 400,
  },
  PAYMENT_UNKNOWN: {
    code: 'PAYMENT_UNKNOWN',
    userMessage: "We couldn't confirm the payment yet. Check status before trying again.",
    recoveryAction: 'Reconcile transaction status before permitting another checkout request.',
    isRetryable: false,
    httpStatus: 409,
  },
  PERMISSION_DENIED: {
    code: 'PERMISSION_DENIED',
    userMessage: "You don't have permission to make this change.",
    recoveryAction: 'Explain required role and offer contact to event owner.',
    isRetryable: false,
    httpStatus: 403,
  },
  RATE_LIMITED: {
    code: 'RATE_LIMITED',
    userMessage: 'Too many attempts. Wait a moment and try again.',
    recoveryAction: 'Pause and enforce exponential backoff before next request.',
    isRetryable: true,
    httpStatus: 429,
  },
  TEMPLATE_UNAVAILABLE: {
    code: 'TEMPLATE_UNAVAILABLE',
    userMessage: 'This design is no longer available for new invitations.',
    recoveryAction: 'Existing saved events render via fallback stationery style.',
    isRetryable: false,
    httpStatus: 410,
  },
  EVENT_CANCELLED: {
    code: 'EVENT_CANCELLED',
    userMessage: 'This event has been cancelled by the host.',
    recoveryAction: 'Display host notification and disable active RSVP actions.',
    isRetryable: false,
    httpStatus: 410,
  },
  NO_SEARCH_RESULTS: {
    code: 'NO_SEARCH_RESULTS',
    userMessage: 'No templates match these filters.',
    recoveryAction: 'Clear active filter pills or explore related occasions.',
    isRetryable: false,
    httpStatus: 200,
  },
  IMPORT_PARTIAL: {
    code: 'IMPORT_PARTIAL',
    userMessage: 'Some guests were imported. Review the rows that need attention.',
    recoveryAction: 'Render row-by-row error list without sending auto-invitations.',
    isRetryable: true,
    httpStatus: 207,
  },
  UNEXPECTED_ERROR: {
    code: 'UNEXPECTED_ERROR',
    userMessage: 'An unexpected issue occurred. Your progress has been preserved.',
    recoveryAction: 'Reload the section or retry action.',
    isRetryable: true,
    httpStatus: 500,
  },
};

/**
 * Maps raw backend, network, or exception errors into sanitized, humane user-facing definitions.
 * STRICT SECURITY INVARIANT:
 * Never exposes SQL errors, database schemas, internal file paths, API secrets, or PII.
 */
export function mapSafeError(err: unknown): ErrorDefinition {
  if (!err) {
    return ERROR_CATALOGUE.UNEXPECTED_ERROR;
  }

  // Already a known catalogue error
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const candidate = (err as any).code as ErrorCode;
    if (ERROR_CATALOGUE[candidate]) {
      return ERROR_CATALOGUE[candidate];
    }
  }

  const rawMessage = err instanceof Error ? err.message : String(err);
  const lower = rawMessage.toLowerCase();

  // Pattern matches for safe categorization
  if (lower.includes('offline') || lower.includes('network') || lower.includes('failed to fetch')) {
    return ERROR_CATALOGUE.NETWORK_OFFLINE;
  }
  if (lower.includes('expired') && (lower.includes('session') || lower.includes('token') || lower.includes('auth'))) {
    return ERROR_CATALOGUE.SESSION_EXPIRED;
  }
  if (lower.includes('permission') || lower.includes('forbidden') || lower.includes('unauthorized') || lower.includes('role')) {
    return ERROR_CATALOGUE.PERMISSION_DENIED;
  }
  if (lower.includes('conflict') || lower.includes('revision') || lower.includes('stale')) {
    return ERROR_CATALOGUE.SAVE_CONFLICT;
  }
  if (lower.includes('deadline') || lower.includes('rsvp closed') || lower.includes('submissions are currently closed')) {
    return ERROR_CATALOGUE.RSVP_CLOSED;
  }
  if (lower.includes('capacity') || lower.includes('full')) {
    return ERROR_CATALOGUE.EVENT_FULL;
  }
  if (lower.includes('rate limit') || lower.includes('too many')) {
    return ERROR_CATALOGUE.RATE_LIMITED;
  }
  if (lower.includes('email') && lower.includes('invalid')) {
    return ERROR_CATALOGUE.EMAIL_INVALID;
  }
  if (lower.includes('phone') && (lower.includes('invalid') || lower.includes('kenyan'))) {
    return ERROR_CATALOGUE.PHONE_INVALID;
  }
  if (lower.includes('required') || lower.includes('missing')) {
    return ERROR_CATALOGUE.FORM_REQUIRED;
  }
  if (lower.includes('save') || lower.includes('persistence')) {
    return ERROR_CATALOGUE.DRAFT_SAVE_FAILED;
  }
  if (lower.includes('not found') || lower.includes('unavailable')) {
    return ERROR_CATALOGUE.INVITATION_UNAVAILABLE;
  }

  // Fallback sanitized error
  return ERROR_CATALOGUE.UNEXPECTED_ERROR;
}

/**
 * Editor / Autosave State Lifecycle Machine
 */
export type SaveStatus =
  | 'idle'
  | 'unsaved'
  | 'saving'
  | 'saved'
  | 'error'
  | 'conflict'
  | 'offline';

export interface SaveStateMachineState {
  status: SaveStatus;
  lastSavedRevision: number;
  currentRevision: number;
  lastSavedAt?: string;
  errorMessage?: string;
}

export class SaveStateMachine {
  private state: SaveStateMachineState;

  constructor(initialRevision = 1) {
    this.state = {
      status: 'idle',
      lastSavedRevision: initialRevision,
      currentRevision: initialRevision,
      lastSavedAt: new Date().toISOString(),
    };
  }

  getState(): SaveStateMachineState {
    return { ...this.state };
  }

  /**
   * User made an edit in memory. Advances local revision counter.
   */
  registerEdit(): SaveStateMachineState {
    this.state.currentRevision += 1;
    this.state.status = 'unsaved';
    this.state.errorMessage = undefined;
    return this.getState();
  }

  /**
   * Autosave dispatch initiated for a specific revision.
   */
  startSaving(revision: number): SaveStateMachineState {
    // Only transition to saving if offline is not active
    if (this.state.status === 'offline') {
      return this.getState();
    }
    this.state.status = 'saving';
    return this.getState();
  }

  /**
   * Server confirmed receipt of a specific revision.
   * MONOTONIC INVARIANT:
   * Only transitions to 'saved' if the accepted revision matches the current active revision.
   * If a newer edit happened while saving was in flight, status remains 'unsaved'.
   */
  saveSucceeded(revision: number): SaveStateMachineState {
    if (revision > this.state.lastSavedRevision) {
      this.state.lastSavedRevision = revision;
      this.state.lastSavedAt = new Date().toISOString();
    }

    if (this.state.currentRevision === revision) {
      this.state.status = 'saved';
      this.state.errorMessage = undefined;
    } else {
      // Newer edits are pending
      this.state.status = 'unsaved';
    }

    return this.getState();
  }

  saveFailed(error: string): SaveStateMachineState {
    this.state.status = 'error';
    this.state.errorMessage = error;
    return this.getState();
  }

  saveConflict(): SaveStateMachineState {
    this.state.status = 'conflict';
    this.state.errorMessage = ERROR_CATALOGUE.SAVE_CONFLICT.userMessage;
    return this.getState();
  }

  goOffline(): SaveStateMachineState {
    this.state.status = 'offline';
    this.state.errorMessage = ERROR_CATALOGUE.NETWORK_OFFLINE.userMessage;
    return this.getState();
  }

  reconnect(): SaveStateMachineState {
    if (this.state.currentRevision > this.state.lastSavedRevision) {
      this.state.status = 'unsaved';
    } else {
      this.state.status = 'saved';
    }
    this.state.errorMessage = undefined;
    return this.getState();
  }
}

/**
 * Payment Reconciliation State Lifecycle Machine
 * Reference: ready -> requesting -> awaiting_confirmation -> succeeded | failed | cancelled | unknown
 */
export type PaymentStatus =
  | 'ready'
  | 'requesting'
  | 'awaiting_confirmation'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'unknown';

export interface PaymentState {
  status: PaymentStatus;
  checkoutRequestId?: string;
  amount?: number;
  phone?: string;
  errorMessage?: string;
  updatedAt: string;
}

export class PaymentStateMachine {
  private state: PaymentState;

  constructor() {
    this.state = {
      status: 'ready',
      updatedAt: new Date().toISOString(),
    };
  }

  getState(): PaymentState {
    return { ...this.state };
  }

  requestPayment(params: { amount: number; phone: string }): PaymentState {
    if (this.state.status === 'awaiting_confirmation' || this.state.status === 'requesting') {
      throw new Error("We're waiting for payment confirmation. Don't pay again yet.");
    }
    if (this.state.status === 'unknown') {
      throw new Error("We couldn't confirm the payment yet. Check status before trying again.");
    }

    this.state = {
      status: 'requesting',
      amount: params.amount,
      phone: params.phone,
      updatedAt: new Date().toISOString(),
    };
    return this.getState();
  }

  dispatchAwaiting(checkoutRequestId: string): PaymentState {
    this.state = {
      ...this.state,
      status: 'awaiting_confirmation',
      checkoutRequestId,
      updatedAt: new Date().toISOString(),
    };
    return this.getState();
  }

  markSucceeded(): PaymentState {
    this.state = {
      ...this.state,
      status: 'succeeded',
      errorMessage: undefined,
      updatedAt: new Date().toISOString(),
    };
    return this.getState();
  }

  markFailed(message = ERROR_CATALOGUE.PAYMENT_FAILED.userMessage): PaymentState {
    this.state = {
      ...this.state,
      status: 'failed',
      errorMessage: message,
      updatedAt: new Date().toISOString(),
    };
    return this.getState();
  }

  markCancelled(): PaymentState {
    this.state = {
      ...this.state,
      status: 'cancelled',
      errorMessage: 'Payment cancelled by user.',
      updatedAt: new Date().toISOString(),
    };
    return this.getState();
  }

  markUnknown(message = ERROR_CATALOGUE.PAYMENT_UNKNOWN.userMessage): PaymentState {
    this.state = {
      ...this.state,
      status: 'unknown',
      errorMessage: message,
      updatedAt: new Date().toISOString(),
    };
    return this.getState();
  }

  reset(): PaymentState {
    this.state = {
      status: 'ready',
      updatedAt: new Date().toISOString(),
    };
    return this.getState();
  }
}
