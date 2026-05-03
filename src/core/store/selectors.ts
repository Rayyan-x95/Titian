import { useMemo } from 'react';
import { useStore } from './useStore';
import { toLocalDateString, isToday } from '@/utils/date';
import { buildTimelineItems } from '@/lib/core/timelineEngine';
import {
  filterExpensesByRange,
  calculateCategoryTotals,
  calculateTotalBalance,
  calculateTotalSpent,
  calculateTotalIncome,
  safeAddCents,
  calculateMonthlyExpense,
  getTopCategories,
  getWeeklyTrend,
} from '@/lib/core/financeEngine';
import { calculateTotalOwed } from '@/lib/core/splitEngine';
import type { TimelineItem } from './types';

// toLocalDateString moved to @/utils/date

export function useTimelineItems(): TimelineItem[] {
  const tasks = useStore((state) => state.tasks);
  const notes = useStore((state) => state.notes);
  const expenses = useStore((state) => state.expenses);
  const sharedExpenses = useStore((state) => state.sharedExpenses);

  return useMemo(() => {
    return buildTimelineItems(tasks, notes, expenses, sharedExpenses);
  }, [tasks, notes, expenses, sharedExpenses]);
}

export function useTodayTasks() {
  const tasks = useStore((state) => state.tasks);
  return useMemo(() => {
    const today = toLocalDateString(new Date());
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      if (Number.isNaN(d.getTime())) return false;
      return toLocalDateString(d) === today;
    });
  }, [tasks]);
}

export function useActiveTasks() {
  const tasks = useStore((state) => state.tasks);
  return useMemo(() => tasks.filter((t) => t.status === 'todo' || t.status === 'doing'), [tasks]);
}

export function useCompletedTodayTasks() {
  const tasks = useStore((state) => state.tasks);
  return useMemo(() => {
    const today = toLocalDateString(new Date());
    return tasks.filter((task) => {
      if (task.status !== 'done') return false;
      if (task.dueDate && toLocalDateString(new Date(task.dueDate)) === today) return true;
      return toLocalDateString(new Date(task.createdAt)) === today;
    });
  }, [tasks]);
}

export function usePriorityTasks(limit = 3) {
  const tasks = useStore((state) => state.tasks);
  return useMemo(() => {
    return [...tasks]
      .filter((t) => t.status !== 'done')
      .sort((a, b) => {
        const pMap = { high: 0, medium: 1, low: 2 };
        if (pMap[a.priority] !== pMap[b.priority]) return pMap[a.priority] - pMap[b.priority];
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      })
      .slice(0, limit);
  }, [tasks, limit]);
}

export function useRecentNotes(limit = 3) {
  const notes = useStore((state) => state.notes);
  return useMemo(() => {
    return [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
  }, [notes, limit]);
}

export function useWeeklyExpenses() {
  const expenses = useStore((state) => state.expenses);
  return useMemo(() => filterExpensesByRange(expenses, 'week'), [expenses]);
}

export function useMonthlySpend() {
  const expenses = useStore((state) => state.expenses);
  return useMemo(() => calculateMonthlyExpense(expenses), [expenses]);
}

export function useLastMonthSpend() {
  const expenses = useStore((state) => state.expenses);
  return useMemo(() => {
    const now = new Date();
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return calculateMonthlyExpense(expenses, lastMonthDate);
  }, [expenses]);
}

export function useCategoryTotals() {
  const expenses = useStore((state) => state.expenses);
  return useMemo(() => calculateCategoryTotals(expenses, new Date()), [expenses]);
}

export function usePersonalExpenses() {
  const expenses = useStore((state) => state.expenses);
  const shared = useStore((state) => state.sharedExpenses);
  const sharedLinkedIds = useMemo(
    () => new Set(shared.map((s) => s.linkedExpenseId).filter(Boolean)),
    [shared],
  );
  return useMemo(
    () => expenses.filter((e) => !sharedLinkedIds.has(e.id)),
    [expenses, sharedLinkedIds],
  );
}

export function useSharedExpenseItems() {
  const shared = useStore((state) => state.sharedExpenses);
  return useMemo(() => shared, [shared]);
}

export function useTopCategories(limit = 3) {
  const expenses = useStore((state) => state.expenses);
  return useMemo(() => getTopCategories(expenses, limit, new Date()), [expenses, limit]);
}

export function useWeeklyTrend() {
  const expenses = useStore((state) => state.expenses);
  return useMemo(() => getWeeklyTrend(expenses), [expenses]);
}

export function usePinnedNotes() {
  const notes = useStore((state) => state.notes);
  return useMemo(() => notes.filter((n) => n.pinned), [notes]);
}

export function useTotalOwed() {
  const sharedExpenses = useStore((state) => state.sharedExpenses);
  return useMemo(() => calculateTotalOwed(sharedExpenses), [sharedExpenses]);
}

export function useTotalBalance() {
  const accounts = useStore((state) => state.accounts);
  return useMemo(() => calculateTotalBalance(accounts), [accounts]);
}

export function useTotalSpent() {
  const expenses = useStore((state) => state.expenses);
  return useMemo(() => calculateTotalSpent(expenses), [expenses]);
}

export function useTotalIncome() {
  const expenses = useStore((state) => state.expenses);
  return useMemo(() => calculateTotalIncome(expenses), [expenses]);
}

export function useSpentToday() {
  const expenses = useStore((state) => state.expenses);
  return useMemo(() => {
    return expenses
      .filter((e) => e.type === 'expense' && isToday(e.createdAt))
      .reduce((sum, e) => safeAddCents(sum, e.amount), 0);
  }, [expenses]);
}

export function useNotesToday() {
  const notes = useStore((state) => state.notes);
  return useMemo(() => {
    return notes.filter((n) => isToday(n.createdAt));
  }, [notes]);
}

export function useBudgetSummary() {
  const budgets = useStore((state) => state.budgets);
  const expenses = useStore((state) => state.expenses);
  return useMemo(() => {
    const totalLimit = budgets.reduce((sum, b) => safeAddCents(sum, b.limit), 0);
    const totalSpent = calculateTotalSpent(expenses); // Simplified for overall limit
    const percent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    return { limit: totalLimit, spent: totalSpent, percent };
  }, [budgets, expenses]);
}
