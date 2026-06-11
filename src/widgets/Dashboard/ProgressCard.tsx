import React from 'react';
import { Card } from '../../shared/ui/Card';
import { ProgressBar } from '../../shared/ui/ProgressBar';

interface ProgressCardProps {
  learnedKana: number;
  learnedKanji: number;
  totalKana?: number;
  totalKanji?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  learnedKana,
  learnedKanji,
  totalKana = 92, // 46 hiragana + 46 katakana
  totalKanji = 30, // 30 basic kanji
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

      <div className="flex items-center gap-6">
        {/* Radial Progress */}
        <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-bg-secondary fill-none"
              strokeWidth="6"
            />
            {/* Foreground Circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-primary fill-none transition-all duration-1000 ease-out"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-text">{percentage}%</span>
            <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Выучено</span>
          </div>
        </div>

        {/* Breakdown progress bars */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-col">
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary mb-1">
              <span>Азбука (Кана)</span>
              <span>{learnedKana} / {totalKana}</span>
            </div>
            <ProgressBar value={learnedKana} max={totalKana} height="sm" />
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary mb-1">
              <span>Иероглифы (Кандзи)</span>
              <span>{learnedKanji} / {totalKanji}</span>
            </div>
            <ProgressBar value={learnedKanji} max={totalKanji} height="sm" />
          </div>
        </div>
      </div>
    </Card>
  );
};
export default ProgressCard;
