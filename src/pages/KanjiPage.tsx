import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Layers, Sparkles } from 'lucide-react';
import { kanjiApi } from '../services/api/kanjiApi';
import { Card } from '../shared/ui/Card';
import { Badge } from '../shared/ui/Badge';
import { ProgressBar } from '../shared/ui/ProgressBar';
import type { KanjiChar } from '../entities/kanji/types';

export const KanjiPage: React.FC = () => {
  const [kanjiList, setKanjiList] = useState<KanjiChar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevel, setActiveLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [selectedKanji, setSelectedKanji] = useState<KanjiChar | null>(null);

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

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6 items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-text-muted font-bold text-sm">Загрузка иероглифов Кандзи...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/30 border border-border/10 p-5 rounded-3xl backdrop-blur-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-text">Кандзи</h1>
            <Badge variant="warning" className="font-bold">漢字</Badge>
          </div>
          <p className="text-text-secondary text-sm font-medium mt-1">
            Китайские иероглифы, используемые в японской письменности для обозначения понятий, корней слов.
          </p>
        </div>

        {/* Progress box */}
        <div className="flex flex-col w-full md:w-64 gap-1.5 flex-shrink-0 bg-bg-secondary/40 border border-border/5 p-3.5 rounded-2xl">
          <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
            <span>Прогресс (Все уровни)</span>
            <span className="text-primary">{learnedCount} / {totalCount}</span>
          </div>
          <ProgressBar value={learnedCount} max={totalCount || 30} height="sm" />
        </div>
      </div>

      {/* Level Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Levels */}
        <div className="flex bg-bg-secondary p-1.5 rounded-2xl border border-border/10 w-full md:w-auto overflow-x-auto whitespace-nowrap">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setActiveLevel(lvl);
                setSelectedKanji(null);
              }}
              className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeLevel === lvl
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск иероглифа или значения..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/50 border border-border/15 py-2.5 pl-10 pr-4 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/50 text-text placeholder:text-text-muted/60"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredKanji.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-surface/10 rounded-3xl border border-dashed border-border/20 gap-3">
          <span className="text-text-muted font-bold text-sm">Ничего не найдено</span>
          {activeLevel !== 'N5' ? (
            <span className="text-xs text-text-secondary max-w-sm">
              Уровень {activeLevel} находится в разработке. Перейдите на уровень <b>N5</b> для тестирования.
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
            transition={{ delay: idx * 0.02 }}
          >
            <Card
              hoverable
              onClick={() => setSelectedKanji(k)}
              className={`p-4 flex flex-col items-center justify-between h-40 cursor-pointer ${
                selectedKanji?.id === k.id
                  ? 'border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20'
                  : k.learned
                  ? 'border-primary/20 bg-primary/5 shadow-sm'
                  : 'border-border/10 bg-surface/40'
              }`}
            >
              <span className="text-5xl font-black font-jp text-text">{k.char}</span>
              <div className="flex flex-col items-center text-center mt-2 w-full">
                <span className="text-sm font-bold text-text truncate w-full">{k.meaning}</span>
                <span className="text-[10px] text-text-muted truncate w-full capitalize mt-0.5">
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 glass border border-glass-border p-6 rounded-3xl shadow-2xl z-30 flex flex-col gap-5 text-text"
          >
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center font-black font-jp text-4xl shadow-lg shadow-primary/20">
                  {selectedKanji.char}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-text">{selectedKanji.meaning}</span>
                    <Badge variant="warning" className="text-[9px]">JLPT {selectedKanji.jlptLevel}</Badge>
                  </div>
                  <span className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Черты: {selectedKanji.strokeCount} | Ключ: {selectedKanji.radical}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedKanji(null)}
                className="text-text-muted hover:text-text bg-bg-secondary/60 hover:bg-bg-secondary p-1.5 rounded-full text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Readings breakdown */}
            <div className="flex flex-col gap-3.5 bg-bg-secondary/40 p-4 rounded-2xl border border-border/5 text-xs">
              {/* Kun'yomi */}
              <div className="flex flex-col gap-1">
                <span className="font-bold text-text-secondary text-[10px] uppercase tracking-wider">Кунъёми (Японское чтение)</span>
                <span className="font-extrabold text-text font-jp text-sm">
                  {selectedKanji.kunyomi.join('、 ') || '—'}
                </span>
              </div>
              {/* On'yomi */}
              <div className="flex flex-col gap-1 border-t border-border/10 pt-2.5">
                <span className="font-bold text-text-secondary text-[10px] uppercase tracking-wider">Онъёми (Китайское чтение)</span>
                <span className="font-extrabold text-primary font-jp text-sm">
                  {selectedKanji.onyomi.join('、 ') || '—'}
                </span>
              </div>
            </div>

            {/* Examples */}
            {selectedKanji.examples && selectedKanji.examples.length > 0 && (
              <div className="flex flex-col gap-2.5 bg-bg-secondary/40 p-4 rounded-2xl border border-border/5 text-xs">
                <span className="font-bold text-text-secondary flex items-center gap-1 text-[10px] uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-primary" /> Употребление в словах
                </span>
                <div className="flex flex-col gap-2.5">
                  {selectedKanji.examples.map((ex, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-border/5 pb-1.5 last:border-b-0 last:pb-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold font-jp text-sm text-text">{ex.word}</span>
                        <span className="text-[10px] text-text-secondary font-medium">({ex.reading})</span>
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
export default KanjiPage;
