import Dexie, { type Table } from 'dexie';
import type { Expense, Note, Task } from '@/core/store/types';

class NexusDatabase extends Dexie {
  tasks!: Table<Task, string>;
  notes!: Table<Note, string>;
  expenses!: Table<Expense, string>;

  constructor() {
    super('nexus');

    this.version(1).stores({
      tasks: 'id, status, createdAt, dueDate, noteId',
      notes: 'id, createdAt',
      expenses: 'id, category, createdAt, linkedTaskId',
    });

    this.tasks = this.table('tasks');
    this.notes = this.table('notes');
    this.expenses = this.table('expenses');
  }
}

export const db = new NexusDatabase();
