import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, BookOpen, ChevronRight } from 'lucide-react';
import { kanaApi } from '../services/api/kanaApi';
import { Card } from '../shared/ui/Card';
import { ProgressBar } from '../shared/ui/ProgressBar';
import { Badge } from '../shared/ui/Badge';
import type { KanaGroup, KanaChar } from '../entities/kana/types';

export const HiraganaPage: React.FC = () => {
  const [groups, setGroups] = useState<KanaGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<KanaChar | null>(null);

  useEffect(() => {
    kanaApi.getHiragana()
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const totalChars = groups.reduce((acc, g) => acc + g.chars.length, 0);
  const learnedChars = groups.reduce(
    (acc, g) => acc + g.chars.filter((c) => c.learned).length,
    0
  );

  const handleCardClick = (char: KanaChar) => {
    setFlippedCardId(flippedCardId === char.id ? null : char.id);
    setSelectedChar(char);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6 items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-text-muted font-bold text-sm">Загрузка азбуки Хирагана...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 relative">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/30 border border-border/10 p-5 rounded-3xl backdrop-blur-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-text">Хирагана</h1>
            <Badge variant="info" className="font-bold">ひらがな</Badge>
          </div>
          <p className="text-text-secondary text-sm font-medium mt-1">
            Слоговая азбука японского языка, используемая для суффиксов, грамматики и исконно японских слов.
          </p>
        </div>
        
        {/* Progress box */}
        <div className="flex flex-col w-full md:w-64 gap-1.5 flex-shrink-0 bg-bg-secondary/40 border border-border/5 p-3.5 rounded-2xl">
          <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
            <span>Прогресс изучения</span>
            <span className="text-primary">{learnedChars} / {totalChars}</span>
          </div>
          <ProgressBar value={learnedChars} max={totalChars} height="sm" />
        </div>
      </div>

      {/* Main Groups */}
      <div className="flex flex-col gap-8">
        {groups.map((group, gIdx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gIdx * 0.05 }}
            className="flex flex-col gap-3"
          >
            {/* Group Header */}
            <div className="flex items-baseline gap-2 border-b border-border/10 pb-2">
              <h2 className="text-lg font-extrabold text-text">{group.nameJp}</h2>
              <span className="text-xs font-bold text-text-muted uppercase">Ряд {group.name}</span>
            </div>

            {/* Characters Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-3.5">
              {group.chars.map((char) => {
                const isFlipped = flippedCardId === char.id;
                return (
                  <div
                    key={char.id}
                    className="relative h-28 cursor-pointer select-none perspective"
                    onClick={() => handleCardClick(char)}
                  >
                    {/* Card Inner Wrapper with 3D Flip */}
                    <motion.div
                      className="w-full h-full relative duration-500 preserve-3d"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                      {/* CARD FRONT */}
                      <Card
                        className={`absolute inset-0 flex flex-col items-center justify-center p-3 backface-hidden ${
                          char.learned
                            ? 'border-primary/30 bg-primary/5 dark:bg-primary/5 shadow-md shadow-primary/5'
                            : 'border-border/15 bg-surface/50'
                        }`}
                      >
                        {char.learned && (
                          <div className="absolute top-1.5 right-1.5 text-emerald-500 bg-emerald-500/10 p-0.5 rounded-full border border-emerald-500/20">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <span className="text-4xl font-extrabold font-jp text-text">{char.char}</span>
                        <span className="text-xs font-bold text-text-muted mt-1.5 uppercase">{char.romaji}</span>
                      </Card>

                      {/* CARD BACK */}
                      <Card
                        className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-bg-secondary rotate-y-180 backface-hidden border-primary/30 shadow-inner"
                      >
                        <span className="text-3xl font-black text-primary font-jp">{char.char}</span>
                        <span className="text-[10px] font-bold text-text-secondary mt-1 uppercase">Чтение</span>
                        <span className="text-sm font-black text-text capitalize mt-0.5">{char.romaji}</span>
                      </Card>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Slide-out / Bottom Panel */}
      <AnimatePresence>
        {flippedCardId && selectedChar && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 glass border border-glass-border p-5 rounded-3xl shadow-2xl z-30 flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold font-jp text-3xl shadow-md shadow-primary/20">
                  {selectedChar.char}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black text-text uppercase">{selectedChar.romaji}</span>
                    <Badge variant={selectedChar.learned ? 'success' : 'default'} className="text-[9px]">
                      {selectedChar.learned ? 'Изучено' : 'В процессе'}
                    </Badge>
                  </div>
                  <span className="text-xs text-text-muted mt-0.5">Азбука: Хирагана</span>
                </div>
              </div>
              <button
                onClick={() => setFlippedCardId(null)}
                className="text-text-muted hover:text-text bg-bg-secondary/60 hover:bg-bg-secondary p-1.5 rounded-full text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Example Words */}
            {selectedChar.examples && selectedChar.examples.length > 0 && (
              <div className="flex flex-col gap-2.5 mt-2 bg-bg-secondary/40 p-3.5 rounded-2xl border border-border/5">
                <span className="text-xs font-bold text-text-secondary flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Примеры слов
                </span>
                <div className="flex flex-col gap-2">
                  {selectedChar.examples.map((ex, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold font-jp text-sm text-text">{ex.word}</span>
                        <span className="text-[10px] text-text-secondary font-medium">({ex.reading})</span>
                      </div>
                      <span className="font-bold text-text-muted">{ex.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default HiraganaPage;
