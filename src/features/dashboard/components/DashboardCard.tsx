import type { ReactNode } from 'react';
import { Card } from '@/shared/ui';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}

export function DashboardCard({ title, subtitle, children, action, icon }: DashboardCardProps) {
  return (
    <Card className="relative p-5 transition-all">
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              {icon}
            </div>
          )}
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {title}
            </p>
            {subtitle ? (
              <p className="text-base font-semibold tracking-tight text-foreground">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {action}
      </div>
      <div className="relative z-10 mt-4">{children}</div>
    </Card>
  );
}
