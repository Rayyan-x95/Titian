import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
              Nexus
            </p>
            <h1 className="text-lg font-semibold tracking-tight">Productivity shell</h1>
          </div>
          <div className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            Offline-first ready
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <Navigation />
    </div>
  );
}
