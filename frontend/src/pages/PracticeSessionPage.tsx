import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lessonApi } from '../services/api/lessonApi';
import { kanaApi } from '../services/api/kanaApi';
import { kanjiApi } from '../services/api/kanjiApi';
import { dictionaryApi } from '../services/api/dictionaryApi';
import type { PracticeSession } from '../entities/lesson/types';
import { FlashcardsExercise } from '../features/practice/components/FlashcardsExercise';
import { WritingExercise } from '../features/practice/components/WritingExercise';
import { MatchingExercise } from '../features/practice/components/MatchingExercise';
import { QuizExercise } from '../features/practice/components/QuizExercise';
import { flattenKana } from '../features/practice/utils';
import { Button } from '../shared/ui/Button';

export const PracticeSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hiragana, setHiragana] = useState(flattenKana([]));
  const [katakana, setKatakana] = useState(flattenKana([]));
  const [kanji, setKanji] = useState<Awaited<ReturnType<typeof kanjiApi.getAll>>>([]);
  const [vocabulary, setVocabulary] = useState<Awaited<ReturnType<typeof dictionaryApi.getAll>>>([]);

  useEffect(() => {
    if (!sessionId) {
      setError('Сессия не найдена');
      setLoading(false);
      return;
    }

    Promise.all([
      lessonApi.getPracticeSessions(),
      kanaApi.getHiragana(),
      kanaApi.getKatakana(),
      kanjiApi.getAll(),
      dictionaryApi.getAll(),
    ])
      .then(([sessions, hiraGroups, kataGroups, kanjiData, dictData]) => {
        const found = sessions.find((s) => s.id === sessionId);
        if (!found) {
          setError('Упражнение не найдено');
        } else {
          setSession(found);
        }
        setHiragana(flattenKana(hiraGroups));
        setKatakana(flattenKana(kataGroups));
        setKanji(kanjiData.filter((k) => k.jlptLevel === 'N5'));
        setVocabulary(dictData.filter((d) => d.jlptLevel === 'N5'));
        setLoading(false);
      })
      .catch(() => {
        setError('Не удалось загрузить данные');
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6 w-full">
        <div className="h-[120px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
        <div className="h-[400px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-text-secondary font-bold">{error ?? 'Что-то пошло не так'}</p>
        <Button variant="primary" onClick={() => navigate('/practice')}>
          Вернуться к практике
        </Button>
      </div>
    );
  }

  switch (session.type) {
    case 'flashcards':
      return <FlashcardsExercise sessionId={session.id} chars={katakana} />;
    case 'writing':
      return <WritingExercise sessionId={session.id} chars={hiragana} />;
    case 'matching':
      return <MatchingExercise sessionId={session.id} kanjiList={kanji} />;
    case 'quiz':
      return <QuizExercise sessionId={session.id} entries={vocabulary} />;
    default:
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-text-secondary font-bold">Неизвестный тип упражнения</p>
          <Button variant="primary" onClick={() => navigate('/practice')}>
            Вернуться к практике
          </Button>
        </div>
      );
  }
};

export default PracticeSessionPage;
