import { LayoutDashboard, SquareCheckBig, Landmark, NotebookPen, Plus, Settings } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const items = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: SquareCheckBig },
  { to: '/finance', label: 'Money', icon: Landmark },
  { to: '/notes', label: 'Thoughts', icon: NotebookPen },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      aria-label="Primary navigation"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 mx-auto flex max-w-[calc(100%-2rem)] flex-col items-center gap-4 px-4 lg:hidden"
    >
      <button
        onClick={() => { void navigate('/tasks?new=1'); }}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-accent shadow-[0_10px_24px_rgba(24,125,255,0.38)] transition-all active:scale-95"
        aria-label="Add new item"
      >
        <Plus className="h-7 w-7 text-white" strokeWidth={2.5} />
      </button>

      <div className="compact-nav pointer-events-auto flex w-full items-center justify-around gap-1 rounded-[1.6rem] border border-border/70 bg-card/70 p-2 backdrop-blur-2xl">
        {items.map((item) => {
          const Icon = item.icon;
          const isMoneyActive = item.to === '/finance' && location.pathname.startsWith('/split');

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              aria-label={item.label}
              className={({ isActive }) =>
                cn(
                  'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[10px] font-semibold tracking-wide transition-all duration-200',
                  (isActive || isMoneyActive)
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {({ isActive }) => {
                const active = isActive || isMoneyActive;
                return (
                  <>
                    {active && (
                      <motion.div 
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-primary/90 to-accent/85"
                        transition={{ type: 'spring', bounce: 0.16, duration: 0.44 }}
                      />
                    )}
                    <Icon className={cn('h-5 w-5 transition-all duration-200', active ? 'scale-105' : 'opacity-80')} strokeWidth={1.7} />
                    <span className="leading-none">{item.label}</span>
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
