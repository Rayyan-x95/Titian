import type { FinancialGoal, OnboardingProfile } from './types';
import { sanitizeString, sanitizeDateString } from '@/utils/sanitizer';
import { normalizePositiveCents } from '@/lib/core/financeEngine';

export function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createTimestamp(value?: string) {
  return value ?? new Date().toISOString();
}

export function upsertItem<T extends { id: string }>(items: T[], item: T): T[] {
  const index = items.findIndex((i) => i.id === item.id);
  if (index === -1) return [...items, item];
  // Use .map to avoid mutation and be more functional
  return items.map((i) => i.id === item.id ? item : i);
}

export function createDefaultOnboardingProfile(timestamp = new Date().toISOString()): OnboardingProfile {
  return {
    id: 'primary',
    name: '',
    income: 0,
    avgExpense: 0,
    goals: [],
    preferences: {
      notifications: true,
      darkMode: true,
    },
    currentStep: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readArray(payload: Record<string, unknown>, key: string): unknown[] {
  const value = payload[key];
  return Array.isArray(value) ? (value as unknown[]) : [];
}

export function normalizeImportedOnboarding(value: unknown, fallback: OnboardingProfile): OnboardingProfile {
  if (!isRecord(value)) return fallback;

  const base = createDefaultOnboardingProfile();
  const preferences = isRecord(value.preferences) ? value.preferences : {};
  const goals = Array.isArray(value.goals)
    ? (value.goals as unknown[]).filter((goal): goal is FinancialGoal =>
        typeof goal === 'string' &&
        [
          'save-money',
          'track-spending',
          'improve-productivity',
          'reduce-expenses',
        ].includes(goal as FinancialGoal),
      )
    : [];

  return {
    ...base,
    id: 'primary',
    name: sanitizeString(value.name, 100) || base.name,
    phoneNumber: sanitizeString(value.phoneNumber, 20),
    dob: sanitizeDateString(value.dob),
    income: typeof value.income === 'number' ? normalizePositiveCents(value.income) : base.income,
    avgExpense: typeof value.avgExpense === 'number' ? normalizePositiveCents(value.avgExpense) : base.avgExpense,
    goals,
    preferences: {
      notifications: typeof preferences.notifications === 'boolean' ? preferences.notifications : base.preferences.notifications,
      darkMode: typeof preferences.darkMode === 'boolean' ? preferences.darkMode : base.preferences.darkMode,
    },
    currentStep: typeof value.currentStep === 'number' ? value.currentStep : base.currentStep,
    completedAt: sanitizeDateString(value.completedAt),
    skippedAt: sanitizeDateString(value.skippedAt),
    createdAt: sanitizeDateString(value.createdAt) || base.createdAt,
    updatedAt: sanitizeDateString(value.updatedAt) || new Date().toISOString(),
  };
}
