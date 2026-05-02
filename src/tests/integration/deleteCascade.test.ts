import { describe, expect, it } from 'vitest';
import { clearTaskNoteReference, clearTasksForDeletedNote } from '@/core/store/taskNoteSync';
import { getTaskHierarchyDepth, hasTaskParentCycle } from '@/lib/core/taskEngine';
import type { Note, Task } from '@/core/store/types';

describe('delete cascade and hierarchy', () => {
  it('removes task id from notes when deleted', () => {
    const notes = [
      { id: 'n1', linkedTaskIds: ['t1', 't2'] }, 
      { id: 'n2', linkedTaskIds: [] }
    ] as Note[];
    const updated = clearTaskNoteReference('t1', notes);
    expect(updated[0].linkedTaskIds).toEqual(['t2']);
  });

  it('clears noteId on tasks when note deleted', () => {
    const tasks = [
      { id: 't1', noteId: 'n1' }, 
      { id: 't2', noteId: undefined }
    ] as Task[];
    const updated = clearTasksForDeletedNote('n1', tasks);
    expect(updated[0].noteId).toBeUndefined();
  });

  it('detects deep hierarchy and cycles', () => {
    const tasks = [
      { id: 'a', parentTaskId: 'b' },
      { id: 'b', parentTaskId: 'c' },
      { id: 'c', parentTaskId: 'a' },
    ] as Task[];
    expect(hasTaskParentCycle('a', 'b', tasks)).toBe(true);
    expect(getTaskHierarchyDepth('a', tasks)).toBeGreaterThan(0);
  });
});
