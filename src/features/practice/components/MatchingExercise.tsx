import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { KanjiChar } from '../../../entities/kanji/types';
import { PracticeShell } from './PracticeShell';
import { PracticeComplete } from './PracticeComplete';
import { buildRoundResult, usePracticeProgress } from '../usePracticeProgress';
import { shuffle } from '../utils';
import { cn } from '../../../shared/lib/cn';

const PAIR_COUNT = 6;

interface MatchingExerciseProps {
  sessionId: string;
  kanjiList: KanjiChar[];
}

type MatchItem = { id: string; label: string; side: 'kanji' | 'meaning'; pairId: string };

export const MatchingExercise: React.FC<MatchingExerciseProps> = ({ sessionId, kanjiList }) => {
  const navigate = useNavigate();
  const { recordAnswer } = usePracticeProgress(sessionId);
  const [roundKey, setRoundKey] = useState(0);

  const pairs = useMemo(
    () => shuffle(kanjiList).slice(0, Math.min(PAIR_COUNT, kanjiList.length)),
    [kanjiList, roundKey]
  );

  const { kanjiItems, meaningItems } = useMemo(() => {
    const kanjiSide: MatchItem[] = pairs.map((k) => ({
      id: `k-${k.id}`,
      label: k.char,
      side: 'kanji' as const,
      pairId: k.id,
    }));
    const meaningSide: MatchItem[] = pairs.map((k) => ({
      id: `m-${k.id}`,
      label: k.meaning,
      side: 'meaning' as const,
      pairId: k.id,
    }));
    return { kanjiItems: shuffle(kanjiSide), meaningItems: shuffle(meaningSide) };
  }, [pairs]);

  const [selectedKanji, setSelectedKanji] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ kanji: string; meaning: string } | null>(null);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const hasMoreInPool = kanjiList.length > PAIR_COUNT;

  const tryMatch = (kanjiId: string, meaningId: string) => {
    const kanjiItem = kanjiItems.find((i) => i.id === kanjiId);
    const meaningItem = meaningItems.find((i) => i.id === meaningId);
    if (!kanjiItem || !meaningItem) return;

    const isCorrect = kanjiItem.pairId === meaningItem.pairId;

    if (isCorrect) {
      recordAnswer(kanjiItem.pairId, true);
      setRoundCorrect((c) => c + 1);
      const newMatched = new Set([...matchedIds, kanjiItem.pairId]);
      setMatchedIds(newMatched);
      setSelectedKanji(null);
      setSelectedMeaning(null);

      if (newMatched.size >= pairs.length) {
        setTimeout(() => setFinished(true), 400);
      }
    } else {
      setWrongPair({ kanji: kanjiId, meaning: meaningId });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedKanji(null);
        setSelectedMeaning(null);
      }, 700);
    }
  };

  const handleKanjiClick = (id: string, pairId: string) => {
    if (matchedIds.has(pairId)) return;
    setSelectedKanji(id);
    if (selectedMeaning) tryMatch(id, selectedMeaning);
  };

  const handleMeaningClick = (id: string, pairId: string) => {
    if (matchedIds.has(pairId)) return;
    setSelectedMeaning(id);
    if (selectedKanji) tryMatch(selectedKanji, id);
  };

  const restart = () => {
    setRoundKey((k) => k + 1);
    setSelectedKanji(null);
    setSelectedMeaning(null);
    setMatchedIds(new Set());
    setWrongPair(null);
    setRoundCorrect(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <PracticeComplete
        result={buildRoundResult(roundCorrect, pairs.length)}
        onRetry={restart}
        onBack={() => navigate('/practice')}
        hasMore={hasMoreInPool}
        onContinue={restart}
      />
    );
  }

  const matchedCount = matchedIds.size;

  const renderTile = (item: MatchItem) => {
    const isMatched = matchedIds.has(item.pairId);
    const isKanji = item.side === 'kanji';
    const isSelected = isKanji ? selectedKanji === item.id : selectedMeaning === item.id;
    const isWrong =
      wrongPair &&
      ((isKanji && wrongPair.kanji === item.id) ||
        (!isKanji && wrongPair.meaning === item.id));

    return (
      <motion.button
        key={item.id}
        type="button"
        disabled={isMatched}
        onClick={() =>
          isKanji
            ? handleKanjiClick(item.id, item.pairId)
            : handleMeaningClick(item.id, item.pairId)
        }
        whileTap={isMatched ? undefined : { scale: 0.95 }}
        className={cn(
          'relative w-full min-h-[56px] sm:min-h-[64px] px-2 py-3 rounded-xl sm:rounded-2xl',
          'border-2 font-bold transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          isKanji ? 'font-jp text-2xl sm:text-3xl' : 'text-xs sm:text-sm leading-tight',
          isMatched && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 opacity-70',
          !isMatched && !isSelected && !isWrong && 'border-border/20 bg-surface hover:border-emerald-500/30',
          isSelected && !isMatched && 'border-emerald-500 bg-emerald-500/10 shadow-md shadow-emerald-500/10',
          isWrong && 'border-red-500 bg-red-500/10'
        )}
      >
        {item.label}
        {isMatched && <CheckCircle2 className="absolute top-1.5 right-1.5 w-4 h-4 text-emerald-500" />}
      </motion.button>
    );
  };

  return (
    <PracticeShell
      title="Сопоставление: Кандзи N5"
      subtitle="Выберите иероглиф и его значение"
      current={matchedCount}
      total={pairs.length}
      badge="漢字"
    >
      <div className="flex flex-col flex-1 gap-4 sm:gap-6">
        <p className="text-xs sm:text-sm text-text-secondary text-center font-medium px-2">
          Нажмите символ слева, затем значение справа
        </p>

        {/* Desktop: two columns side by side */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-4 flex-1">
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary px-1">
              Иероглифы
            </span>
            {kanjiItems.map(renderTile)}
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary px-1">
              Значения
            </span>
            {meaningItems.map(renderTile)}
          </div>
        </div>

        {/* Mobile: interleaved grid for easier thumb reach */}
        <div className="sm:hidden grid grid-cols-2 gap-2.5 flex-1 content-start">
          <span className="col-span-2 text-[10px] font-black uppercase tracking-wider text-text-secondary text-center">
            Иероглифы ↔ Значения
          </span>
          {Array.from({ length: Math.max(kanjiItems.length, meaningItems.length) }).map((_, i) => (
            <React.Fragment key={i}>
              {kanjiItems[i] && renderTile(kanjiItems[i])}
              {meaningItems[i] && renderTile(meaningItems[i])}
            </React.Fragment>
          ))}
        </div>
      </div>
    </PracticeShell>
  );
};
