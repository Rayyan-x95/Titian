import { useMemo, useState, useEffect } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { PageShell } from '@/shared/components';
import { Button } from '@/shared/ui';
import { useStore } from '@/core/store';
import { useSettings, formatMoney } from '@/core/settings';
import type { Expense, ExpenseInput, ExpenseUpdate, SharedExpense } from '@/core/store/types';
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
import { warmupOCR } from '@/utils/parserEngine';

type DisplayedExpense = Pick<Expense, 'id' | 'amount' | 'category' | 'createdAt' | 'linkedTaskId'> & {
  description?: string;
  shared?: boolean;
  settlementStatus?: SharedExpense['settlementStatus'];
};

const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Rent',
  'Utilities',
  'Entertainment',
  'Health',
  'Personal',
  'Study',
  'Other'
];

const INCOME_CATEGORIES = [
  'Salary',
  'Investment',
  'Bonus',
  'Freelance',
  'Gift',
  'Interest',
  'Dividend',
  'Rental',
  'Reimbursement'
];

export function FinancePage() {
  useSeo({ 
    title: 'Money', 
    description: 'Take control of your finances. Track expenses, manage budgets, and handle shared costs with ease in a professional personal finance system.' 
  });

  const currency = useSettings((s) => s.currency);
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
  const updateExpense = useStore((s) => s.updateExpense);

  const [viewShared, setViewShared] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isScanningViaDashboard, setIsScanningViaDashboard] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [newTransactionType, setNewTransactionType] = useState<'expense' | 'income'>('expense');
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    void warmupOCR();
  }, []);

  const displayedExpenses = useMemo<DisplayedExpense[]>(() => {
    if (viewShared) {
      return sharedItems
        .slice()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((s): DisplayedExpense => ({
          id: s.id,
          amount: s.totalAmount,
          category: 'Split',
          createdAt: s.createdAt,
          description: s.description,
          shared: true,
          settlementStatus: s.settlementStatus,
        }));
    }

    return personalExpenses
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((e): DisplayedExpense => ({
        ...e,
        description: e.note,
      }));
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
    });
    setQuickInput('');
  };

  return (
    <PageShell
      eyebrow="Money"
      title="Finance"
      description="Large balance first, fast actions second, and lightweight insight always in context."
    >
      <div className="space-y-6 pb-36 lg:pb-8">
        <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/55 p-8">
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-muted-foreground">Available Liquidity</p>
            <h1 className="titan-metric mt-4 text-gradient">{formatMoney(totalBalance, currency)}</h1>
            <div className="mt-8 grid grid-cols-2 gap-8 w-full max-w-md">
              <div className="flex flex-col items-center border-r border-border">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Income</p>
                <p className="mt-1 text-lg font-bold text-emerald-500">{formatMoney(totalIncome, currency)}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expenses</p>
                <p className="mt-1 text-lg font-bold text-primary">{formatMoney(monthlySpend, currency)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Button className="h-12 w-full" onClick={() => { setEditingExpense(null); setNewTransactionType('expense'); setIsExpenseFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Expense
          </Button>
          <Button className="h-12 w-full" onClick={() => { setEditingExpense(null); setNewTransactionType('income'); setIsExpenseFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Income
          </Button>
          <Button className="h-12 w-full" variant="outline" onClick={() => { setEditingExpense(null); setIsScanningViaDashboard(true); setIsExpenseFormOpen(true); }}>
            <Search className="h-4 w-4 mr-2" /> Scan
          </Button>
          <Button className="h-12 w-full" variant="outline" onClick={() => (window.location.href = '/splits')}>
            <Users className="h-4 w-4 mr-2" /> Split
          </Button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categories</p>
            <ul className="mt-4 space-y-3">
              {topCategories.map((t) => (
                <li key={t.category} className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground/80">{t.category}</span>
                  <span className="text-sm font-black">{formatMoney(t.amount, currency)}</span>
                </li>
              ))}
              {topCategories.length === 0 && <li className="text-xs text-muted-foreground">No data yet</li>}
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button 
              onClick={() => setViewShared(false)} 
              className={cn(
                'flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all', 
                !viewShared ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              )}
            >
              Personal
            </button>
            <button 
              onClick={() => setViewShared(true)} 
              className={cn(
                'flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all', 
                viewShared ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              )}
            >
              Shared
            </button>
          </div>

          <form onSubmit={(event) => { void handleQuickAdd(event); }} className="w-full sm:w-1/2 lg:w-1/3">
            <div className="relative">
              <input 
                value={quickInput} 
                onChange={(e) => setQuickInput(e.target.value)} 
                placeholder="Quick add: 'Swiggy ₹250'" 
                className="w-full rounded-xl border border-border bg-surface/50 px-4 py-2.5 text-sm focus:bg-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
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
                   <div className="flex flex-col items-center justify-center py-10 opacity-20">
                     <img src="/icons/falcon.png" alt="Falcon" className="h-12 w-12 grayscale" />
                     <p className="mt-3 text-[10px] font-black uppercase tracking-widest">No entries</p>
                   </div>
                 ) : (
                   <div className="space-y-3">
                     {items.map((it) => (
                       <div key={it.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-all hover:border-primary/40">
                         <div className="min-w-0">
                           <div className="flex items-center gap-2">
                             <div className="text-sm font-bold truncate text-foreground">{it.description || it.category}</div>
                             {it.shared && <span className="px-1.5 py-0.5 rounded bg-primary/10 text-[8px] uppercase text-primary font-bold">Split</span>}
                           </div>
                           <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {it.description ? it.category : ''}
                              {it.linkedTaskId ? (it.description ? ' • linked' : 'linked') : ''}
                           </div>
                         </div>
                         <div className="text-right">
                           <div className="text-sm font-bold text-foreground">{formatMoney(it.amount, currency)}</div>
                           <div className="text-[10px] font-medium text-muted-foreground/60">{new Date(it.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
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
          expenseCategories={EXPENSE_CATEGORIES}
          incomeCategories={INCOME_CATEGORIES}
          accounts={accounts}
          tasks={tasks}
          notes={notes}
          initialValues={editingExpense ?? undefined}
          initialType={editingExpense?.type ?? newTransactionType}
          autoTriggerScan={isScanningViaDashboard}
          onOpenChange={(nextOpen) => {
            setIsExpenseFormOpen(nextOpen);
            if (!nextOpen) {
              setEditingExpense(null);
              setIsScanningViaDashboard(false);
            }
          }}
          onSubmit={async (values) => {
            const payload: ExpenseInput & ExpenseUpdate = {
              amount: Math.round(values.amountDollars * 100),
              category: values.category,
              type: values.type,
              accountId: values.accountId,
              tags: values.tags,
              area: values.area,
              note: values.note,
              isRecurring: values.isRecurring,
              recurrenceRule: values.recurrenceRule,
              linkedTaskId: values.linkedTaskId,
              linkedNoteId: values.linkedNoteId,
              createdAt: new Date(`${values.date}T12:00:00`).toISOString(),
            };
            if (editingExpense) {
              await updateExpense(editingExpense.id, payload);
            } else {
              await addExpense(payload);
            }
            setIsExpenseFormOpen(false);
          }}
        />
      </div>
    </PageShell>
  );
}
