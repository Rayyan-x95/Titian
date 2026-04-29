import { useEffect } from 'react';
import { useStore } from '@/core/store';
import { createNotificationHandler } from '@/lib/notifications';
import { useSettings } from '@/core/settings';

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

        const spent = expenses
          .filter(e => e.category === budget.category && e.type === 'expense')
          .reduce((sum, e) => sum + e.amount, 0);

        const percent = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

        if (percent >= 90) {
          handler.notifyBudgetAlert({ category: budget.category, limit: budget.limit, spent });
          notifiedBudgets.add(budget.id);
        }
      });
    }, 60 * 1000); // Check every minute

    // Request permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => clearInterval(checkInterval);
  }, [tasks, budgets, expenses, notificationsEnabled]);
}
