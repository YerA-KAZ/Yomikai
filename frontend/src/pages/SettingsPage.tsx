import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Info, Settings, ShieldCheck, Code, Cat, Dog } from 'lucide-react';
import { useThemeStore } from '../features/theme/useThemeStore';
import { Card } from '../shared/ui/Card';

export const SettingsPage: React.FC = () => {
  const { petTheme, colorMode, setPetTheme, setColorMode } = useThemeStore();

  const dailyGoals = [
    { label: 'Легкий', xp: 10, description: '10 XP / день' },
    { label: 'Обычный', xp: 20, description: '20 XP / день' },
    { label: 'Серьезный', xp: 30, description: '30 XP / день' },
    { label: 'Безумный', xp: 50, description: '50 XP / день' },
  ];

  const activeGoalXp = 30; // decorative state

  return (
    <div className="flex flex-col gap-8 py-4 md:py-6 text-text max-w-3xl mx-auto w-full">
      {/* Header Info */}
      <div className="flex items-center gap-3 relative pb-4">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-border/50 via-border/10 to-transparent" />
        <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20 shadow-sm">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold drop-shadow-sm">Настройки</h1>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="flex flex-col gap-10"
      >
        {/* SECTION 1: APPEARANCE */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-extrabold text-text-secondary uppercase tracking-widest bg-surface/80 px-3 py-1 rounded-lg border border-border/10 inline-block shadow-sm">Внешний вид</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-border/30 to-transparent" />
          </div>
          
          {/* Color Mode Select */}
          <Card className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-border/15 bg-surface/60">
            <div className="flex flex-col">
              <span className="text-base font-black text-text">Цветовая схема</span>
              <span className="text-xs text-text-muted mt-1 font-semibold">Светлое или темное оформление интерфейса</span>
            </div>

            <div className="flex bg-surface/80 p-1.5 rounded-2xl border border-border/20 self-start md:self-auto shadow-inner">
              <button
                onClick={() => setColorMode('light')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  colorMode === 'light'
                    ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 shadow-md shadow-amber-200/50 scale-105'
                    : 'text-text-muted hover:text-text hover:bg-bg-secondary'
                }`}
              >
                <Sun className="w-4 h-4" /> Светлая
              </button>
              <button
                onClick={() => setColorMode('dark')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  colorMode === 'dark'
                    ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-md shadow-slate-900/50 scale-105'
                    : 'text-text-muted hover:text-text hover:bg-bg-secondary'
                }`}
              >
                <Moon className="w-4 h-4" /> Темная
              </button>
            </div>
          </Card>

          {/* Pet Selection Select */}
          <Card className="p-6 flex flex-col gap-5 border-border/15 bg-surface/60">
            <div className="flex flex-col">
              <span className="text-base font-black text-text">Интерактивный питомец</span>
              <span className="text-xs text-text-muted mt-1 font-semibold">Выберите пушистого помощника и цветовую тему приложения</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cat Theme Card */}
              <div
                onClick={() => setPetTheme('cat')}
                className={`cursor-pointer rounded-3xl border p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 relative overflow-hidden group ${
                  petTheme === 'cat'
                    ? 'border-amber-500/50 ring-2 ring-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent shadow-lg shadow-amber-500/10'
                    : 'border-border/15 hover:border-amber-500/30 hover:bg-surface'
                }`}
              >
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center bg-bg-secondary transition-colors">
                  {petTheme === 'cat' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                </div>
                
                <div className={`p-4 rounded-full transition-transform duration-500 ${petTheme === 'cat' ? 'bg-amber-500 text-white scale-110 shadow-lg shadow-amber-500/30' : 'bg-surface border border-border/20 text-text-muted group-hover:scale-110 group-hover:text-amber-500 group-hover:bg-amber-500/10'}`}>
                   <Cat className="w-10 h-10" />
                </div>
                
                <div className="flex flex-col items-center">
                  <span className={`text-base font-black transition-colors ${petTheme === 'cat' ? 'text-amber-500' : 'text-text group-hover:text-amber-500'}`}>Кот (Апельсин)</span>
                  <span className="text-xs font-bold text-text-muted mt-0.5 tracking-wide">Теплая / Оранжевая тема</span>
                </div>
              </div>

              {/* Dog Theme Card */}
              <div
                onClick={() => setPetTheme('dog')}
                className={`cursor-pointer rounded-3xl border p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 relative overflow-hidden group ${
                  petTheme === 'dog'
                    ? 'border-blue-500/50 ring-2 ring-blue-500/30 bg-gradient-to-b from-blue-500/10 to-transparent shadow-lg shadow-blue-500/10'
                    : 'border-border/15 hover:border-blue-500/30 hover:bg-surface'
                }`}
              >
                 <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center bg-bg-secondary transition-colors">
                  {petTheme === 'dog' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                
                <div className={`p-4 rounded-full transition-transform duration-500 ${petTheme === 'dog' ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/30' : 'bg-surface border border-border/20 text-text-muted group-hover:scale-110 group-hover:text-blue-500 group-hover:bg-blue-500/10'}`}>
                   <Dog className="w-10 h-10" />
                </div>

                <div className="flex flex-col items-center">
                  <span className={`text-base font-black transition-colors ${petTheme === 'dog' ? 'text-blue-500' : 'text-text group-hover:text-blue-500'}`}>Пес (Черныш)</span>
                  <span className="text-xs font-bold text-text-muted mt-0.5 tracking-wide">Холодная / Голубая тема</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* SECTION 2: LEARNING GOAL */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-extrabold text-text-secondary uppercase tracking-widest bg-surface/80 px-3 py-1 rounded-lg border border-border/10 inline-block shadow-sm">Цели обучения</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-border/30 to-transparent" />
          </div>
          <Card className="p-6 flex flex-col gap-5 border-border/15 bg-surface/60">
            <div className="flex flex-col">
              <span className="text-base font-black text-text">Ежедневная норма опыта</span>
              <span className="text-xs text-text-muted mt-1 font-semibold">Выберите норму XP в день для поддержания темпа обучения</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {dailyGoals.map((goal) => {
                const isActive = activeGoalXp === goal.xp;
                return (
                  <div
                    key={goal.xp}
                    onClick={() => alert(`Ежедневная цель изменена на ${goal.xp} XP!`)}
                    className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center text-center justify-center transition-all duration-300 relative group ${
                      isActive
                        ? 'border-primary ring-2 ring-primary/20 bg-gradient-to-b from-primary/10 to-transparent shadow-md'
                        : 'border-border/15 bg-surface/40 hover:bg-surface hover:border-primary/30'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                    )}
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text'}`}>
                      {goal.label}
                    </span>
                    <span className="text-xl font-black text-text mt-2 drop-shadow-sm group-hover:text-primary transition-colors">{goal.xp}</span>
                    <span className="text-[9px] text-text-muted font-bold mt-1 tracking-widest uppercase">XP в день</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* SECTION 3: SYSTEM INFO */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-extrabold text-text-secondary uppercase tracking-widest bg-surface/80 px-3 py-1 rounded-lg border border-border/10 inline-block shadow-sm">О приложении</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-border/30 to-transparent" />
          </div>
          <Card className="p-6 flex flex-col gap-5 border-border/15 bg-surface/60">
            <div className="flex items-center gap-4 border-b border-border/10 pb-4">
              <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-sm">
                 <Info className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black text-text tracking-wide">Yomikai</span>
                <span className="text-xs text-text-muted font-bold tracking-widest uppercase mt-0.5">Версия 1.0.0 (Beta)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className="flex justify-between items-center py-2 px-3 hover:bg-surface rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold text-text-secondary group-hover:text-text">Лицензия и Конфиденциальность</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">Подробнее</span>
              </button>

              <button className="flex justify-between items-center py-2 px-3 hover:bg-surface rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <Code className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-text-secondary group-hover:text-text">Открытый исходный код</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">GitHub</span>
              </button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default SettingsPage;
