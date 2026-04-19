import { useEffect, useMemo, useState } from 'react';
import { Link2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Task } from '@/core/store/types';

export interface NoteEditorValues {
  content: string;
  tags: string[];
  linkedTaskIds: string[];
}

interface NoteEditorProps {
  open: boolean;
  title: string;
  saveLabel: string;
  tasks: Task[];
  isSaving?: boolean;
  initialValues?: NoteEditorValues;
  onOpenChange: (open: boolean) => void;
  onSave: (values: NoteEditorValues) => Promise<void>;
  onConvertToTask?: () => Promise<void>;
}

const defaultValues: NoteEditorValues = {
  content: '',
  tags: [],
  linkedTaskIds: [],
};

function normalizeTag(rawTag: string) {
  return rawTag.trim().replace(/\s+/g, '-').toLowerCase();
}

export function NoteEditor({
  open,
  title,
  saveLabel,
  tasks,
  isSaving = false,
  initialValues,
  onOpenChange,
  onSave,
  onConvertToTask,
}: NoteEditorProps) {
  const [values, setValues] = useState<NoteEditorValues>(defaultValues);
  const [pendingTag, setPendingTag] = useState('');
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setValues(defaultValues);
      setPendingTag('');
      setSubmissionError(null);
      return;
    }

    setValues(initialValues ?? defaultValues);
    setPendingTag('');
    setSubmissionError(null);
  }, [initialValues, open]);

  const sortedTasks = useMemo(
    () => [...tasks].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [tasks],
  );

  if (!open) {
    return null;
  }

  const toggleTaskLink = (taskId: string) => {
    setValues((current) => {
      const selected = new Set(current.linkedTaskIds);

      if (selected.has(taskId)) {
        selected.delete(taskId);
      } else {
        selected.add(taskId);
      }

      return { ...current, linkedTaskIds: Array.from(selected) };
    });
  };

  const addTag = () => {
    const nextTag = normalizeTag(pendingTag);

    if (!nextTag || values.tags.includes(nextTag)) {
      setPendingTag('');
      return;
    }

    setValues((current) => ({ ...current, tags: [...current.tags, nextTag] }));
    setPendingTag('');
  };

  const removeTag = (tag: string) => {
    setValues((current) => ({
      ...current,
      tags: current.tags.filter((item) => item !== tag),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = values.content.trim();

    if (!content) {
      setSubmissionError('Write something before saving this note.');
      return;
    }

    setSubmissionError(null);

    try {
      await onSave({
        ...values,
        content,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save note. Please try again.';
      setSubmissionError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 py-4 backdrop-blur-sm sm:items-center">
      <button
        type="button"
        aria-label="Close note editor"
        className="absolute inset-0 cursor-default"
        onClick={() => onOpenChange(false)}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-2xl rounded-[1.5rem] border border-border bg-card p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Note</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">{title}</h3>
          </div>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>

        <label className="mt-5 block space-y-2">
          <span className="text-sm font-medium text-foreground">Markdown</span>
          <textarea
            autoFocus
            value={values.content}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                content: event.target.value,
              }))
            }
            placeholder="Capture your thought..."
            className="min-h-52 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </label>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Tags</p>
          <div className="flex gap-2">
            <input
              value={pendingTag}
              onChange={(event) => setPendingTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag"
              className="h-11 flex-1 rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
            <Button type="button" variant="outline" onClick={addTag}>
              Add
            </Button>
          </div>

          {values.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {values.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={`Remove ${tag} tag`}
                >
                  #{tag}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-4 space-y-2">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <Link2 className="h-4 w-4" />
            Link to task
          </p>
          {sortedTasks.length === 0 ? (
            <p className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              Create a task first to link it.
            </p>
          ) : (
            <div className="max-h-40 space-y-2 overflow-auto rounded-2xl border border-border bg-background p-3">
              {sortedTasks.map((task) => {
                const checked = values.linkedTaskIds.includes(task.id);
                return (
                  <label
                    key={task.id}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-card"
                  >
                    <span className="min-w-0 truncate text-sm text-foreground">{task.title}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTaskLink(task.id)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {submissionError ? (
          <p
            role="alert"
            className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {submissionError}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          {onConvertToTask ? (
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                setSubmissionError(null);
                try {
                  await onConvertToTask();
                } catch (error) {
                  const message =
                    error instanceof Error ? error.message : 'Failed to convert note into task.';
                  setSubmissionError(message);
                }
              }}
              disabled={isSaving || !values.content.trim()}
            >
              Convert to task
            </Button>
          ) : null}

          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving || !values.content.trim()}>
            {isSaving ? 'Saving…' : saveLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
