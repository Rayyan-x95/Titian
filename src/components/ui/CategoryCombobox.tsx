import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Tag } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CategoryComboboxProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export function CategoryCombobox({
  value,
  options,
  onChange,
  placeholder = 'e.g. Food',
  id,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Keep query in sync when value changes externally (e.g. form reset)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = query.trim()
    ? options.filter((opt) => opt.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('pointerdown', handler);
    return () => window.removeEventListener('pointerdown', handler);
  }, [open]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const commit = (cat: string) => {
    onChange(cat);
    setQuery(cat);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next);
    onChange(next);
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0 && filtered[activeIndex]) {
        e.preventDefault();
        commit(filtered[activeIndex]);
      }
    }
  };

  const showDropdown = open && filtered.length > 0;

  return (
    <div ref={rootRef} className="relative">
      {/* Input trigger */}
      <div
        className={cn(
          'flex h-12 w-full items-center gap-2 rounded-2xl border bg-background px-4 transition-colors',
          open ? 'border-primary ring-2 ring-primary/20' : 'border-border',
        )}
      >
        <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Toggle category list"
          onClick={() => {
            setOpen((o) => !o);
            inputRef.current?.focus();
          }}
          className="text-muted-foreground transition-transform duration-200"
        >
          <ChevronDown
            className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      </div>

      {/* Dropdown list */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
            className="ui-surface absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-border/60 p-1 shadow-2xl"
            aria-label="Category suggestions"
          >
            {filtered.map((cat, index) => {
              const isSelected = cat === value;
              const isActive = index === activeIndex;
              return (
                <button
                  key={cat}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(cat)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive || isSelected
                      ? 'bg-primary/12 text-primary'
                      : 'text-foreground hover:bg-secondary/60',
                  )}
                >
                  <span>{cat}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })}

            {/* If query doesn't match any option exactly, offer to create it */}
            {query.trim() && !options.some((o) => o.toLowerCase() === query.trim().toLowerCase()) && (
              <button
                type="button"
                onClick={() => commit(query.trim())}
                className="mt-0.5 flex w-full items-center gap-2 rounded-lg border-t border-border/40 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                <span className="text-primary">+</span>
                Use &ldquo;{query.trim()}&rdquo; as new category
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
