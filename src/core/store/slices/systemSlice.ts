import { StateCreator } from 'zustand';
import { db } from '@/core/db/db';
import type { DailySnapshot, Account, Expense } from '../types';
import type { CoreStoreState } from '../useStore';
import { 
  reconcileIntegrity 
} from '../taskNoteSync';
import { 
  normalizeTask 
} from '@/lib/core/taskEngine';
import { 
  normalizeNote 
} from '@/lib/core/noteEngine';
import { 
  normalizeAccount, 
  normalizeBudget, 
  normalizeExpenseRecurrenceRule, 
  normalizePositiveCents, 
  dollarsToCentsSafe 
} from '@/lib/core/financeEngine';
import { 
  computeDailySnapshots 
} from '@/lib/core/timelineEngine';
import { sanitizeString, sanitizeTags, sanitizeDateString } from '@/utils/sanitizer';
import { 
  createDefaultOnboardingProfile, 
  isRecord, 
  readArray, 
  normalizeImportedOnboarding, 
  createId
} from '../utils';

export interface SystemSlice {
  hydrated: boolean;
  dailySnapshots: DailySnapshot[];
  hydrate: () => Promise<void>;
  clearAll: () => Promise<void>;
  importBackup: (payload: unknown) => Promise<void>;
  updateSnapshot: (date: string, type: 'task' | 'expense' | 'note' | 'split', value?: number) => Promise<void>;
  recomputeSnapshots: () => Promise<void>;
  resetRateLimits: () => Promise<void>;
}

async function hydrateFromDatabase() {
  const [tasks, notes, expenses, budgets, accounts, friends, groups, sharedExpenses, dailySnapshots, onboarding] = await Promise.all([
    db.tasks.toArray(),
    db.notes.toArray(),
    db.expenses.toArray(),
    db.budgets.toArray(),
    db.accounts.toArray(),
    db.friends.toArray(),
    db.groups.toArray(),
    db.sharedExpenses.toArray(),
    db.dailySnapshots.toArray(),
    db.onboarding.get('primary'),
  ]);

  const clean = reconcileIntegrity(tasks, notes, expenses, sharedExpenses, groups, friends);
  return { 
    ...clean,
    budgets,
    accounts,
    dailySnapshots,
    onboarding: onboarding ?? createDefaultOnboardingProfile(),
  };
}

