import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Layers, Edit3, GraduationCap } from 'lucide-react';
import { kanjiApi } from '../services/api/kanjiApi';
import { Card } from '../shared/ui/Card';
import { Badge } from '../shared/ui/Badge';
import { KanjiStudyOverlay } from '../features/study/KanjiStudyOverlay';
import type { KanjiChar } from '../entities/kanji/types';

export const KanjiPage: React.FC = () => {
  const [kanjiList, setKanjiList] = useState<KanjiChar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevel, setActiveLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [selectedKanji, setSelectedKanji] = useState<KanjiChar | null>(null);
  const [studyKanji, setStudyKanji] = useState<KanjiChar | null>(null);

  useEffect(() => {
    kanjiApi.getAll()
      .then((data) => {
        setKanjiList(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Filtering kanji
  const filteredKanji = kanjiList.filter((k) => {
    const matchesLevel = k.jlptLevel === activeLevel;
    const matchesSearch =
      k.char.includes(searchQuery) ||
      k.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.onyomi.some((o) => o.includes(searchQuery)) ||
      k.kunyomi.some((ku) => ku.includes(searchQuery));
    return matchesLevel && (searchQuery ? matchesSearch : true);
  });

  const learnedCount = kanjiList.filter((k) => k.learned).length;
  const totalCount = kanjiList.length;

  const levels: ('N5' | 'N4' | 'N3' | 'N2' | 'N1')[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

  const handleStudyFinish = async (kanjiId: string, xpEarned: number) => {
    await kanjiApi.markLearned(kanjiId, xpEarned);
    setKanjiList((items) => items.map((item) => item.id === kanjiId ? { ...item, learned: true } : item));
    setSelectedKanji((current) => current?.id === kanjiId ? { ...current, learned: true } : current);
  };

  const handleNextKanji = () => {
    if (!studyKanji) return;
    const currentIndex = filteredKanji.findIndex((item) => item.id === studyKanji.id);
    const nextKanji = filteredKanji[currentIndex + 1];
    if (nextKanji) {
      setStudyKanji(nextKanji);
      setSelectedKanji(nextKanji);
      return;
    }
    setStudyKanji(null);
    setSelectedKanji(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6 w-full">
        {/* Header Skeleton */}
        <div className="h-[120px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
        
        {/* Filters Skeleton */}
        <div className="h-12 w-full max-w-lg bg-surface/50 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-40 bg-surface/50 rounded-3xl relative overflow-hidden border border-border/5">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
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
            <h1 className="text-3xl font-extrabold text-text drop-shadow-sm">Кандзи</h1>
            <Badge variant="warning" className="font-bold">漢字</Badge>
          </div>
          <p className="text-text-secondary text-sm font-medium mt-1">
            Китайские иероглифы, используемые в японской письменности для обозначения понятий, корней слов.
          </p>
        </div>
      </div>

      {/* Level Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Levels */}
        <div className="flex bg-surface/60 backdrop-blur-md p-1.5 rounded-2xl border border-border/20 w-full md:w-auto overflow-x-auto whitespace-nowrap shadow-sm">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setActiveLevel(lvl);
                setSelectedKanji(null);
              }}
              className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeLevel === lvl
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 scale-105'
                  : 'text-text-muted hover:text-text hover:bg-bg-secondary'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Поиск иероглифа или значения..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/60 backdrop-blur-md border border-border/20 py-3 pl-11 pr-4 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-text placeholder:text-text-muted/60 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredKanji.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-surface/20 rounded-3xl border border-dashed border-border/40 gap-3">
          <div className="p-4 bg-bg-secondary/50 rounded-full mb-2">
            <Search className="w-8 h-8 text-text-muted/50" />
          </div>
          <span className="text-text-muted font-bold text-base">Ничего не найдено</span>
          {activeLevel !== 'N5' ? (
            <span className="text-xs text-text-secondary max-w-sm">
              Уровень {activeLevel} находится в разработке. Перейдите на уровень <b className="text-text">N5</b> для тестирования.
            </span>
          ) : (
            <span className="text-xs text-text-secondary">Попробуйте изменить запрос поиска.</span>
          )}
        </div>
      )}

      {/* Kanji Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredKanji.map((k, idx) => (
          <motion.div
            key={k.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.02, type: 'spring', stiffness: 200 }}
          >
            <Card
              hoverable
              onClick={() => setSelectedKanji(k)}
              className={`p-4 flex flex-col items-center justify-between h-40 cursor-pointer relative overflow-hidden group ${
                selectedKanji?.id === k.id
                  ? 'border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/30 bg-primary/5'
                  : k.learned
                  ? 'border-emerald-500/30 bg-emerald-500/5 shadow-sm'
                  : 'border-border/15 bg-surface/60 hover:bg-surface hover:border-primary/30'
              }`}
            >
              {/* Decorative background kanji character */}
              <span className="absolute -right-4 -bottom-4 text-7xl font-black font-jp text-text-muted/5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                {k.char}
              </span>

              {/* Stroke count indicator */}
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-extrabold text-text-muted bg-bg-secondary/80 px-1.5 py-0.5 rounded-md border border-border/20 backdrop-blur-sm">
                <Edit3 className="w-2.5 h-2.5" />
                {k.strokeCount}
              </div>

              <span className="text-5xl font-black font-jp text-text mt-3 drop-shadow-sm group-hover:text-primary transition-colors">{k.char}</span>
              <div className="flex flex-col items-center text-center mt-auto w-full z-10 bg-surface/80 backdrop-blur-sm py-1 px-2 rounded-xl border border-border/5">
                <span className="text-sm font-bold text-text truncate w-full group-hover:text-primary transition-colors">{k.meaning}</span>
                <span className="text-[10px] text-text-muted truncate w-full capitalize mt-0.5 font-bold tracking-wider">
                  {k.kunyomi[0] || k.onyomi[0] || ''}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detail Sliding Drawer */}
      <AnimatePresence>
        {selectedKanji && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[400px] glass border border-glass-border p-6 rounded-3xl shadow-2xl z-30 flex flex-col gap-5 text-text"
          >
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center font-black font-jp text-4xl shadow-lg shadow-amber-500/30">
                  {selectedKanji.char}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-text">{selectedKanji.meaning}</span>
                    <Badge variant="warning" className="text-[9px] font-black tracking-widest">JLPT {selectedKanji.jlptLevel}</Badge>
                  </div>
                  <span className="text-xs text-text-muted mt-1 flex items-center gap-2 font-bold bg-bg-secondary/50 py-1 px-2 rounded-lg border border-border/10 inline-flex w-fit">
                    <span className="flex items-center gap-1 text-primary"><Edit3 className="w-3.5 h-3.5" /> {selectedKanji.strokeCount} черт</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1 text-accent"><Layers className="w-3.5 h-3.5" /> Ключ: {selectedKanji.radical}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedKanji(null)}
                className="text-text-muted hover:text-text bg-bg-secondary/60 hover:bg-bg-secondary p-1.5 rounded-full text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Readings breakdown */}
            <div className="flex flex-col gap-3.5 bg-bg-secondary/40 p-4 rounded-2xl border border-border/10 text-xs shadow-sm">
              {/* Kun'yomi */}
              <div className="flex flex-col gap-1.5">
                <span className="font-extrabold text-text-secondary text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-blue-400" /> Кунъёми (Японское чтение)
                </span>
                <span className="font-black text-text font-jp text-[15px] bg-surface py-1.5 px-3 rounded-xl border border-border/5">
                  {selectedKanji.kunyomi.join('、 ') || '—'}
                </span>
              </div>
              {/* On'yomi */}
              <div className="flex flex-col gap-1.5 border-t border-border/10 pt-3">
                <span className="font-extrabold text-text-secondary text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-amber-400" /> Онъёми (Китайское чтение)
                </span>
                <span className="font-black text-primary font-jp text-[15px] bg-surface py-1.5 px-3 rounded-xl border border-border/5">
                  {selectedKanji.onyomi.join('、 ') || '—'}
                </span>
              </div>
            </div>

            {/* Examples */}
            {selectedKanji.examples && selectedKanji.examples.length > 0 && (
              <div className="flex flex-col gap-2.5 bg-bg-secondary/40 p-4 rounded-2xl border border-border/10 text-xs shadow-sm">
                <span className="font-extrabold text-text-secondary flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-primary" /> Употребление в словах
                </span>
                <div className="flex flex-col gap-2.5 mt-1">
                  {selectedKanji.examples.map((ex, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-border/5 pb-2 last:border-b-0 last:pb-0 group">
                      <div className="flex items-baseline gap-2">
                        <span className="font-black font-jp text-sm text-text group-hover:text-primary transition-colors">{ex.word}</span>
                        <span className="text-[10px] text-text-secondary font-bold bg-surface px-1.5 py-0.5 rounded-md border border-border/5">
                          {ex.reading}
                        </span>
                      </div>
                      <span className="font-extrabold text-text-muted text-[11px]">{ex.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setStudyKanji(selectedKanji)}
              className="w-full bg-primary text-white font-extrabold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              <GraduationCap className="w-5 h-5" />
              Изучить
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {studyKanji && (
          <KanjiStudyOverlay
            key={studyKanji.id}
            kanji={studyKanji}
            allKanji={kanjiList}
            onClose={() => setStudyKanji(null)}
            onFinish={handleStudyFinish}
            onNextKanji={handleNextKanji}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
export default KanjiPage;
