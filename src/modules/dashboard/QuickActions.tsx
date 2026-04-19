import { Landmark, NotebookPen, Plus, SquareCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const actions = [
  { label: 'Task', icon: SquareCheckBig, to: '/tasks' },
  { label: 'Note', icon: NotebookPen, to: '/notes' },
  { label: 'Expense', icon: Landmark, to: '/finance' },
] as const;

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="ui-slide-up-enter p-4">
      <div className="mb-3 flex items-center gap-2">
        <Plus className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-foreground">Quick actions</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              type="button"
              variant="secondary"
              className="h-14 rounded-2xl"
              onClick={() => navigate(action.to)}
              aria-label={`Open ${action.label}`}
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