export const createSystemSlice: StateCreator<CoreStoreState, [], [], SystemSlice> = (set, get) => ({
  hydrated: false,
  dailySnapshots: [],

  hydrate: async () => {
    try {
      const data = await hydrateFromDatabase();
      const {
        tasks,
        notes,
        budgets,
        friends,
        groups,
        sharedExpenses,
        dailySnapshots,
        onboarding,
      } = data;
      let { accounts, expenses } = data;
      
      if (accounts.length === 0) {
        const defaults: Account[] = [
          { id: 'cash', name: 'Cash', balance: 0, createdAt: new Date().toISOString() },
          { id: 'bank', name: 'Bank', balance: 0, createdAt: new Date().toISOString() },
        ];
        await db.accounts.bulkPut(defaults);
        accounts = defaults;
      } else {
        const upiAccount = accounts.find(a => a.id === 'upi');
        if (upiAccount) {
          const bankAccount = accounts.find(a => a.id === 'bank');
          if (bankAccount) {
            const updatedBank = { ...bankAccount, balance: bankAccount.balance + upiAccount.balance };
            await db.transaction('rw', [db.accounts, db.expenses], async () => {
              await db.accounts.delete('upi');
              await db.accounts.put(updatedBank);
              await db.expenses.where('accountId').equals('upi').modify({ accountId: 'bank' });
            });
            accounts = accounts.filter(a => a.id !== 'upi').map(a => a.id === 'bank' ? updatedBank : a);
            expenses = expenses.map(e => e.accountId === 'upi' ? { ...e, accountId: 'bank' } : e);
          }
        }
      }

      // Use the clean data from hydrateFromDatabase (which now uses reconcileIntegrity)
      set({ tasks, notes, expenses, budgets, accounts, friends, groups, sharedExpenses, dailySnapshots, onboarding, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  clearAll: async () => {
    await db.transaction('rw', db.tables, async () => {
      await Promise.all(db.tables.map(table => table.clear()));
    });
    set({ 
      tasks: [], notes: [], expenses: [], budgets: [], accounts: [], 
      friends: [], groups: [], sharedExpenses: [], dailySnapshots: [], 
      onboarding: createDefaultOnboardingProfile() 
    });
  },

  importBackup: async (payload) => {
    if (!isRecord(payload)) throw new Error('Invalid backup payload.');

    const importedTasks = readArray(payload, 'tasks').map(t => normalizeTask(t)).filter(Boolean);
    const importedNotes = readArray(payload, 'notes').map(n => normalizeNote(n)).filter(Boolean);
    const importedFriends = readArray(payload, 'friends') as any[];
    const importedGroups = readArray(payload, 'groups') as any[];
    const importedSharedExpenses = readArray(payload, 'sharedExpenses') as any[];
    const importedRawExpenses = readArray(payload, 'expenses') as any[];

    let importedAccounts = readArray(payload, 'accounts').map(a => normalizeAccount(a)).filter(Boolean);
    if (importedAccounts.length === 0) {
      const now = new Date().toISOString();
      importedAccounts = [
        { id: 'cash', name: 'Cash', balance: 0, createdAt: now },
        { id: 'bank', name: 'Bank', balance: 0, createdAt: now },
      ];
    }

    const clean = reconcileIntegrity(
      importedTasks,
      importedNotes,
      importedRawExpenses,
      importedSharedExpenses,
      importedGroups,
      importedFriends
    );

    const { tasks, notes, sharedExpenses, groups, friends } = clean;

    const accountIds = new Set(importedAccounts.map(a => a.id));
    const fallbackAccountId = importedAccounts[0].id;

    const expenses: Expense[] = clean.expenses.flatMap(e => {
      if (!isRecord(e) || typeof e.category !== 'string') return [];
      
      return [{
        id: typeof e.id === 'string' ? e.id : createId(),
        amount: typeof e.amount === 'number' ? normalizePositiveCents(e.amount) : normalizePositiveCents(Number(e.amount || 0)),
        category: sanitizeString(e.category, 50),
        type: e.type === 'income' ? 'income' : 'expense',
        accountId: typeof e.accountId === 'string' && accountIds.has(e.accountId) ? e.accountId : fallbackAccountId,
        tags: sanitizeTags(e.tags),
        area: typeof e.area === 'string' ? (e.area as import('../types').LifeArea) : 'finance',
        note: sanitizeString(e.note, 500),
        isRecurring: Boolean(e.isRecurring),
        recurrenceRule: normalizeExpenseRecurrenceRule(e.recurrenceRule),
        linkedTaskId: e.linkedTaskId,
        linkedNoteId: e.linkedNoteId,
        createdAt: sanitizeDateString(e.createdAt) || new Date().toISOString(),
      }];
    });

    const importedBudgets = readArray(payload, 'budgets').map(b => normalizeBudget(b)).filter(Boolean);
    const importedOnboarding = normalizeImportedOnboarding(payload.onboarding, get().onboarding);

    await db.transaction('rw', db.tables, async () => {
      await Promise.all(db.tables.map(table => table.clear()));
      await Promise.all([
        db.tasks.bulkPut(tasks),
        db.notes.bulkPut(notes),
        db.expenses.bulkPut(expenses),
        db.sharedExpenses.bulkPut(sharedExpenses),
        db.groups.bulkPut(groups),
        db.friends.bulkPut(friends),
        db.budgets.bulkPut(importedBudgets),
        db.accounts.bulkPut(importedAccounts),
        db.onboarding.put(importedOnboarding),
      ]);
    });

    set({
      tasks, notes, expenses, sharedExpenses, groups, friends,
      budgets: importedBudgets, accounts: importedAccounts, onboarding: importedOnboarding,
      hydrated: true
    });
  },

  updateSnapshot: async (date, type, value = 1) => {
    const snapshots = [...get().dailySnapshots];
    const index = snapshots.findIndex(s => s.date === date);
    
    if (index === -1) {
      const newSnapshot: DailySnapshot = {
        date,
        tasksCompleted: type === 'task' ? value : 0,
        notesCreated: type === 'note' ? value : 0,
        expensesTotal: type === 'expense' ? value : 0,
        splitsAdded: type === 'split' ? value : 0,
        topArea: 'personal',
      };
      await db.dailySnapshots.put(newSnapshot);
      set({ dailySnapshots: [...snapshots, newSnapshot] });
    } else {
      const updated = { ...snapshots[index] };
      if (type === 'task') updated.tasksCompleted = Math.max(0, updated.tasksCompleted + value);
      else if (type === 'note') updated.notesCreated = Math.max(0, updated.notesCreated + value);
      else if (type === 'expense') updated.expensesTotal = Math.max(0, updated.expensesTotal + value);
      else if (type === 'split') updated.splitsAdded = Math.max(0, updated.splitsAdded + value);
      
      await db.dailySnapshots.put(updated);
      snapshots[index] = updated;
      set({ dailySnapshots: snapshots });
    }
  },

  recomputeSnapshots: async () => {
    const snapshots = computeDailySnapshots(get().tasks, get().notes, get().expenses, get().sharedExpenses);
    await db.dailySnapshots.clear();
    await db.dailySnapshots.bulkPut(snapshots);
    set({ dailySnapshots: snapshots });
  },

  resetRateLimits: async () => {
    // Placeholder
  },
});
