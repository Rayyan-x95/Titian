import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link2, PencilLine, Trash2, Pin, Clock } from 'lucide-react';
import { Button } from '@/shared/ui';
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
  const compact = content.split('\n').map((line) => line.trim()).filter(Boolean).slice(0, 3).join('\n\n').trim(); 
  if (!compact) return 'Empty note'; 
  return compact.length > 180 ? `${compact.slice(0, 180)}...` : compact; 
}

export function NoteItem({ note, linkedTasks, onOpen, onDelete }: NoteItemProps) {
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
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50"
    >
      <div className="flex items-start justify-between gap-4">
        <button type="button" onClick={onOpen} className="flex-1 text-left focus:outline-none">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
              <Clock className="h-2.5 w-2.5" />
              <span>{createdAtFormatted}</span>
            </div>
            {note.pinned && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Pin className="h-2.5 w-2.5 fill-current" />
              </div>
            )}
          </div>
          
          <div className="text-sm font-medium leading-relaxed text-foreground/90 line-clamp-4 prose prose-invert prose-p:my-1 prose-headings:my-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{preview}</ReactMarkdown>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {note.tags.map((tag) => (
              <span key={tag} className="rounded-lg bg-secondary/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                #{tag}
              </span>
            ))}
            {(linkedTasks.length > 0 || (note.linkedNoteIds?.length ?? 0) > 0) && (
              <div className="flex items-center gap-2 border-l border-border pl-2 ml-1">
                {linkedTasks.length > 0 && (
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-primary/60">
                    <Link2 className="h-2.5 w-2.5" />
                    {linkedTasks.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </button>

        <div className="flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button variant="ghost" size="sm" aria-label="Edit note" onClick={onOpen} className="h-8 w-8 p-0 rounded-lg bg-secondary/50 hover:bg-secondary">
            <PencilLine className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Delete note" onClick={(e) => { e.stopPropagation(); void onDelete(); }} className="h-8 w-8 p-0 rounded-lg bg-destructive/5 hover:bg-destructive/10 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
