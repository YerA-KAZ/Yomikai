# Yomikai — Платформа для изучения японского языка

> Полнофункциональное интерактивное веб-приложение с геймификацией, системой лиг и виртуальным питомцем.

[![Deploy on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render)](https://render.com)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)

---

## 📋 Возможности

- **🔤 Алфавиты** — Хирагана и Катакана с интерактивными карточками и практикой
- **🀄 Кандзи** — Иероглифы с мнемониками, примерами и уровнями JLPT
- **📖 Словарь** — Расширенный каталог слов с поиском и фильтрацией
- **📝 Тесты** — Адаптивные тесты с системой опыта (XP)
- **🎮 Практика** — Флэш-карточки, Matching, Quiz, Writing — 4 игровых режима
- **🏆 Таблица лидеров** — 6 лиг, еженедельное повышение топ-3 участников
- **🔥 Ударный режим** — Динамический подсчёт дней непрерывного обучения
- **📊 Статистика** — Недельный график активности, точность, общее время
- **🐾 Виртуальный питомец** — Кот (Светлая/Оранжевая) или Пёс (Тёмная/Голубая)
- **🌙 Две темы** — Светлая и Тёмная, привязаны к питомцу и цветовой схеме
- **👑 Панель администратора** — Управление контентом, пользователями и лигами

---

## 🏗️ Архитектура

### Монорепо структура

```
ProjectYomikai/
├── frontend/               # React + TypeScript + Vite
│   └── src/
│       ├── pages/          # Страницы (Home, Practice, Leaderboard, Profile...)
│       ├── widgets/        # Составные UI-виджеты (Dashboard, Header, Sidebar)
│       ├── features/       # Бизнес-логика (auth, practice, theme, user)
│       ├── entities/       # Типы данных (user, lesson, kana, kanji)
│       ├── services/api/   # HTTP-клиент и API-методы
│       └── shared/ui/      # Переиспользуемые компоненты (Button, Card, Badge)
│
├── backend/                # Express + TypeScript + Prisma
│   └── src/
│       ├── routes/         # REST API маршруты
│       ├── services/       # Бизнес-логика (user, league, content)
│       ├── middleware/     # Auth, Error handler
│       └── lib/            # JWT, env, date utils
│   └── prisma/
│       ├── schema.prisma   # Схема БД
│       └── seed.ts         # Начальные данные
│
└── README.md
```

---

## 🛠️ Технологический стек

### Frontend
| Технология | Назначение |
|---|---|
| React 19 | UI-библиотека |
| TypeScript 5 | Статическая типизация |
| Vite 6 | Сборщик / HMR |
| TailwindCSS 4 | Утилитарные CSS-стили |
| Framer Motion | Анимации и переходы |
| React Router 7 | Клиентская маршрутизация |
| Zustand | Глобальное состояние |
| Lucide React | SVG иконки |

### Backend
| Технология | Назначение |
|---|---|
| Express 4 | Web-фреймворк |
| TypeScript 5 | Статическая типизация |
| Prisma 6 | ORM + управление миграциями |
| PostgreSQL 16 | Реляционная база данных |
| JWT (jsonwebtoken) | Токен-аутентификация |
| Bcrypt | Хеширование паролей |
| Zod | Валидация входных данных |

### Деплой
| Сервис | Роль |
|---|---|
| **Render** | Backend Web Service + PostgreSQL |
| **Render Static Sites** | Frontend (SPA) |
| **cron-job.org** | Внешний планировщик еженедельного обновления лиг |

---

## 🚀 Установка и запуск

### Требования
- Node.js 20+
- npm 10+
- PostgreSQL 15+ (или подключение к Render DB)

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # Production сборка
npm run lint       # Проверка кода
```

### Backend

```bash
cd backend
npm install
cp .env.example .env        # Заполните переменные
npm run prisma:migrate      # Применить миграции к БД
npm run prisma:seed         # Заполнить БД начальными данными
npm run dev                 # http://localhost:3001
npm run prisma:studio       # Визуальный редактор БД на localhost:5555
```

---

## 🔧 Переменные окружения

### `backend/.env`

```env
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/yomikai_db
JWT_SECRET=your-jwt-secret-key
FRONTEND_ORIGIN=http://localhost:5173
CRON_SECRET=your-cron-secret-key
```

> ⚠️ Никогда не добавляйте `.env` в git-репозиторий! Файл внесён в `.gitignore`.

---

## 📦 API эндпоинты

### Аутентификация

| Метод | URL | Описание |
|---|---|---|
| `POST` | `/api/auth/register` | Регистрация нового пользователя |
| `POST` | `/api/auth/login` | Вход в систему |

### Пользователь (требует JWT)

| Метод | URL | Описание |
|---|---|---|
| `GET` | `/api/user/me` | Профиль текущего пользователя |
| `POST` | `/api/user/me` | Обновление профиля |
| `GET` | `/api/user/stats` | Статистика (XP, streak, недельная активность) |
| `POST` | `/api/user/me/xp` | Начислить XP пользователю |

### Контент (требует JWT)

| Метод | URL | Описание |
|---|---|---|
| `GET` | `/api/lessons` | Список уроков |
| `GET` | `/api/kana` | Хирагана и Катакана |
| `GET` | `/api/kanji` | Иероглифы |
| `GET` | `/api/dictionary` | Словарь |
| `GET` | `/api/practice-sessions` | Сессии для практики |

### Тесты (требует JWT)

| Метод | URL | Описание |
|---|---|---|
| `GET` | `/api/tests` | Список тестов |
| `POST` | `/api/tests/:id/submit` | Отправить результат теста |

### Лидерборд (требует JWT)

| Метод | URL | Описание |
|---|---|---|
| `GET` | `/api/leaderboard/weekly` | Еженедельный рейтинг лиги |
| `GET` | `/api/leaderboard/all-time` | Рейтинг за всё время |

### Cron (защищённый)

| Метод | URL | Описание |
|---|---|---|
| `POST` | `/api/cron/weekly-update` | Запустить еженедельное повышение лиг |

> Требует заголовок: `Authorization: Bearer <CRON_SECRET>`

---

## 🏆 Система лиг

6 уровней (от низшего к высшему):

| # | Название | |
|---|---|---|
| 1 | Лига Академии | *(начальная для всех пользователей)* |
| 2 | Лига Храма Знаний | |
| 3 | Лига Додзё | |
| 4 | Лига Самураев | |
| 5 | Лига Сёгунов | |
| 6 | Лига Императора | *(высшая)* |

Каждое воскресенье в 23:59 топ-3 участника каждой лиги переходят на следующий уровень. Запуск обеспечивается внешним cron-сервисом (`cron-job.org`).

---

## 🗄️ Схема базы данных

Ключевые модели Prisma:

| Модель | Назначение |
|---|---|
| **User** | Пользователи: XP, streak, роль (USER/ADMIN) |
| **ActivityLog** | Ежедневная активность (минуты, XP за день) |
| **Lesson / LessonContent** | Уроки и их контент |
| **Test / Question / TestAttempt** | Тесты, вопросы, результаты |
| **League / LeagueParticipant** | 6 лиг, недельный XP, позиция |
| **KanaGroup / KanaChar** | Символы хираганы и катаканы |
| **KanjiEntry** | Иероглифы (значение, чтение, JLPT) |
| **DictionaryEntry** | Слова и фразы словаря |

---

## 📝 Соглашения о коде

- **Feature-Based** архитектура на Frontend (`features/`, `entities/`, `widgets/`)
- **Service Layer** паттерн на Backend (`routes/` → `services/` → `prisma`)
- Весь код на TypeScript со strict-режимом
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`

---

## 👨‍💻 Автор

**YerA-KAZ** — [GitHub](https://github.com/YerA-KAZ/Yomikai)
