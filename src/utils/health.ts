export function runtimeHealth() {
  return {
    now: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'node',
    memory: typeof performance !== 'undefined' && (performance as any).memory ? (performance as any).memory : undefined,
  };
}
