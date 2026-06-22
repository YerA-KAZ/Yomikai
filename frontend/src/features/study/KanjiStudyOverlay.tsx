import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, XCircle, Trophy, BookOpen, Info, PenTool, MessageSquare, Brain  } from 'lucide-react';
import type { KanjiChar } from '../../entities/kanji/types';
import { Button } from '../../shared/ui/Button';



interface KanjiStudyOverlayProps {
  kanji: KanjiChar;
  allKanji: KanjiChar[];
  onClose: () => void;
  onFinish: (kanjiId: string, xpEarned: number) => void | Promise<void>;
  onNextKanji: () => void;
}

type Step = 'intro' | 'card' | 'quiz-meaning' | 'quiz-reading' | 'result';
type CardTab = 'reading' | 'strokes' | 'words';

export const KanjiStudyOverlay: React.FC<KanjiStudyOverlayProps> = ({ kanji, allKanji, onClose, onFinish, onNextKanji }) => {
  const [step, setStep] = useState<Step>('intro');
  const [cardTab, setCardTab] = useState<CardTab>('reading');
  
  // Strokes stepper
  const [strokeStep, setStrokeStep] = useState(0);
  
  // Quiz state
  const [quizResults, setQuizResults] = useState<{ meaning: boolean | null; reading: boolean | null }>({ meaning: null, reading: null });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  // Generate wrong options for meaning quiz
  const meaningOptions = useMemo(() => {
    const options = new Set<string>();
    options.add(kanji.meaning);
    const others = allKanji.filter(k => k.id !== kanji.id);
    while (options.size < 4 && options.size <= others.length) {
      const random = others[Math.floor(Math.random() * others.length)];
      options.add(random.meaning);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  }, [kanji, allKanji]);

  // Pick a random word for reading quiz
  const quizWord = useMemo(() => {
    const words = kanji.words && kanji.words.length > 0 ? kanji.words : kanji.examples;
    if (!words || words.length === 0) return null;
    return words[Math.floor(Math.random() * words.length)];
  }, [kanji]);

  // Generate wrong options for reading quiz
  const readingOptions = useMemo(() => {
    if (!quizWord) return [];
    const options = new Set<string>();
    options.add(quizWord.reading);
    const allWords = allKanji.flatMap(k => [...(k.words ?? []), ...k.examples]);
    while (options.size < 4 && allWords.length > 0) {
      const random = allWords[Math.floor(Math.random() * allWords.length)];
      if (random.reading !== quizWord.reading) options.add(random.reading);
      if (options.size >= 4) break;
      // prevent infinite loop if not enough unique readings
      if (allWords.length < 10) break;
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  }, [quizWord, allKanji, kanji]);

  const handleMeaningAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    const isCorrect = option === kanji.meaning;
    setQuizResults(prev => ({ ...prev, meaning: isCorrect }));
  };

  const handleReadingAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    const isCorrect = option === quizWord?.reading;
    setQuizResults(prev => ({ ...prev, reading: isCorrect }));
  };

  const goToNextAfterMeaning = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (quizWord && readingOptions.length >= 2) {
      setStep('quiz-reading');
    } else {
      setStep('result');
    }
  };

  const goToResult = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setStep('result');
  };

  const correctCount = [quizResults.meaning, quizResults.reading].filter(Boolean).length;
  const totalQuizzes = quizWord && readingOptions.length >= 2 ? 2 : 1;
  const xpEarned = totalQuizzes === 2
    ? (correctCount === 2 ? 30 : correctCount === 1 ? 15 : 5)
    : (correctCount === 1 ? 30 : 5);

  const handleFinish = async () => {
    if (hasFinished || isFinishing) return;
    setIsFinishing(true);
    try {
      await onFinish(kanji.id, xpEarned);
      setHasFinished(true);
    } finally {
      setIsFinishing(false);
    }
  };

  const handleNext = async () => {
    await handleFinish();
    onNextKanji();
  };

  const handleRetry = () => {
    setStep('intro');
    setCardTab('reading');
    setStrokeStep(0);
    setQuizResults({ meaning: null, reading: null });
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinishing(false);
    setHasFinished(false);
  };

  const getOptionStyle = (option: string, correctAnswer: string) => {
    if (!isAnswered) return "bg-surface border-border/20 hover:border-primary/50 hover:bg-primary/5 text-text";
    const isCorrect = option === correctAnswer;
    const isSelected = selectedOption === option;
    if (isCorrect) return "bg-emerald-500 text-white border-emerald-600";
    if (isSelected && !isCorrect) return "bg-red-500 text-white border-red-600";
    return "bg-surface border-border/10 opacity-40";
  };

  return (
    <div className="fixed z-50 top-16 left-0 right-0 bottom-0 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-surface border border-glass-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/10">
          <div className="flex flex-col">
            <span className="text-xs font-black text-text-muted uppercase tracking-widest">
              {step === 'intro' ? 'Подготовка' : step === 'card' ? 'Изучение' : step === 'quiz-meaning' ? 'Квиз: Значение' : step === 'quiz-reading' ? 'Квиз: Чтение' : 'Результаты'}
            </span>
            <h2 className="text-xl font-extrabold text-text flex items-center gap-2">
              <span className="font-jp text-2xl">{kanji.char}</span> {kanji.meaning}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text bg-bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center min-h-[420px]">
          <AnimatePresence mode="wait">

            {/* SCREEN 1: INTRO */}
            {step === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center gap-8 w-full"
              >
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-amber-500/20">
                  <span className="text-6xl font-black font-jp text-white">{kanji.char}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-3xl font-black text-text">{kanji.meaning}</h3>
                  <p className="text-text-secondary font-medium mt-1 max-w-md">
                    Сейчас мы изучим чтение, порядок черт и слова с этим иероглифом, а затем пройдём два квиза для закрепления.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 text-xs font-bold text-text-muted">
                  <span className="bg-bg-secondary px-3 py-1.5 rounded-xl border border-border/10 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Чтение
                  </span>
                  <span className="bg-bg-secondary px-3 py-1.5 rounded-xl border border-border/10 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5" />
                    Черты ({kanji.strokeCount})
                  </span>
                  <span className="bg-bg-secondary px-3 py-1.5 rounded-xl border border-border/10 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Слова
                  </span>
                  <span className="bg-bg-secondary px-3 py-1.5 rounded-xl border border-border/10 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" />
                    Квиз ×2
                  </span>
                </div>
                <div className="text-[10px] text-text-muted">⏱ Примерное время: ~3–5 мин</div>
                <Button size="lg" onClick={() => setStep('card')} className="w-full max-w-xs mt-2 group">
                  Начать <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {/* SCREEN 2: CARD with 3 tabs */}
            {step === 'card' && (
              <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center gap-6 w-full"
              >
                {/* Tab Switcher */}
                <div className="flex bg-bg-secondary/60 p-1 rounded-2xl border border-border/20 w-full max-w-md">
                  {([
                    { key: 'reading', label: 'Чтение' },
                    { key: 'strokes', label: 'Черты' },
                    { key: 'words', label: 'Слова' },
                  ] as { key: CardTab; label: string }[]).map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setCardTab(tab.key)}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        cardTab === tab.key 
                          ? 'bg-surface shadow-md text-text' 
                          : 'text-text-muted hover:text-text'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab: Reading */}
                {cardTab === 'reading' && (
                  <div className="flex flex-col gap-4 w-full max-w-md">
                    {/* Kunyomi - orange */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-1.5">
                      <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm bg-amber-500" /> Кунъёми (Японское)
                      </span>
                      <span className="font-black font-jp text-lg text-text">
                        {kanji.kunyomi.join('、 ') || '—'}
                      </span>
                    </div>
                    {/* Onyomi - neutral */}
                    <div className="bg-bg-secondary/60 border border-border/20 rounded-2xl p-4 flex flex-col gap-1.5">
                      <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm bg-text-muted/50" /> Онъёми (Китайское)
                      </span>
                      <span className="font-black font-jp text-lg text-text">
                        {kanji.onyomi.join('、 ') || '—'}
                      </span>
                    </div>
                    {/* Hint */}
                    {kanji.hint && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3 flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs font-bold text-blue-600">{kanji.hint}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Strokes */}
                {cardTab === 'strokes' && (
                  <div className="flex flex-col items-center gap-4 w-full max-w-md">
                    {kanji.strokes && kanji.strokes.length > 0 ? (
                      <>
                        <div className="w-48 h-48 bg-bg-secondary/40 border border-border/20 rounded-3xl flex items-center justify-center shadow-inner relative overflow-hidden">
                          {/* Render SVG strokes */}
                          <svg viewBox="0 0 109 109" className="w-40 h-40">
                            {kanji.strokes.map((stroke, idx) => (
                              stroke.paths.map((path, pIdx) => (
                                <path
                                  key={`${idx}-${pIdx}`}
                                  d={path}
                                  fill="none"
                                  stroke={strokeStep >= kanji.strokes!.length ? '#334155' : idx < strokeStep ? '#94a3b8' : idx === strokeStep ? '#f59e0b' : '#e2e8f0'}
                                  strokeWidth={strokeStep < kanji.strokes!.length && idx === strokeStep ? 4 : 3}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  opacity={strokeStep >= kanji.strokes!.length || idx <= strokeStep ? 1 : 0.25}
                                />
                              ))
                            ))}
                          </svg>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setStrokeStep(Math.max(0, strokeStep - 1))}
                            disabled={strokeStep === 0}
                            className="p-2 rounded-xl bg-bg-secondary border border-border/20 disabled:opacity-30 hover:bg-surface transition-colors"
                          >
                            <ArrowLeft className="w-5 h-5" />
                          </button>
                          <span className="text-sm font-bold text-text-muted">
                            {strokeStep >= kanji.strokes.length ? 'Полный кандзи' : `Черта ${strokeStep + 1} из ${kanji.strokes.length}`}
                          </span>
                          <button
                            onClick={() => setStrokeStep(Math.min(kanji.strokes!.length, strokeStep + 1))}
                            disabled={strokeStep >= kanji.strokes.length}
                            className="p-2 rounded-xl bg-bg-secondary border border-border/20 disabled:opacity-30 hover:bg-surface transition-colors"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
                        <div className="w-32 h-32 bg-bg-secondary/40 border border-border/20 rounded-3xl flex items-center justify-center">
                          <span className="text-7xl font-black font-jp text-text/20">{kanji.char}</span>
                        </div>
                        <span className="text-sm text-text-muted font-bold">Черты ещё не добавлены</span>
                        <span className="text-xs text-text-muted/60">Администратор может нарисовать черты в Админ-панели</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Words */}
                {cardTab === 'words' && (
                  <div className="flex flex-col gap-3 w-full max-w-md">
                    {(kanji.words && kanji.words.length > 0 ? kanji.words : kanji.examples).length > 0 ? (
                      (kanji.words && kanji.words.length > 0 ? kanji.words : kanji.examples).map((w, idx) => (
                        <div key={idx} className="bg-bg-secondary/40 border border-border/10 rounded-2xl p-3 flex items-center justify-between group hover:border-primary/30 transition-colors">
                          <div className="flex items-baseline gap-2">
                            <span className="font-black font-jp text-base text-text group-hover:text-primary transition-colors">{w.word}</span>
                            <span className="text-xs text-text-secondary font-bold bg-surface px-1.5 py-0.5 rounded-md border border-border/5">{w.reading}</span>
                          </div>
                          <span className="text-xs font-bold text-text-muted">{w.meaning}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-10 gap-2">
                        <BookOpen className="w-10 h-10 text-text-muted/30" />
                        <span className="text-sm text-text-muted font-bold">Слова ещё не добавлены</span>
                      </div>
                    )}
                  </div>
                )}

                <Button size="lg" onClick={() => { setSelectedOption(null); setIsAnswered(false); setStep('quiz-meaning'); }} className="w-full max-w-xs mt-4">
                  Перейти к квизу
                </Button>
              </motion.div>
            )}

            {/* SCREEN 3: QUIZ — MEANING */}
            {step === 'quiz-meaning' && (
              <motion.div key="quiz-meaning" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <p className="text-sm text-text-muted font-bold">Что означает этот иероглиф?</p>
                <div className="bg-bg-secondary/50 border border-border/10 w-32 h-32 rounded-[2rem] flex items-center justify-center shadow-inner">
                  <span className="text-7xl font-black font-jp text-text">{kanji.char}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {meaningOptions.map((option, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleMeaningAnswer(option)}
                      className={`h-14 rounded-2xl border-2 font-bold text-sm transition-all duration-300 ${getOptionStyle(option, kanji.meaning)}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {isAnswered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
                    <span className={`flex items-center gap-2 text-lg font-bold ${selectedOption === kanji.meaning ? 'text-emerald-500' : 'text-red-500'}`}>
                      {selectedOption === kanji.meaning ? <><Check className="w-6 h-6" /> Верно!</> : <><XCircle className="w-6 h-6" /> Ошибка!</>}
                    </span>
                    <Button size="md" onClick={goToNextAfterMeaning}>Далее <ArrowRight className="w-4 h-4" /></Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SCREEN 4: QUIZ — READING */}
            {step === 'quiz-reading' && quizWord && (
              <motion.div key="quiz-reading" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <p className="text-sm text-text-muted font-bold">Как читается это слово?</p>
                <div className="bg-bg-secondary/50 border border-border/10 px-8 py-6 rounded-[2rem] flex items-center justify-center shadow-inner">
                  <span className="text-5xl font-black font-jp text-text">{quizWord.word}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {readingOptions.map((option, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleReadingAnswer(option)}
                      className={`h-14 rounded-2xl border-2 font-bold text-sm transition-all duration-300 ${getOptionStyle(option, quizWord.reading)}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {isAnswered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
                    <span className={`flex items-center gap-2 text-lg font-bold ${selectedOption === quizWord.reading ? 'text-emerald-500' : 'text-red-500'}`}>
                      {selectedOption === quizWord.reading ? <><Check className="w-6 h-6" /> Верно!</> : <><XCircle className="w-6 h-6" /> Ошибка!</>}
                    </span>
                    <Button size="md" onClick={goToResult}>Далее <ArrowRight className="w-4 h-4" /></Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SCREEN 5: RESULT */}
            {step === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="bg-amber-500/10 text-amber-500 p-4 rounded-3xl mb-2">
                    <Trophy className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black">Урок завершен!</h3>
                  <p className="text-text-secondary font-medium mt-2">
                    Вы ответили правильно на {correctCount} из {totalQuizzes} вопросов.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center bg-bg-secondary p-4 rounded-2xl min-w-[100px] border border-border/5">
                    <span className="text-xs font-bold text-text-muted uppercase">Точность</span>
                    <span className="text-2xl font-black text-primary">{Math.round((correctCount / totalQuizzes) * 100)}%</span>
                  </div>
                  <div className="flex flex-col items-center bg-amber-500/5 p-4 rounded-2xl min-w-[100px] border border-amber-500/20">
                    <span className="text-xs font-bold text-amber-600/70 uppercase">Получено</span>
                    <div className="flex items-center gap-1 text-2xl font-black text-amber-500">
                      <span>+{xpEarned}</span>
                      <span className="text-[10px]">XP</span>
                    </div>
                  </div>
                </div>

                {/* What was remembered */}
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  <div className={`flex items-center justify-between p-3 rounded-2xl border ${quizResults.meaning ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <span className="text-sm font-bold">Значение: {kanji.meaning}</span>
                    {quizResults.meaning ? <Check className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                  {quizResults.reading !== null && (
                    <div className={`flex items-center justify-between p-3 rounded-2xl border ${quizResults.reading ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      <span className="text-sm font-bold">Чтение: {quizWord?.reading}</span>
                      {quizResults.reading ? <Check className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 w-full max-w-sm mt-4">
                  <Button variant="secondary" className="flex-1" onClick={handleRetry}>
                    Повторить
                  </Button>
                  <Button className="flex-1" onClick={handleNext} disabled={isFinishing}>
                    Следующий кандзи
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
