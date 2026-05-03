import { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { CheckCircle2, Circle, Clock, LucideProps } from 'lucide-react';
import { useStore } from '@/core/store';
import type { Task, TaskStatus } from '@/core/store/types';
import { cn } from '@/utils/cn';
import { toLocalDateString } from '@/utils/date';
import { format } from 'date-fns';

interface TaskKanbanProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const COLUMNS: {
  id: TaskStatus;
  title: string;
  icon: React.ComponentType<LucideProps>;
  color: string;
}[] = [
  { id: 'todo', title: 'To Do', icon: Circle, color: 'text-muted-foreground' },
  { id: 'doing', title: 'In Progress', icon: Clock, color: 'text-amber-500' },
  { id: 'done', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
];

export function TaskKanban({ tasks, onEditTask }: TaskKanbanProps) {
  const updateTask = useStore((state) => state.updateTask);

  const columnsData = useMemo(() => {
    const data: Record<TaskStatus, Task[]> = { todo: [], doing: [], done: [] };
    const topLevel = tasks.filter((t) => !t.parentTaskId);

    topLevel.forEach((task) => {
      data[task.status].push(task);
    });

    for (const key in data) {
      data[key as TaskStatus].sort((a, b) => {
        const pMap = { high: 0, medium: 1, low: 2 };
        if (pMap[a.priority] !== pMap[b.priority]) return pMap[a.priority] - pMap[b.priority];
        return b.createdAt.localeCompare(a.createdAt);
      });
    }

    return data;
  }, [tasks]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const newStatus = destination.droppableId as TaskStatus;
    const oldStatus = source.droppableId as TaskStatus;

    if (newStatus !== oldStatus) {
      await updateTask(draggableId, { status: newStatus });

      if (newStatus === 'done') {
        const today = toLocalDateString(new Date());
        await useStore.getState().updateSnapshot(today, 'task', 1);
      } else if (oldStatus === 'done') {
        const today = toLocalDateString(new Date());
        await useStore.getState().updateSnapshot(today, 'task', -1);
      }
    }
  };

  return (
    <DragDropContext
      onDragEnd={(result) => {
        void onDragEnd(result);
      }}
    >
      <div className="flex flex-col md:flex-row gap-6 items-start h-full pb-10 overflow-x-auto custom-scrollbar">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className="flex-1 min-w-[300px] bg-card/20 border border-border/50 rounded-3xl p-5 flex flex-col h-[70vh]"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <column.icon className={cn('h-4 w-4', column.color)} />
                <h3 className="text-sm font-bold tracking-tight">{column.title}</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-0.5 rounded-md bg-secondary/50">
                {columnsData[column.id].length}
              </span>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    'flex-1 overflow-y-auto custom-scrollbar space-y-3 p-1 rounded-2xl transition-colors',
                    snapshot.isDraggingOver ? 'bg-primary/5' : '',
                  )}
                >
                  {columnsData[column.id].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onEditTask(task)}
                          className={cn(
                            'group bg-card border border-border/60 rounded-2xl p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md cursor-pointer',
                            snapshot.isDragging ? 'rotate-2 scale-105 shadow-glow' : '',
                          )}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h4
                              className={cn(
                                'text-sm font-bold leading-tight',
                                task.status === 'done' && 'line-through text-muted-foreground',
                              )}
                            >
                              {task.title}
                            </h4>
                            {task.priority === 'high' && (
                              <div className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 items-center mt-3">
                            {task.dueDate && (
                              <span
                                className={cn(
                                  'text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1',
                                  new Date(task.dueDate) < new Date() && task.status !== 'done'
                                    ? 'bg-rose-500/10 text-rose-500'
                                    : 'bg-secondary text-muted-foreground',
                                )}
                              >
                                <Clock className="h-3 w-3" />
                                {format(new Date(task.dueDate), 'MMM d')}
                              </span>
                            )}
                            {(task.area || task.tags?.length) && (
                              <div className="flex items-center gap-1 overflow-hidden">
                                {task.area && (
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {task.area}
                                  </span>
                                )}
                                {task.tags?.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[9px] font-bold text-primary/70 uppercase tracking-widest before:content-['•'] before:mr-1 before:text-muted-foreground/30"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
