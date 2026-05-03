import { useEffect } from 'react';
import { useStore } from '@/core/store';
import { createNotificationHandler } from '@/lib/core/notifications';
import { useSettings } from '@/core/settings';
import { calculateBudgetUsage } from '@/lib/core/financeEngine';

export function useBackgroundNotifications() {
  const tasks = useStore((state) => state.tasks);
  const budgets = useStore((state) => state.budgets);
  const expenses = useStore((state) => state.expenses);
  const notificationsEnabled = useSettings((state) => state.notifications);

  useEffect(() => {
    if (!notificationsEnabled) return;

    const handler = createNotificationHandler();
    const notifiedTasks = new Set<string>();
    const notifiedBudgets = new Set<string>();

    const checkInterval = setInterval(() => {
      const now = new Date();

      // Check tasks
      tasks.forEach((task) => {
        if (task.status === 'done' || !task.dueDate) return;
        if (notifiedTasks.has(task.id)) return;

        const due = new Date(task.dueDate);
        const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursLeft > 0 && hoursLeft <= 24) {
          handler.notifyTaskDue({ id: task.id, title: task.title, due: task.dueDate });
          notifiedTasks.add(task.id);
        }
      });

      // Check budgets
      budgets.forEach((budget) => {
        if (notifiedBudgets.has(budget.id)) return;

        const usage = calculateBudgetUsage(budget, expenses, now);
        const percent = usage.percent;
        const spent = usage.spent;

        if (percent >= 90) {
          handler.notifyBudgetAlert({ category: budget.category, limit: budget.limit, spent });
          notifiedBudgets.add(budget.id);
        }
      });
    }, 60 * 1000); // Check every minute

    // Request permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }

    return () => clearInterval(checkInterval);
  }, [tasks, budgets, expenses, notificationsEnabled]);
}
