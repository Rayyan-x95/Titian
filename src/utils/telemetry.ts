export function trackEvent(name: string, props: Record<string, unknown> = {}) {
  // Lightweight telemetry shim. Replace with your provider (Amplitude, GA, Sentry) later.
  if (typeof window === 'undefined') return;
  try {
    // Use navigator.sendBeacon when available for reliability
    const payload = { name, props, ts: new Date().toISOString() };
    if (navigator && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/_telemetry', blob);
    } else {
      // Fallback to async fetch (no await)
      fetch('/_telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // swallow errors — telemetry must not break app
  }
}

export function initTelemetry(enable = false) {
  // Placeholder init
  if (!enable) return;
  trackEvent('telemetry_initialized', { enabled: true });
}
