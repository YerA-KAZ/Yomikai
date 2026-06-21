import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse-subtle',
  error: 'bg-red-500/10 text-red-600 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20 animate-pulse-subtle',
};

export function Badge({
  variant = 'default',
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'rounded-full border',
        'max-w-full whitespace-nowrap',
        'px-3 py-1 text-xs font-bold tracking-wide',
        variantClasses[variant],
        className
      )}
    >
      {icon && <span className="shrink-0 [&>svg]:size-3.5">{icon}</span>}
      {children}
    </span>
  );
}
