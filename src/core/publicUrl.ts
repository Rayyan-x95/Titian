const DEFAULT_PUBLIC_URL = 'https://rayyan-x95.github.io/titan';

function normalizeBaseUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_PUBLIC_URL;
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

export function getPublicUrlBase(): string {
  const envValue = (import.meta as unknown as { env?: Record<string, unknown> }).env?.VITE_PUBLIC_URL;
  return normalizeBaseUrl(typeof envValue === 'string' ? envValue : DEFAULT_PUBLIC_URL);
}

