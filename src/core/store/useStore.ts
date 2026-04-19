import { create } from 'zustand';
import { db } from '@/core/db/db';
import type {
  Expense,
  ExpenseInput,
  ExpenseUpdate,
  Note,
  NoteInput,
  NoteUpdate,
  Task,
  TaskInput,
  TaskUpdate,
} from './types';
import {
  clearTaskNoteReference,
  clearTasksForDeletedNote,
  reconcileTaskNoteReferences,
  syncTaskNoteReference,
  validateTaskNoteReference,
} from './taskNoteSync';
import { fromDollars } from './types';

interface CoreStoreState {
  tasks: Task[];
  notes: Note[];
  expenses: Expense[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addTask: (task: TaskInput) => Promise<Task>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<Task | undefined>;
  deleteTask: (id: string) => Promise<void>;
  addNote: (note: NoteInput) => Promise<Note>;
  updateNote: (id: string, updates: NoteUpdate) => Promise<Note | undefined>;
  deleteNote: (id: string) => Promise<void>;
  addExpense: (expense: ExpenseInput) => Promise<Expense>;
  updateExpense: (id: string, updates: ExpenseUpdate) => Promise<Expense | undefined>;
  deleteExpense: (id: string) => Promise<void>;
}

const storageKeyPrefix = 'titan-core';
let hydrationPromise: Promise<void> | null = null;

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createTimestamp(value?: string) {
  return value ?? new Date().toISOString();
}

function upsertTask(tasks: Task[], task: Task) {
  const nextTasks = tasks.filter((item) => item.id !== task.id);
  nextTasks.push(task);
  return nextTasks;
}

function upsertNote(notes: Note[], note: Note) {
  const nextNotes = notes.filter((item) => item.id !== note.id);
  nextNotes.push(note);
  return nextNotes;
}

function upsertExpense(expenses: Expense[], expense: Expense) {
  const nextExpenses = expenses.filter((item) => item.id !== expense.id);
  nextExpenses.push(expense);
  return nextExpenses;
}

async function hydrateFromDatabase() {
  const [tasks, notes, expenses] = await Promise.all([
    db.tasks.toArray(),
    db.notes.toArray(),
    db.expenses.toArray(),
  ]);

  const reconciled = reconcileTaskNoteReferences(tasks, notes);

  return { tasks: reconciled.tasks, notes: reconciled.notes, expenses };
}

export const useStore = create<CoreStoreState>((set, get) => ({
  tasks: [],
  notes: [],
  expenses: [],
  hydrated: false,

  hydrate: async () => {
    const { tasks, notes, expenses } = await hydrateFromDatabase();
    set({ tasks, notes, expenses, hydrated: true });
  },

  addTask: async (taskInput) => {
    const currentState = get();
    const task: Task = {
      id: taskInput.id ?? createId(),
      title: taskInput.title,
      status: taskInput.status,
      dueDate: taskInput.dueDate,
      noteId: taskInput.noteId,
      createdAt: createTimestamp(taskInput.createdAt),
    };

    validateTaskNoteReference(task, currentState.notes);
    await db.tasks.put(task);
    const nextNotes = syncTaskNoteReference(task, currentState.notes, currentState.tasks);
    const touchedNoteIds = new Set([task.noteId].filter(Boolean) as string[]);

    await Promise.all(nextNotes.filter((note) => touchedNoteIds.has(note.id)).map((note) => db.notes.put(note)));

    set((state) => ({
      tasks: upsertTask(state.tasks, task),
      notes: nextNotes,
    }));
    return task;
  },

  updateTask: async (id, updates) => {
    const currentState = get();
    const current = currentState.tasks.find((task) => task.id === id);

    if (!current) {
      return undefined;
    }

    const nextTask: Task = { ...current, ...updates };
    validateTaskNoteReference(nextTask, currentState.notes);
    await db.tasks.put(nextTask);
    const nextNotes = syncTaskNoteReference(nextTask, currentState.notes, currentState.tasks);
    const touchedNoteIds = new Set([current.noteId, nextTask.noteId].filter(Boolean) as string[]);

    await Promise.all(nextNotes.filter((note) => touchedNoteIds.has(note.id)).map((note) => db.notes.put(note)));

    set((state) => ({
      tasks: upsertTask(state.tasks, nextTask),
      notes: nextNotes,
    }));
    return nextTask;
  },

  deleteTask: async (id) => {
    const currentState = get();
    const currentTask = currentState.tasks.find((task) => task.id === id);
    const nextNotes = currentTask ? clearTaskNoteReference(id, currentState.notes) : currentState.notes;

    await db.tasks.delete(id);
    if (currentTask?.noteId) {
      const updatedNote = nextNotes.find((note) => note.id === currentTask.noteId);

      if (updatedNote) {
        await db.notes.put(updatedNote);
      }
    }

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      notes: nextNotes,
    }));
  },

