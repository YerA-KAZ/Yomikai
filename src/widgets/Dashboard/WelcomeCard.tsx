import React from 'react';
import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';
import { Card } from '../../shared/ui/Card';

interface WelcomeCardProps {
  userName: string;
  level: number;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName, level }) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-accent border-none text-white p-6 md:p-8 flex items-center justify-between shadow-xl">
      {/* Background circles for decorative effect */}
      <div className="absolute right-0 top-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute left-1/3 bottom-0 -mb-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            Привет, {userName}!
            <motion.span
              animate={{ rotate: [0, 15, -10, 15, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.2 }}
              className="inline-block"
            >
              <Hand className="w-6 h-6 md:w-8 md:h-8 fill-amber-200 text-amber-200" />
            </motion.span>
          </h2>
        </div>
        <p className="text-white/80 text-sm md:text-base font-medium max-w-sm">
          Готов сделать шаг к идеальному японскому сегодня?
        </p>
      </div>

      <div className="flex flex-col items-center justify-center bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 w-20 h-20 md:w-24 md:h-24 shadow-inner relative z-10">
        <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">Уровень</span>
        <span className="text-3xl md:text-4xl font-black">{level}</span>
      </div>
    </Card>
  );
};
export default WelcomeCard;
