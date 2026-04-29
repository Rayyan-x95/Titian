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
  Legend
} from 'recharts';
import { format, subDays } from 'date-fns';
import { useSettings, formatMoney } from '@/core/settings';

const COLORS = [
  '#3b82f6', // blue-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
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
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
            formatter={(value: number) => [formatMoney(value * 100, currency), 'Spent']}
          />
          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">No data available</p>
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
            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: number) => formatMoney(value * 100, currency)}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-foreground/80">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
