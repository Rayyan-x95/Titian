import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function DashboardCard({ title, subtitle, children, action }: DashboardCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
          {subtitle ? <h3 className="text-base font-medium text-foreground">{subtitle}</h3> : null}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}
