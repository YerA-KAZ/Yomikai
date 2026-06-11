import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

type ProgressBarHeight = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  height?: ProgressBarHeight;
  className?: string;
}

const heightClasses: Record<ProgressBarHeight, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  height = 'md',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-text-secondary">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-text">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          'bg-bg-secondary',
          heightClasses[height]
        )}
      >
        <motion.div
          className={cn(
            'h-full rounded-full',
            'bg-gradient-to-r from-primary via-accent to-primary-light',
            'shadow-[0_0_8px_rgba(var(--theme-primary),0.4)]'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>
    </div>
  );
}
