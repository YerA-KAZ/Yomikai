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
    'hover:shadow-[0_8px_20px_rgba(var(--theme-primary-rgb),0.3)] border border-transparent',
    'disabled:from-primary/50 disabled:to-accent/50 disabled:shadow-none'
  ),
  secondary: cn(
    'bg-surface backdrop-blur-xl border border-border/50 shadow-sm',
    'text-text hover:bg-surface-hover hover:border-primary/30',
    'disabled:opacity-50'
  ),
  ghost: cn(
    'bg-transparent text-text-secondary border border-transparent',
    'hover:bg-primary/10 hover:text-primary hover:border-primary/20',
    'disabled:opacity-50'
  ),
  danger: cn(
    'bg-gradient-to-r from-red-500 to-red-600 text-white',
    'shadow-lg shadow-red-500/25 border border-transparent',
    'hover:shadow-[0_8px_20px_rgba(239,68,68,0.3)]',
    'disabled:from-red-500/50 disabled:to-red-600/50 disabled:shadow-none'
  ),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5 rounded-xl',
  md: 'px-6 py-3 text-base gap-2 rounded-2xl',
  lg: 'px-8 py-4 text-lg gap-2.5 rounded-2xl',
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
      whileTap={isDisabled ? undefined : { scale: 0.95 }}
      className={cn(
        'inline-flex items-center justify-center relative overflow-hidden',
        'max-w-full whitespace-nowrap',
        'font-bold transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
        'cursor-pointer disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* Soft overlay on hover */}
      <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors pointer-events-none" />
      
      {loading ? (
        <Loader2 className="animate-spin shrink-0 relative z-10" size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
      ) : iconBefore ? (
        <span className="shrink-0 relative z-10">{iconBefore}</span>
      ) : null}
      <span className="relative z-10 inline-flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap">{children}</span>
      {!loading && iconAfter && <span className="shrink-0 relative z-10">{iconAfter}</span>}
    </motion.button>
  );
}
