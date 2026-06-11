import { type ReactNode, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

type CardPadding = 'sm' | 'md' | 'lg';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  children: ReactNode;
  padding?: CardPadding;
  hoverable?: boolean;
  delay?: number;
  className?: string;
}

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  padding = 'md',
  hoverable = false,
  delay = 0,
  className,
  onClick,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={
        hoverable
          ? {
              y: -4,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              transition: { duration: 0.2 },
            }
          : undefined
      }
      onClick={onClick}
      className={cn(
        'rounded-3xl',
        'bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg',
        'dark:bg-white/5 dark:border-white/10 dark:shadow-xl',
        paddingClasses[padding],
        hoverable && 'cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
