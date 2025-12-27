import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", glowColor = "rgba(96, 165, 250, 0.2)" }: { children: React.ReactNode; className?: string; glowColor?: string }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.01 }}
    className={`glass glass-shine rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-[0_20px_50px_-10px_${glowColor}] ${className}`}
  >
    {children}
  </motion.div>
);

export default GlassCard;

