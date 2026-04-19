import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/PageShell';
import { useTheme } from '@/hooks/useTheme';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <PageShell
      title="Settings"
      description="Theme and app preferences will be managed here as the product grows."
    >
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Appearance</h3>
            <p className="text-sm text-muted-foreground">Dark mode is the default theme for Nexus.</p>
          </div>
          <Button variant="outline" onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </Button>
        </div>
      </div>
    </PageShell>
  );
}