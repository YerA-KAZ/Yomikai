import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, BookOpen, Volume2, Bookmark, FileQuestion } from 'lucide-react';
import { dictionaryApi } from '../services/api/dictionaryApi';
import { Card } from '../shared/ui/Card';
import { Badge } from '../shared/ui/Badge';
import type { DictionaryEntry } from '../entities/dictionary/types';

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const DictionaryPage: React.FC = () => {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedLevel, setSelectedLevel] = useState<string>('Все');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  useEffect(() => {
    dictionaryApi.getAll()
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const q = debouncedSearchQuery.toLowerCase();
      const matchesSearch =
        entry.word.includes(debouncedSearchQuery) ||
        entry.reading.toLowerCase().includes(q) ||
        entry.meaning.toLowerCase().includes(q) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesLevel = selectedLevel === 'Все' ? true : entry.jlptLevel === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [entries, debouncedSearchQuery, selectedLevel]);

  const handleToggleExpand = (id: string) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const levels = ['Все', 'N5', 'N4', 'N3', 'N2', 'N1'];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-4 md:py-6 w-full">
        <div className="h-[100px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-14 bg-surface/50 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-20 bg-surface/50 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 text-text">
      {/* Header Info */}
      <div className="flex flex-col glass border border-border/10 p-5 rounded-3xl">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold drop-shadow-sm">Словарь</h1>
          <Badge variant="success" className="font-bold">辞書</Badge>
        </div>
        <p className="text-text-secondary text-sm font-medium mt-1">
          База данных японских слов. Введите слово на японском (иероглифы / хирагана) или перевод на русском языке.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Введите слово, чтение, перевод или тему..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/60 backdrop-blur-md border border-border/20 py-4 pl-12 pr-4 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-sm placeholder:text-text-muted/60 transition-all"
          />
        </div>

        {/* Level Tags */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                selectedLevel === lvl
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 scale-105'
                  : 'bg-surface/50 border border-border/10 text-text-muted hover:text-text hover:bg-surface'
              }`}
            >
              {lvl === 'Все' ? 'Все уровни' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-surface/20 rounded-3xl border border-dashed border-border/40 gap-3">
          <div className="p-4 bg-bg-secondary/50 rounded-full mb-2">
            <FileQuestion className="w-8 h-8 text-text-muted/50" />
          </div>
          <span className="text-text-muted font-bold text-base">Слов не найдено</span>
          <span className="text-xs text-text-secondary">Попробуйте изменить поисковый запрос или уровень.</span>
        </div>
      )}

      {/* Entries List */}
      <div className="flex flex-col gap-3">
        {filteredEntries.map((entry, idx) => {
          const isExpanded = expandedEntryId === entry.id;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3) }}
            >
              <Card
                className={`p-4 transition-all duration-300 relative overflow-hidden group ${
                  isExpanded 
                    ? 'shadow-lg border-primary/30 ring-1 ring-primary/20 bg-surface/90' 
                    : 'border-border/15 hover:border-primary/30 bg-surface/60 hover:bg-surface'
                }`}
              >
                {/* Decorative background kanji */}
                <span className="absolute -right-4 -bottom-4 text-7xl font-black font-jp text-text-muted/5 select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">
                  {entry.word.charAt(0)}
                </span>

                {/* Collapsed top bar */}
                <div
                  className="flex items-center justify-between cursor-pointer relative z-10"
                  onClick={() => handleToggleExpand(entry.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Big word */}
                    <div className="flex flex-col flex-shrink-0">
                      <span className="text-xl md:text-2xl font-black font-jp text-text group-hover:text-primary transition-colors">{entry.word}</span>
                      <span className="text-xs text-text-muted mt-0.5 font-bold tracking-wider">[{entry.reading}]</span>
                    </div>

                    {/* Divider line */}
                    <div className="w-[1px] h-8 bg-border/20 hidden md:block" />

                    {/* Translation */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm md:text-base font-bold text-text truncate capitalize">{entry.meaning}</span>
                      <span className="text-[10px] text-text-muted mt-0.5 font-bold uppercase tracking-wider">{entry.partOfSpeech}</span>
                    </div>
                  </div>

                  {/* Right options & badges */}
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="text-[9px] uppercase font-bold tracking-wider hidden sm:inline-block">
                      {entry.jlptLevel}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(entry.word);
                      }}
                      className="p-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 hover:scale-110 transition-all shadow-sm"
                      title="Прослушать произношение"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button className="text-text-muted hover:text-primary p-1.5 hidden sm:block transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <div className="p-1 rounded-full bg-bg-secondary/50 group-hover:bg-bg-secondary transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="flex flex-col gap-3.5 mt-4 pt-4 border-t border-border/10">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag, tIdx) => (
                            <Badge key={tIdx} className="text-[9px] font-bold bg-bg-secondary/80 border border-border/10 text-text-secondary capitalize tracking-wider px-2 py-1">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Examples */}
                        {entry.examples && entry.examples.length > 0 && (
                          <div className="flex flex-col gap-2 bg-bg-secondary/40 p-4 rounded-xl border border-border/10 text-xs shadow-sm">
                            <span className="font-extrabold text-text-secondary flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-1">
                              <BookOpen className="w-3.5 h-3.5 text-primary" /> Примеры предложений
                            </span>
                            {entry.examples.map((ex, exIdx) => (
                               <div key={exIdx} className="flex flex-col gap-1.5 border-b border-border/5 pb-2.5 last:border-b-0 last:pb-0">
                                <span className="font-black font-jp text-[15px] text-text bg-surface/50 py-1 px-2 rounded-lg border border-border/5">{ex.japanese}</span>
                                <span className="font-bold text-text-muted px-2">{ex.russian}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
export default DictionaryPage;
