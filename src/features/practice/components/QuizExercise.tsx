import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { DictionaryEntry } from '../../../entities/dictionary/types';
import { Card } from '../../../shared/ui/Card';
import { PracticeShell } from './PracticeShell';
import { PracticeComplete } from './PracticeComplete';
import { buildRoundResult, usePracticeProgress } from '../usePracticeProgress';
import { pickDistractors, shuffle } from '../utils';
import { cn } from '../../../shared/lib/cn';

const ROUND_SIZE = 10;

interface QuizExerciseProps {
  sessionId: string;
  entries: DictionaryEntry[];
}

export const QuizExercise: React.FC<QuizExerciseProps> = ({ sessionId, entries }) => {
  const navigate = useNavigate();
  const { recordAnswer } = usePracticeProgress(sessionId);
  const [roundKey, setRoundKey] = useState(0);

  const questions = useMemo(() => {
    const selected = shuffle(entries).slice(0, Math.min(ROUND_SIZE, entries.length));
    return selected.map((entry) => {
      const distractors = pickDistractors(entries, entry, 3, (e) => e.id);
      const options = shuffle([entry, ...distractors]);
      return { entry, options };
    });
  }, [entries, roundKey]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const hasMoreInPool = entries.length > ROUND_SIZE;

  const handleSelect = (entryId: string) => {
    if (selected || !current) return;
    const isCorrect = entryId === current.entry.id;
    setSelected(entryId);
    recordAnswer(current.entry.id, isCorrect);
    if (isCorrect) setRoundCorrect((c) => c + 1);

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 900);
  };

  const restart = () => {
    setRoundKey((k) => k + 1);
    setIndex(0);
    setSelected(null);
    setRoundCorrect(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <PracticeComplete
        result={buildRoundResult(roundCorrect, questions.length)}
        onRetry={restart}
        onBack={() => navigate('/practice')}
        hasMore={hasMoreInPool}
        onContinue={restart}
      />
    );
  }

  if (!current) return null;

  return (
    <PracticeShell
      title="Викторина: Словарь N5"
      subtitle="Выберите правильный перевод"
      current={index + 1}
      total={questions.length}
      badge="語彙"
    >
      <div className="flex flex-col items-center flex-1 gap-5 sm:gap-6 py-2">
        <Card className="w-full max-w-lg p-6 sm:p-8 text-center border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
            Что означает это слово?
          </p>
          <span className="font-jp text-3xl sm:text-4xl font-black text-text block">
            {current.entry.word}
          </span>
          <span className="text-sm text-primary font-bold mt-2 block">{current.entry.reading}</span>
          <span className="text-[10px] text-text-secondary mt-2 inline-block bg-surface/60 px-2 py-0.5 rounded-md border border-border/10">
            {current.entry.partOfSpeech}
          </span>
        </Card>

        <div className="flex flex-col gap-2.5 sm:gap-3 w-full max-w-lg">
          <AnimatePresence mode="popLayout">
            {current.options.map((option, optIdx) => {
              const isSelected = selected === option.id;
              const isCorrect = option.id === current.entry.id;
              const showResult = selected !== null;

              return (
                <motion.button
                  key={option.id}
                  layout
                  type="button"
                  disabled={selected !== null}
                  onClick={() => handleSelect(option.id)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: optIdx * 0.05 }}
                  className={cn(
                    'relative w-full text-left px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl',
                    'border-2 font-medium text-sm sm:text-base transition-all duration-200',
                    'active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                    !showResult && 'border-border/20 bg-surface hover:border-purple-500/40 hover:bg-purple-500/5',
                    showResult && isCorrect && 'border-emerald-500 bg-emerald-500/15 text-emerald-700',
                    showResult && isSelected && !isCorrect && 'border-red-500 bg-red-500/15 text-red-600',
                    showResult && !isSelected && !isCorrect && 'border-border/10 bg-surface/50 opacity-50'
                  )}
                >
                  <span className="pr-8">{option.meaning}</span>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-emerald-500" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-red-500" />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </PracticeShell>
  );
};
