import React from 'react';
import { motion } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right';

const generateVariants = (direction: Direction) => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const value = direction === 'right' || direction === 'down' ? 80 : -80;
  return {
    hidden: { filter: 'blur(8px)', opacity: 0, [axis]: value } as any,
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      [axis]: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    } as any,
  };
};

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  once?: boolean;
  amount?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  once = true,
  amount = 0.3,
}) => {
  const baseVariants = generateVariants(direction as Direction);
  const variants = {
    hidden: baseVariants.hidden,
    visible: {
      ...baseVariants.visible,
      transition: {
        ...baseVariants.visible.transition,
        delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={variants}
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
