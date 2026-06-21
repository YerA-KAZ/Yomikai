import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, BookOpen } from 'lucide-react';
import { kanaApi } from '../services/api/kanaApi';
import { Card } from '../shared/ui/Card';
import { ProgressBar } from '../shared/ui/ProgressBar';
import { Badge } from '../shared/ui/Badge';
import type { KanaGroup, KanaChar } from '../entities/kana/types';

interface AlphabetPageProps {
  defaultTab?: 'hiragana' | 'katakana';
}

export const AlphabetPage: React.FC<AlphabetPageProps> = ({ defaultTab }) => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  
  // Determine initial tab based on route param or prop, default to 'hiragana'
  const initialTab = (tab === 'katakana' || tab === 'hiragana') 
    ? tab 
    : (defaultTab || 'hiragana');

  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>(initialTab);
  const [groups, setGroups] = useState<KanaGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<KanaChar | null>(null);

  // Sync state if URL path parameter changes
  useEffect(() => {
    if (tab === 'katakana' || tab === 'hiragana') {
      setActiveTab(tab);
    }
  }, [tab]);

  // Fetch data dynamically based on active tab
  useEffect(() => {
    setLoading(true);
    setFlippedCardId(null);
    setSelectedChar(null);

    const fetchPromise = activeTab === 'hiragana' 
      ? kanaApi.getHiragana() 
      : kanaApi.getKatakana();

    fetchPromise
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeTab]);

  const totalChars = groups.reduce((acc, g) => acc + g.chars.length, 0);
  const learnedChars = groups.reduce(
    (acc, g) => acc + g.chars.filter((c) => c.learned).length,
    0
  );

  const handleTabChange = (newTab: 'hiragana' | 'katakana') => {
    setActiveTab(newTab);
    navigate(`/alphabet/${newTab}`, { replace: true });
  };

  const handleCardClick = (char: KanaChar) => {
    setFlippedCardId(flippedCardId === char.id ? null : char.id);
    setSelectedChar(char);
  };

  const getGroupColorClass = (index: number) => {
    const colors = [
      'border-blue-500/20 bg-blue-500/5',
      'border-emerald-500/20 bg-emerald-500/5',
      'border-amber-500/20 bg-amber-500/5',
      'border-purple-500/20 bg-purple-500/5',
      'border-rose-500/20 bg-rose-500/5',
      'border-indigo-500/20 bg-indigo-500/5',
      'border-cyan-500/20 bg-cyan-500/5',
      'border-orange-500/20 bg-orange-500/5',
      'border-teal-500/20 bg-teal-500/5',
      'border-pink-500/20 bg-pink-500/5',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6 w-full">
        {/* Header Skeleton */}
        <div className="h-[120px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
        
        {/* Grid Skeleton */}
        <div className="flex flex-col gap-8">
          {[1, 2, 3].map((g) => (
            <div key={g} className="flex flex-col gap-3">
              <div className="h-8 w-32 bg-surface/50 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-3.5">
                {[1, 2, 3, 4, 5].map((c) => (
                  <div key={c} className="h-28 bg-surface/50 rounded-3xl relative overflow-hidden border border-border/5">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 relative">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-5 rounded-3xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-text drop-shadow-sm">
              {activeTab === 'hiragana' ? 'Хирагана' : 'Катакана'}
            </h1>
            <Badge 
              variant={activeTab === 'hiragana' ? 'info' : 'warning'} 
              className="font-bold"
            >
              {activeTab === 'hiragana' ? 'ひらがな' : 'カタカナ'}
            </Badge>
          </div>
          <p className="text-text-secondary text-sm font-medium mt-1">
            {activeTab === 'hiragana' 
              ? 'Слоговая азбука японского языка, используемая для суффиксов, грамматики и исконно японских слов.'
              : 'Слоговая азбука японского языка, используемая для заимствованных слов, названий и звукоподражаний.'}
          </p>
        </div>
        
        <div className="w-full md:w-72 flex-shrink-0">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-bg-secondary/60 border border-border/10 p-1.5 rounded-2xl relative">
            <button
              onClick={() => handleTabChange('hiragana')}
              className={`rounded-xl py-2 text-center text-xs font-black transition-all relative z-10 whitespace-nowrap ${
                activeTab === 'hiragana' ? 'text-white' : 'text-text-secondary hover:text-text'
              }`}
            >
              Хирагана
              {activeTab === 'hiragana' && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                  layoutId="activeKanaTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </button>
            <button
              onClick={() => handleTabChange('katakana')}
              className={`rounded-xl py-2 text-center text-xs font-black transition-all relative z-10 whitespace-nowrap ${
                activeTab === 'katakana' ? 'text-white' : 'text-text-secondary hover:text-text'
              }`}
            >
              Катакана
              {activeTab === 'katakana' && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                  layoutId="activeKanaTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          </div>
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
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Ряд {group.name}</span>
            </div>

            {/* Characters Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-3.5">
              {group.chars.map((char) => {
                const isFlipped = flippedCardId === char.id;
                const colorClass = getGroupColorClass(gIdx);
                
                return (
                  <div
                    key={char.id}
                    className="relative h-28 cursor-pointer select-none perspective group"
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
                            ? 'border-primary/30 bg-primary/10 shadow-[inset_0_0_10px_rgba(var(--theme-primary-rgb),0.1)]'
                            : `border-border/15 bg-surface/50 group-hover:border-primary/30 group-hover:bg-surface transition-colors ${colorClass}`
                        }`}
                      >
                        {char.learned && (
                          <div className="absolute top-1.5 right-1.5 text-emerald-500 bg-emerald-500/10 p-0.5 rounded-full border border-emerald-500/20">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <span className="text-4xl font-extrabold font-jp text-text">{char.char}</span>
                        <span className="text-[10px] font-black text-text-muted mt-1.5 uppercase tracking-wider">{char.romaji}</span>
                      </Card>

                      {/* CARD BACK */}
                      <Card
                        className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-gradient-to-br from-primary to-accent rotate-y-180 backface-hidden border-transparent shadow-lg text-white"
                      >
                        <span className="text-3xl font-black font-jp">{char.char}</span>
                        <span className="text-[9px] font-bold text-white/70 mt-1 uppercase tracking-widest">Чтение</span>
                        <span className="text-sm font-black capitalize mt-0.5">{char.romaji}</span>
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
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 glass border border-glass-border p-5 rounded-3xl shadow-2xl z-30 flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary to-accent text-white w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold font-jp text-3xl shadow-lg shadow-primary/25">
                  {selectedChar.char}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black text-text uppercase tracking-widest">{selectedChar.romaji}</span>
                    <Badge variant={selectedChar.learned ? 'success' : 'default'} className="text-[9px]">
                      {selectedChar.learned ? 'Изучено' : 'В процессе'}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted mt-0.5 uppercase tracking-wider">
                    Азбука: {activeTab === 'hiragana' ? 'Хирагана' : 'Катакана'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setFlippedCardId(null)}
                className="text-text-muted hover:text-text bg-bg-secondary/60 hover:bg-bg-secondary p-1.5 rounded-full text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Example Words */}
            {selectedChar.examples && selectedChar.examples.length > 0 && (
              <div className="flex flex-col gap-2.5 mt-2 bg-bg-secondary/40 p-3.5 rounded-2xl border border-border/10">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-text-secondary flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Примеры слов
                </span>
                <div className="flex flex-col gap-2">
                  {selectedChar.examples.map((ex, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs group">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold font-jp text-sm text-text group-hover:text-primary transition-colors">{ex.word}</span>
                        <span className="text-[10px] text-text-secondary font-bold">({ex.reading})</span>
                      </div>
                      <span className="font-bold text-text-muted text-[11px]">{ex.meaning}</span>
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

export default AlphabetPage;
