import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  drift: number;
}

interface HeartParticlesProps {
  active: boolean;
  color?: string;
}

const MAX_HEARTS = 15;

export const HeartParticles = ({ active, color = 'var(--theme-primary)' }: HeartParticlesProps) => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const idCounter = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spawnHeart = useCallback(() => {
    const newHeart: Heart = {
      id: idCounter.current++,
      x: Math.random() * 80 + 10,
      y: Math.random() * 30 + 60,
      size: Math.random() * 12 + 16,
      delay: 0,
      drift: (Math.random() - 0.5) * 60,
    };

    setHearts((prev) => {
      const trimmed = prev.length >= MAX_HEARTS ? prev.slice(1) : prev;
      return [...trimmed, newHeart];
    });

    // Remove heart after animation completes
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2000);
  }, []);

  useEffect(() => {
    if (active) {
      // Spawn first heart immediately
      spawnHeart();

      const scheduleNext = () => {
        const delay = Math.random() * 200 + 200; // 200-400ms
        intervalRef.current = setTimeout(() => {
          spawnHeart();
          scheduleNext();
        }, delay);
      };

      scheduleNext();
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, spawnHeart]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
            }}
            initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.1, 1, 0.8],
              y: -120,
              x: heart.drift,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 2,
              ease: 'easeOut',
              opacity: { times: [0, 0.1, 0.6, 1] },
              scale: { times: [0, 0.15, 0.5, 1] },
            }}
          >
            <svg
              width={heart.size}
              height={heart.size}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill={color}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
