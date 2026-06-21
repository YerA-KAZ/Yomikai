import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { KanaChar } from '../../../entities/kana/types';
import { Card } from '../../../shared/ui/Card';
import { PracticeShell } from './PracticeShell';
import { PracticeComplete } from './PracticeComplete';
import { buildRoundResult, usePracticeProgress } from '../usePracticeProgress';
import { pickDistractors, shuffle } from '../utils';
import { cn } from '../../../shared/lib/cn';

const ROUND_SIZE = 10;

interface WritingExerciseProps {
  sessionId: string;
  chars: KanaChar[];
}

export const WritingExercise: React.FC<WritingExerciseProps> = ({ sessionId, chars }) => {
  const navigate = useNavigate();
  const { recordAnswer } = usePracticeProgress(sessionId);
  const [roundKey, setRoundKey] = useState(0);

  const questions = useMemo(() => {
    const selected = shuffle(chars).slice(0, Math.min(ROUND_SIZE, chars.length));
    return selected.map((char) => {
      const distractors = pickDistractors(chars, char, 3, (c) => c.id);
      const options = shuffle([char, ...distractors]);
      return { char, options };
    });
  }, [chars, roundKey]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const hasMoreInPool = chars.length > ROUND_SIZE;

  const handleSelect = (charId: string) => {
    if (selected || !current) return;
    const isCorrect = charId === current.char.id;
    setSelected(charId);
    recordAnswer(current.char.id, isCorrect);
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

  const example = current.char.examples[0];

  return (
    <PracticeShell
      title="Письмо: Хирагана"
      subtitle="Выберите правильный символ для романji"
      current={index + 1}
      total={questions.length}
      badge="ひらがな"
    >
      <div className="flex flex-col items-center flex-1 gap-5 sm:gap-6 py-2">
        <Card className="w-full max-w-lg p-6 sm:p-8 text-center border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-600/5">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
            Какой символ соответствует
          </p>
          <span className="text-4xl sm:text-5xl font-black text-primary">{current.char.romaji}</span>
          {example && (
            <p className="text-sm text-text-secondary mt-3">
              Пример: <span className="font-jp text-text">{example.word}</span> — {example.meaning}
            </p>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg">
          <AnimatePresence mode="popLayout">
            {current.options.map((option) => {
              const isSelected = selected === option.id;
              const isCorrect = option.id === current.char.id;
              const showResult = selected !== null;

              return (
                <motion.button
                  key={option.id}
                  layout
                  type="button"
                  disabled={selected !== null}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    'relative flex items-center justify-center min-h-[80px] sm:min-h-[100px]',
                    'rounded-2xl border-2 font-jp text-4xl sm:text-5xl font-black',
                    'transition-all duration-200 active:scale-95',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                    !showResult && 'border-border/20 bg-surface hover:border-amber-500/40 hover:bg-amber-500/5',
                    showResult && isCorrect && 'border-emerald-500 bg-emerald-500/15 text-emerald-600',
                    showResult && isSelected && !isCorrect && 'border-red-500 bg-red-500/15 text-red-500',
                    showResult && !isSelected && !isCorrect && 'border-border/10 bg-surface/50 opacity-50'
                  )}
                >
                  {option.char}
                  {showResult && isCorrect && (
                    <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-emerald-500" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="absolute top-2 right-2 w-5 h-5 text-red-500" />
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
