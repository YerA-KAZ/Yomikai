import type { Lesson, PracticeSession } from '../../entities/lesson/types';

export const mockLessons: Lesson[] = [
  {
    id: 'l1',
    title: 'Хирагана: Ряд А (あ、い、う、え、お)',
    description: 'Основа всей японской письменности. Изучите первые 5 гласных звуков.',
    type: 'hiragana',
    difficulty: 'beginner',
    xpReward: 20,
    estimatedTime: 5,
    completed: true,
    questions: [
      {
        id: 'q1_1',
        type: 'multiple_choice',
        question: 'Какому звуку соответствует символ「あ」?',
        options: ['a', 'i', 'u', 'o'],
        correctAnswer: 'a',
        hint: 'Это самая первая буква алфавита.',
        explanation: 'Символ「あ」читается как русский звук [а].'
      },
      {
        id: 'q1_2',
        type: 'multiple_choice',
        question: 'Какому звуку соответствует символ「い」?',
        options: ['e', 'i', 'u', 'a'],
        correctAnswer: 'i',
        hint: 'Выглядит как две вертикальные черты, левая длиннее с крючком.',
        explanation: 'Символ「い」читается как русский звук [и].'
      },
      {
        id: 'q1_3',
        type: 'multiple_choice',
        question: 'Какому звуку соответствует символ「う」?',
        options: ['u', 'o', 'e', 'a'],
        correctAnswer: 'u',
        hint: 'Похоже на повернутую улитку или ухо.',
        explanation: 'Символ「う」читается как русский звук [у].'
      },
      {
        id: 'q1_4',
        type: 'typing',
        question: 'Напишите чтение (ромадзи) для символа「え」:',
        correctAnswer: 'e',
        hint: 'Звук [э].',
        explanation: 'Символ「え」читается как [е] (или русский звук [э]).'
      },
      {
        id: 'q1_5',
        type: 'typing',
        question: 'Напишите чтение (ромадзи) для символа「お」:',
        correctAnswer: 'o',
        hint: 'Звук [о]. Очень похож на «あ», но с точкой справа вверху.',
        explanation: 'Символ「お」читается как русский звук [о].'
      }
    ]
  },
  {
    id: 'l2',
    title: 'Катакана: Ряд А (ア、イ、ウ、エ、オ)',
    description: 'Изучите катакану — азбуку для заимствованных слов. Первые пять символов.',
    type: 'katakana',
    difficulty: 'beginner',
    xpReward: 20,
    estimatedTime: 5,
    completed: false,
    questions: [
      {
        id: 'q2_1',
        type: 'multiple_choice',
        question: 'Найдите катакану для звука [a]:',
        options: ['ア', 'イ', 'ウ', 'エ'],
        correctAnswer: 'ア',
        hint: 'Угловатый символ, похожий на профиль лица с козырьком.',
        explanation: 'Символ「ア」соответствует звуку [a] в катакане.'
      },
      {
        id: 'q2_2',
        type: 'multiple_choice',
        question: 'Найдите катакану для звука [i]:',
        options: ['オ', 'イ', 'ウ', 'エ'],
        correctAnswer: 'イ',
        hint: 'Похож на человека, стоящего в профиль, или на латинскую букву T на боку.',
        explanation: 'Символ「イ」соответствует звуку [i] в катакане.'
      },
      {
        id: 'q2_3',
        type: 'multiple_choice',
        question: 'Найдите катакану для звука [u]:',
        options: ['ウ', 'ア', 'オ', 'エ'],
        correctAnswer: 'ウ',
        hint: 'Похож на хирагану「う」, но с четкими углами и верхней вертикальной чертой.',
        explanation: 'Символ「ウ」соответствует звуку [u] в катакане.'
      },
      {
        id: 'q2_4',
        type: 'typing',
        question: 'Напишите ромадзи для символа「エ」:',
        correctAnswer: 'e',
        hint: 'Похож на большую латинскую букву I.',
        explanation: 'Символ「エ」соответствует звуку [e] в катакане.'
      },
      {
        id: 'q2_5',
        type: 'typing',
        question: 'Напишите ромадзи для символа「オ」:',
        correctAnswer: 'o',
        hint: 'Похож на человека с раскинутыми руками и одной ногой.',
        explanation: 'Символ「オ」соответствует звуку [o] в катакане.'
      }
    ]
  },
  {
    id: 'l3',
    title: 'Кандзи N5: Первые Числа (一、二、三)',
    description: 'Начните изучать иероглифы с самых простых символов чисел.',
    type: 'kanji',
    difficulty: 'beginner',
    xpReward: 30,
    estimatedTime: 7,
    completed: false,
    questions: [
      {
        id: 'q3_1',
        type: 'multiple_choice',
        question: 'Что означает кандзи「一」?',
        options: ['Один', 'Два', 'Три', 'Человек'],
        correctAnswer: 'Один',
        hint: 'Просто одна горизонтальная линия.',
        explanation: 'Кандзи「一」означает число 1. Читается как «ити».'
      },
      {
        id: 'q3_2',
        type: 'multiple_choice',
        question: 'Какое японское чтение (кунъёми) у кандзи「二」?',
        options: ['ひとつ', 'ふたつ', 'みっつ', 'よっつ'],
        correctAnswer: 'ふたつ',
        hint: 'Для двух вещей используется чтение «фута-цу».',
        explanation: '二つ читается как «футацу» (два предмета).'
      },
      {
        id: 'q3_3',
        type: 'multiple_choice',
        question: 'Какое китайское чтение (онъёми) у кандзи「三」?',
        options: ['ни', 'ити', 'сан', 'си'],
        correctAnswer: 'сан',
        hint: 'Звучит почти так же, как русское числительное, но заканчивается на Н.',
        explanation: 'Онъёми (китайское чтение) для 三 — это「サン」(сан).'
      },
      {
        id: 'q3_4',
        type: 'typing',
        question: 'Напишите значение кандзи「三」(одно слово по-русски, с заглавной буквы):',
        correctAnswer: 'Три',
        hint: 'Три горизонтальные линии.',
        explanation: 'Кандзи「三」означает число 3.'
      },
      {
        id: 'q3_5',
        type: 'typing',
        question: 'Напишите чтение слова「一人」(ромадзи):',
        correctAnswer: 'hitori',
        hint: 'Исключение для чтения «один человек».',
        explanation: 'Слово「一人」читается как «hitori» (один человек).'
      }
    ]
  }
];

export const mockPracticeSessions: PracticeSession[] = [
  {
    id: 'p1',
    type: 'flashcards',
    title: 'Флеш-карты: Хирагана',
    description: 'Повторяйте хирагану с помощью карточек для запоминания.',
    icon: 'Layers',
    itemCount: 46,
    completedCount: 46,
    accuracy: 92
  },
  {
    id: 'p2',
    type: 'writing',
    title: 'Письмо: Катакана',
    description: 'Практикуйте написание символов катаканы в правильном порядке черт.',
    icon: 'PenTool',
    itemCount: 46,
    completedCount: 15,
    accuracy: 80
  },
  {
    id: 'p3',
    type: 'matching',
    title: 'Сопоставление: Кандзи N5',
    description: 'Сопоставляйте иероглифы с их значениями на скорость.',
    icon: 'Puzzle',
    itemCount: 30,
    completedCount: 10,
    accuracy: 85
  },
  {
    id: 'p4',
    type: 'quiz',
    title: 'Викторина: Словарь N5',
    description: 'Проверьте знание лексики базового уровня в игровом формате.',
    icon: 'HelpCircle',
    itemCount: 40,
    completedCount: 25,
    accuracy: 88
  }
];
