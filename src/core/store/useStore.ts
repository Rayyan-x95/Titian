import { create } from 'zustand';
import { db } from '@/core/db/db';
import type {
  Expense,
  ExpenseInput,
  Note,
  NoteInput,
  NoteUpdate,
  Task,
  TaskInput,
  TaskUpdate,
} from './types';

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
  deleteExpense: (id: string) => Promise<void>;
}

const storageKeyPrefix = 'nexus-core';

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

  return { tasks, notes, expenses };
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
    const task: Task = {
      id: taskInput.id ?? createId(),
      title: taskInput.title,
      status: taskInput.status,
      dueDate: taskInput.dueDate,
      noteId: taskInput.noteId,
      createdAt: createTimestamp(taskInput.createdAt),
    };

    await db.tasks.put(task);
    set((state) => ({ tasks: upsertTask(state.tasks, task) }));
    return task;
  },

  updateTask: async (id, updates) => {
    const current = get().tasks.find((task) => task.id === id);

    if (!current) {
      return undefined;
    }

    const nextTask: Task = { ...current, ...updates };
    await db.tasks.put(nextTask);
    set((state) => ({ tasks: upsertTask(state.tasks, nextTask) }));
    return nextTask;
  },

  deleteTask: async (id) => {
    await db.tasks.delete(id);
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },

  addNote: async (noteInput) => {
    const note: Note = {
      id: noteInput.id ?? createId(),
      content: noteInput.content,
      tags: noteInput.tags ?? [],
      linkedTaskIds: noteInput.linkedTaskIds ?? [],
      createdAt: createTimestamp(noteInput.createdAt),
    };

    await db.notes.put(note);
    set((state) => ({ notes: upsertNote(state.notes, note) }));
    return note;
  },

  updateNote: async (id, updates) => {
    const current = get().notes.find((note) => note.id === id);

    if (!current) {
      return undefined;
    }

    const nextNote: Note = { ...current, ...updates };
    await db.notes.put(nextNote);
    set((state) => ({ notes: upsertNote(state.notes, nextNote) }));
    return nextNote;
  },

  deleteNote: async (id) => {
    await db.notes.delete(id);
    set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
  },

  addExpense: async (expenseInput) => {
    const expense: Expense = {
      id: expenseInput.id ?? createId(),
      amount: expenseInput.amount,
      category: expenseInput.category,
      linkedTaskId: expenseInput.linkedTaskId,
      createdAt: createTimestamp(expenseInput.createdAt),
    };

    await db.expenses.put(expense);
    set((state) => ({ expenses: upsertExpense(state.expenses, expense) }));
    return expense;
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

  await useStore.getState().hydrate();
}

export { storageKeyPrefix };
