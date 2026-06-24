import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Award } from 'lucide-react';
import { lessonApi } from '../services/api/lessonApi';
import type { Lesson, Question, QuestionType } from '../entities/lesson/types';
import { QUESTION_TYPE_LABELS } from '../entities/lesson/types';

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

function checkAnswer(userAnswer: string, correctAnswer: string, type: QuestionType): boolean {
  if (type === 'word_composition') {
    const normalizeSet = (value: string) =>
      value.split(',').map((part) => part.trim()).filter(Boolean).sort().join(',');
    return normalizeSet(userAnswer) === normalizeSet(correctAnswer);
  }
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}

function isJapaneseDisplay(type: QuestionType): boolean {
  return [
    'kana_symbol_to_reading',
    'kana_fill_blank',
    'meaning_to_kanji',
    'word_to_reading',
    'kanji_in_context',
    'kanji_to_meaning',
    'word_composition',
  ].includes(type);
}

function isLargePrompt(type: QuestionType): boolean {
  return type !== 'kana_reading_to_symbol' && type !== 'meaning_to_kanji' && type !== 'kanji_to_meaning';
}

function getPromptClassName(type: QuestionType): string {
  const base = 'font-black text-text leading-none drop-shadow-md select-none text-center';
  if (type === 'kana_reading_to_symbol') return `${base} text-6xl md:text-7xl tracking-widest`;
  if (type === 'meaning_to_kanji') return `${base} text-3xl md:text-4xl`;
  if (type === 'kanji_to_meaning') return `${base} text-[8rem] md:text-[10rem] font-jp`;
  if (type === 'kana_symbol_to_reading') return `${base} text-[8rem] md:text-[10rem] font-jp`;
  if (type === 'kana_fill_blank' || type === 'kanji_in_context' || type === 'word_to_reading') {
    return `${base} text-4xl md:text-5xl font-jp`;
  }
  if (type === 'word_composition') return `${base} text-4xl md:text-5xl font-jp`;
  return base;
}

function getInstruction(type: QuestionType): string {
  switch (type) {
    case 'kana_symbol_to_reading':
      return 'Выберите правильное ромадзи для символа';
    case 'kana_reading_to_symbol':
      return 'Выберите правильный символ каны';
    case 'kana_fill_blank':
      return 'Вставьте пропущенный символ';
    case 'kanji_to_meaning':
      return 'Выберите значение иероглифа';
    case 'meaning_to_kanji':
      return 'Выберите иероглиф для значения';
    case 'word_to_reading':
      return 'Выберите чтение слова хираганой';
    case 'kanji_in_context':
      return 'Вставьте нужный кандзи в предложение';
    case 'word_composition':
      return 'Выберите все кандзи, из которых состоит слово';
    default:
      return 'Выберите ответ';
  }
}

function getOptionClassName(type: QuestionType, option: string): string {
  const isJp = isJapaneseDisplay(type) && /[\u3040-\u30ff\u4e00-\u9faf]/.test(option);
  return isJp ? 'text-3xl font-jp' : 'text-lg';
}

