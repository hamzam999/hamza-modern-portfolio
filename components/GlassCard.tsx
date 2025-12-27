import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", glowColor = "rgba(96, 165, 250, 0.2)" }: { children: React.ReactNode; className?: string; glowColor?: string; key?: React.Key }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.01 }}
    className={`glass glass-shine rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 transition-all duration-500 hover:shadow-[0_20px_50px_-10px_${glowColor}] ${className}`}
  >
    {children}
  </motion.div>
);

export default GlassCard;

