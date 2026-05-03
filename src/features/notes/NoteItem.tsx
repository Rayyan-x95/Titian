import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link2, PencilLine, Trash2, Pin, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Note, Task } from '@/core/store/types';

interface NoteItemProps {
  note: Note;
  linkedTasks: Task[];
  onOpen: () => void;
  onDelete: () => Promise<void>;
}

function toPreview(content: string) {
  const compact = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join('\n\n')
    .trim();
  if (!compact) return 'Empty note';
  return compact.length > 180 ? `${compact.slice(0, 180)}...` : compact;
}

export const NoteItem = memo(function NoteItem({
  note,
  linkedTasks,
  onOpen,
  onDelete,
}: NoteItemProps) {
  const createdAtFormatted = useMemo(() => {
    const date = new Date(note.createdAt);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
  }, [note.createdAt]);

  const preview = useMemo(() => toPreview(note.content), [note.content]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-panel group relative overflow-hidden rounded-[2.5rem] p-7 transition-all hover:shadow-glow-blue"
    >
      <div className="flex items-start justify-between gap-4">
        <button type="button" onClick={onOpen} className="flex-1 text-left focus:outline-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
              <Clock className="h-3 w-3" />
              <span>{createdAtFormatted}</span>
            </div>
            {note.pinned && (
              <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/10 shadow-glow">
                <Pin className="h-3 w-3 fill-current" />
              </div>
            )}
          </div>

          <div className="text-sm font-medium leading-relaxed text-foreground/90 line-clamp-4 prose prose-invert prose-p:my-1 prose-headings:my-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{preview}</ReactMarkdown>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500"
              >
                #{tag}
              </span>
            ))}
            {(linkedTasks.length > 0 || (note.linkedNoteIds?.length ?? 0) > 0) && (
              <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                {linkedTasks.length > 0 && (
                  <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                    <Link2 className="h-3 w-3" />
                    {linkedTasks.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </button>

        <div className="flex flex-col gap-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            aria-label="Edit note"
            onClick={onOpen}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <PencilLine className="h-5 w-5" />
          </button>
          <button
            aria-label="Delete note"
            onClick={(e) => {
              e.stopPropagation();
              void onDelete();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
});
