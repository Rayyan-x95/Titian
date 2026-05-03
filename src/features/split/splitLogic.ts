import type { SharedExpense, GroupBalance } from '@/core/store/types';

export function calculateGroupBalances(
  groupId: string,
  sharedExpenses: SharedExpense[],
  members: string[],
): GroupBalance[] {
  const groupExpenses = sharedExpenses.filter((e) => e.groupId === groupId);
  const balances: Record<string, number> = {};
  members.forEach((id) => {
    balances[id] = 0;
  });
  groupExpenses.forEach((expense) => {
    if (balances[expense.paidBy] !== undefined) balances[expense.paidBy] += expense.totalAmount;
    expense.participants.forEach((p) => {
      if (balances[p.id] !== undefined) balances[p.id] -= p.amount;
    });
  });
  return Object.entries(balances).map(([friendId, amount]) => ({ friendId, amount }));
}
