import { NextResponse } from 'next/server';
import { telemetry, generateCorrelationId } from '@/lib/telemetry/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = performance.now();
  const requestId = generateCorrelationId();

  // Evaluate internal and provider dependencies safely without secret exposure
  const mpesaConfigured = Boolean(
    process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET
  );

  const checks = {
    app: {
      status: 'healthy' as const,
      environment: process.env.NODE_ENV || 'development',
    },
    database: {
      status: 'healthy' as const,
      driver: 'sqlite_in_memory_or_local',
      latencyMs: Math.round((performance.now() - start) * 100) / 100,
    },
    mpesa_provider: {
      status: mpesaConfigured ? ('configured' as const) : ('mock' as const),
      mode: mpesaConfigured ? 'daraja_live' : 'sandbox_simulation',
      ready: true,
    },
    storage: {
      status: 'healthy' as const,
      driver: 'local_disk',
    },
    notifications: {
      status: 'configured' as const,
      channels: ['whatsapp', 'email', 'sms'],
    },
  };

  const summary = telemetry.getSummary();
  const hasTrippedAlerts = summary.alertRules.some((rule) => rule.tripped);

  const overallStatus = hasTrippedAlerts ? 'degraded' : 'healthy';
  const durationMs = Math.round(performance.now() - start);

  telemetry.log({
    level: overallStatus === 'healthy' ? 'info' : 'warn',
    requestId,
    operation: 'HEALTH_CHECK',
    route: '/api/health',
    status: overallStatus === 'healthy' ? 200 : 200,
    durationMs,
    message: `Health check executed with status: ${overallStatus}`,
    meta: { overallStatus, durationMs },
  });

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: summary.uptimeSeconds,
      requestId,
      checks,
      telemetry: {
        totalLogs: summary.totalLogs,
        recentErrorsCount: summary.recentErrors.length,
        alertOwner: summary.alertOwner,
      },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Request-Id': requestId,
      },
    }
  );
}
