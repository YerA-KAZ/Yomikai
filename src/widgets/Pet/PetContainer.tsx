import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../features/theme/useThemeStore';
import { CatPet } from './CatPet';
import { DogPet } from './DogPet';
import { HeartParticles } from './HeartParticles';

export const PetContainer: React.FC = () => {
  const { petTheme } = useThemeStore();
  const [isPetting, setIsPetting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const isMouseDown = useRef(false);
  const strokeCount = useRef(0);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only left click
    if (e.button !== 0) return;
    isMouseDown.current = true;
    strokeCount.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    
    // Check movement to qualify as petting
    strokeCount.current += 1;
    if (strokeCount.current > 4 && !isPetting) {
      setIsPetting(true);
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    setIsPetting(false);
  };

  // Touch interaction handlers (for Mobile petting)
  const handleTouchStart = () => {
    isMouseDown.current = true;
    strokeCount.current = 0;
  };

  const handleTouchMove = () => {
    if (!isMouseDown.current) return;
    
    strokeCount.current += 1;
    if (strokeCount.current > 3 && !isPetting) {
      setIsPetting(true);
    }
  };

  const handleTouchEnd = () => {
    isMouseDown.current = false;
    setIsPetting(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    isMouseDown.current = false;
    setIsPetting(false);
    setIsHovering(false);
  };

  return (
    <motion.div
      className="fixed bottom-18 right-4 md:bottom-6 md:right-6 z-40 select-none pet-cursor w-32 h-32 md:w-44 md:h-44 xl:w-52 xl:h-52 touch-none"
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', delay: 0.8, stiffness: 260, damping: 20 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Heart particles that fly out when petting */}
      <HeartParticles active={isPetting} />

      {/* Actual Pet Renderer */}
      {petTheme === 'cat' ? (
        <CatPet isPetting={isPetting} isHovering={isHovering} />
      ) : (
        <DogPet isPetting={isPetting} isHovering={isHovering} />
      )}
    </motion.div>
  );
};
export default PetContainer;
