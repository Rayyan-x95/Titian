import { describe, expect, it } from 'vitest';
import { parseQuickCapture } from '@/lib/core/parserEngine';

describe('parserEngine edge cases', () => {
  it('parses amounts with commas and different currency symbols', () => {
    const a = parseQuickCapture('Paid ₹1,234.56 for groceries today');
    expect(a.amount).toBe(123456);

    const b = parseQuickCapture('Received $2,000.00 salary');
    expect(b.amount).toBe(200000);
  });

  it('parses relative dates like today and tomorrow', () => {
    const today = parseQuickCapture('Lunch $5 today');
    expect(today.dueDate).toBeDefined();
    const tomorrow = parseQuickCapture('Coffee $3 tomorrow');
    expect(tomorrow.dueDate).toBeDefined();
  });

  it('does not throw on malformed input', () => {
    const r = parseQuickCapture('just some random text without numbers');
    expect(r.title).toBeDefined();
  });
});
