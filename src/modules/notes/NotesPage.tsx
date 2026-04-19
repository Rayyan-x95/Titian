import { PageShell } from '@/components/PageShell';

export function NotesPage() {
  return (
    <PageShell
      title="Notes"
      description="Notes will become a structured capture space for ideas, references, and planning."
    >
      <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Placeholder content for the notes module. Future work can add editors, tags, and search.
        </p>
      </article>
    </PageShell>
  );
}