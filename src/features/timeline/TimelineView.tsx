import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toLocalDateString, isToday } from '@/utils/date';
import {
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Heart,
  Wallet,
  Users,
  Zap,
} from 'lucide-react';
import { PageShell } from '@/shared/components';
import { TagInput } from '@/shared/ui';
import { useTimelineItems } from '@/core/store/selectors';
import type { TimelineItem } from '@/core/store/types';
import { useSeo } from '@/seo';
import { useSettings, formatMoney } from '@/core/settings';
import { cn } from '@/utils/cn';

function getAreaIcon(area: string, className?: string) {
  switch (area) {
    case 'work':
      return <Briefcase className={className} />;
    case 'health':
      return <Heart className={className} />;
    case 'finance':
      return <Wallet className={className} />;
    case 'social':
      return <Users className={className} />;
    default:
      return <Zap className={className} />;
  }
}


function groupByDate(items: TimelineItem[]) {
  const groups: Record<string, TimelineItem[]> = {};

  items.forEach((item) => {
    const dateKey = toLocalDateString(new Date(item.timestamp));
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
  });

  return groups;
}

function dateLabel(dateKey: string) {
  const date = new Date(dateKey + 'T12:00:00'); // Use noon to avoid DST/timezone issues when parsing just date
  
  if (isToday(dateKey)) return 'Today';
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateKey === toLocalDateString(yesterday)) return 'Yesterday';
  
  return format(date, 'MMMM d, yyyy');
}

function TimelineRow({ item }: { item: TimelineItem }) {
  const currency = useSettings((s) => s.currency);
  
  let area: string = 'personal';
  let title = 'Activity';
  let meta = '';
  let icon = <Zap className="h-4 w-4" />;
  let toneClass = 'text-primary bg-primary/10';

  switch (item.type) {
    case 'task': {
      const task = item.data;
      area = task.area || 'personal';
      title = task.title;
      meta = String(task.status).toUpperCase();
      icon = <CheckCircle2 className="h-4 w-4" />;
      toneClass = 'text-emerald-400 bg-emerald-500/10';
      break;
    }
    case 'note': {
      const note = item.data;
      area = note.area || 'personal';
      title = note.content.split('\n')[0] || 'Untitled note';
      meta = `${(note.tags || []).length} tags`;
      icon = <FileText className="h-4 w-4" />;
      toneClass = 'text-cyan-300 bg-cyan-500/10';
      break;
    }
    case 'expense': {
      const expense = item.data;
      area = expense.area || 'personal';
      title = expense.category;
      meta = formatMoney(expense.amount, currency);
      icon = <CircleDollarSign className="h-4 w-4" />;
      toneClass = expense.type === 'income' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10';
      break;
    }
    case 'split': {
      const split = item.data;
      area = split.area || 'personal';
      title = split.description;
      meta = formatMoney(split.totalAmount, currency);
      icon = <Users className="h-4 w-4" />;
      toneClass = 'text-blue-300 bg-blue-500/10';
      break;
    }
  }

  return (
    <article className="relative rounded-2xl border border-border/70 bg-card/50 p-4 transition-colors hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl', toneClass)}>{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="truncate text-sm font-semibold text-foreground">{title || 'Untitled'}</h4>
            <time className="text-[11px] font-medium text-muted-foreground">
              {format(new Date(item.timestamp), 'h:mm a')}
            </time>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{meta}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              {getAreaIcon(area, 'h-3 w-3')} {area}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function TimelineView() {
  useSeo({
    title: 'Timeline',
    description: 'A focused narrative feed of tasks, notes, expenses, and shared activity.',
    path: '/timeline',
  });

  const [filterTags, setFilterTags] = useState<string[]>([]);
  const items = useTimelineItems();

  const filtered = useMemo(() => {
    if (filterTags.length === 0) return items;

    const normalized = filterTags.map((tag) => tag.toLowerCase());
    return items.filter((item) => {
      let tags: string[] = [];
      if (item.type === 'task' || item.type === 'note' || item.type === 'expense') {
        tags = item.data.tags || [];
      }
      return normalized.some((wanted) => tags.map((tag) => tag.toLowerCase()).includes(wanted));
    });
  }, [items, filterTags]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const dates = useMemo(() => Object.keys(grouped).sort((a, b) => b.localeCompare(a)), [grouped]);

  return (
    <PageShell
      eyebrow="Narrative"
      title="Timeline"
      description="A chronological feed of work, money, ideas, and shared life updates."
    >
      <div className="rounded-2xl border border-border/70 bg-card/40 p-4 sm:p-5">
        <TagInput
          tags={filterTags}
          onChange={setFilterTags}
          placeholder="Filter by tag"
          className="border-border/60 bg-card/50"
        />
      </div>

      {dates.length === 0 ? (
        <article className="rounded-2xl border border-dashed border-border bg-card/35 p-10 text-center">
          <p className="text-sm font-medium text-foreground">Your timeline is clear.</p>
          <p className="mt-2 text-xs text-muted-foreground">Capture tasks, notes, and expenses to build your feed.</p>
        </article>
      ) : (
        <div className="space-y-8">
          {dates.map((dateKey) => (
            <section key={dateKey} className="space-y-3">
              <div className="sticky top-2 z-10 rounded-xl border border-border/70 bg-background/80 px-3 py-2 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {dateLabel(dateKey)}
                </p>
              </div>
              <div className="space-y-2.5">
                {grouped[dateKey].map((item, index) => {
                  const dataId = (item.data as { id?: string }).id || index;
                  return (
                    <TimelineRow key={`${item.type}-${dataId}-${item.timestamp}`} item={item} />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
