import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CatPetProps {
  isPetting: boolean;
  isHovering: boolean;
}

export const CatPet: React.FC<CatPetProps> = ({ isPetting, isHovering }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodically trigger blink
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150); // Blink duration
    };

    const interval = setInterval(() => {
      if (!isPetting) {
        triggerBlink();
      }
    }, 4000 + Math.random() * 3000); // 4-7 sec interval

    return () => clearInterval(interval);
  }, [isPetting]);

  // Purr vibration animation values
  const purrTransition = {
    y: {
      repeat: Infinity,
      repeatType: 'reverse' as const,
      duration: 0.08,
      ease: 'linear' as any,
    },
  };

  // Paw wave animation
  const pawVariants = {
    wave: {
      rotate: [-12, 18, -12],
      transition: {
        repeat: Infinity,
        duration: 1.8,
        ease: 'easeInOut' as any,
      },
    },
    still: {
      rotate: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center select-none"
      animate={isPetting ? { y: [0, -1.5, 0] } : {}}
      transition={isPetting ? purrTransition : {}}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Orange Gradient for Cat Body */}
          <linearGradient id="catBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA07A" />
            <stop offset="60%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#E07B00" />
          </linearGradient>
          {/* Collar Gold Gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#F5B041" />
          </linearGradient>
        </defs>

        {/* Tail (swaying) */}
        <motion.path
          d="M60 170 C40 185, 20 180, 15 150 C10 120, 30 110, 25 90 C22 80, 12 85, 15 95 C20 110, 0 120, 5 150 C10 190, 45 200, 70 180 Z"
          fill="url(#catBodyGrad)"
          stroke="#E07B00"
          strokeWidth="1.5"
          style={{ transformOrigin: '60px 170px' }}
          animate={isPetting ? { rotate: [-5, 15, -5] } : { rotate: [-3, 5, -3] }}
          transition={{
            repeat: Infinity,
            duration: isPetting ? 1.2 : 2.5,
            ease: 'easeInOut' as any,
          }}
        />

        {/* Cat Body */}
        <path
          d="M 60 180 C 60 130, 140 130, 140 180 C 140 195, 60 195, 60 180 Z"
          fill="url(#catBodyGrad)"
          stroke="#E07B00"
          strokeWidth="2"
        />

        {/* Chest Fur (Cream color) */}
        <path
          d="M 85 145 C 80 160, 120 160, 115 145 C 110 135, 90 135, 85 145 Z"
          fill="#FFF5EB"
        />

        {/* Collar & Bell */}
        <path
          d="M 72 138 Q 100 150 128 138"
          stroke="#E74C3C"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="100" cy="148" r="6" fill="url(#goldGrad)" stroke="#D35400" strokeWidth="1" />
        <circle cx="100" cy="151" r="1.5" fill="#5D4037" />

        {/* Left Paw (resting) */}
        <path
          d="M 80 180 C 80 170, 92 170, 92 180 C 92 185, 80 185, 80 180 Z"
          fill="url(#catBodyGrad)"
          stroke="#E07B00"
          strokeWidth="1.5"
        />

        {/* Right Paw (waving / interactive) */}
        <motion.g
          style={{ transformOrigin: '115px 172px' }}
          variants={pawVariants}
          animate={isPetting ? 'still' : 'wave'}
        >
          <path
            d="M 108 180 C 108 162, 122 162, 122 180 C 122 185, 108 185, 108 180 Z"
            fill="url(#catBodyGrad)"
            stroke="#E07B00"
            strokeWidth="1.5"
          />
          {/* Paw pads (pink) visible if waving */}
          <ellipse cx="115" cy="172" rx="4" ry="3" fill="#FFB6C1" />
          <circle cx="110" cy="166" r="1.5" fill="#FFB6C1" />
          <circle cx="115" cy="164" r="1.5" fill="#FFB6C1" />
          <circle cx="120" cy="166" r="1.5" fill="#FFB6C1" />
        </motion.g>

        {/* Head Group */}
        <motion.g
          style={{ transformOrigin: '100px 100px' }}
          animate={isHovering && !isPetting ? { y: -3 } : { y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          {/* Ears */}
          {/* Left Ear */}
          <path
            d="M 50 70 L 35 25 Q 40 22 50 28 L 78 52 Z"
            fill="url(#catBodyGrad)"
            stroke="#E07B00"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M 47 62 L 39 33 Q 42 31 49 35 L 68 51 Z"
            fill="#FFB6C1"
            opacity="0.8"
          />
          {/* Right Ear */}
          <path
            d="M 150 70 L 165 25 Q 160 22 150 28 L 122 52 Z"
            fill="url(#catBodyGrad)"
            stroke="#E07B00"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M 153 62 L 161 33 Q 158 31 151 35 L 132 51 Z"
            fill="#FFB6C1"
            opacity="0.8"
          />

          {/* Head Base */}
          <ellipse
            cx="100"
            cy="90"
            rx="56"
            ry="45"
            fill="url(#catBodyGrad)"
            stroke="#E07B00"
            strokeWidth="2"
          />

          {/* Blush (Petting) */}
          {isPetting && (
            <>
              <circle cx="62" cy="104" r="6" fill="#FF6B6B" opacity="0.45" />
              <circle cx="138" cy="104" r="6" fill="#FF6B6B" opacity="0.45" />
            </>
          )}

          {/* Eyes */}
          {isPetting ? (
            // Happy closed eyes (^_^ crescents)
            <>
              <path
                d="M 68 92 Q 78 82 88 92"
                stroke="#5D4037"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 112 92 Q 122 82 132 92"
                stroke="#5D4037"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : isBlinking ? (
            // Blinking eyes (flat lines)
            <>
              <line x1="68" y1="90" x2="88" y2="90" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
              <line x1="112" y1="90" x2="132" y2="90" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            // Normal open eyes (black circles with white highlights)
            <>
              <circle cx="78" cy="90" r="7.5" fill="#2C3E50" />
              <circle cx="76" cy="87.5" r="2.5" fill="#FFFFFF" />
              <circle cx="80" cy="92" r="1" fill="#FFFFFF" />

              <circle cx="122" cy="90" r="7.5" fill="#2C3E50" />
              <circle cx="120" cy="87.5" r="2.5" fill="#FFFFFF" />
              <circle cx="124" cy="92" r="1" fill="#FFFFFF" />
            </>
          )}

          {/* Nose */}
          <polygon
            points="97,97 103,97 100,101"
            fill="#E74C3C"
          />

          {/* Mouth */}
          {isPetting ? (
            // Satisfied open mouth
            <path
              d="M 94 104 Q 100 114 106 104"
              stroke="#5D4037"
              strokeWidth="2"
              fill="#E74C3C"
              strokeLinecap="round"
            />
          ) : (
            // Default cat mouth (double curve)
            <path
              d="M 93 103 Q 97 107 100 103 Q 103 107 107 103"
              stroke="#5D4037"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Whiskers */}
          {/* Left Whiskers */}
          <line x1="52" y1="98" x2="32" y2="95" stroke="#E07B00" strokeWidth="1.5" />
          <line x1="50" y1="104" x2="28" y2="104" stroke="#E07B00" strokeWidth="1.5" />
          <line x1="52" y1="110" x2="32" y2="113" stroke="#E07B00" strokeWidth="1.5" />

          {/* Right Whiskers */}
          <line x1="148" y1="98" x2="168" y2="95" stroke="#E07B00" strokeWidth="1.5" />
          <line x1="150" y1="104" x2="172" y2="104" stroke="#E07B00" strokeWidth="1.5" />
          <line x1="148" y1="110" x2="168" y2="113" stroke="#E07B00" strokeWidth="1.5" />
        </motion.g>
      </svg>
    </motion.div>
  );
};
export default CatPet;
