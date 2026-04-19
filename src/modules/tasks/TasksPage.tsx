import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { PageShell } from '@/components/PageShell';
import { useStore } from '@/core/store';
import type { Task, TaskStatus } from '@/core/store/types';
import { useSeo } from '@/seo';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';

type TaskFilter = 'all' | 'active' | 'completed';

export function TasksPage() {
  useSeo({
    title: 'Tasks',
    description: 'Track and prioritize your work with task planning in Titan.',
    path: '/tasks',
  });

  const tasks = useStore((state) => state.tasks);
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  const deleteTask = useStore((state) => state.deleteTask);
  const hydrated = useStore((state) => state.hydrated);

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // All task due dates for calendar dots
  const markedDates = useMemo(
    () => tasks.map((t) => t.dueDate).filter(Boolean) as string[],
    [tasks],
  );

  const visibleTasks = useMemo(() => {
    let sorted = [...tasks].sort((left, right) => right.createdAt.localeCompare(left.createdAt));

    if (filter === 'active') sorted = sorted.filter((t) => t.status !== 'done');
    else if (filter === 'completed') sorted = sorted.filter((t) => t.status === 'done');

    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      const ymd = `${y}-${m}-${d}`;
      sorted = sorted.filter((t) => t.dueDate === ymd);
    }

    return sorted;
  }, [filter, selectedDate, tasks]);

  const handleCreateTask = async (values: {
    title: string;
    dueDate?: string;
    status: TaskStatus;
  }) => {
    await addTask({
      title: values.title.trim(),
      status: values.status,
      dueDate: values.dueDate || undefined,
      noteId: undefined,
    });
    setIsFormOpen(false);
  };

  const handleUpdateTask = async (values: {
    title: string;
    dueDate?: string;
    status: TaskStatus;
  }) => {
    if (!editingTask) {
      return;
    }

    await updateTask(editingTask.id, {
      title: values.title.trim(),
      status: values.status,
      dueDate: values.dueDate || undefined,
    });
    setEditingTask(null);
  };

  const handleToggleStatus = async (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'todo' ? 'doing' : task.status === 'doing' ? 'done' : 'todo';

    await updateTask(task.id, { status: nextStatus });
  };

  const handleDeleteTask = async (task: Task) => {
    const confirmed = window.confirm(`Delete task “${task.title}”?`);

    if (!confirmed) {
      return;
    }

    await deleteTask(task.id);
  };

  const openCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  return (
    <PageShell
      title="Tasks"
      description="Capture, sort, and move work forward without leaving the app shell."
    >
      {/* Two-column layout: calendar sidebar + task list */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Calendar sidebar */}
        <div className="shrink-0">
          <Calendar
            value={selectedDate ?? undefined}
            markedDates={markedDates}
            onChange={(date) => {
              setSelectedDate((prev) =>
                prev && prev.getTime() === date.getTime() ? null : date
              );
            }}
          />
          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="mt-2 w-full rounded-xl py-1.5 text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear date filter ×
            </button>
          )}
        </div>

        {/* Task list */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Filter + Add bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(['all', 'active', 'completed'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={
                    filter === item
                      ? 'rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
                      : 'rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
                  }
                >
                  {item === 'all' ? 'All' : item === 'active' ? 'Active' : 'Completed'}
                </button>
              ))}
            </div>
            <Button onClick={openCreateForm} className="shrink-0" aria-label="Create task">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
          </div>

          {selectedDate && (
            <p className="text-xs text-primary font-medium">
              Showing tasks due {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          )}

          {visibleTasks.length === 0 ? (
            <article className="rounded-3xl border border-dashed border-border bg-card/50 p-6 text-center shadow-sm">
              <p className="text-sm font-medium text-foreground">
                {selectedDate ? 'No tasks due on this day' : 'No tasks yet'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedDate
                  ? 'Try selecting a different date or clear the filter.'
                  : 'Create your first task to start tracking work.'}
              </p>
            </article>
          ) : (
            visibleTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={openEditForm}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </div>

      <TaskForm
        open={isFormOpen}
        title={editingTask ? 'Edit task' : 'New task'}
        submitLabel={editingTask ? 'Save changes' : 'Create task'}
        initialValues={editingTask ?? undefined}
        onOpenChange={(nextOpen) => {
          setIsFormOpen(nextOpen);
          if (!nextOpen) {
            setEditingTask(null);
          }
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />
    </PageShell>
  );
}
