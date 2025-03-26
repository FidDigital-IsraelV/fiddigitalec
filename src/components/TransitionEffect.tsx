
import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface TransitionEffectProps {
  children: React.ReactNode;
}

export const TransitionEffect: React.FC<TransitionEffectProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export const FadeIn: React.FC<{ 
  children: React.ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ 
  children, 
  delay = 0,
  duration = 0.5,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn: React.FC<{ 
  children: React.ReactNode; 
  delay?: number;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
}> = ({ 
  children, 
  delay = 0,
  direction = "left",
  className = "" 
}) => {
  const directionValues = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: -20 },
    down: { x: 0, y: 20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionValues[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.7,
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn: React.FC<{ 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}> = ({ 
  children, 
  delay = 0,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5,
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default TransitionEffect;
