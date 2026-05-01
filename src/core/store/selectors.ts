import { useMemo } from 'react';
import { useStore } from './useStore';
import { buildTimelineItems } from '@/lib/core/timelineEngine';
import { getTodayTasks } from '@/lib/core/taskEngine';
import { filterExpensesByRange, calculateCategoryTotals, calculateTotalBalance, calculateTotalSpent, calculateTotalIncome, safeAddCents, calculateMonthlyExpense, getTopCategories, getWeeklyTrend } from '@/lib/core/financeEngine';
import { calculateTotalOwed } from '@/lib/core/splitEngine';
import type { TimelineItem } from './types';

export function useTimelineItems(): TimelineItem[] {
  const tasks = useStore(state => state.tasks);
  const notes = useStore(state => state.notes);
  const expenses = useStore(state => state.expenses);
  const sharedExpenses = useStore(state => state.sharedExpenses);

  return useMemo(() => {
    return buildTimelineItems(tasks, notes, expenses, sharedExpenses);
  }, [tasks, notes, expenses, sharedExpenses]);
}

export function useTodayTasks() {
  const tasks = useStore(state => state.tasks);
  return useMemo(() => getTodayTasks(tasks), [tasks]);
}

export function useWeeklyExpenses() {
  const expenses = useStore(state => state.expenses);
  return useMemo(() => filterExpensesByRange(expenses, 'week'), [expenses]);
}

export function useMonthlySpend() {
  const expenses = useStore(state => state.expenses);
  return useMemo(() => calculateMonthlyExpense(expenses), [expenses]);
}

export function useLastMonthSpend() {
  const expenses = useStore(state => state.expenses);
  return useMemo(() => {
    const now = new Date();
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return calculateMonthlyExpense(expenses, lastMonthDate);
  }, [expenses]);
}

export function useCategoryTotals() {
  const expenses = useStore(state => state.expenses);
  return useMemo(() => calculateCategoryTotals(expenses), [expenses]);
}

export function usePersonalExpenses() {
  const expenses = useStore(state => state.expenses);
  const shared = useStore(state => state.sharedExpenses);
  const sharedLinkedIds = useMemo(() => new Set(shared.map((s) => s.linkedExpenseId).filter(Boolean)), [shared]);
  return useMemo(() => expenses.filter((e) => !sharedLinkedIds.has(e.id)), [expenses, sharedLinkedIds]);
}

export function useSharedExpenseItems() {
  const shared = useStore(state => state.sharedExpenses);
  return useMemo(() => shared, [shared]);
}

export function useTopCategories(limit = 3) {
  const expenses = useStore(state => state.expenses);
  return useMemo(() => getTopCategories(expenses, limit), [expenses, limit]);
}

export function useWeeklyTrend() {
  const expenses = useStore(state => state.expenses);
  return useMemo(() => getWeeklyTrend(expenses), [expenses]);
}

export function usePinnedNotes() {
  const notes = useStore(state => state.notes);
  return useMemo(() => notes.filter(n => n.pinned), [notes]);
}

export function useTotalOwed() {
  const sharedExpenses = useStore(state => state.sharedExpenses);
  return useMemo(() => calculateTotalOwed(sharedExpenses), [sharedExpenses]);
}

export function useTotalBalance() {
  const accounts = useStore(state => state.accounts);
  return useMemo(() => calculateTotalBalance(accounts), [accounts]);
}

export function useTotalSpent() {
  const expenses = useStore(state => state.expenses);
  return useMemo(() => calculateTotalSpent(expenses), [expenses]);
}

export function useTotalIncome() {
  const expenses = useStore(state => state.expenses);
  return useMemo(() => calculateTotalIncome(expenses), [expenses]);
}

export function useSpentToday() {
  const expenses = useStore(state => state.expenses);
  return useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return expenses
      .filter(e => e.type === 'expense' && e.createdAt.startsWith(today))
      .reduce((sum, e) => safeAddCents(sum, e.amount), 0);
  }, [expenses]);
}

export function useBudgetSummary() {
  const budgets = useStore(state => state.budgets);
  const expenses = useStore(state => state.expenses);
  return useMemo(() => {
    const totalLimit = budgets.reduce((sum, b) => safeAddCents(sum, b.limit), 0);
    const totalSpent = calculateTotalSpent(expenses); // Simplified for overall limit
    const percent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    return { limit: totalLimit, spent: totalSpent, percent };
  }, [budgets, expenses]);
}
