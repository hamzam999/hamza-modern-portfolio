import React from 'react';
import { motion } from 'framer-motion';
import NeonIcon from './NeonIcon';

const SectionTitle = ({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon?: any }) => (
  <div className="mb-10 md:mb-24 text-center md:text-left flex flex-col items-center md:items-start relative z-10 w-full px-2">
   <motion.div className='flex space-x-4 justify-center items-center'>
    {Icon && (
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        className="mb-4 md:mb-6"
      >
        <NeonIcon icon={Icon} color="#60a5fa" size={32} />
      </motion.div>
    )}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 md:mb-6 leading-[1.1] md:leading-[0.9] text-white"
    >
      {title}
    </motion.h2>
    </motion.div>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-white/50 text-base md:text-2xl max-w-3xl leading-relaxed"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

export default SectionTitle;

