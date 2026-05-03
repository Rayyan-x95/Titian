import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, NotebookPen, SquareCheckBig } from 'lucide-react';

export interface ContinueItem {
  type: 'task' | 'note';
  id: string;
  title: string;
  to: string;
}

interface ContinueCardProps {
  item: ContinueItem;
}

export function ContinueCard({ item }: ContinueCardProps) {
  const navigate = useNavigate();
  const Icon = item.type === 'task' ? SquareCheckBig : NotebookPen;
  const accentClass = item.type === 'task' ? 'text-primary' : 'text-accent';

  return (
    <div
      role="button"
      tabIndex={0}
      id={`dashboard-continue-${item.id}`}
      onClick={() => {
        void navigate(item.to);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          void navigate(item.to);
        }
      }}
      className="glass-panel titan-card group cursor-pointer p-5 transition-all hover:bg-white/5 border-white/5 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3 text-blue-400/80" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400/70">
            Resume
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-blue-400/80" />
      </div>
      <div className="flex items-start gap-4">
        <div
          className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/5 transition-colors group-hover:border-white/10 ${accentClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500/80">
            {item.type}
          </p>
          <p className="mt-1 truncate text-sm font-bold text-white group-hover:text-blue-50 transition-colors">
            {item.title}
          </p>
        </div>
      </div>
    </div>
  );
}
