import { motion } from 'framer-motion';
import { ChevronRight, PencilLine, Trash2, Repeat, Calendar, Flag } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/shared/ui';
import { cn } from '@/utils/cn';
import type { Task, TaskStatus, TaskPriority } from '@/core/store/types';

interface TaskItemProps {
  task: Task;
  subtasks?: Task[];
  onEdit: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddSubtask?: (parentId: string) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: 'Todo',
  doing: 'Doing',
  done: 'Done',
};

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-muted/50 text-muted-foreground',
  doing: 'bg-amber-500/10 text-amber-500',
  done: 'bg-emerald-500/10 text-emerald-500',
};

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-blue-500/10 text-blue-500',
  medium: 'bg-amber-500/10 text-amber-500',
  high: 'bg-rose-500/10 text-rose-500',
};

export function TaskItem({ task, subtasks, onEdit, onToggleStatus, onDelete, onAddSubtask }: TaskItemProps) {
  const formattedDueDate = useMemo(() => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    if (Number.isNaN(date.getTime())) return task.dueDate;
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
  }, [task.dueDate]);

  const createdAtFormatted = useMemo(() => {
    if (!task.createdAt) return '-';
    const date = new Date(task.createdAt);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
  }, [task.createdAt]);

  const nextStatusLabel = task.status === 'todo' ? 'Start' : task.status === 'doing' ? 'Complete' : 'Reset';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
             <span className={cn(
               "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
               statusStyles[task.status]
             )}>
               <span className="h-1 w-1 rounded-full bg-current" />
               {statusLabels[task.status]}
             </span>
             
             <span className={cn(
               "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
               priorityStyles[task.priority]
             )}>
               <Flag className="h-2.5 w-2.5" />
               {task.priority}
             </span>

             {task.recurrence && (
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  <Repeat className="h-2.5 w-2.5" />
                  {task.recurrence.type}
                </span>
              )}

             {formattedDueDate && (
               <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                 <Calendar className="h-2.5 w-2.5" />
                 {formattedDueDate}
               </span>
             )}
          </div>

          <h3 className={cn(
            "text-base font-bold tracking-tight leading-tight transition-all",
            task.status === 'done' ? "text-muted-foreground line-through opacity-40" : "text-foreground"
          )}>
            {task.title}
          </h3>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
              {createdAtFormatted}
            </p>
          </div>

          {subtasks && subtasks.length > 0 && (
            <div className="mt-4">
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${(subtasks.filter(s => s.status === 'done').length / subtasks.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onToggleStatus(task)} 
            className={cn(
              "h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
              task.status === 'done' ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
            )}
          >
            {nextStatusLabel}
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
          
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <Button 
              variant="ghost" 
              size="sm" 
              aria-label={`Edit ${task.title}`}
              onClick={(e) => { e.stopPropagation(); onEdit(task); }} 
              className="h-7 w-7 p-0 rounded-md bg-white/5 hover:bg-white/10"
            >
              <PencilLine className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Delete ${task.title}`}
              onClick={(e) => { e.stopPropagation(); onDelete(task); }}
              className="h-7 w-7 p-0 rounded-md bg-destructive/5 hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {subtasks && subtasks.length > 0 && (
        <div className="mt-6 space-y-3 pl-6 border-l border-border/50">
          {subtasks.map((st) => (
            <TaskItem
              key={st.id}
              task={st}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onAddSubtask={onAddSubtask}
            />
          ))}
        </div>
      )}
    </motion.article>
  );
}
