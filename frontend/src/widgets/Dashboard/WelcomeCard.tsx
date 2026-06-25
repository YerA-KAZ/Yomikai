import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../shared/ui/Card';

interface WelcomeCardProps {
  userName: string;
  level: number;
}

const floatingKana = [
  { char: 'あ', size: 'text-6xl', left: '10%', top: '20%', duration: 15 },
  { char: 'カ', size: 'text-8xl', left: '85%', top: '15%', duration: 18 },
  { char: '漢', size: 'text-9xl', left: '75%', top: '75%', duration: 25 },
];

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName, level }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  }, []);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary-dark border-none text-white p-6 md:p-8 flex items-center justify-between shadow-[0_15px_40px_rgba(var(--theme-primary-rgb),0.3)]">
      {/* Background circles for decorative effect */}
      <div className="absolute right-0 top-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse-subtle" />
      <div className="absolute left-1/3 bottom-0 -mb-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />

      {/* Floating Kana inside card */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        {floatingKana.map((k, idx) => (
          <motion.div
            key={idx}
            className={`absolute font-jp font-black select-none ${k.size}`}
            style={{ left: k.left, top: k.top }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: k.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {k.char}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            {greeting}, {userName}!
          </h2>
        </div>
        <p className="text-white/80 text-sm md:text-base font-medium max-w-sm">
          Готов сделать шаг к идеальному японскому сегодня?
        </p>
      </div>

      <div className="flex flex-col items-center justify-center bg-white/15 backdrop-blur-md rounded-3xl border border-white/20 w-20 h-20 md:w-24 md:h-24 shadow-inner relative z-10 transform hover:scale-105 transition-transform duration-300">
        <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">Уровень</span>
        <span className="text-3xl md:text-4xl font-black drop-shadow-md">{level}</span>
      </div>
    </Card>
  );
};
export default WelcomeCard;
