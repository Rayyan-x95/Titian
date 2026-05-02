import type { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: ReactNode;
}

export function PageShell({ title, description, eyebrow, children }: PageShellProps) {
  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {(title || description) && (
        <div className="space-y-3 rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm sm:p-6">
          <p className="titan-eyebrow">{eyebrow || 'Titan Workspace'}</p>
          {title && (
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="relative z-10 space-y-4">
        {children}
      </div>
    </section>
  );
}
