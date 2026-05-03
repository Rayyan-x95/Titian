export function runtimeHealth() {
  return {
    now: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'node',
    memory:
      typeof performance !== 'undefined' && 'memory' in performance
        ? (performance as unknown as { memory: unknown }).memory
        : undefined,
  };
}
