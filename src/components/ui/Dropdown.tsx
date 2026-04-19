import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface DropdownOption<T extends string> {
  label: string;
  value: T;
}

interface DropdownProps<T extends string> {
  label: string;
  value: T;
  options: Array<DropdownOption<T>>;
  onChange: (value: T) => void;
  className?: string;
}

export function Dropdown<T extends string>({ label, value, options, onChange, className }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointer = (event: PointerEvent) => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      if (!root.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setOpen(false);
      buttonRef.current?.focus();
    };

    window.addEventListener('pointerdown', handlePointer);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('pointerdown', handlePointer);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    const index = Math.max(0, options.findIndex((option) => option.value === value));
    setActiveIndex(index);
  }, [options, value]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        className="ui-button ui-button-secondary h-12 w-full min-w-44 flex items-center justify-between rounded-xl px-4"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className="flex flex-col items-start text-left">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
          <span className="text-sm font-semibold text-foreground">{selected?.label ?? ''}</span>
        </span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            className="ui-surface absolute right-0 top-[calc(100%+0.5rem)] z-40 min-w-44 overflow-hidden rounded-xl border border-border/70 p-1 shadow-2xl"
            role="listbox"
            tabIndex={-1}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveIndex((index) => Math.min(options.length - 1, index + 1));
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex((index) => Math.max(0, index - 1));
              }

              if (event.key === 'Enter') {
                event.preventDefault();
                const option = options[activeIndex];

                if (option) {
                  onChange(option.value);
                  setOpen(false);
                  buttonRef.current?.focus();
                }
              }
            }}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                    isSelected || activeIndex === index
                      ? 'bg-primary/15 text-primary'
                      : 'text-foreground hover:bg-secondary/70',
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    buttonRef.current?.focus();
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
