import { describe, expect, it } from 'vitest';
import { generateNextRecurringTasks } from '@/lib/core/taskEngine';
import { parseQuickCapture } from '@/lib/core/parserEngine';
import { reconcileTaskNoteReferences } from '@/core/store/taskNoteSync';

describe('integration flows', () => {
  it('generates next recurring tasks when completed', () => {
    const tasks = [
      { id: 't1', title: 'Pay subscription', status: 'done', priority: 'medium', energy: 'medium', area: 'personal', recurrence: { type: 'monthly', interval: 1 }, createdAt: '2024-01-01T00:00:00Z', dueDate: '2024-01-01' },
    ];

    const { newTasks, updatedTaskIds } = generateNextRecurringTasks(tasks as any);
    expect(updatedTaskIds).toContain('t1');
    expect(newTasks.length).toBeGreaterThan(0);
  });

  it('parses quick finance strings end-to-end', () => {
    const r = parseQuickCapture('Paid $12.50 to Starbucks tomorrow');
    expect(r.title.toLowerCase().includes('starbucks')).toBe(true);
    expect(r.amount).toBeGreaterThan(0);
  });

  it('reconciles tasks/notes into a consistent state', () => {
    const tasks = [{ id: 'task-1', noteId: 'note-missing' }];
    const notes = [{ id: 'note-1', linkedTaskIds: ['stale'] }];
    const r = reconcileTaskNoteReferences(tasks as any, notes as any);
    expect(r.tasks[0].noteId).toBeUndefined();
  });
});
