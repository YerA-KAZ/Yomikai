import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Database, Plus, Search, Trash2, Users, RotateCcw, X } from 'lucide-react';
import {
  adminApi,
  type AdminUser,
  type AdminTestQuestion,
  type DictionaryEntry,
  type AdminLesson,
  type AdminKanji,
} from '../services/api/adminApi';
import {
  ALPHABET_QUESTION_TYPES,
  KANJI_QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
  type QuestionType,
} from '../entities/lesson/types';

type KanjiWordInput = { word: string; reading: string; meaning: string };
type DrawPoint = { x: number; y: number };

const emptyKanjiWord: KanjiWordInput = { word: '', reading: '', meaning: '' };

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'kanji' | 'tests' | 'users'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [kanjiForm, setKanjiForm] = useState({
    char: '',
    meaning: '',
    onyomi: '',
    kunyomi: '',
    jlptLevel: 'N5' as 'N5' | 'N4' | 'N3' | 'N2' | 'N1',
    strokeCount: '1',
    radical: '',
    hint: '',
    words: [{ ...emptyKanjiWord }],
  });
  const [kanjiStrokes, setKanjiStrokes] = useState<{ paths: string[]; order: number }[]>([]);
  const [draftStrokePath, setDraftStrokePath] = useState('');
  const [isSavingKanji, setIsSavingKanji] = useState(false);
  const [showDatabase, setShowDatabase] = useState(false);
  const [dictionaryItems, setDictionaryItems] = useState<DictionaryEntry[]>([]);
  const [kanjiItems, setKanjiItems] = useState<AdminKanji[]>([]);
  const [testItems, setTestItems] = useState<AdminTestQuestion[]>([]);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [dictionaryForm, setDictionaryForm] = useState({
    word: '',
    reading: '',
    meaning: '',
    partOfSpeech: 'noun',
    jlptLevel: 'N5' as 'N5' | 'N4' | 'N3' | 'N2' | 'N1',
  });
  const [testForm, setTestForm] = useState({
    lessonId: '',
    type: 'kana_symbol_to_reading' as QuestionType,
    question: '',
    options: '',
    correctAnswer: '',
    hint: '',
    explanation: '',
  });
  const [newLessonForm, setNewLessonForm] = useState({
    title: '',
    description: '',
    type: 'hiragana' as 'hiragana' | 'katakana' | 'kanji' | 'vocabulary' | 'grammar',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    xpReward: '20',
    estimatedTime: '5',
  });
  const [createNewLesson, setCreateNewLesson] = useState(false);
  const [isSavingDictionary, setIsSavingDictionary] = useState(false);
  const [isSavingTest, setIsSavingTest] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDrawingRef = useRef(false);
  const draftPointsRef = useRef<DrawPoint[]>([]);

  const splitList = (value: string) => value
    .split(/[,\u3001]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const pointsToPath = (points: DrawPoint[]) => points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');

  const getSvgPoint = (event: React.PointerEvent<SVGSVGElement>): DrawPoint | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 109,
      y: ((event.clientY - rect.top) / rect.height) * 109,
    };
  };

  const startStroke = (event: React.PointerEvent<SVGSVGElement>) => {
    const point = getSvgPoint(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    draftPointsRef.current = [point];
    setDraftStrokePath(pointsToPath([point]));
  };

  const continueStroke = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawingRef.current) return;
    const point = getSvgPoint(event);
    if (!point) return;
    draftPointsRef.current = [...draftPointsRef.current, point];
    setDraftStrokePath(pointsToPath(draftPointsRef.current));
  };

  const finishStroke = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const path = pointsToPath(draftPointsRef.current);
    if (draftPointsRef.current.length > 1 && path) {
      setKanjiStrokes((strokes) => {
        const nextStrokes = [...strokes, { paths: [path], order: strokes.length }];
        setKanjiForm((form) => ({
          ...form,
          strokeCount: String(Math.max(Number(form.strokeCount) || 1, nextStrokes.length)),
        }));
        return nextStrokes;
      });
    }
    draftPointsRef.current = [];
    setDraftStrokePath('');
  };

  const removeKanjiStroke = (index: number) => {
    setKanjiStrokes((strokes) => strokes
      .filter((_, strokeIndex) => strokeIndex !== index)
      .map((stroke, order) => ({ ...stroke, order })));
  };

  const handleKanjiWordChange = (index: number, field: keyof KanjiWordInput, value: string) => {
    setKanjiForm((form) => ({
      ...form,
      words: form.words.map((word, wordIndex) => wordIndex === index ? { ...word, [field]: value } : word),
    }));
  };

  const handleAddKanjiWord = () => {
    setKanjiForm((form) => ({ ...form, words: [...form.words, { ...emptyKanjiWord }] }));
  };

  const handleRemoveKanjiWord = (index: number) => {
    setKanjiForm((form) => ({
      ...form,
      words: form.words.length === 1 ? [{ ...emptyKanjiWord }] : form.words.filter((_, wordIndex) => wordIndex !== index),
    }));
  };

  const handleKanjiSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const words = kanjiForm.words
      .map((word) => ({
        word: word.word.trim(),
        reading: word.reading.trim(),
        meaning: word.meaning.trim(),
      }))
      .filter((word) => word.word && word.reading && word.meaning);
    const strokeCount = Math.max(Number(kanjiForm.strokeCount) || 1, kanjiStrokes.length || 1);

    setIsSavingKanji(true);
    try {
      await adminApi.addKanji({
        char: kanjiForm.char.trim(),
        meaning: kanjiForm.meaning.trim(),
        onyomi: splitList(kanjiForm.onyomi),
        kunyomi: splitList(kanjiForm.kunyomi),
        jlptLevel: kanjiForm.jlptLevel,
        strokeCount,
        radical: kanjiForm.radical.trim(),
        hint: kanjiForm.hint.trim() || undefined,
        words,
        examples: words,
        strokes: kanjiStrokes,
      });
      setKanjiForm({
        char: '',
        meaning: '',
        onyomi: '',
        kunyomi: '',
        jlptLevel: 'N5',
        strokeCount: '1',
        radical: '',
        hint: '',
        words: [{ ...emptyKanjiWord }],
      });
      setKanjiStrokes([]);
      alert('Кандзи сохранён');
    } catch (err) {
      console.error('Failed to save kanji', err);
      alert('Не удалось сохранить кандзи');
    } finally {
      setIsSavingKanji(false);
    }
  };

  const splitOptions = (value: string) => value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const loadDatabase = async () => {
    if (activeTab === 'dictionary') {
      const items = await adminApi.getDictionary();
      setDictionaryItems(items);
    } else if (activeTab === 'kanji') {
      const items = await adminApi.getKanji();
      setKanjiItems(items);
    } else if (activeTab === 'tests') {
      const items = await adminApi.getTests();
      setTestItems(items);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      adminApi.getUsers().then(setUsers).catch(console.error);
    }
    if (activeTab === 'tests') {
      adminApi.getLessons().then(setLessons).catch(console.error);
    }
    setShowDatabase(false);
  }, [activeTab]);

  useEffect(() => {
    if (showDatabase && (activeTab === 'dictionary' || activeTab === 'kanji' || activeTab === 'tests')) {
      loadDatabase().catch(console.error);
    }
  }, [showDatabase, activeTab]);

  const handleDictionarySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingDictionary(true);
    try {
      await adminApi.addDictionary({
        word: dictionaryForm.word.trim(),
        reading: dictionaryForm.reading.trim(),
        meaning: dictionaryForm.meaning.trim(),
        partOfSpeech: dictionaryForm.partOfSpeech,
        jlptLevel: dictionaryForm.jlptLevel,
      });
      setDictionaryForm({
        word: '',
        reading: '',
        meaning: '',
        partOfSpeech: 'noun',
        jlptLevel: 'N5',
      });
      alert('Слово сохранено');
      if (showDatabase) await loadDatabase();
    } catch (err) {
      console.error('Failed to save dictionary word', err);
      alert('Не удалось сохранить слово');
    } finally {
      setIsSavingDictionary(false);
    }
  };

  const handleDeleteDictionary = async (id: string, word: string) => {
    if (!confirm(`Удалить слово «${word}»?`)) return;
    try {
      await adminApi.deleteDictionary(id);
      setDictionaryItems((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete dictionary word', err);
    }
  };

  const handleDeleteKanji = async (id: string, char: string) => {
    if (!confirm(`Удалить кандзи «${char}»?`)) return;
    try {
      await adminApi.deleteKanji(id);
      setKanjiItems((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete kanji', err);
    }
  };

  const handleTestSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingTest(true);
    try {
      let lessonId = testForm.lessonId;
      if (createNewLesson) {
        const lesson = await adminApi.addLesson({
          title: newLessonForm.title.trim(),
          description: newLessonForm.description.trim(),
          type: newLessonForm.type,
          difficulty: newLessonForm.difficulty,
          xpReward: Number(newLessonForm.xpReward) || 20,
          estimatedTime: Number(newLessonForm.estimatedTime) || 5,
        }) as AdminLesson;
        lessonId = lesson.id;
        setLessons((prev) => [...prev, { ...lesson, questionCount: 0 }]);
      }

      if (!lessonId) {
        alert('Выберите тест или создайте новый');
        return;
      }

      const options = splitOptions(testForm.options);
      await adminApi.addTest({
        lessonId,
        type: testForm.type,
        question: testForm.question.trim(),
        options: options.length > 0 ? options : undefined,
        correctAnswer: testForm.correctAnswer.trim(),
        hint: testForm.hint.trim() || undefined,
        explanation: testForm.explanation.trim() || undefined,
      });

      setTestForm({
        lessonId: createNewLesson ? lessonId : testForm.lessonId,
        type: testForm.type,
        question: '',
        options: '',
        correctAnswer: '',
        hint: '',
        explanation: '',
      });
      setCreateNewLesson(false);
      alert('Вопрос добавлен');
      if (showDatabase) await loadDatabase();
    } catch (err) {
      console.error('Failed to save test question', err);
      alert('Не удалось добавить вопрос');
    } finally {
      setIsSavingTest(false);
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (!confirm('Удалить этот вопрос?')) return;
    try {
      await adminApi.deleteTest(id);
      setTestItems((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete test question', err);
    }
  };

  const getQuestionFieldLabels = (type: QuestionType) => {
    switch (type) {
      case 'kana_symbol_to_reading':
        return { question: 'Символ каны', options: 'Варианты ромадзи (через запятую)', answer: 'Правильное ромадзи' };
      case 'kana_reading_to_symbol':
        return { question: 'Ромадзи', options: 'Варианты символов (через запятую)', answer: 'Правильный символ' };
      case 'kana_fill_blank':
        return { question: 'Слово с пропуском (напр. ありがと_)', options: 'Варианты символов', answer: 'Правильный символ' };
      case 'kanji_to_meaning':
        return { question: 'Иероглиф', options: 'Варианты значений на русском', answer: 'Правильное значение' };
      case 'meaning_to_kanji':
        return { question: 'Значение на русском', options: 'Варианты иероглифов', answer: 'Правильный иероглиф' };
      case 'word_to_reading':
        return { question: 'Слово (кандзи)', options: 'Варианты чтения хираганой', answer: 'Правильное чтение' };
      case 'kanji_in_context':
        return { question: 'Предложение с пропуском (_)', options: 'Варианты кандзи', answer: 'Правильный кандзи' };
      case 'word_composition':
        return { question: 'Слово (кандзи)', options: 'Все варианты кандзи (через запятую)', answer: 'Состав слова (кандзи через запятую)' };
      default:
        return { question: 'Вопрос', options: 'Варианты', answer: 'Правильный ответ' };
    }
  };

  const questionLabels = getQuestionFieldLabels(testForm.type);

  const handleResetUser = async (id: string, name: string) => {
    if (confirm(`Вы уверены, что хотите обнулить XP пользователя ${name}?`)) {
      try {
        await adminApi.resetUserXp(id);
        setUsers(users.map(u => u.id === id ? { ...u, xp: 0 } : u));
      } catch (err) {
        console.error('Failed to reset XP', err);
      }
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`Вы уверены, что хотите удалить пользователя ${name}? Это действие нельзя отменить.`)) {
      try {
        await adminApi.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error('Failed to delete user', err);
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 max-w-5xl mx-auto w-full">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-text">Профиль Администратора</h1>
            <p className="text-text-secondary">Управление пользователями и контентом приложения</p>
          </div>
        </div>
        
        <button
          onClick={() => window.location.href = '/profile'}
          className="bg-surface border border-border/20 shadow-sm hover:border-primary/50 hover:bg-primary/5 px-4 py-2 rounded-xl font-bold transition-all text-sm text-text"
        >
          Вернуться в профиль
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-surface border border-border/50 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'dictionary' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-bg-secondary'}`}
        >
          Словарь
        </button>
        <button
          onClick={() => setActiveTab('kanji')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'kanji' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-bg-secondary'}`}
        >
          Кандзи
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'tests' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-bg-secondary'}`}
        >
          Тесты
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-bg-secondary'}`}
        >
          Пользователи
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 md:p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">
            {activeTab === 'dictionary' ? 'Добавить новое слово' : 
             activeTab === 'kanji' ? 'Добавить новый кандзи' : 
             activeTab === 'tests' ? 'Создать вопрос для теста' : 'Управление пользователями'}
          </h2>
          {activeTab !== 'users' && (
            <button
              type="button"
              onClick={() => setShowDatabase((value) => !value)}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                showDatabase
                  ? 'bg-primary text-white'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {showDatabase ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              {showDatabase ? 'Закрыть базу' : `База ${activeTab === 'dictionary' ? 'слов' : activeTab === 'kanji' ? 'кандзи' : 'тестов'}`}
            </button>
          )}
        </div>

        {activeTab === 'dictionary' ? (
          showDatabase ? (
            <div className="flex flex-col gap-3">
              {dictionaryItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-bg border border-border/50 rounded-2xl">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xl font-jp font-black">{item.word}</span>
                      <span className="text-sm text-text-secondary">{item.reading}</span>
                      <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full">{item.jlptLevel}</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{item.meaning}</p>
                    <p className="text-xs text-text-muted mt-1">{item.partOfSpeech}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteDictionary(item.id, item.word)}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {dictionaryItems.length === 0 && (
                <div className="text-center py-8 text-text-secondary">Слов в словаре пока нет</div>
              )}
            </div>
          ) : (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleDictionarySubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Слово (Кандзи/Кана)</label>
              <input
                type="text"
                required
                placeholder="Пример: 食べる"
                value={dictionaryForm.word}
                onChange={(event) => setDictionaryForm((form) => ({ ...form, word: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Чтение (Фуригана/Ромадзи)</label>
              <input
                type="text"
                required
                placeholder="Пример: たべる"
                value={dictionaryForm.reading}
                onChange={(event) => setDictionaryForm((form) => ({ ...form, reading: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-text-secondary">Значение на русском</label>
              <input
                type="text"
                required
                placeholder="Пример: есть, кушать"
                value={dictionaryForm.meaning}
                onChange={(event) => setDictionaryForm((form) => ({ ...form, meaning: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Часть речи</label>
              <select
                value={dictionaryForm.partOfSpeech}
                onChange={(event) => setDictionaryForm((form) => ({ ...form, partOfSpeech: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              >
                <option value="verb">Глагол (verb)</option>
                <option value="noun">Существительное (noun)</option>
                <option value="adjective">Прилагательное (adjective)</option>
                <option value="adverb">Наречие (adverb)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Уровень JLPT</label>
              <select
                value={dictionaryForm.jlptLevel}
                onChange={(event) => setDictionaryForm((form) => ({ ...form, jlptLevel: event.target.value as typeof form.jlptLevel }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              >
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
              </select>
            </div>
            
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSavingDictionary}
                className="bg-primary text-white font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                <Plus className="w-5 h-5" />
                {isSavingDictionary ? 'Сохранение...' : 'Сохранить слово в БД'}
              </button>
            </div>
          </form>
          )
        ) : activeTab === 'kanji' ? (
          showDatabase ? (
            <div className="flex flex-col gap-3">
              {kanjiItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-bg border border-border/50 rounded-2xl">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xl font-jp font-black">{item.char}</span>
                      <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full">{item.jlptLevel}</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{item.meaning}</p>
                    <p className="text-xs text-text-muted mt-1">Оньёми: {item.onyomi.join(', ')} | Кунъёми: {item.kunyomi.join(', ')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteKanji(item.id, item.char)}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {kanjiItems.length === 0 && (
                <div className="text-center py-8 text-text-secondary">Кандзи в базе пока нет</div>
              )}
            </div>
          ) : (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleKanjiSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Иероглиф</label>
              <input
                type="text"
                required
                maxLength={2}
                placeholder="Пример: 水"
                value={kanjiForm.char}
                onChange={(event) => setKanjiForm((form) => ({ ...form, char: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Значение</label>
              <input
                type="text"
                required
                placeholder="Пример: Вода"
                value={kanjiForm.meaning}
                onChange={(event) => setKanjiForm((form) => ({ ...form, meaning: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Онъёми (китайские чтения)</label>
              <input
                type="text"
                placeholder="Пример: スイ (разделять запятой)"
                value={kanjiForm.onyomi}
                onChange={(event) => setKanjiForm((form) => ({ ...form, onyomi: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Кунъёми (японские чтения)</label>
              <input
                type="text"
                placeholder="Пример: みず (разделять запятой)"
                value={kanjiForm.kunyomi}
                onChange={(event) => setKanjiForm((form) => ({ ...form, kunyomi: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Уровень JLPT</label>
              <select
                value={kanjiForm.jlptLevel}
                onChange={(event) => setKanjiForm((form) => ({ ...form, jlptLevel: event.target.value as typeof kanjiForm.jlptLevel }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              >
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Ключ / радикал</label>
              <input
                type="text"
                required
                placeholder="Пример: 水"
                value={kanjiForm.radical}
                onChange={(event) => setKanjiForm((form) => ({ ...form, radical: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Количество черт</label>
              <input
                type="number"
                min={1}
                required
                value={kanjiForm.strokeCount}
                onChange={(event) => setKanjiForm((form) => ({ ...form, strokeCount: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Подсказка</label>
              <input
                type="text"
                placeholder="Короткая подсказка для таба «Чтение»"
                value={kanjiForm.hint}
                onChange={(event) => setKanjiForm((form) => ({ ...form, hint: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-3 rounded-2xl border border-border/40 bg-bg/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-text">Слова</h3>
                  <p className="text-xs text-text-secondary">Слово, ромадзи/чтение и перевод попадут в таб «Слова» и квиз чтения.</p>
                </div>
                <button type="button" onClick={handleAddKanjiWord} className="px-3 py-2 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-colors">
                  + Слово
                </button>
              </div>
              {kanjiForm.words.map((word, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <input
                    type="text"
                    placeholder="水"
                    value={word.word}
                    onChange={(event) => handleKanjiWordChange(index, 'word', event.target.value)}
                    className="bg-bg border border-border/50 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="mizu"
                    value={word.reading}
                    onChange={(event) => handleKanjiWordChange(index, 'reading', event.target.value)}
                    className="bg-bg border border-border/50 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="вода"
                    value={word.meaning}
                    onChange={(event) => handleKanjiWordChange(index, 'meaning', event.target.value)}
                    className="bg-bg border border-border/50 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-primary"
                  />
                  <button type="button" onClick={() => handleRemoveKanjiWord(index)} className="px-3 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 rounded-2xl border border-border/40 bg-bg/40 p-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-black text-text">Черты кандзи</h3>
                <p className="text-xs text-text-secondary">Рисуйте каждую черту отдельно. Порядок сохраняется по очереди добавления.</p>
                <svg
                  ref={svgRef}
                  viewBox="0 0 109 109"
                  onPointerDown={startStroke}
                  onPointerMove={continueStroke}
                  onPointerUp={finishStroke}
                  onPointerCancel={finishStroke}
                  className="w-full aspect-square rounded-2xl border border-border/50 bg-surface touch-none cursor-crosshair" 
                 >
                  <path d="M 54.5 0 V 109 M 0 54.5 H 109" stroke="currentColor" strokeWidth="0.5" className="text-border/50" />
                  {kanjiStrokes.map((stroke, index) => stroke.paths.map((path, pathIndex) => (
                    <path key={`${index}-${pathIndex}`} d={path} fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  )))}
                  {draftStrokePath && <path d={draftStrokePath} fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-text-secondary">Последовательность</span>
                  <button type="button" onClick={() => setKanjiStrokes([])} className="text-xs font-bold text-text-muted hover:text-red-500 transition-colors">
                    Очистить
                  </button>
                </div>
                {kanjiStrokes.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {kanjiStrokes.map((stroke, index) => (
                      <div key={index} className="rounded-xl border border-border/30 bg-surface p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-text-muted">#{index + 1}</span>
                          <button type="button" onClick={() => removeKanjiStroke(index)} className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <svg viewBox="0 0 109 109" className="w-full aspect-square">
                          {stroke.paths.map((path, pathIndex) => (
                            <path key={pathIndex} d={path} fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                          ))}
                        </svg>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-border/50 text-sm font-bold text-text-muted">
                    Черты ещё не добавлены
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <button disabled={isSavingKanji} className="bg-primary text-white font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-60">
                <Plus className="w-5 h-5" />
                {isSavingKanji ? 'Сохранение...' : 'Сохранить кандзи в БД'}
              </button>
            </div>
          </form>
          )
        ) : activeTab === 'tests' ? (
          showDatabase ? (
            <div className="flex flex-col gap-3">
              {testItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row md:items-start justify-between gap-3 p-4 bg-bg border border-border/50 rounded-2xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full">
                        {QUESTION_TYPE_LABELS[item.type]}
                      </span>
                      <span className="text-xs text-text-muted">{item.lessonTitle}</span>
                    </div>
                    <p className="text-lg font-jp font-black">{item.question}</p>
                    {Array.isArray(item.options) && item.options.length > 0 && (
                      <p className="text-xs text-text-secondary mt-2">
                        Варианты: {item.options.join(' · ')}
                      </p>
                    )}
                    <p className="text-sm text-emerald-600 font-bold mt-2">Ответ: {item.correctAnswer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteTest(item.id)}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {testItems.length === 0 && (
                <div className="text-center py-8 text-text-secondary">Вопросов в базе пока нет</div>
              )}
            </div>
          ) : (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleTestSubmit}>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-text-secondary">Тип вопроса</label>
              <select
                value={testForm.type}
                onChange={(event) => setTestForm((form) => ({ ...form, type: event.target.value as QuestionType }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              >
                <optgroup label="Азбука">
                  {ALPHABET_QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>{QUESTION_TYPE_LABELS[type]}</option>
                  ))}
                </optgroup>
                <optgroup label="Кандзи">
                  {KANJI_QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>{QUESTION_TYPE_LABELS[type]}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">{questionLabels.question}</label>
              <input
                type="text"
                required
                placeholder="Пример: あ"
                value={testForm.question}
                onChange={(event) => setTestForm((form) => ({ ...form, question: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">{questionLabels.answer}</label>
              <input
                type="text"
                required
                placeholder={testForm.type === 'word_composition' ? '日,本,人' : 'Пример: a'}
                value={testForm.correctAnswer}
                onChange={(event) => setTestForm((form) => ({ ...form, correctAnswer: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-text-secondary">{questionLabels.options}</label>
              <textarea
                required
                rows={2}
                placeholder="a, i, u, o"
                value={testForm.options}
                onChange={(event) => setTestForm((form) => ({ ...form, options: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-text-secondary">Привязать к тесту</label>
              <select
                value={createNewLesson ? 'new' : testForm.lessonId}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === 'new') {
                    setCreateNewLesson(true);
                  } else {
                    setCreateNewLesson(false);
                    setTestForm((form) => ({ ...form, lessonId: value }));
                  }
                }}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              >
                <option value="">Выберите тест...</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title} ({lesson.questionCount} вопр.)
                  </option>
                ))}
                <option value="new">+ Создать новый тест</option>
              </select>
            </div>
            {createNewLesson && (
              <>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-text-secondary">Название нового теста</label>
                  <input
                    type="text"
                    required
                    value={newLessonForm.title}
                    onChange={(event) => setNewLessonForm((form) => ({ ...form, title: event.target.value }))}
                    className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-text-secondary">Описание</label>
                  <input
                    type="text"
                    required
                    value={newLessonForm.description}
                    onChange={(event) => setNewLessonForm((form) => ({ ...form, description: event.target.value }))}
                    className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-secondary">Категория</label>
                  <select
                    value={newLessonForm.type}
                    onChange={(event) => setNewLessonForm((form) => ({ ...form, type: event.target.value as typeof form.type }))}
                    className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
                  >
                    <option value="hiragana">Хирагана</option>
                    <option value="katakana">Катакана</option>
                    <option value="kanji">Кандзи</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-secondary">Сложность</label>
                  <select
                    value={newLessonForm.difficulty}
                    onChange={(event) => setNewLessonForm((form) => ({ ...form, difficulty: event.target.value as typeof form.difficulty }))}
                    className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
                  >
                    <option value="beginner">Начальный</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                  </select>
                </div>
              </>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Подсказка (необязательно)</label>
              <input
                type="text"
                value={testForm.hint}
                onChange={(event) => setTestForm((form) => ({ ...form, hint: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Пояснение (необязательно)</label>
              <input
                type="text"
                value={testForm.explanation}
                onChange={(event) => setTestForm((form) => ({ ...form, explanation: event.target.value }))}
                className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSavingTest}
                className="bg-primary text-white font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                <Plus className="w-5 h-5" />
                {isSavingTest ? 'Сохранение...' : 'Добавить вопрос в тест'}
              </button>
            </div>
          </form>
          )
        ) : activeTab === 'users' ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Поиск по имени или email..." 
                  className="w-full bg-bg border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-text focus:outline-none focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="bg-bg border border-border/50 rounded-xl px-4 py-2.5 text-text focus:outline-none focus:border-primary font-bold min-w-[150px]"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
              >
                <option value="all">Все роли</option>
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </div>

            {filteredUsers.map((user) => (
              <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-bg border border-border/50 rounded-2xl gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg overflow-hidden">
                    {user.avatar.startsWith('/') || user.avatar.startsWith('http') ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text">{user.name}</span>
                      {user.role === 'admin' && (
                        <span className="text-[10px] bg-red-500/10 text-red-500 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                      )}
                    </div>
                    <span className="text-sm text-text-secondary">{user.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Опыт</span>
                    <span className="font-black text-emerald-500">{user.xp} XP</span>
                  </div>
                  
                  {user.role !== 'admin' && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleResetUser(user.id, user.name)}
                        className="p-2.5 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white rounded-xl transition-colors"
                        title="Обнулить XP"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors"
                        title="Удалить аккаунт"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-text-secondary">
                Пользователи не найдены
              </div>
            )}
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default AdminPage;
