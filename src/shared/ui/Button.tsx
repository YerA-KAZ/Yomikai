import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-gradient-to-r from-primary to-accent text-white',
    'shadow-lg shadow-primary/25',
    'hover:shadow-xl hover:shadow-primary/30',
    'disabled:from-primary/50 disabled:to-accent/50 disabled:shadow-none'
  ),
  secondary: cn(
    'bg-glass backdrop-blur-xl border border-glass-border',
    'text-text hover:bg-surface-hover',
    'disabled:opacity-50'
  ),
  ghost: cn(
    'bg-transparent text-text-secondary',
    'hover:bg-surface-hover hover:text-text',
    'disabled:opacity-50'
  ),
  danger: cn(
    'bg-gradient-to-r from-red-500 to-red-600 text-white',
    'shadow-lg shadow-red-500/25',
    'hover:shadow-xl hover:shadow-red-500/30',
    'disabled:from-red-500/50 disabled:to-red-600/50 disabled:shadow-none'
  ),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconBefore,
  iconAfter,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-2xl font-semibold',
        'transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
        'cursor-pointer disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
      ) : iconBefore ? (
        <span className="shrink-0">{iconBefore}</span>
      ) : null}
      <span>{children}</span>
      {!loading && iconAfter && <span className="shrink-0">{iconAfter}</span>}
    </motion.button>
  );
}
