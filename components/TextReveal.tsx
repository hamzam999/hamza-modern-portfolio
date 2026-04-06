import React, { FC, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
}

const Word: FC<{ children: string; progress: MotionValue<number>; range: [number, number] }> = ({
  children,
  progress,
  range,
}) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mx-1 lg:mx-1.5 inline-block">
      <span className="opacity-[0.08]">{children}</span>
      <motion.span
        style={{ opacity }}
        className="absolute left-0 top-0 text-white"
      >
        {children}
      </motion.span>
    </span>
  );
};

const TextReveal: FC<TextRevealProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.25'],
  });

  const words = text.split(' ');

  return (
    <p
      ref={containerRef}
      className={`flex flex-wrap leading-relaxed ${className}`}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default TextReveal;
