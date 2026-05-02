import { LayoutDashboard, SquareCheckBig, Landmark, NotebookPen, Search, Settings } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { APP_VERSION } from '@/core/version';

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: SquareCheckBig },
  { to: '/finance', label: 'Money', icon: Landmark },
  { to: '/notes', label: 'Thoughts', icon: NotebookPen },
] as const;

export function Sidebar() {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border bg-surface-solid z-50">
      <div className="p-6 flex items-center gap-3">
        <img src="/icons/titan-logo.png" alt="Titan" className="h-6 w-6" />
        <span className="text-lg font-bold tracking-tight">Titan</span>
      </div>

      <div className="px-4 mb-6">
        <button 
          onClick={() => { void navigate('/search'); }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground transition-all text-sm"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] opacity-40">⌘K</kbd>
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isMoneyActive = item.to === '/finance' && location.pathname.startsWith('/split');
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => {
                const active = isActive || isMoneyActive;
                return cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                );
              }}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            )
          }
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </NavLink>
        <div className="px-3 py-2 text-[10px] text-muted-foreground flex justify-between items-center opacity-60">
          <span>Version {APP_VERSION}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>
    </aside>
  );
}
