import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, ArrowLeft } from 'lucide-react';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import type { RoundResult } from '../types';

interface PracticeCompleteProps {
  result: RoundResult;
  onRetry: () => void;
  onBack: () => void;
  hasMore?: boolean;
  onContinue?: () => void;
}

export const PracticeComplete: React.FC<PracticeCompleteProps> = ({
  result,
  onRetry,
  onBack,
  hasMore,
  onContinue,
}) => {
  const isGreat = result.accuracy >= 80;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center flex-1 py-6 sm:py-10"
    >
      <Card className="w-full max-w-md p-6 sm:p-8 flex flex-col items-center gap-5 sm:gap-6 text-center border border-border/20">
        <div
          className={`p-4 sm:p-5 rounded-full ${
            isGreat
              ? 'bg-emerald-500/15 text-emerald-500'
              : 'bg-amber-500/15 text-amber-500'
          }`}
        >
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-text">
            {isGreat ? 'Отлично!' : 'Раунд завершён'}
          </h2>
          <p className="text-text-secondary text-sm mt-2">
            {result.correct} из {result.total} правильных ответов
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-bg-secondary/60 border border-border/10 rounded-2xl p-4">
            <div className="text-2xl sm:text-3xl font-black text-primary">{result.accuracy}%</div>
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-1">
              Точность
            </div>
          </div>
          <div className="bg-bg-secondary/60 border border-border/10 rounded-2xl p-4">
            <div className="text-2xl sm:text-3xl font-black text-emerald-500">{result.correct}</div>
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-1">
              Верно
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button variant="secondary" size="md" className="w-full" onClick={onBack} iconBefore={<ArrowLeft className="w-4 h-4" />}>
            К практике
          </Button>
          {hasMore && onContinue ? (
            <Button variant="primary" size="md" className="w-full" onClick={onContinue}>
              Продолжить
            </Button>
          ) : (
            <Button variant="primary" size="md" className="w-full" onClick={onRetry} iconBefore={<RotateCcw className="w-4 h-4" />}>
              Ещё раз
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
