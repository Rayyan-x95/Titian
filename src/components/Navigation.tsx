import { LayoutDashboard, Landmark, NotebookPen, Settings, SquareCheckBig } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';

const items = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: SquareCheckBig },
  { to: '/notes', label: 'Notes', icon: NotebookPen },
  { to: '/finance', label: 'Finance', icon: Landmark },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Navigation() {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-5 gap-1 px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:px-4 lg:px-8">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground',
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
