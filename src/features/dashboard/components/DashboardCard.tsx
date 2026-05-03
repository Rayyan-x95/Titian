import type { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}

export function DashboardCard({ title, subtitle, children, action, icon }: DashboardCardProps) {
  return (
    <div className="glass-panel titan-card relative p-6 transition-all border-white/5 hover:bg-white/5">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/5">
              {icon}
            </div>
          )}
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500/80">
              {title}
            </p>
            {subtitle ? (
              <p className="text-lg font-bold tracking-tight text-white">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {action}
      </div>
      <div className="relative z-10 mt-6">{children}</div>
    </div>
  );
}
