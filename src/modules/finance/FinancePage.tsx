import { PageShell } from '@/components/PageShell';

export function FinancePage() {
  return (
    <PageShell
      title="Finance"
      description="Finance will later hold budgeting, balances, and simple recurring tracking."
    >
      <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Placeholder content for the finance module. Use this screen for future snapshots and inputs.
        </p>
      </article>
    </PageShell>
  );
}