import React, { FC, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface TextHighlightProps {
  text: string;
  className?: string;
  highlightColor?: string;
}

const HighlightWord: FC<{
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlightColor: string;
}> = ({ children, progress, range, highlightColor }) => {
  const color = useTransform(progress, range, [
    'rgba(255, 255, 255, 0.2)',
    highlightColor,
  ]);

  return (
    <motion.span
      style={{ color }}
      className="relative mx-[0.15em] inline-block transition-none"
    >
      {children}
    </motion.span>
  );
};

const TextHighlight: FC<TextHighlightProps> = ({
  text,
  className = '',
  highlightColor = 'rgba(255, 255, 255, 0.9)',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'start 0.3'],
  });

  const words = text.split(' ');

  return (
    <p
      ref={containerRef}
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <HighlightWord
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            highlightColor={highlightColor}
          >
            {word}
          </HighlightWord>
        );
      })}
    </p>
  );
};

export default TextHighlight;
