import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DogPetProps {
  isPetting: boolean;
  isHovering: boolean;
}

export const DogPet: React.FC<DogPetProps> = ({ isPetting, isHovering }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodically trigger blink
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150);
    };

    const interval = setInterval(() => {
      if (!isPetting) {
        triggerBlink();
      }
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isPetting]);

  // Tail wagging animation speeds
  const tailWagSpeed = isPetting ? 0.15 : isHovering ? 0.3 : 0.6;
  const tailWagAngle = isPetting ? 35 : isHovering ? 25 : 12;

  // Body wiggle when petting
  const bodyWiggle = {
    x: isPetting ? [0, -1, 1, -1, 1, 0] : [0],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      ease: 'easeInOut' as any,
    },
  };

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center select-none"
      animate={isPetting ? (bodyWiggle as any) : {}}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cool Steel-Blue gradients */}
          <linearGradient id="dogBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C5D8EE" />
            <stop offset="60%" stopColor="#8BAED4" />
            <stop offset="100%" stopColor="#5A84B0" />
          </linearGradient>
          {/* Deep Indigo-Blue for Ears */}
          <linearGradient id="dogEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A6FA8" />
            <stop offset="100%" stopColor="#243560" />
          </linearGradient>
        </defs>

        {/* Tail (Wagging) */}
        <motion.path
          d="M 140 170 Q 175 160 185 130 Q 187 122 178 126 Q 168 130 148 162"
          fill="url(#dogBodyGrad)"
          stroke="#5A84B0"
          strokeWidth="1.5"
          style={{ transformOrigin: '140px 170px' }}
          animate={{ rotate: [-tailWagAngle, tailWagAngle, -tailWagAngle] }}
          transition={{
            repeat: Infinity,
            duration: tailWagSpeed,
            ease: 'easeInOut' as any,
          }}
        />

        {/* Dog Body */}
        <path
          d="M 60 180 C 60 130, 140 130, 140 180 C 140 195, 60 195, 60 180 Z"
          fill="url(#dogBodyGrad)"
          stroke="#5A84B0"
          strokeWidth="2"
        />

        {/* White Chest */}
        <ellipse cx="100" cy="165" rx="22" ry="16" fill="#FDFEFE" />

        {/* Collar & Bone Tag */}
        <path
          d="M 72 138 Q 100 150 128 138"
          stroke="#3A5FA8"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Bone Tag */}
        <g transform="translate(100, 148) scale(0.6)">
          <path
            d="M-8 -3 C-12 -6, -12 0, -8 -3 L8 -3 C12 0, 12 -6, 8 -3 C12 -6, 12 -12, 8 -9 L-8 -9 C-12 -12, -12 -6, -8 -9 Z"
            fill="#F0F3F4"
            stroke="#BDC3C7"
            strokeWidth="1"
          />
        </g>

        {/* Left Front Paw */}
        <path
          d="M 78 180 C 78 168, 92 168, 92 180 C 92 185, 78 185, 78 180 Z"
          fill="url(#dogBodyGrad)"
          stroke="#5A84B0"
          strokeWidth="1.5"
        />

        {/* Right Front Paw */}
        <path
          d="M 108 180 C 108 168, 122 168, 122 180 C 122 185, 108 185, 108 180 Z"
          fill="url(#dogBodyGrad)"
          stroke="#5A84B0"
          strokeWidth="1.5"
        />

        {/* Head Group */}
        <motion.g
          style={{ transformOrigin: '100px 100px' }}
          animate={isHovering && !isPetting ? { y: -3 } : { y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          {/* Floppy Ears */}
          {/* Left Ear */}
          <motion.path
            d="M 52 55 C 30 55 25 110 40 115 C 50 117 56 85 56 65"
            fill="url(#dogEarGrad)"
            stroke="#5C2E0B"
            strokeWidth="1.5"
            style={{ transformOrigin: '52px 55px' }}
            animate={isPetting ? { rotate: [-10, 15, -10] } : isHovering ? { rotate: [0, 5, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' as any }}
          />

          {/* Right Ear */}
          <motion.path
            d="M 148 55 C 170 55 175 110 160 115 C 150 117 144 85 144 65"
            fill="url(#dogEarGrad)"
            stroke="#5C2E0B"
            strokeWidth="1.5"
            style={{ transformOrigin: '148px 55px' }}
            animate={isPetting ? { rotate: [10, -15, 10] } : isHovering ? { rotate: [0, -5, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' as any }}
          />

          {/* Head Base */}
          <ellipse
            cx="100"
            cy="90"
            rx="52"
            ry="42"
            fill="url(#dogBodyGrad)"
            stroke="#5A84B0"
            strokeWidth="2"
          />

          {/* White Snout background */}
          <ellipse cx="100" cy="102" rx="20" ry="14" fill="#FDFEFE" />

          {/* Blush (Petting) */}
          {isPetting && (
            <>
              <circle cx="65" cy="100" r="5" fill="#FF6B6B" opacity="0.45" />
              <circle cx="135" cy="100" r="5" fill="#FF6B6B" opacity="0.45" />
            </>
          )}

          {/* Eyes */}
          {isPetting ? (
            // Happy squinting eyes
            <>
              <path
                d="M 68 90 Q 78 80 88 90"
                stroke="#5D4037"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 112 90 Q 122 80 132 90"
                stroke="#5D4037"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : isBlinking ? (
            // Closed eyes
            <>
              <line x1="68" y1="88" x2="88" y2="88" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
              <line x1="112" y1="88" x2="132" y2="88" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            // Open puppy dog eyes
            <>
              <circle cx="78" cy="88" r="8" fill="#3E2723" />
              <circle cx="76" cy="85" r="2.5" fill="#FFFFFF" />
              <circle cx="81" cy="90" r="1.2" fill="#FFFFFF" />

              <circle cx="122" cy="88" r="8" fill="#3E2723" />
              <circle cx="120" cy="85" r="2.5" fill="#FFFFFF" />
              <circle cx="125" cy="90" r="1.2" fill="#FFFFFF" />
            </>
          )}

          {/* Nose */}
          <ellipse cx="100" cy="98" rx="7" ry="5" fill="#1A2E50" />

          {/* Mouth & Tongue */}
          {isPetting ? (
            <>
              {/* Tongue hanging out */}
              <motion.path
                d="M 96 104 Q 100 120 104 104 Z"
                fill="#FF8A8A"
                stroke="#E74C3C"
                strokeWidth="1.5"
                animate={{ scaleY: [1, 1.2, 1] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
              <path
                d="M 92 104 Q 100 108 108 104"
                stroke="#5D4037"
                strokeWidth="2"
                fill="none"
              />
            </>
          ) : (
            // Soft smile
            <path
              d="M 92 104 Q 100 109 108 104"
              stroke="#5D4037"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
};
export default DogPet;
