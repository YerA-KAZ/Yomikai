import { type ReactNode, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

type CardPadding = 'sm' | 'md' | 'lg' | 'none';
type CardVariant = 'default' | 'glass';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  children: ReactNode;
  padding?: CardPadding;
  variant?: CardVariant;
  hoverable?: boolean;
  delay?: number;
  className?: string;
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-surface border border-border shadow-md',
  glass: 'glass',
};

export function Card({
  children,
  padding = 'md',
  variant = 'default',
  hoverable = false,
  delay = 0,
  className,
  onClick,
  ...props
}: CardProps) {
  const hasExplicitPadding =
    typeof className === 'string' && /(?:^|\s)(?:p|px|py|pt|pr|pb|pl)-/.test(className);

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
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 15px rgba(var(--theme-primary-rgb), 0.15)',
              borderColor: 'rgba(var(--theme-primary-rgb), 0.3)',
              transition: { duration: 0.2 },
            }
          : undefined
      }
      onClick={onClick}
      className={cn(
        'rounded-3xl overflow-hidden transition-colors duration-300',
        variantClasses[variant],
        !hasExplicitPadding && paddingClasses[padding],
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
