import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { KanaChar } from '../../../entities/kana/types';
import { Button } from '../../../shared/ui/Button';
import { PracticeShell } from './PracticeShell';
import { PracticeComplete } from './PracticeComplete';
import { buildRoundResult, usePracticeProgress } from '../usePracticeProgress';
import { shuffle } from '../utils';

const ROUND_SIZE = 10;

interface FlashcardsExerciseProps {
  sessionId: string;
  chars: KanaChar[];
}

export const FlashcardsExercise: React.FC<FlashcardsExerciseProps> = ({ sessionId, chars }) => {
  const navigate = useNavigate();
  const { recordAnswer } = usePracticeProgress(sessionId);
  const [roundKey, setRoundKey] = useState(0);

  const deck = useMemo(
    () => shuffle(chars).slice(0, Math.min(ROUND_SIZE, chars.length)),
    [chars, roundKey]
  );

  const [index, setIndex] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [currentFlipped, setCurrentFlipped] = useState(false);

  const current = deck[index];
  const hasMoreInPool = chars.length > ROUND_SIZE;

  // Хэндлер ответа — только запись и переход к следующей карточке
  const handleAnswer = (known: boolean) => {
    if (!current) return;
    recordAnswer(current.id, known);
    if (known) setRoundCorrect((c) => c + 1);

    if (index + 1 >= deck.length) {
      setFinished(true);
    } else {
      setIndex(prev => prev + 1);
      // Флаг переворота для новой карточки сбросится, потому что при новом index
      // компонент Flashcard будет создан заново (key={index}) и начнёт с flipped = false
    }
  };

  const restart = () => {
    setRoundKey(prev => prev + 1);
    setIndex(0);
    setRoundCorrect(0);
    setFinished(false);
    setCurrentFlipped(false);
  };

  // ---- Внутренний компонент карточки с собственным состоянием flipped ----
  const Flashcard = React.memo(({ 
    char, 
    romaji, 
    type,
    onFlipChange 
  }: { 
    char: string; 
    romaji: string; 
    type: string;
    onFlipChange: (flipped: boolean) => void;
  }) => {
    const [flipped, setFlipped] = useState(false);

    const handleClick = () => {
      const newState = !flipped;
      setFlipped(newState);
      onFlipChange(newState);
    };

    return (
      <button
        type="button"
        className="w-full max-w-sm sm:max-w-md perspective-1000 focus:outline-none"
        onClick={handleClick}
        aria-label={flipped ? "Показать ответ" : "Показать символ"}
      >
        <motion.div
          className="relative w-full aspect-[4/3] preserve-3d"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Передняя сторона: только символ */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl shadow-2xl p-6 border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="font-jp text-7xl sm:text-8xl font-black text-text drop-shadow-sm">
              {char}
            </span>
            <span className="text-xs text-text-secondary mt-4 font-bold uppercase tracking-wider">
              Нажмите, чтобы перевернуть
            </span>
          </div>

          {/* Задняя сторона: чтение и тип */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl shadow-2xl p-6 border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-blue-600/10 backface-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-4xl sm:text-5xl font-black text-primary">{romaji}</span>
            <p className="text-sm text-text-secondary mt-3 uppercase tracking-wide">
              {type === "katakana" ? "Katakana" : "Hiragana"}
            </p>
          </div>
        </motion.div>
      </button>
    );
  });
  // ------------------------------------------------------------

  if (finished) {
    return (
      <PracticeComplete
        result={buildRoundResult(roundCorrect, deck.length)}
        onRetry={restart}
        onBack={() => navigate("/practice")}
        hasMore={hasMoreInPool}
        onContinue={restart}
      />
    );
  }

  if (!current) return null;

  return (
    <PracticeShell
      title="Флеш-карты: Катакана"
      subtitle="Нажмите на карточку, чтобы перевернуть"
      current={index + 1}
      total={deck.length}
      badge="カタカナ"
    >
      <div className="flex flex-col items-center justify-center flex-1 gap-5 sm:gap-8 py-2">
        {/* Ключ index — заставляет React пересоздавать карточку при смене символа */}
        <Flashcard
          key={index}
          char={current.char}
          romaji={current.romaji}
          type={current.type}
          onFlipChange={setCurrentFlipped}
        />

        <AnimatePresence mode="wait">
          {currentFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-2 gap-3 w-full max-w-sm sm:max-w-md"
            >
              <Button
                variant="danger"
                size="lg"
                onClick={() => handleAnswer(false)}
                iconBefore={<X className="w-5 h-5" />}
              >
                Не знаю
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600"
                onClick={() => handleAnswer(true)}
                iconBefore={<Check className="w-5 h-5" />}
              >
                Знаю
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PracticeShell>
  );
};