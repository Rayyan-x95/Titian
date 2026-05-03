import { ChevronRight, NotebookPen, SquareCheckBig } from 'lucide-react';
import type { Task, Note } from '@/core/store/types';
import { noteTitle, notePreview } from '@/lib/core/noteEngine';

const statusConfig = {
  todo: { label: 'To Do', dot: 'bg-muted-foreground/60' },
  doing: { label: 'Doing', dot: 'bg-primary' },
  done: { label: 'Done', dot: 'bg-emerald-500' },
} as const;

function TaskStatusBadge({ status }: { status: Task['status'] }) {
  const config = statusConfig[status];
  return (
    <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} shadow-[0_0_8px_currentColor]`} />
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
        {config.label}
      </span>
    </span>
  );
}

interface TaskRowProps {
  task: Task;
  onClick: () => void;
}

export function TaskRow({ task, onClick }: TaskRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-all hover:bg-white/5 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/10 transition-colors group-hover:border-blue-500/30">
        <SquareCheckBig className="h-4 w-4" />
      </div>
      <span className="flex-1 truncate text-sm font-bold text-white/90 group-hover:text-white transition-colors">
        {task.title}
      </span>
      <TaskStatusBadge status={task.status} />
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-blue-400" />
    </button>
  );
}

interface NoteRowProps {
  note: Note;
  onClick: () => void;
}

export function NoteRow({ note, onClick }: NoteRowProps) {
  const title = noteTitle(note.content);
  const preview = notePreview(note.content);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-start gap-4 rounded-2xl px-4 py-3 text-left transition-all hover:bg-white/5 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
    >
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 transition-colors group-hover:border-cyan-500/30">
        <NotebookPen className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white/90 group-hover:text-white transition-colors">
          {title}
        </p>
        {preview && (
          <p className="mt-1 truncate text-xs font-medium text-slate-500 group-hover:text-slate-400 transition-colors">
            {preview}
          </p>
        )}
      </div>
      <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-cyan-400" />
    </button>
  );
}
