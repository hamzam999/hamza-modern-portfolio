import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const Typewriter = ({ text, delay = 0.05 }: { text: string; delay?: number }) => {
  const letters = useMemo(() => text.split(""), [text]);
  return (
    <span>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * delay, duration: 0.1 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export default Typewriter;