export const TestSessionPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answersLog, setAnswersLog] = useState<{ questionId: string; userAnswer: string; correct: boolean }[]>([]);
  const [startedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);

  const questions = lesson?.questions ?? [];
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    lessonApi.getById(lessonId)
      .then((data) => {
        setLesson(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить тест');
        setLoading(false);
      });
  }, [lessonId]);

  const handleOptionSelect = (option: string) => {
    if (!currentQuestion || isAnswered) return;

    setSelectedOption(option);
    const correct = checkAnswer(option, currentQuestion.correctAnswer, currentQuestion.type);
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore((prev) => prev + 1);
    setAnswersLog((prev) => [
      ...prev,
      { questionId: currentQuestion.id, userAnswer: option, correct },
    ]);

    if (correct) {
      setTimeout(() => advanceQuestion(), 1200);
    }
  };

  const handleMultiSubmit = () => {
    if (!currentQuestion || isAnswered || selectedMulti.length === 0) return;

    const userAnswer = selectedMulti.join(',');
    const correct = checkAnswer(userAnswer, currentQuestion.correctAnswer, currentQuestion.type);
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore((prev) => prev + 1);
    setAnswersLog((prev) => [
      ...prev,
      { questionId: currentQuestion.id, userAnswer, correct },
    ]);

    if (correct) {
      setTimeout(() => advanceQuestion(), 1200);
    }
  };

  const handleTextSubmit = (answer: string) => {
    if (!currentQuestion || isAnswered) return;

    const correct = checkAnswer(answer, currentQuestion.correctAnswer, currentQuestion.type);
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore((prev) => prev + 1);
    setAnswersLog((prev) => [
      ...prev,
      { questionId: currentQuestion.id, userAnswer: answer, correct },
    ]);

    if (correct) {
      setTimeout(() => advanceQuestion(), 1200);
    }
  };

  const toggleMultiOption = (option: string) => {
    if (isAnswered) return;
    setSelectedMulti((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
    );
  };

  const advanceQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setSelectedMulti([]);
      setTextInput('');
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = async () => {
    if (!lesson || submitting) return;
    setSubmitting(true);
    const timeSpent = Math.round((Date.now() - startedAt) / 1000);
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

    try {
      await lessonApi.submitTest({
        testId: lesson.id,
        score: percentage,
        totalQuestions: questions.length,
        correctAnswers: score,
        timeSpent,
        completedAt: new Date().toISOString(),
        answers: answersLog,
      });
    } catch (err) {
      console.error('Failed to submit test', err);
    } finally {
      navigate('/tests');
    }
  };

  const questionTypeLabel = useMemo(
    () => (currentQuestion ? QUESTION_TYPE_LABELS[currentQuestion.type] : ''),
    [currentQuestion],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-text-secondary font-bold">
        Загрузка теста...
      </div>
    );
  }

  if (error || !lesson || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-text-secondary font-bold">{error ?? 'Тест не найден'}</p>
        <button
          onClick={() => navigate('/tests')}
          className="bg-primary text-white font-bold py-3 px-6 rounded-xl"
        >
          Вернуться к тестам
        </button>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
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
          <h1 className="text-4xl font-black text-text">Тест завершён!</h1>
          <p className="text-sm text-text-secondary font-bold">{lesson.title}</p>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between text-text-secondary font-bold px-4">
              <span>Правильных ответов:</span>
              <span className={percentage >= 80 ? 'text-emerald-500' : 'text-primary'}>
                {score} / {questions.length}
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
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl transition-all shadow-lg mt-4 disabled:opacity-60"
          >
            {submitting ? 'Сохранение...' : 'Вернуться к тестам'}
          </button>
        </motion.div>
      </div>
    );
  }

  const isMulti = currentQuestion.type === 'word_composition';
  const options = currentQuestion.options ?? [];

  return (
    <div className="max-w-2xl mx-auto w-full py-8 md:py-12 flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tests')}
          className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors p-2 -ml-2 rounded-xl hover:bg-surface-hover"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold hidden sm:inline">Отмена</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-surface border border-border/50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-primary">
            {questionTypeLabel}
          </div>
          <div className="bg-surface border border-border/50 px-4 py-1.5 rounded-xl text-sm font-bold text-text-secondary">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-surface border border-border/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${(currentIndex / questions.length) * 100}%` }}
        />
      </div>

      <div className="glass flex-1 flex flex-col items-center justify-center p-8 rounded-[3rem] relative overflow-hidden min-h-[420px]">
        <p className="text-sm text-text-muted font-bold mb-6 text-center">
          {getInstruction(currentQuestion.type)}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className={`mb-10 ${isLargePrompt(currentQuestion.type) ? '' : 'px-4'}`}
          >
            <div className={getPromptClassName(currentQuestion.type)}>
              {currentQuestion.question}
            </div>
          </motion.div>
        </AnimatePresence>

        {currentQuestion.hint && !isAnswered && (
          <p className="text-xs text-text-muted mb-4 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {currentQuestion.hint}
          </p>
        )}

        <div className="w-full max-w-md flex flex-col gap-3 relative z-10">
          {options.length === 0 ? (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (textInput.trim()) handleTextSubmit(textInput);
              }}
              className="flex flex-col gap-3 w-full"
            >
              <div className="relative">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isAnswered}
                  autoFocus
                  placeholder="Введите ответ..."
                  className={`w-full bg-bg border-2 rounded-2xl px-6 py-4 text-xl font-bold text-center focus:outline-none transition-colors disabled:opacity-100 ${
                    isAnswered 
                      ? isCorrect 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' 
                        : 'border-red-500 bg-red-500/10 text-red-500'
                      : 'border-border/50 focus:border-primary text-text'
                  }`}
                />
                {isAnswered && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {!isAnswered && (
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl disabled:opacity-50"
                >
                  Проверить
                </button>
              )}
            </form>
          ) : isMulti ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {options.map((option) => {
                  const isSelected = selectedMulti.includes(option);
                  const isCorrectOption = currentQuestion.correctAnswer
                    .split(',')
                    .map((part) => part.trim())
                    .includes(option);
                  let stateClass = 'border-border/50 hover:border-primary bg-bg';
                  let Icon = null;
                  if (isAnswered) {
                    if (isCorrectOption) {
                      stateClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-600';
                      Icon = <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
                    } else if (isSelected) {
                      stateClass = 'border-red-500 bg-red-500/10 text-red-500';
                      Icon = <XCircle className="w-6 h-6 text-red-500" />;
                    }
                  } else if (isSelected) {
                    stateClass = 'border-primary bg-primary/10 text-primary';
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => toggleMultiOption(option)}
                      className={`py-4 px-3 rounded-2xl border-2 font-jp text-3xl font-black transition-all relative flex items-center justify-center min-h-[64px] ${stateClass}`}
                    >
                      {option}
                      {Icon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {Icon}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {!isAnswered && (
                <button
                  type="button"
                  onClick={handleMultiSubmit}
                  disabled={selectedMulti.length === 0}
                  className="mt-2 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl disabled:opacity-50"
                >
                  Подтвердить выбор
                </button>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {options.map((option) => {
                let stateClass = 'border-border/50 hover:border-primary bg-bg text-text';
                let Icon = null;
                if (isAnswered) {
                  if (option === currentQuestion.correctAnswer) {
                    stateClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-600';
                    Icon = <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
                  } else if (option === selectedOption) {
                    stateClass = 'border-red-500 bg-red-500/10 text-red-500';
                    Icon = <XCircle className="w-6 h-6 text-red-500" />;
                  }
                } else if (option === selectedOption) {
                  stateClass = 'border-primary bg-primary/10 text-primary';
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(option)}
                    className={`py-4 px-3 rounded-2xl border-2 font-bold transition-all relative flex items-center justify-center min-h-[64px] ${stateClass} ${getOptionClassName(currentQuestion.type, option)}`}
                  >
                    {option}
                    {Icon && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {Icon}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            {isAnswered && !isCorrect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 w-full mt-2"
              >
                <div className="text-center">
                  <p className="text-text-secondary text-sm">Правильный ответ:</p>
                  <p className="text-xl font-black text-emerald-500 mt-1 font-jp">
                    {currentQuestion.correctAnswer.replace(/,/g, ' + ')}
                  </p>
                  {currentQuestion.explanation && (
                    <p className="text-xs text-text-muted mt-2">{currentQuestion.explanation}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={advanceQuestion}
                  className="w-full bg-bg border border-border hover:bg-surface-hover text-text font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Продолжить <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </motion.div>
            )}
            {isAnswered && isCorrect && currentQuestion.explanation && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-emerald-600 font-bold mt-2"
              >
                {currentQuestion.explanation}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TestSessionPage;
