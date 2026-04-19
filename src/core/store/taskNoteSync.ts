import type { Note, Task } from './types';

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values));
}

function normalizeLinkedTaskIds(note: Note) {
  return {
    ...note,
    linkedTaskIds: note.linkedTaskIds ?? [],
  };
}

export function validateTaskNoteReference(task: Task, notes: Note[]) {
  if (!task.noteId) {
    return;
  }

  const hasNote = notes.some((note) => note.id === task.noteId);

  if (!hasNote) {
    throw new Error(`Task ${task.id} references missing note ${task.noteId}`);
  }
}

export function syncTaskNoteReference(task: Task, noteStore: Note[], taskStore: Task[]) {
  const previousTask = taskStore.find((item) => item.id === task.id);
  const previousNoteId = previousTask?.noteId;
  let nextNotes = noteStore.map(normalizeLinkedTaskIds);

  if (previousNoteId && previousNoteId !== task.noteId) {
    nextNotes = nextNotes.map((note) =>
      note.id === previousNoteId
        ? { ...note, linkedTaskIds: note.linkedTaskIds!.filter((taskId) => taskId !== task.id) }
        : note,
    );
  }

  if (task.noteId) {
    nextNotes = nextNotes.map((note) =>
      note.id === task.noteId
        ? {
            ...note,
            linkedTaskIds: uniqueStrings([...(note.linkedTaskIds ?? []), task.id]),
          }
        : note,
    );
  }

  return nextNotes;
}

export function clearTaskNoteReference(taskId: string, noteStore: Note[]) {
  return noteStore.map((note) => ({
    ...note,
    linkedTaskIds: (note.linkedTaskIds ?? []).filter((linkedTaskId) => linkedTaskId !== taskId),
  }));
}

export function clearTasksForDeletedNote(noteId: string, taskStore: Task[]) {
  return taskStore.map((task) =>
    task.noteId === noteId
      ? {
          ...task,
          noteId: undefined,
        }
      : task,
  );
}

export function reconcileTaskNoteReferences(tasks: Task[], notes: Note[]) {
  const noteIds = new Set(notes.map((note) => note.id));
  const sanitizedTasks = tasks.map((task) =>
    task.noteId && !noteIds.has(task.noteId) ? { ...task, noteId: undefined } : task,
  );

  const normalizedNotes = notes.map((note) => ({
    ...normalizeLinkedTaskIds(note),
    linkedTaskIds: sanitizedTasks.filter((task) => task.noteId === note.id).map((task) => task.id),
  }));

  return { tasks: sanitizedTasks, notes: normalizedNotes };
}
