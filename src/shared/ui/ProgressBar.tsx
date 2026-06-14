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
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
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

  // Determine color based on completion percentage
  let colorClass = 'from-primary via-accent to-primary-light';
  if (percentage >= 100) {
    colorClass = 'from-emerald-500 via-emerald-400 to-emerald-300';
  } else if (percentage >= 75) {
    colorClass = 'from-amber-500 via-amber-400 to-amber-300';
  }

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-bold text-text-secondary">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-black text-text">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden relative',
          'bg-bg-secondary border border-border/5',
          heightClasses[height]
        )}
      >
        <motion.div
          className={cn(
            'absolute top-0 bottom-0 left-0 rounded-full',
            'bg-gradient-to-r shadow-sm',
            colorClass
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[200%] animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
