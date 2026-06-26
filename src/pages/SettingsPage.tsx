import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Info, Settings, ShieldCheck, Code } from 'lucide-react';
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
                className={`cursor-pointer rounded-3xl border p-5 flex flex-col items-center justify-center gap-3 transition-all duration-300 relative group ${
                  petTheme === 'cat'
                    ? 'border-amber-500/50 ring-2 ring-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent shadow-lg shadow-amber-500/10'
                    : 'border-border/15 hover:border-amber-500/30 hover:bg-surface'
                }`}
              >
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center bg-bg-secondary transition-colors">
                  {petTheme === 'cat' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                </div>

                <div className={`transition-transform duration-500 flex items-center justify-center ${petTheme === 'cat' ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                  <svg viewBox="20 20 160 175" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="miniCatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFA07A" />
                        <stop offset="60%" stopColor="#FF8C00" />
                        <stop offset="100%" stopColor="#E07B00" />
                      </linearGradient>
                    </defs>
                    <path d="M 60 180 C 60 130, 140 130, 140 180 C 140 195, 60 195, 60 180 Z" fill="url(#miniCatGrad)" stroke="#E07B00" strokeWidth="2" />
                    <path d="M 85 145 C 80 160, 120 160, 115 145 C 110 135, 90 135, 85 145 Z" fill="#FFF5EB" />
                    <path d="M 72 138 Q 100 150 128 138" stroke="#E74C3C" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <circle cx="100" cy="148" r="6" fill="#FFE066" stroke="#D35400" strokeWidth="1" />
                    <path d="M 80 180 C 80 170, 92 170, 92 180 C 92 185, 80 185, 80 180 Z" fill="url(#miniCatGrad)" stroke="#E07B00" strokeWidth="1.5" />
                    <path d="M 108 180 C 108 170, 120 170, 120 180 C 120 185, 108 185, 108 180 Z" fill="url(#miniCatGrad)" stroke="#E07B00" strokeWidth="1.5" />
                    <path d="M 50 70 L 35 28 Q 40 24 50 30 L 78 54 Z" fill="url(#miniCatGrad)" stroke="#E07B00" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M 48 63 L 40 35 Q 43 32 50 36 L 68 53 Z" fill="#FFB6C1" opacity="0.8" />
                    <path d="M 150 70 L 165 28 Q 160 24 150 30 L 122 54 Z" fill="url(#miniCatGrad)" stroke="#E07B00" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M 152 63 L 160 35 Q 157 32 150 36 L 132 53 Z" fill="#FFB6C1" opacity="0.8" />
                    <ellipse cx="100" cy="90" rx="56" ry="45" fill="url(#miniCatGrad)" stroke="#E07B00" strokeWidth="2" />
                    <circle cx="78" cy="90" r="7.5" fill="#2C3E50" />
                    <circle cx="76" cy="87.5" r="2.5" fill="#FFFFFF" />
                    <circle cx="122" cy="90" r="7.5" fill="#2C3E50" />
                    <circle cx="120" cy="87.5" r="2.5" fill="#FFFFFF" />
                    <polygon points="97,97 103,97 100,101" fill="#E74C3C" />
                    <path d="M 93 103 Q 97 107 100 103 Q 103 107 107 103" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <line x1="55" y1="97" x2="35" y2="94" stroke="#E07B00" strokeWidth="1.5" />
                    <line x1="53" y1="103" x2="31" y2="103" stroke="#E07B00" strokeWidth="1.5" />
                    <line x1="145" y1="97" x2="165" y2="94" stroke="#E07B00" strokeWidth="1.5" />
                    <line x1="147" y1="103" x2="169" y2="103" stroke="#E07B00" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="flex flex-col items-center">
                  <span className={`text-base font-black transition-colors ${petTheme === 'cat' ? 'text-amber-500' : 'text-text group-hover:text-amber-500'}`}>Кот (Апельсин)</span>
                  <span className="text-xs font-bold text-text-muted mt-0.5 tracking-wide">Тёплая / Оранжевая тема</span>
                </div>
              </div>

              {/* Dog Theme Card */}
              <div
                onClick={() => setPetTheme('dog')}
                className={`cursor-pointer rounded-3xl border p-5 flex flex-col items-center justify-center gap-3 transition-all duration-300 relative group ${
                  petTheme === 'dog'
                    ? 'border-blue-500/50 ring-2 ring-blue-500/30 bg-gradient-to-b from-blue-500/10 to-transparent shadow-lg shadow-blue-500/10'
                    : 'border-border/15 hover:border-blue-500/30 hover:bg-surface'
                }`}
              >
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center bg-bg-secondary transition-colors">
                  {petTheme === 'dog' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>

                <div className={`transition-transform duration-500 flex items-center justify-center ${petTheme === 'dog' ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                  <svg viewBox="30 20 140 180" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="miniDogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C5D8EE" />
                        <stop offset="60%" stopColor="#8BAED4" />
                        <stop offset="100%" stopColor="#5A84B0" />
                      </linearGradient>
                      <linearGradient id="miniDogEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4A6FA8" />
                        <stop offset="100%" stopColor="#243560" />
                      </linearGradient>
                    </defs>
                    <path d="M 52 55 C 30 55 25 110 40 115 C 50 117 56 85 56 65" fill="url(#miniDogEarGrad)" stroke="#243560" strokeWidth="1.5" />
                    <path d="M 148 55 C 170 55 175 110 160 115 C 150 117 144 85 144 65" fill="url(#miniDogEarGrad)" stroke="#243560" strokeWidth="1.5" />
                    <path d="M 140 170 Q 175 160 185 130 Q 187 122 178 126 Q 168 130 148 162" fill="url(#miniDogGrad)" stroke="#5A84B0" strokeWidth="1.5" />
                    <path d="M 60 180 C 60 130, 140 130, 140 180 C 140 195, 60 195, 60 180 Z" fill="url(#miniDogGrad)" stroke="#5A84B0" strokeWidth="2" />
                    <ellipse cx="100" cy="165" rx="22" ry="16" fill="#FDFEFE" />
                    <path d="M 72 138 Q 100 150 128 138" stroke="#3A5FA8" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M 78 180 C 78 168, 92 168, 92 180 C 92 185, 78 185, 78 180 Z" fill="url(#miniDogGrad)" stroke="#5A84B0" strokeWidth="1.5" />
                    <path d="M 108 180 C 108 168, 122 168, 122 180 C 122 185, 108 185, 108 180 Z" fill="url(#miniDogGrad)" stroke="#5A84B0" strokeWidth="1.5" />
                    <ellipse cx="100" cy="90" rx="52" ry="42" fill="url(#miniDogGrad)" stroke="#5A84B0" strokeWidth="2" />
                    <ellipse cx="100" cy="102" rx="20" ry="14" fill="#FDFEFE" />
                    <circle cx="78" cy="88" r="8" fill="#1A2E50" />
                    <circle cx="76" cy="85" r="2.5" fill="#FFFFFF" />
                    <circle cx="122" cy="88" r="8" fill="#1A2E50" />
                    <circle cx="120" cy="85" r="2.5" fill="#FFFFFF" />
                    <ellipse cx="100" cy="98" rx="7" ry="5" fill="#1A2E50" />
                    <path d="M 92 104 Q 100 109 108 104" stroke="#243560" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="flex flex-col items-center">
                  <span className={`text-base font-black transition-colors ${petTheme === 'dog' ? 'text-blue-500' : 'text-text group-hover:text-blue-500'}`}>Пёс (Черныш)</span>
                  <span className="text-xs font-bold text-text-muted mt-0.5 tracking-wide">Холодная / Синяя тема</span>
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
