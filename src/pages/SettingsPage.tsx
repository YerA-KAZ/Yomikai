import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Info, Settings, ShieldCheck, Code } from 'lucide-react';
import { useThemeStore } from '../features/theme/useThemeStore';
import { Card } from '../shared/ui/Card';
import { Badge } from '../shared/ui/Badge';

export const SettingsPage: React.FC = () => {
  const { petTheme, colorMode, setPetTheme, setColorMode, toggleColorMode } = useThemeStore();

  const dailyGoals = [
    { label: 'Легкий', xp: 10, description: '10 XP / день' },
    { label: 'Обычный', xp: 20, description: '20 XP / день' },
    { label: 'Серьезный', xp: 30, description: '30 XP / день' },
    { label: 'Безумный', xp: 50, description: '50 XP / день' },
  ];

  const activeGoalXp = 30; // decorative state

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 text-text max-w-3xl mx-auto">
      {/* Header Info */}
      <div className="flex items-center gap-2 border-b border-border/10 pb-3">
        <Settings className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-extrabold">Настройки</h1>
      </div>

      {/* SECTION 1: APPEARANCE */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold text-text-secondary uppercase tracking-wider text-xs">Внешний вид и Оформление</h3>
        
        {/* Color Mode Select */}
        <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text">Цветовая схема</span>
            <span className="text-xs text-text-muted mt-0.5">Выберите темное или светлое оформление интерфейса</span>
          </div>

          <div className="flex bg-bg-secondary p-1 rounded-2xl border border-border/10 self-start md:self-auto">
            <button
              onClick={() => setColorMode('light')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                colorMode === 'light'
                  ? 'bg-surface text-primary shadow shadow-primary/5 border border-primary/10'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Светлая
            </button>
            <button
              onClick={() => setColorMode('dark')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                colorMode === 'dark'
                  ? 'bg-surface text-primary shadow shadow-primary/5 border border-primary/10'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Темная
            </button>
          </div>
        </Card>

        {/* Pet Selection Select */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text">Интерактивный питомец</span>
            <span className="text-xs text-text-muted mt-0.5">Выберите вашего постоянного пушистого помощника и тему</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cat Theme Card */}
            <div
              onClick={() => setPetTheme('cat')}
              className={`cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden bg-surface/30 ${
                petTheme === 'cat'
                  ? 'border-primary ring-2 ring-primary/20 shadow-md bg-primary/5 shadow-primary/5'
                  : 'border-border/10 hover:border-primary/25 hover:bg-surface-hover/20'
              }`}
            >
              {petTheme === 'cat' && (
                <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-primary" />
              )}
              {/* Cat inline SVG preview */}
              <svg className="w-16 h-16 fill-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2c-3.31 0-6 2.69-6 6v3.28C5.22 11.75 4 13.73 4 16c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.27-1.22-4.25-2-4.72V8c0-3.31-2.69-6-6-6zm-3.5 8c-.83 0-1.5-.67-1.5-1.5S7.67 7 8.5 7 10 7.67 10 8.5 9.33 10 8.5 10zm7 0c-.83 0-1.5-.67-1.5-1.5S14.67 7 15.5 7s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-text">Кот (Апельсин)</span>
                <span className="text-[10px] text-text-muted mt-0.5">Оранжевая тема</span>
              </div>
            </div>

            {/* Dog Theme Card */}
            <div
              onClick={() => setPetTheme('dog')}
              className={`cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden bg-surface/30 ${
                petTheme === 'dog'
                  ? 'border-primary ring-2 ring-primary/20 shadow-md bg-primary/5 shadow-primary/5'
                  : 'border-border/10 hover:border-primary/25 hover:bg-surface-hover/20'
              }`}
            >
              {petTheme === 'dog' && (
                <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-primary" />
              )}
              {/* Dog inline SVG preview */}
              <svg className="w-16 h-16 fill-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-text">Пес (Черныш)</span>
                <span className="text-[10px] text-text-muted mt-0.5">Голубая тема</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 2: LEARNING GOAL */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold text-text-secondary uppercase tracking-wider text-xs">Цели обучения</h3>
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text">Ежедневная цель по опыту (XP)</span>
            <span className="text-xs text-text-muted mt-0.5">Выберите норму XP в день для поддержания темпа обучения</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dailyGoals.map((goal) => {
              const isActive = activeGoalXp === goal.xp;
              return (
                <div
                  key={goal.xp}
                  onClick={() => alert(`Ежедневная цель изменена на ${goal.xp} XP!`)}
                  className={`cursor-pointer border rounded-2xl p-3 flex flex-col items-center text-center justify-center transition-all bg-surface/20 ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border/10 hover:bg-surface-hover/20 hover:border-primary/20'
                  }`}
                >
                  <span className="text-xs font-extrabold text-text-secondary">{goal.label}</span>
                  <span className="text-sm font-black text-text mt-1.5">{goal.xp} XP</span>
                  <span className="text-[9px] text-text-muted font-semibold mt-0.5">в день</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* SECTION 3: SYSTEM INFO */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold text-text-secondary uppercase tracking-wider text-xs">О приложении</h3>
        <Card className="p-5 flex flex-col gap-4 text-xs font-semibold text-text-secondary">
          <div className="flex items-center gap-3 border-b border-border/5 pb-3">
            <Info className="w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text">Yomikai App</span>
              <span className="text-[10px] text-text-muted mt-0.5">Версия 1.0.0 (Beta)</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Лицензия & Конфиденциальность</span>
            </div>
            <a href="#" className="text-primary hover:underline text-[11px] font-bold">Подробнее</a>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-border/5 pt-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-text" />
              <span>Открытый исходный код</span>
            </div>
            <a href="#" className="text-primary hover:underline text-[11px] font-bold">Репозиторий</a>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default SettingsPage;
