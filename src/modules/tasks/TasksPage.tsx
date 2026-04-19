import { PageShell } from '@/components/PageShell';

export function TasksPage() {
  return (
    <PageShell
      title="Tasks"
      description="Task workflow will live here. The page exists now so navigation and routing are complete."
    >
      <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Placeholder content for the tasks module. Wire in lists, filters, and sync later.
        </p>
      </article>
    </PageShell>
  );
}