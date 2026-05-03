/**
 * Formats a Date or ISO string into a local YYYY-MM-DD string.
 */
export function toLocalDateString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!Number.isFinite(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if an ISO string or Date corresponds to today in local time.
 */
export function isToday(date: Date | string): boolean {
  const localDate = toLocalDateString(date);
  const today = toLocalDateString(new Date());
  return localDate === today && localDate !== '';
}
