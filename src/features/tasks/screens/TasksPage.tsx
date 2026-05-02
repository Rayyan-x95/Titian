import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Plus, List, CalendarDays } from 'lucide-react';
import { Button, Calendar } from '@/shared/ui';
import { PageShell } from '@/shared/components';
import { useStore } from '@/core/store';
import type { Task, TaskStatus } from '@/core/store/types';
import { useSeo } from '@/seo';
import { TaskForm } from '../components/TaskForm';
import { TaskItem } from '../components/TaskItem';
import { TaskCalendar } from '../components/TaskCalendar';
import { TaskKanban } from '../components/TaskKanban';
import { cn } from '@/utils/cn';
import { toLocalDateString } from '@/utils/date';

type TaskFilter = 'all' | 'active' | 'completed';
type TaskView = 'list' | 'calendar' | 'kanban';

export function TasksPage() {
  useSeo({
    title: 'Tasks',
    description: 'Master your productivity with smart task management. Organize workflows, set priorities, and connect tasks to your notes and finances.',
    path: '/tasks',
  });

  const tasks = useStore((state) => state.tasks);
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  const deleteTask = useStore((state) => state.deleteTask);
  const hydrated = useStore((state) => state.hydrated);
  const processRecurringTasks = useStore((state) => state.processRecurringTasks);

  useEffect(() => {
    if (hydrated) {
      void processRecurringTasks();
    }
  }, [hydrated, processRecurringTasks]);

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<TaskView>('list');

  const markedDates = useMemo(
    () => tasks.map((t) => t.dueDate).filter(Boolean) as string[],
    [tasks],
  );

  const taskTree = useMemo(() => {
    let filtered = [...tasks];
    if (filter === 'active') filtered = filtered.filter((t) => t.status !== 'done');
    else if (filter === 'completed') filtered = filtered.filter((t) => t.status === 'done');

    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      const ymd = `${y}-${m}-${d}`;
      filtered = filtered.filter((t) => t.dueDate === ymd);
    }

    const map = new Map<string, Task[]>();
    filtered.forEach(t => {
      if (t.parentTaskId) {
        const children = map.get(t.parentTaskId) || [];
        children.push(t);
        map.set(t.parentTaskId, children);
      }
    });

    const filteredIds = new Set(filtered.map(t => t.id));
    const topLevel = filtered.filter(t => !t.parentTaskId || !filteredIds.has(t.parentTaskId));

    topLevel.sort((a, b) => {
      const pMap: Record<string, number> = { high: 0, medium: 1, low: 2 };
      if (pMap[a.priority] !== pMap[b.priority]) return pMap[a.priority] - pMap[b.priority];
      return b.createdAt.localeCompare(a.createdAt);
    });

    return { topLevel, childrenMap: map };
  }, [filter, selectedDate, tasks]);

  const handleCreateTask = async (values: import('@/core/store/types').TaskInput) => {
    await addTask({ ...values, title: values.title.trim() });
    setIsFormOpen(false);
  };

  const handleUpdateTask = async (values: import('@/core/store/types').TaskInput) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, { ...values, title: values.title.trim() });
    setEditingTask(null);
  };

  const handleToggleStatus = async (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'todo' ? 'doing' : task.status === 'doing' ? 'done' : 'todo';
    await updateTask(task.id, { status: nextStatus });
    
    if (nextStatus === 'done') {
      const today = toLocalDateString(new Date());
      await useStore.getState().updateSnapshot(today, 'task', 1);
    } else if (task.status === 'done') {
      const today = toLocalDateString(new Date());
      await useStore.getState().updateSnapshot(today, 'task', -1);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    await deleteTask(task.id);
  };

  const openCreateForm = () => { setEditingTask(null); setIsFormOpen(true); };
  const openEditForm = (task: Task) => { setEditingTask(task); setIsFormOpen(true); };
  const handleAddSubtask = (parentId: string) => {
    setEditingTask({ parentTaskId: parentId } as Task);
    setIsFormOpen(true);
  };

  return (
    <PageShell
      eyebrow="Execution"
      title="Tasks"
      description="Plan today, keep upcoming visible, and close loops without clutter."
    >
      <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
        <div className="shrink-0">
          <Calendar
            value={selectedDate ?? undefined}
            markedDates={markedDates}
            onChange={setSelectedDate}
          />
        </div>

        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {(['all', 'active', 'completed'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                    filter === item ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex rounded-xl border border-border/70 bg-card p-1">
                <button 
                  onClick={() => setView('list')} 
                  aria-label="List view"
                  className={cn("p-1.5 rounded-lg transition-all", view === 'list' ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                >
                  <List className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setView('calendar')} 
                  aria-label="Calendar view"
                  className={cn("p-1.5 rounded-lg transition-all", view === 'calendar' ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                >
                  <CalendarDays className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setView('kanban')} 
                  aria-label="Kanban view"
                  className={cn("p-1.5 rounded-lg transition-all", view === 'kanban' ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/></svg>
                </button>
              </div>
              <Button onClick={openCreateForm} className="flex-1 sm:flex-none shadow-glow">
                <Plus className="h-4 w-4" />
                <span>New</span>
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view + filter + (selectedDate?.toISOString() || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'calendar' ? (
                <TaskCalendar onDateClick={(d) => { setSelectedDate(d); setView('list'); }} onEditTask={openEditForm} />
              ) : view === 'kanban' ? (
                <TaskKanban tasks={taskTree.topLevel} onEditTask={openEditForm} />
              ) : (
                <LayoutGroup>
                  <div className="space-y-4">
                    {taskTree.topLevel.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        subtasks={taskTree.childrenMap.get(task.id)}
                        onEdit={openEditForm}
                        onToggleStatus={(t) => { void handleToggleStatus(t); }}
                        onDelete={(t) => { void handleDeleteTask(t); }}
                        onAddSubtask={handleAddSubtask}
                      />
                    ))}
                    {taskTree.topLevel.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
                        <img src="/icons/falcon.png" alt="Falcon" className="h-24 w-24 opacity-10 grayscale" />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground">A clean horizon</p>
                          <p className="text-xs text-muted-foreground">Adjust filters or start a new quest.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </LayoutGroup>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <TaskForm
        open={isFormOpen}
        title={editingTask ? 'Edit task' : 'New task'}
        submitLabel={editingTask ? 'Save' : 'Create'}
        initialValues={editingTask ?? undefined}
        onOpenChange={setIsFormOpen}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />
    </PageShell>
  );
}
