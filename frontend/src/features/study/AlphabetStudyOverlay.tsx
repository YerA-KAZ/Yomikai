import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, XCircle, Trophy, BookOpen, Star } from 'lucide-react';
import type { KanaGroup, KanaChar } from '../../entities/kana/types';
import { Button } from '../../shared/ui/Button';
import { ProgressBar } from '../../shared/ui/ProgressBar';

interface AlphabetStudyOverlayProps {
  group: KanaGroup;
  allGroups: KanaGroup[]; // used to generate random wrong answers
  onClose: () => void;
  onFinish: (learnedKanaIds: string[], xpEarned: number) => void;
}

type Step = 'intro' | 'cards' | 'quiz' | 'result';

export const AlphabetStudyOverlay: React.FC<AlphabetStudyOverlayProps> = ({ group, allGroups, onClose, onFinish }) => {
  const [step, setStep] = useState<Step>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const chars = group.chars;
  const currentChar = chars[currentIndex];

  // Generate quiz options for the current character
  const quizOptions = useMemo(() => {
    if (step !== 'quiz' || !currentChar) return [];
    const allChars = allGroups.flatMap(g => g.chars);
    const options = new Set<string>();
    options.add(currentChar.romaji);
    
    // Add 3 random wrong options
    while (options.size < 4 && options.size < allChars.length) {
      const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
      if (randomChar.romaji !== currentChar.romaji) {
        options.add(randomChar.romaji);
      }
    }
    
    return Array.from(options).sort(() => Math.random() - 0.5);
  }, [currentChar, allGroups, step]);

  const handleNextCard = () => {
    if (currentIndex < chars.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStep('quiz');
      setCurrentIndex(0);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    const isCorrect = option === currentChar.romaji;
    setQuizAnswers(prev => ({ ...prev, [currentChar.id]: isCorrect }));

    setTimeout(() => {
      if (currentIndex < chars.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsAnswered(false);
        setSelectedOption(null);
      } else {
        setStep('result');
      }
    }, 1500); // 1.5s delay to show feedback
  };

  const correctCount = Object.values(quizAnswers).filter(Boolean).length;
  const totalCount = chars.length;
  // Let's say 10 XP per correct answer
  const xpEarned = correctCount * 10;

  const handleFinish = () => {
    const learnedIds = chars.filter(c => quizAnswers[c.id]).map(c => c.id);
    onFinish(learnedIds, xpEarned);
  };

  const handleRetry = () => {
    setStep('cards');
    setCurrentIndex(0);
    setQuizAnswers({});
    setIsAnswered(false);
    setSelectedOption(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-surface/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-surface border border-glass-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/10">
          <div className="flex flex-col">
            <span className="text-xs font-black text-text-muted uppercase tracking-widest">
              {step === 'intro' ? 'Вступление' : step === 'cards' ? 'Изучение' : step === 'quiz' ? 'Проверка' : 'Результаты'}
            </span>
            <h2 className="text-xl font-extrabold text-text">Ряд {group.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text bg-bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Intro */}
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center gap-8 w-full"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-primary/10 text-primary p-4 rounded-3xl mb-2">
                    <BookOpen className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black">{group.nameJp}</h3>
                  <p className="text-text-secondary font-medium mt-2">
                    В этом уроке мы изучим {chars.length} новых символа. Сначала мы посмотрим на них, а затем закрепим знания в небольшом квизе.
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-3 w-full max-w-sm">
                  {chars.map(c => (
                    <div key={c.id} className="bg-bg-secondary border border-border/10 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-2xl font-black font-jp">{c.char}</span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">{c.romaji}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" onClick={() => setStep('cards')} className="w-full max-w-xs mt-4 group">
                  Начать урок
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Cards */}
            {step === 'cards' && currentChar && (
              <motion.div
                key={`card-${currentChar.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <div className="w-full max-w-md flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold text-text-muted mb-1">
                    <span>Карточка {currentIndex + 1} из {chars.length}</span>
                  </div>
                  <ProgressBar value={((currentIndex) / chars.length) * 100} className="h-2" />

                </div>

                <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-primary/5">
                  <span className="text-7xl md:text-8xl font-black font-jp text-text">{currentChar.char}</span>
                </div>

                <div className="text-center flex flex-col gap-1">
                  <span className="text-4xl font-black text-primary uppercase tracking-widest">{currentChar.romaji}</span>
                  <span className="text-sm font-bold text-text-muted uppercase">{currentChar.type === 'hiragana' ? 'Хирагана' : 'Катакана'}</span>
                </div>

                {currentChar.examples && currentChar.examples.length > 0 && (
                  <div className="w-full max-w-md bg-bg-secondary/50 rounded-2xl p-4 border border-border/10 flex flex-col gap-3">
                    <span className="text-xs uppercase font-extrabold text-text-secondary tracking-wider">Примеры</span>
                    {currentChar.examples.slice(0, 3).map((ex, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold font-jp text-base">{ex.word}</span>
                          <span className="text-xs text-text-secondary">({ex.reading})</span>
                        </div>
                        <span className="text-text-muted font-medium">{ex.meaning}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button size="lg" onClick={handleNextCard} className="w-full max-w-xs mt-4">
                  Далее
                </Button>
              </motion.div>
            )}

            {/* Step 3: Quiz */}
            {step === 'quiz' && currentChar && (
              <motion.div
                key={`quiz-${currentChar.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <div className="w-full max-w-md flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold text-text-muted mb-1">
                    <span>Вопрос {currentIndex + 1} из {chars.length}</span>
                  </div>
                  <ProgressBar value={((currentIndex) / chars.length) * 100} className="h-2" />

                </div>

                <div className="bg-bg-secondary/50 border border-border/10 w-32 h-32 md:w-40 md:h-40 rounded-[2rem] flex items-center justify-center shadow-inner">
                  <span className="text-6xl md:text-7xl font-black font-jp text-text">{currentChar.char}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
                  {quizOptions.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === currentChar.romaji;
                    
                    let btnClass = "bg-surface border-border/10 hover:border-primary/50 hover:bg-primary/5 text-text";
                    if (isAnswered) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-500 text-white border-emerald-600";
                      } else if (isSelected && !isCorrect) {
                        btnClass = "bg-red-500 text-white border-red-600";
                      } else {
                        btnClass = "bg-surface border-border/10 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleOptionSelect(option)}
                        className={`h-16 rounded-2xl border-2 font-black text-xl uppercase tracking-widest transition-all duration-300 ${btnClass}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-lg font-bold mt-4 ${selectedOption === currentChar.romaji ? 'text-emerald-500' : 'text-red-500'}`}
                  >
                    {selectedOption === currentChar.romaji ? (
                      <><Check className="w-6 h-6" /> Верно!</>
                    ) : (
                      <><XCircle className="w-6 h-6" /> Ошибка!</>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 4: Result */}
            {step === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="bg-amber-500/10 text-amber-500 p-4 rounded-3xl mb-2">
                    <Trophy className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black">Урок завершен!</h3>
                  <p className="text-text-secondary font-medium mt-2">
                    Вы ответили правильно на {correctCount} из {totalCount} вопросов.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center bg-bg-secondary p-4 rounded-2xl min-w-[100px] border border-border/5">
                    <span className="text-xs font-bold text-text-muted uppercase">Точность</span>
                    <span className="text-2xl font-black text-primary">{Math.round((correctCount / totalCount) * 100)}%</span>
                  </div>
                  <div className="flex flex-col items-center bg-amber-500/5 p-4 rounded-2xl min-w-[100px] border border-amber-500/20">
                    <span className="text-xs font-bold text-amber-600/70 uppercase">Получено</span>
                    <div className="flex items-center gap-1 text-2xl font-black text-amber-500">
                      <span>+{xpEarned}</span>
                      <span className="text-[10px]">XP</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3 w-full max-w-sm mt-2">
                  {chars.map(c => {
                    const isCorrect = quizAnswers[c.id];
                    return (
                      <div 
                        key={c.id} 
                        className={`border rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm relative overflow-hidden ${
                          isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-red-500/10 border-red-500/30 text-red-600'
                        }`}
                      >
                        <span className="text-2xl font-black font-jp">{c.char}</span>
                        <span className="text-[10px] font-bold uppercase">{c.romaji}</span>
                        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 w-full max-w-sm mt-4">
                  {correctCount < totalCount && (
                    <Button variant="ghost" className="flex-1" onClick={handleRetry}>
                      Повторить
                    </Button>
                  )}
                  <Button className="flex-1" onClick={handleFinish}>
                    Завершить
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
