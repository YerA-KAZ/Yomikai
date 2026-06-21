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
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
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
    setSelectedCardId(null);
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
    setSelectedCardId(selectedCardId === char.id ? null : char.id);
    setSelectedChar(char);
  };

  const getGroupColorClass = (index: number) => {
    const colors = [
      'border-blue-500/40 bg-blue-500/5',
      'border-emerald-500/40 bg-emerald-500/5',
      'border-amber-500/40 bg-amber-500/5',
      'border-purple-500/40 bg-purple-500/5',
      'border-rose-500/40 bg-rose-500/5',
      'border-indigo-500/40 bg-indigo-500/5',
      'border-cyan-500/40 bg-cyan-500/5',
      'border-orange-500/40 bg-orange-500/5',
      'border-teal-500/40 bg-teal-500/5',
      'border-pink-500/40 bg-pink-500/5',
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
                const isSelected = selectedCardId === char.id;
                const colorClass = getGroupColorClass(gIdx);
                
                return (
                  <div
                    key={char.id}
                    className="relative h-28 cursor-pointer select-none group"
                    onClick={() => handleCardClick(char)}
                  >
                    <div
                      className={`absolute inset-0 flex flex-col items-center justify-center p-3 rounded-3xl transition-all duration-300 ${
                        isSelected
                          ? 'bg-primary border border-primary shadow-lg shadow-primary/30 text-white scale-105 z-10'
                          : char.learned
                            ? 'border border-primary/40 bg-primary/10 shadow-[inset_0_0_10px_rgba(var(--theme-primary-rgb),0.1)] text-text'
                            : `border bg-surface/50 group-hover:border-primary/50 group-hover:bg-surface transition-colors ${colorClass} text-text`
                      }`}
                    >
                      {char.learned && !isSelected && (
                        <div className="absolute top-1.5 right-1.5 text-emerald-500 bg-emerald-500/10 p-0.5 rounded-full border border-emerald-500/20">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <span className={`text-4xl font-extrabold font-jp ${isSelected ? 'text-white' : ''}`}>{char.char}</span>
                      <span className={`text-[10px] font-black mt-1.5 uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>{char.romaji}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Slide-out / Bottom Panel */}
      <AnimatePresence>
        {selectedCardId && selectedChar && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-[500px] lg:w-[600px] glass border border-glass-border p-6 md:p-8 rounded-[2.5rem] shadow-2xl z-30 flex flex-col gap-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className="bg-gradient-to-br from-primary to-accent text-white w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center font-extrabold font-jp text-5xl md:text-6xl shadow-xl shadow-primary/25">
                  {selectedChar.char}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl md:text-3xl font-black text-text uppercase tracking-widest">{selectedChar.romaji}</span>
                    <Badge variant={selectedChar.learned ? 'success' : 'default'} className="text-[11px] md:text-xs">
                      {selectedChar.learned ? 'Изучено' : 'В процессе'}
                    </Badge>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-text-muted uppercase tracking-wider">
                    Азбука: {activeTab === 'hiragana' ? 'Хирагана' : 'Катакана'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCardId(null)}
                className="text-text-muted hover:text-text bg-bg-secondary/60 hover:bg-bg-secondary p-2.5 rounded-full text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Example Words */}
            {selectedChar.examples && selectedChar.examples.length > 0 && (
              <div className="flex flex-col gap-3.5 mt-2 bg-bg-secondary/40 p-5 rounded-[2rem] border border-border/10">
                <span className="text-xs md:text-sm uppercase font-extrabold tracking-wider text-text-secondary flex items-center gap-2">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5" /> Примеры слов
                </span>
                <div className="flex flex-col gap-3">
                  {selectedChar.examples.map((ex, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:justify-between md:items-center text-sm group gap-1 md:gap-4 border-b border-border/5 last:border-0 pb-2 last:pb-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-extrabold font-jp text-lg md:text-xl text-text group-hover:text-primary transition-colors">{ex.word}</span>
                        <span className="text-xs md:text-sm text-text-secondary font-bold">({ex.reading})</span>
                      </div>
                      <span className="font-bold text-text-muted text-sm">{ex.meaning}</span>
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
