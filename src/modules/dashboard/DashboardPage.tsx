import { PageShell } from '@/components/PageShell';

export function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="A single place to see what is next across tasks, notes, and finance."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Today</p>
          <h3 className="mt-3 text-lg font-medium">Empty shell, ready for widgets</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add task lists, note shortcuts, or a finance snapshot here when the data layer arrives.
          </p>
        </article>

        <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Status</p>
          <h3 className="mt-3 text-lg font-medium">Offline-first foundation</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Routing, layout, theme handling, and responsive navigation are already in place.
          </p>
        </article>
      </div>
    </PageShell>
  );
}