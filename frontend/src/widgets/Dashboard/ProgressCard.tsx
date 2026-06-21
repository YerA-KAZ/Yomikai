import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../shared/ui/Card';
import { ProgressBar } from '../../shared/ui/ProgressBar';

interface ProgressCardProps {
  learnedKana: number;
  learnedKanji: number;
  totalKana?: number;
  totalKanji?: number;
  learnedWords?: number;
  totalWords?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  learnedKana,
  learnedKanji,
  totalKana = 92, // 46 hiragana + 46 katakana
  totalKanji = 30, // 30 basic kanji
  learnedWords = 120, // Mock fallback
  totalWords = 500, // Mock total target
}) => {
  const totalLearned = learnedKana + learnedKanji;
  const totalItems = totalKana + totalKanji;
  const percentage = Math.round((totalLearned / totalItems) * 100);

  // SVG Circle geometry
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card hoverable className="flex flex-col gap-5 p-5">
      <h3 className="text-lg font-bold text-text">Общий прогресс</h3>

      <div className="flex flex-col md:flex-row lg:flex-col gap-6">
        {/* Radial Progress & Summary */}
        <div className="flex items-center gap-4 border-b border-border/10 pb-4 md:border-b-0 md:pb-0 lg:border-b lg:pb-4">
          <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-md">
              {/* Background Circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-bg-secondary fill-none"
                strokeWidth="7"
              />
              {/* Foreground Circle */}
              <motion.circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-primary fill-none"
                strokeWidth="7"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-text">{percentage}%</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text">Азбуки и Кандзи</span>
            <span className="text-xs text-text-muted mt-1 leading-snug">
              Освоено {totalLearned} из {totalItems} базовых символов.
            </span>
          </div>
        </div>

        {/* Breakdown progress bars */}
        <div className="flex-1 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
              <span>Слоговые азбуки (Кана)</span>
              <span className="text-text">{learnedKana} / {totalKana}</span>
            </div>
            <ProgressBar value={learnedKana} max={totalKana} height="sm" />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
              <span>Иероглифы (Кандзи)</span>
              <span className="text-text">{learnedKanji} / {totalKanji}</span>
            </div>
            <ProgressBar value={learnedKanji} max={totalKanji} height="sm" />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
              <span>Словарный запас</span>
              <span className="text-text">{learnedWords} / {totalWords}</span>
            </div>
            <ProgressBar value={learnedWords} max={totalWords} height="sm" />
          </div>
        </div>
      </div>
    </Card>
  );
};
export default ProgressCard;
