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
    <Card className="p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-36 h-36 bg-primary/8 rounded-full blur-3xl -z-10 group-hover:bg-primary/15 transition-all duration-700" />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-primary/70">{title}</p>
          {subtitle ? <h3 className="text-xl font-semibold tracking-tight text-foreground">{subtitle}</h3> : null}
        </div>
        {action}
      </div>
      <div className="mt-6 relative z-10">{children}</div>
    </Card>
  );
}

