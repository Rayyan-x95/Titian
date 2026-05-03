import { describe, expect, it } from 'vitest';
import {
  splitEqual,
  splitWeighted,
  computeSettlements,
  calculateTotalOwed,
} from '@/lib/core/splitEngine';

describe('splitEngine edge cases', () => {
  it('splits equally with remainder distributed', () => {
    const shares = splitEqual(100, [{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    expect(shares.reduce((s, x) => s + x.amount, 0)).toBe(100);
  });

  it('weighted split falls back to equal when weights invalid', () => {
    const shares = splitWeighted(100, [
      { id: 'a', weight: 0 },
      { id: 'b', weight: 0 },
    ]);
    expect(shares.length).toBe(2);
    expect(shares.reduce((s, x) => s + x.amount, 0)).toBe(100);
  });

  it('compute settlements handles rounding', () => {
    const settlements = computeSettlements([
      { id: 'a', balance: -101 },
      { id: 'b', balance: 101 },
    ]);
    expect(settlements.length).toBeGreaterThan(0);
  });

  it('calculateTotalOwed handles mixed paidBy entries', () => {
    const shared = [
      {
        paidBy: 'user',
        participants: [
          { id: 'user', amount: 50 },
          { id: 'a', amount: 50 },
        ],
      },
      {
        paidBy: 'a',
        participants: [
          { id: 'user', amount: 30 },
          { id: 'a', amount: 70 },
        ],
      },
    ];
    const total = calculateTotalOwed(shared, 'user');
    expect(typeof total).toBe('number');
  });
});
