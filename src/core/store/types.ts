export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string;
  noteId?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  tags: string[];
  linkedTaskIds: string[];
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  linkedTaskId?: string;
  createdAt: string;
}

export type TaskInput = Omit<Task, 'id' | 'createdAt'> & Partial<Pick<Task, 'id' | 'createdAt'>>;
export type NoteInput = Omit<Note, 'id' | 'createdAt'> & Partial<Pick<Note, 'id' | 'createdAt'>>;
export type ExpenseInput = Omit<Expense, 'id' | 'createdAt'> &
  Partial<Pick<Expense, 'id' | 'createdAt'>>;

export type TaskUpdate = Partial<Omit<Task, 'id' | 'createdAt'>>;
export type NoteUpdate = Partial<Omit<Note, 'id' | 'createdAt'>>;
