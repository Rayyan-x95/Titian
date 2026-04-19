import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <motion.article
      layout
      transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn('ui-card', className)}
    >
      {children}
    </motion.article>
  );
}
