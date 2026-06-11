import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, BookOpen, Volume2, Bookmark } from 'lucide-react';
import { dictionaryApi } from '../services/api/dictionaryApi';
import { Card } from '../shared/ui/Card';
import { Badge } from '../shared/ui/Badge';
import type { DictionaryEntry } from '../entities/dictionary/types';

export const DictionaryPage: React.FC = () => {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.word.includes(searchQuery) ||
      entry.reading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel = selectedLevel === 'Все' ? true : entry.jlptLevel === selectedLevel;

    return matchesSearch && matchesLevel;
  });

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

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6 items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-text-muted font-bold text-sm">Загрузка словаря...</span>
      </div>
    );
  }

  const levels = ['Все', 'N5', 'N4', 'N3', 'N2', 'N1'];

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 text-text">
      {/* Header Info */}
      <div className="flex flex-col bg-surface/30 border border-border/10 p-5 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold">Словарь</h1>
          <Badge variant="success" className="font-bold">辞書</Badge>
        </div>
        <p className="text-text-secondary text-sm font-medium mt-1">
          База данных японских слов. Введите слово на японском (иероглифы / хирагана) или перевод на русском языке.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Введите слово, чтение, перевод или тему..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/50 border border-border/15 py-3.5 pl-12 pr-4 rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/50 placeholder:text-text-muted/60 shadow-sm"
          />
        </div>

        {/* Level Tags */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedLevel === lvl
                  ? 'bg-primary text-white border-transparent shadow-sm'
                  : 'bg-bg-secondary border-border/10 text-text-muted hover:text-text hover:bg-surface-hover'
              }`}
            >
              {lvl === 'Все' ? 'Все уровни' : lvl}
            </button>
          ))}
        </div>
      </div>

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
                className={`p-4 transition-all duration-300 border border-border/10 hover:border-primary/30 bg-surface/40 ${
                  isExpanded ? 'shadow-md border-primary/20 bg-surface/75' : ''
                }`}
              >
                {/* Collapsed top bar */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleToggleExpand(entry.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Big word */}
                    <div className="flex flex-col flex-shrink-0">
                      <span className="text-xl md:text-2xl font-black font-jp text-text">{entry.word}</span>
                      <span className="text-xs text-text-muted mt-0.5 font-medium">[{entry.reading}]</span>
                    </div>

                    {/* Divider line */}
                    <div className="w-[1px] h-8 bg-border/10 hidden md:block" />

                    {/* Translation */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm md:text-base font-bold text-text truncate capitalize">{entry.meaning}</span>
                      <span className="text-[10px] text-text-muted mt-0.5 font-bold uppercase">{entry.partOfSpeech}</span>
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
                      className="p-2 bg-primary/10 text-primary border border-primary/15 rounded-xl hover:bg-primary/20 transition-colors shadow-sm"
                      title="Прослушать произношение"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button className="text-text-muted hover:text-text p-1 hidden sm:block">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <div>{isExpanded ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}</div>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3.5 mt-4 pt-4 border-t border-border/10">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags.map((tag, tIdx) => (
                            <Badge key={tIdx} className="text-[9px] font-bold bg-bg-secondary border border-border/10 text-text-secondary capitalize">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Examples */}
                        {entry.examples && entry.examples.length > 0 && (
                          <div className="flex flex-col gap-2 bg-bg-secondary/40 p-3.5 rounded-xl border border-border/5 text-xs">
                            <span className="font-bold text-text-secondary flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-1">
                              <BookOpen className="w-3.5 h-3.5 text-primary" /> Примеры предложений
                            </span>
                            {entry.examples.map((ex, exIdx) => (
                              <div key={exIdx} className="flex flex-col gap-1 border-b border-border/5 pb-2 last:border-b-0 last:pb-0">
                                <span className="font-extrabold font-jp text-sm text-text">{ex.japanese}</span>
                                <span className="font-semibold text-text-muted">{ex.russian}</span>
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
