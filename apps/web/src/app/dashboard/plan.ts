'use client';

export type Plan = 'starter' | 'pro' | 'enterprise';

export interface PlanLimits {
  users: number | 'unlimited';
  ledgerPerMonth: number | 'unlimited';
  aiPerDay: number | 'unlimited';
  customRoles: boolean;
  sso: boolean;
  signedExport: boolean;
  prioritySupport: boolean;
  dedicatedSuccess: boolean;
  supportHours: string;
}

export const PLANS: Record<Plan, PlanLimits & { label: string; color: string }> = {
  starter: {
    label: 'Starter',
    color: '#888890',
    users: 5,
    ledgerPerMonth: 1000,
    aiPerDay: 10,
    customRoles: false,
    sso: false,
    signedExport: false,
    prioritySupport: false,
    dedicatedSuccess: false,
    supportHours: 'E-mail • binnen 24u op werkdagen',
  },
  pro: {
    label: 'Pro',
    color: '#5e6ad2',
    users: 25,
    ledgerPerMonth: 50000,
    aiPerDay: 'unlimited',
    customRoles: true,
    sso: true,
    signedExport: true,
    prioritySupport: true,
    dedicatedSuccess: false,
    supportHours: 'Chat + e-mail • binnen 4u op werkdagen',
  },
  enterprise: {
    label: 'Enterprise',
    color: '#facc15',
    users: 'unlimited',
    ledgerPerMonth: 'unlimited',
    aiPerDay: 'unlimited',
    customRoles: true,
    sso: true,
    signedExport: true,
    prioritySupport: true,
    dedicatedSuccess: true,
    supportHours: '24/7 priority • dedicated success manager',
  },
};

export function getCurrentPlan(): Plan {
  if (typeof window === 'undefined') return 'pro';
  const stored = localStorage.getItem('demo_account');
  if (stored) {
    try {
      const account = JSON.parse(stored);
      if (account.plan && (account.plan === 'starter' || account.plan === 'pro' || account.plan === 'enterprise')) {
        return account.plan;
      }
    } catch {
      // fall through
    }
  }
  return 'pro'; // demo default
}

export function formatLimit(value: number | 'unlimited'): string {
  if (value === 'unlimited') return 'onbeperkt';
  return value.toLocaleString('nl-NL');
}

export function usagePercent(used: number, limit: number | 'unlimited'): number {
  if (limit === 'unlimited') return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}
