import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { useSettings, formatMoney } from '@/core/settings';

const COLORS = [
  '#60a5fa', // blue-400
  '#c084fc', // purple-400
  '#fb7185', // rose-400
  '#fbbf24', // amber-400
  '#34d399', // emerald-400
  '#f87171', // red-400
  '#22d3ee', // cyan-400
  '#fb923c', // orange-400
];

interface ExpenseData {
  createdAt: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
}

interface SpendingTrendChartProps {
  expenses: ExpenseData[];
}

function normalizeTooltipValue(value: unknown) {
  if (Array.isArray(value)) {
    const firstValue = value[0] as number | string | undefined;
    return typeof firstValue === 'number' ? firstValue : Number(firstValue || 0);
  }

  return typeof value === 'number' ? value : Number(value || 0);
}

export function SpendingTrendChart({ expenses }: SpendingTrendChartProps) {
  const { currency } = useSettings();

  const data = useMemo(() => {
    // Generate last 14 days
    const days: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'MMM dd');
      days[d] = 0;
    }

    expenses.forEach((e) => {
      if (e.type === 'expense') {
        const d = format(new Date(e.createdAt), 'MMM dd');
        if (days[d] !== undefined) {
          days[d] += e.amount / 100;
        }
      }
    });

    return Object.entries(days).map(([date, amount]) => ({
      date,
      amount,
    }));
  }, [expenses]);

  return (
    <div className="h-64 w-full text-xs font-bold font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888888' }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888888' }}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              borderWidth: '1px',
              padding: '12px 16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            }}
            labelStyle={{
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '4px',
              color: '#64748b',
            }}
            itemStyle={{ fontWeight: 900, color: '#fff' }}
            formatter={(value) => [
              formatMoney(normalizeTooltipValue(value) * 100, currency),
              'Spent',
            ]}
          />
          <Bar dataKey="amount" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={24} />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CategoryPieChartProps {
  expenses: ExpenseData[];
}

export function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  const { currency } = useSettings();

  const data = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.forEach((e) => {
      if (e.type === 'expense') {
        cats[e.category] = (cats[e.category] || 0) + e.amount / 100;
      }
    });

    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories
  }, [expenses]);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full text-xs font-bold font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              borderWidth: '1px',
              padding: '12px 16px',
              color: '#fff',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            }}
            itemStyle={{ fontWeight: 900, color: '#fff' }}
            formatter={(value) => formatMoney(normalizeTooltipValue(value) * 100, currency)}
          />
          <Legend
            verticalAlign="bottom"
            height={48}
            iconType="circle"
            formatter={(value) => (
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mx-2">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
