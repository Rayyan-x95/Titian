import { useMemo } from 'react';
import type { Task } from '@/core/store/types';

interface UseTaskTreeProps {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  selectedDate: Date | null;
}

export function useTaskTree({ tasks, filter, selectedDate }: UseTaskTreeProps) {
  return useMemo(() => {
    let filtered = [...tasks];
    if (filter === 'active') filtered = filtered.filter((t) => t.status !== 'done');
    else if (filter === 'completed') filtered = filtered.filter((t) => t.status === 'done');

    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      const ymd = `${y}-${m}-${d}`;
      filtered = filtered.filter((t) => t.dueDate === ymd);
    }

    const map = new Map<string, Task[]>();
    filtered.forEach((t) => {
      if (t.parentTaskId) {
        const children = map.get(t.parentTaskId) || [];
        children.push(t);
        map.set(t.parentTaskId, children);
      }
    });

    const filteredIds = new Set(filtered.map((t) => t.id));
    const topLevel = filtered.filter((t) => !t.parentTaskId || !filteredIds.has(t.parentTaskId));

    topLevel.sort((a, b) => {
      const pMap: Record<string, number> = { high: 0, medium: 1, low: 2 };
      if (pMap[a.priority] !== pMap[b.priority]) return pMap[a.priority] - pMap[b.priority];
      return b.createdAt.localeCompare(a.createdAt);
    });

    return { topLevel, childrenMap: map };
  }, [filter, selectedDate, tasks]);
}
