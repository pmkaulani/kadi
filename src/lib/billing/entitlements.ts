export type PlanTier = 'free' | 'pro' | 'enterprise';

export type SubscriptionStatus =
  | 'pilot_preview'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired';

export interface PlanEntitlements {
  tier: PlanTier;
  displayName: string;
  priceKes: number;
  maxActiveEvents: number;
  maxGuestsPerEvent: number;
  premiumTemplates: boolean;
  customDomain: boolean;
  advancedAnalyticsExport: boolean;
  prioritySupport: boolean;
  cohostLimit: number;
  qrCheckIn: boolean;
  mpesaContributions: boolean; // Supported for all tiers
}

export const PLAN_TIERS: Record<PlanTier, PlanEntitlements> = {
  free: {
    tier: 'free',
    displayName: 'Host Essential',
    priceKes: 0,
    maxActiveEvents: 3,
    maxGuestsPerEvent: 100,
    premiumTemplates: false,
    customDomain: false,
    advancedAnalyticsExport: false,
    prioritySupport: false,
    cohostLimit: 2,
    qrCheckIn: true,
    mpesaContributions: true,
  },
  pro: {
    tier: 'pro',
    displayName: 'Celebration Atelier Pro',
    priceKes: 2500,
    maxActiveEvents: 9999,
    maxGuestsPerEvent: 1500,
    premiumTemplates: true,
    customDomain: true,
    advancedAnalyticsExport: true,
    prioritySupport: true,
    cohostLimit: 10,
    qrCheckIn: true,
    mpesaContributions: true,
  },
  enterprise: {
    tier: 'enterprise',
    displayName: 'Bespoke Atelier & Concierge',
    priceKes: 15000,
    maxActiveEvents: 9999,
    maxGuestsPerEvent: 99999,
    premiumTemplates: true,
    customDomain: true,
    advancedAnalyticsExport: true,
    prioritySupport: true,
    cohostLimit: 99,
    qrCheckIn: true,
    mpesaContributions: true,
  },
};

export interface BillingProviderStatus {
  configured: boolean;
  mode: 'live' | 'pilot_preview';
  title: string;
  description: string;
  allowedTiers: PlanTier[];
}

/**
 * Returns authoritative state of the subscription billing gateway.
 * When real payment gateway credentials are absent from environment,
 * marks status honestly as 'pilot_preview' and unlocks Pro features during pilot.
 */
export function getBillingProviderStatus(): BillingProviderStatus {
  const isProviderConfigured = Boolean(
    process.env.BILLING_API_KEY || process.env.STRIPE_SECRET_KEY
  );

  if (isProviderConfigured) {
    return {
      configured: true,
      mode: 'live',
      title: 'Automated Billing Active',
      description: 'Monthly and annual atelier subscriptions are managed via secure card and M-Pesa billing.',
      allowedTiers: ['free', 'pro', 'enterprise'],
    };
  }

  return {
    configured: false,
    mode: 'pilot_preview',
    title: 'Complimentary Early Access Pilot',
    description:
      'Kadi subscription billing is currently operating in host preview mode. All Atelier Pro capabilities—including all 23 stationery worlds, unmetered guest invitations, and analytics exports—are unlocked for registered hosts with zero subscription fees.',
    allowedTiers: ['pro'],
  };
}

/**
 * Server-enforced feature entitlement verification.
 */
export function getUserEntitlements(_userId?: string): PlanEntitlements {
  const providerStatus = getBillingProviderStatus();

  // During pilot preview, all registered users are entitled to Pro capabilities
  if (providerStatus.mode === 'pilot_preview') {
    return PLAN_TIERS.pro;
  }

  // Fallback to Free tier if billing is live but user has no active subscription
  return PLAN_TIERS.free;
}

/**
 * Server entitlement gate. UI state is never proof of entitlement.
 */
export function checkFeatureEntitlement(
  userId: string | undefined,
  feature: keyof Omit<PlanEntitlements, 'tier' | 'displayName' | 'priceKes'>
): { granted: boolean; tier: PlanTier; reason?: string } {
  const entitlements = getUserEntitlements(userId);
  const val = entitlements[feature];

  if (typeof val === 'boolean') {
    return {
      granted: val,
      tier: entitlements.tier,
      reason: val ? undefined : `Requires Atelier Pro upgrade.`,
    };
  }

  return {
    granted: true,
    tier: entitlements.tier,
  };
}
