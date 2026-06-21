import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, RefreshCcw, Award } from 'lucide-react';

// MOCK DATA: In a real app, this would be fetched from the backend via lessonApi.getById(lessonId)
const MOCK_QUESTIONS = [
  { id: '1', symbol: 'あ', answer: 'a' },
  { id: '2', symbol: 'い', answer: 'i' },
  { id: '3', symbol: '水', answer: 'mizu' },
  { id: '4', symbol: 'た', answer: 'ta' },
  { id: '5', symbol: '猫', answer: 'neko' },
];

export const TestSessionPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = MOCK_QUESTIONS[currentIndex];

  useEffect(() => {
    // Focus the input when a new question appears
    if (!isAnswered && !isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isAnswered, isFinished]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isAnswered) return;

    const correct = inputValue.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }
    setIsAnswered(true);

    // Auto-advance after 1.5s if correct, or wait for explicit click if incorrect
    if (correct) {
      setTimeout(handleNext, 1200);
    }
  };

  const handleNext = () => {
    if (currentIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setInputValue('');
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    // Here we would call lessonApi.submitTest(result)
    navigate('/tests');
  };

  if (isFinished) {
    const percentage = Math.round((score / MOCK_QUESTIONS.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-10 rounded-[3rem] flex flex-col items-center gap-6 max-w-md w-full"
        >
          <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-2">
            <Award className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-text">Тест Завершен!</h1>
          
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between text-text-secondary font-bold px-4">
              <span>Правильных ответов:</span>
              <span className={percentage >= 80 ? 'text-emerald-500' : 'text-primary'}>
                {score} / {MOCK_QUESTIONS.length}
              </span>
            </div>
            <div className="w-full bg-surface-hover h-4 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className={`h-full ${percentage >= 80 ? 'bg-emerald-500' : 'bg-primary'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-2xl font-bold mt-4">
            <Award className="w-5 h-5" />
            <span>+ {score * 10} XP</span>
          </div>

          <button 
            onClick={handleFinish}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl transition-all shadow-lg mt-4"
          >
            Вернуться к тестам
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full py-8 md:py-12 flex flex-col gap-8 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/tests')}
          className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors p-2 -ml-2 rounded-xl hover:bg-surface-hover"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold hidden sm:inline">Отмена</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-surface border border-border/50 px-4 py-1.5 rounded-xl text-sm font-bold text-text-secondary">
            Вопрос {currentIndex + 1} из {MOCK_QUESTIONS.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-surface border border-border/50 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: `${(currentIndex / MOCK_QUESTIONS.length) * 100}%` }}
          animate={{ width: `${((currentIndex) / MOCK_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Interactive Testing Area */}
      <div className="glass flex-1 flex flex-col items-center justify-center p-8 rounded-[3rem] relative overflow-hidden min-h-[400px]">
        {/* The Symbol */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="text-[8rem] md:text-[10rem] font-jp font-black text-text leading-none mb-12 drop-shadow-md select-none"
          >
            {currentQuestion.symbol}
          </motion.div>
        </AnimatePresence>

        {/* The Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 relative z-10">
          
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isAnswered}
              placeholder="Введите чтение..."
              className={`w-full text-center text-2xl font-bold py-4 px-6 rounded-2xl bg-bg border-2 transition-all focus:outline-none ${
                !isAnswered 
                  ? 'border-border/50 focus:border-primary shadow-inner' 
                  : isCorrect 
                    ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' 
                    : 'border-red-500 text-red-500 bg-red-500/5'
              }`}
            />
            
            {/* Validation Icon Overlay */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Romaji Warning / Helper Text */}
          <AnimatePresence mode="wait">
            {!isAnswered ? (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-text-muted text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Пишите чтение на <strong>ромадзи</strong> (латиницей)</span>
              </motion.div>
            ) : !isCorrect ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex flex-col items-center gap-4 w-full"
              >
                <div className="text-center">
                  <p className="text-text-secondary text-sm">Правильный ответ:</p>
                  <p className="text-2xl font-black text-emerald-500 mt-1">{currentQuestion.answer}</p>
                </div>
                <button 
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-bg border border-border hover:bg-surface-hover text-text font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Продолжить <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
          
        </form>
      </div>
    </div>
  );
};

export default TestSessionPage;
