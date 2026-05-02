import type { Task, Note, Expense, SharedExpense, DailySnapshot, TimelineItem } from '@/core/store/types';
import { toLocalDateString } from '@/utils/date';

export function buildTimelineItems(
  tasks: Task[],
  notes: Note[],
  expenses: Expense[],
  sharedExpenses: SharedExpense[]
): TimelineItem[] {
  const items: TimelineItem[] = [
    ...tasks.map(t => ({ type: 'task' as const, data: t, timestamp: t.createdAt })),
    ...notes.map(n => ({ type: 'note' as const, data: n, timestamp: n.createdAt })),
    ...expenses.map(e => ({ type: 'expense' as const, data: e, timestamp: e.createdAt })),
    ...sharedExpenses.map(se => ({ type: 'split' as const, data: se, timestamp: se.createdAt })),
  ];
  return items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function computeDailySnapshots(
  tasks: Task[],
  notes: Note[],
  expenses: Expense[],
  sharedExpenses: SharedExpense[]
): DailySnapshot[] {
  const snapshotMap = new Map<string, DailySnapshot>();

  const getSnapshot = (date: string) => {
    if (!snapshotMap.has(date)) {
      snapshotMap.set(date, {
        date,
        tasksCompleted: 0,
        expensesTotal: 0,
        notesCreated: 0,
        splitsAdded: 0,
        topArea: 'personal',
      });
    }
    return snapshotMap.get(date)!;
  };

  tasks.filter(t => t.status === 'done').forEach(t => {
    const date = toLocalDateString(t.createdAt);
    if (date) getSnapshot(date).tasksCompleted += 1;
  });

  expenses.filter(e => e.type === 'expense').forEach(e => {
    const date = toLocalDateString(e.createdAt);
    if (date) getSnapshot(date).expensesTotal += e.amount;
  });

  notes.forEach(n => {
    const date = toLocalDateString(n.createdAt);
    if (date) getSnapshot(date).notesCreated += 1;
  });

  sharedExpenses.forEach(se => {
    const date = toLocalDateString(se.createdAt);
    if (date) getSnapshot(date).splitsAdded += 1; // Count of splits, not amount
  });

  return Array.from(snapshotMap.values());
}
