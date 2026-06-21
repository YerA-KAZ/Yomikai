import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { ProgressBar } from '../../../shared/ui/ProgressBar';
import { Badge } from '../../../shared/ui/Badge';

interface PracticeShellProps {
  title: string;
  subtitle?: string;
  current: number;
  total: number;
  badge?: string;
  children: React.ReactNode;
}

export const PracticeShell: React.FC<PracticeShellProps> = ({
  title,
  subtitle,
  current,
  total,
  badge,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:gap-6 py-2 sm:py-4 w-full min-h-[calc(100vh-120px)]">
      <div className="flex flex-col gap-3 glass border border-border/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 mt-0.5 px-2.5"
            onClick={() => navigate('/practice')}
            aria-label="Назад к практике"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-text truncate">{title}</h1>
              {badge && <Badge variant="info" className="font-bold shrink-0">{badge}</Badge>}
            </div>
            {subtitle && (
              <p className="text-text-secondary text-xs sm:text-sm font-medium mt-1">{subtitle}</p>
            )}
          </div>
          <span className="text-xs font-black text-text-secondary bg-bg-secondary/60 px-2.5 py-1 rounded-lg border border-border/10 shrink-0">
            {current} / {total}
          </span>
        </div>
        <ProgressBar value={current} max={total} height="sm" />
      </div>

      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};
