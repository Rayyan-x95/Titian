/**
 * Sanitizer utility for Titan
 * Ensures data integrity and prevents XSS/Injection
 */

const MAX_STRING_LENGTH = 5000;
const MAX_TITLE_LENGTH = 200;

/**
 * Trims and truncates strings
 */
export function sanitizeString(value: unknown, maxLength = MAX_STRING_LENGTH): string {
  if (typeof value !== 'string') return '';
  return value.trim().substring(0, maxLength);
}

/**
 * Strips HTML tags safely using the browser's DOM parser
 */
export function stripHtml(value: string): string {
  if (!value) return '';
  try {
    const doc = new Parser().parseFromString(value, 'text/html');
    return doc.body.textContent || '';
  } catch {
    // Fallback for environments where DOMParser is not available (e.g., SSR or tests)
    return value.replace(/<[^>]*>?/gm, '');
  }
}

// Internal helper to avoid creating a new parser every time
class Parser {
  private parser: DOMParser | null = null;
  parseFromString(string: string, type: DOMParserSupportedType): Document {
    if (!this.parser && typeof DOMParser !== 'undefined') {
      this.parser = new DOMParser();
    }
    if (this.parser) return this.parser.parseFromString(string, type);
    // Return a mock document-like object if no parser
    return { body: { textContent: string } } as Document;
  }
}

/**
 * Sanitizes a title (single line, limited length)
 */
export function sanitizeTitle(value: unknown): string {
  const sanitized = sanitizeString(value, MAX_TITLE_LENGTH);
  return sanitized.replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Sanitizes tags (lowercase, alphanumeric, limited length)
 */
export function sanitizeTag(value: unknown): string {
  const sanitized = sanitizeString(value, 30);
  return sanitized.toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

/**
 * Sanitizes an array of tags
 */
export function sanitizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return Array.from(new Set(tags.map(sanitizeTag).filter(Boolean)));
}

/**
 * Validates and sanitizes a date string
 */
export function sanitizeDateString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : undefined;
}