  addNote: async (noteInput) => {
    const note: Note = {
      id: noteInput.id ?? createId(),
      content: noteInput.content,
      tags: noteInput.tags ?? [],
      linkedTaskIds: noteInput.linkedTaskIds ?? [],
      createdAt: createTimestamp(noteInput.createdAt),
    };

    const derivedNote = reconcileTaskNoteReferences(get().tasks, [note]).notes[0] ?? note;
    await db.notes.put(derivedNote);
    set((state) => {
      const nextNotes = upsertNote(state.notes, derivedNote);
      const reconciled = reconcileTaskNoteReferences(state.tasks, nextNotes);

      return { notes: reconciled.notes };
    });
    return derivedNote;
  },

  updateNote: async (id, updates) => {
    const currentState = get();
    const current = currentState.notes.find((note) => note.id === id);

    if (!current) {
      return undefined;
    }

    const nextNote: Note = { ...current, ...updates, linkedTaskIds: current.linkedTaskIds };
    const derivedNote = reconcileTaskNoteReferences(get().tasks, [nextNote]).notes[0] ?? nextNote;
    await db.notes.put(derivedNote);
    set((state) => {
      const nextNotes = upsertNote(state.notes, derivedNote);
      const reconciled = reconcileTaskNoteReferences(state.tasks, nextNotes);

      return { notes: reconciled.notes };
    });
    return derivedNote;
  },

  deleteNote: async (id) => {
    const currentState = get();
    const affectedTasks = currentState.tasks.filter((task) => task.noteId === id);

    await Promise.all(
      affectedTasks.map((task) => db.tasks.put({ ...task, noteId: undefined })),
    );
    await db.notes.delete(id);
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      tasks: clearTasksForDeletedNote(id, state.tasks),
    }));
  },

  addExpense: async (expenseInput) => {
    const expense: Expense = {
      id: expenseInput.id ?? createId(),
      amount: fromDollars(expenseInput.amountDollars),
      category: expenseInput.category,
      linkedTaskId: expenseInput.linkedTaskId,
      createdAt: createTimestamp(expenseInput.createdAt),
    };

    await db.expenses.put(expense);
    set((state) => ({ expenses: upsertExpense(state.expenses, expense) }));
    return expense;
  },

  updateExpense: async (id, updates) => {
    const current = get().expenses.find((expense) => expense.id === id);

    if (!current) {
      return undefined;
    }

    const nextExpense: Expense = { ...current, ...updates };
    await db.expenses.put(nextExpense);
    set((state) => ({ expenses: upsertExpense(state.expenses, nextExpense) }));
    return nextExpense;
  },

  deleteExpense: async (id) => {
    await db.expenses.delete(id);
    set((state) => ({ expenses: state.expenses.filter((expense) => expense.id !== id) }));
  },
}));

export async function initializeCoreStore() {
  if (useStore.getState().hydrated) {
    return;
  }

  if (!hydrationPromise) {
    hydrationPromise = useStore
      .getState()
      .hydrate()
      .finally(() => {
        hydrationPromise = null;
      });
  }

  await hydrationPromise;
}

export { storageKeyPrefix };
