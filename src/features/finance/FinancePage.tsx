import { useMemo, useState, useEffect } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { PageShell } from '@/shared/components';
import { Button } from '@/shared/ui';
import { useStore } from '@/core/store';
import { useSettings, formatMoney } from '@/core/settings';
import type { Expense, Account, Task, Note, SharedExpense } from '@/core/store/types';
import { useSeo } from '@/seo';
import { ExpenseForm } from './ExpenseForm';
import { cn } from '@/utils/cn';
import { parseQuickCapture } from '@/lib/core/parserEngine';
import {
  useTotalBalance,
  useMonthlySpend,
  useTotalIncome,
  useTopCategories,
  useWeeklyTrend,
  usePersonalExpenses,
  useSharedExpenseItems,
} from '@/core/store/selectors';

export function FinancePage() {
  useSeo({ title: 'Finance', description: 'A clear view of your money.' });

  const currency = useSettings().currency;
  const totalBalance = useTotalBalance();
  const monthlySpend = useMonthlySpend();
  const totalIncome = useTotalIncome();

  const personalExpenses = usePersonalExpenses();
  const sharedItems = useSharedExpenseItems();
  const topCategories = useTopCategories(3);
  const weeklyTrend = useWeeklyTrend();

  const accounts = useStore((s) => s.accounts);
  const tasks = useStore((s) => s.tasks);
  const notes = useStore((s) => s.notes);
  const addExpense = useStore((s) => s.addExpense);

  const [viewShared, setViewShared] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
  }, []);

  const displayedExpenses = useMemo(() => {
    if (viewShared) {
      return sharedItems
        .slice()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((s) => ({
          id: s.id,
          amount: s.totalAmount,
          category: 'Split',
          createdAt: s.createdAt,
          description: s.description,
          shared: true,
          settlementStatus: s.settlementStatus,
        } as any));
    }

    return personalExpenses.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [viewShared, personalExpenses, sharedItems]);

  function groupByRecency<T extends { createdAt: string }>(items: T[]) {
    const today = new Date().toDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toDateString();

    const groups: { today: T[]; yesterday: T[]; earlier: T[] } = { today: [], yesterday: [], earlier: [] };
    items.forEach((item) => {
      const d = new Date(item.createdAt).toDateString();
      if (d === today) groups.today.push(item);
      else if (d === yesterday) groups.yesterday.push(item);
      else groups.earlier.push(item);
    });
    return groups;
  }

  const groups = useMemo(() => groupByRecency(displayedExpenses), [displayedExpenses]);

  const handleQuickAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!quickInput.trim()) return;
    if (accounts.length === 0) {
      window.alert('Please create an account first.');
      return;
    }
    const parsed = parseQuickCapture(quickInput);
    await addExpense({
      amount: parsed.amount,
      category: parsed.category,
      type: parsed.type,
      accountId: accounts[0].id,
      note: parsed.note,
      tags: [],
      isRecurring: false,
      createdAt: new Date().toISOString(),
    } as any);
    setQuickInput('');
  };

  return (
    <PageShell title="Finance" description="Balance, quick actions, insights, transactions.">
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Available Balance</p>
          <h1 className="mt-3 text-6xl font-black tracking-tight text-foreground">{formatMoney(totalBalance, currency)}</h1>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="text-[10px] font-black uppercase">Income</div>
              <div className="font-bold">{formatMoney(totalIncome, currency)}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-black uppercase">Expense (month)</div>
              <div className="font-bold">{formatMoney(monthlySpend, currency)}</div>
            </div>
          </div>
        </section>

        <section className="flex gap-3">
          <Button className="flex-1" onClick={() => { setEditingExpense(null); setIsExpenseFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Expense
          </Button>
          <Button className="flex-1" onClick={() => { setEditingExpense(null); setIsExpenseFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Income
          </Button>
          <Button className="flex-1" onClick={() => window.alert('Scan (OCR) — coming soon')}>
            <Search className="h-4 w-4 mr-2" /> Scan
          </Button>
          <Button className="flex-1" onClick={() => (window.location.href = '/splits')}>
            <Users className="h-4 w-4 mr-2" /> Split
          </Button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Top Categories</p>
            <ul className="mt-3 space-y-2">
              {topCategories.map((t) => (
                <li key={t.category} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.category}</span>
                  <span className="font-bold">{formatMoney(t.amount, currency)}</span>
                </li>
              ))}
              {topCategories.length === 0 && <li className="text-sm text-muted-foreground">No expense categories yet</li>}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Weekly Trend</p>
            <div className="mt-3 flex items-end gap-2 h-16">
              {weeklyTrend.map((d) => (
                <div key={d.day} className="flex-1">
                  <div className="h-full flex items-end">
                    <div style={{ height: `${Math.min(100, (d.amount / 1000) * 100)}%` }} className="w-full rounded-md bg-primary/60" />
                  </div>
                  <div className="text-[10px] text-center mt-1">{d.day.slice(0, 2)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setViewShared(false)} className={cn('px-3 py-1 rounded-lg font-bold', !viewShared ? 'bg-primary text-white' : 'bg-secondary')}>
              Personal
            </button>
            <button onClick={() => setViewShared(true)} className={cn('px-3 py-1 rounded-lg font-bold', viewShared ? 'bg-primary text-white' : 'bg-secondary')}>
              Shared
            </button>
          </div>

          <form onSubmit={handleQuickAdd} className="w-1/3">
            <div className="relative">
              <input value={quickInput} onChange={(e) => setQuickInput(e.target.value)} placeholder="Quick add: 'Swiggy ₹250'" className="w-full rounded-xl border border-border px-4 py-2" />
            </div>
          </form>
        </div>

        <section className="space-y-6">
          {(['today', 'yesterday', 'earlier'] as const).map((sectionKey) => {
            const items = groups[sectionKey];
            return (
              <div key={sectionKey}>
                <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-2">{sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}</h4>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No transactions</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((it: any) => (
                      <div key={it.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-bold truncate">{it.description || it.category}</div>
                            {it.shared && <span className="ml-2 text-xs uppercase text-purple-500 font-bold">Split</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">{it.category}{it.linkedTaskId ? ' • linked' : ''}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatMoney(it.amount, currency)}</div>
                          <div className="text-xs text-muted-foreground">{new Date(it.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <ExpenseForm
          open={isExpenseFormOpen}
          title={editingExpense ? 'Edit Transaction' : 'New Transaction'}
          submitLabel={editingExpense ? 'Save Changes' : 'Record Entry'}
          categories={['Food', 'Travel', 'Study', 'Personal', 'Rent', 'Utilities', 'Entertainment', 'Salary', 'Investment']}
          accounts={accounts}
          tasks={tasks}
          notes={notes}
          initialValues={editingExpense ?? undefined}
          onOpenChange={(nextOpen) => {
            setIsExpenseFormOpen(nextOpen);
            if (!nextOpen) setEditingExpense(null);
          }}
          onSubmit={async (values) => {
            const payload = { ...values, amount: Math.round(values.amountDollars * 100) } as any;
            if (editingExpense) {
              await useStore.getState().updateExpense(editingExpense.id, payload);
            } else {
              await addExpense(payload as any);
            }
            setIsExpenseFormOpen(false);
          }}
        />
      </div>
    </PageShell>
  );
}
