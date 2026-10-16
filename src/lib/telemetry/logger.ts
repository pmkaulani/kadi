import crypto from 'crypto';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  requestId?: string;
  correlationId?: string;
  route?: string;
  operation: string;
  status?: number | string;
  durationMs?: number;
  message: string;
  meta?: Record<string, any>;
  error?: {
    code?: string;
    message: string;
  };
}

export type FailureCategory =
  | 'api_failures'
  | 'save_failures'
  | 'rsvp_failures'
  | 'upload_failures'
  | 'provider_timeouts';

export interface TelemetrySummary {
  uptimeSeconds: number;
  totalLogs: number;
  errorCount: number;
  counters: Record<FailureCategory, number>;
  recentErrors: Array<{
    timestamp: string;
    category: FailureCategory;
    operation: string;
    message: string;
    requestId?: string;
  }>;
  alertOwner: string;
  alertRules: Array<{
    name: string;
    threshold: number;
    windowSeconds: number;
    tripped: boolean;
  }>;
}

const REDACT_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /auth/i,
  /cookie/i,
  /passkey/i,
  /apikey/i,
  /api_key/i,
  /sql/i,
  /credit/i,
  /card/i,
  /hash/i,
];

const REDACT_VALUE_PATTERNS = [
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, // JWT / Bearer
  /tok_[a-zA-Z0-9_-]+/g, // Private tokens
  /(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})/g, // Credit cards
  /\b(?:select|insert|update|delete|drop|union)\b\s+.*\b(?:from|into|where|table)\b/i, // Raw SQL
];

/**
 * Recursively redacts sensitive credentials, tokens, PII, and SQL from objects.
 */
export function sanitizeLogData(data: any): any {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    let sanitized = data;
    for (const pattern of REDACT_VALUE_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[REDACTED_SECRET]');
    }
    return sanitized;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item));
  }

  if (typeof data === 'object') {
    const copy: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const isSensitiveKey = REDACT_KEY_PATTERNS.some((pat) => pat.test(key));
      if (isSensitiveKey) {
        copy[key] = '[REDACTED]';
      } else {
        copy[key] = sanitizeLogData(value);
      }
    }
    return copy;
  }

  return data;
}

class TelemetryRegistry {
  private startTime = Date.now();
  private totalLogs = 0;
  private errorCount = 0;
  private counters: Record<FailureCategory, number> = {
    api_failures: 0,
    save_failures: 0,
    rsvp_failures: 0,
    upload_failures: 0,
    provider_timeouts: 0,
  };
  private recentErrors: Array<{
    timestamp: string;
    category: FailureCategory;
    operation: string;
    message: string;
    requestId?: string;
  }> = [];

  public log(entry: Omit<LogEntry, 'timestamp'>): LogEntry {
    this.totalLogs++;
    const fullEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      ...entry,
      meta: entry.meta ? sanitizeLogData(entry.meta) : undefined,
      message: sanitizeLogData(entry.message),
    };

    if (entry.level === 'error') {
      this.errorCount++;
    }

    // Format structured JSON output for standard server stream
    const output = JSON.stringify(fullEntry);
    if (entry.level === 'error') {
      console.error(output);
    } else if (entry.level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }

    return fullEntry;
  }

  public recordFailure(
    category: FailureCategory,
    operation: string,
    error: any,
    requestId?: string
  ): void {
    this.counters[category] = (this.counters[category] || 0) + 1;
    const safeMsg = sanitizeLogData(
      error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown failure'
    );

    this.recentErrors.unshift({
      timestamp: new Date().toISOString(),
      category,
      operation,
      message: safeMsg,
      requestId,
    });

    if (this.recentErrors.length > 50) {
      this.recentErrors.pop();
    }

    this.log({
      level: 'error',
      operation,
      requestId,
      message: `[${category.toUpperCase()}] ${safeMsg}`,
      error: {
        message: safeMsg,
        code: error?.code,
      },
    });
  }

  public getSummary(): TelemetrySummary {
    const errorRate = this.errorCount;
    return {
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      totalLogs: this.totalLogs,
      errorCount: this.errorCount,
      counters: { ...this.counters },
      recentErrors: [...this.recentErrors],
      alertOwner: 'ops@kadi.africa',
      alertRules: [
        {
          name: 'High API Failure Rate',
          threshold: 25,
          windowSeconds: 60,
          tripped: this.counters.api_failures > 25,
        },
        {
          name: 'Provider Timeout Spike',
          threshold: 10,
          windowSeconds: 120,
          tripped: this.counters.provider_timeouts > 10,
        },
        {
          name: 'RSVP Submission Failure Spike',
          threshold: 15,
          windowSeconds: 60,
          tripped: this.counters.rsvp_failures > 15,
        },
      ],
    };
  }

  public resetMetrics(): void {
    this.totalLogs = 0;
    this.errorCount = 0;
    this.counters = {
      api_failures: 0,
      save_failures: 0,
      rsvp_failures: 0,
      upload_failures: 0,
      provider_timeouts: 0,
    };
    this.recentErrors = [];
  }
}

// Global Singleton
const globalForTelemetry = globalThis as unknown as { __kadi_telemetry?: TelemetryRegistry };
export const telemetry = globalForTelemetry.__kadi_telemetry || new TelemetryRegistry();
if (process.env.NODE_ENV !== 'production') {
  globalForTelemetry.__kadi_telemetry = telemetry;
}

export function generateCorrelationId(): string {
  return `req_${crypto.randomBytes(8).toString('hex')}`;
}
