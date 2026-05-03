import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'default' | 'outline' | 'danger' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-glow-blue hover:shadow-glow-blue/80 border-none',
  secondary: 'glass-panel bg-white/10 text-white border-white/20 hover:bg-white/20',
  ghost: 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white border-none shadow-none',
  default: 'glass-panel text-white border-white/10 hover:border-white/20',
  outline:
    'border-2 border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/20',
  danger:
    'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 shadow-glow-rose',
  glass: 'glass-panel hover:bg-white/10 text-slate-300 border-white/5 shadow-glow',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-8 text-base font-semibold',
};

export function Button({
  className,
  variant = 'default',
  size = 'md',
  type = 'button',
  children,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={loading ? {} : { scale: 1.005 }}
      whileTap={loading ? {} : { scale: 0.985 }}
      transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
      disabled={disabled || loading}
      className={cn(
        'ui-button inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner size="sm" className="border-t-current" />}
      {children}
    </motion.button>
  );
}
