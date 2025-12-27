import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Typewriter from './Typewriter';
import HeroBackground from './HeroBackground';

const slideInFromLeft = (delay: number) => ({
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      delay: delay,
      duration: 0.5,
    },
  },
});

const slideInFromTop = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5,
    },
  },
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 md:pt-20 overflow-hidden px-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        className="container mx-auto relative z-10 flex flex-col items-center justify-center text-center"
      >
        {/* <HeroBackground /> */}
        <div className="max-w-5xl w-full">
          <motion.div 
            variants={slideInFromTop}
            className="welcome-box inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-8 md:mb-12 border-[#7042f88b] opacity-[0.9]"
          >
            <Sparkles className="text-[#b49bff] w-4 h-4" />
            <h1 className="text-[10px] md:text-[12px] font-black tracking-[0.2em] text-white uppercase">Available for New Projects</h1>
          </motion.div>
          
          <motion.h1 
            variants={slideInFromLeft(0.4)}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-black tracking-tighter mb-6 md:mb-10 leading-[1] md:leading-[0.85] text-white"
          >
            Engineering <br /><span className="text-gradient">Business Impact.</span>
          </motion.h1>

          <motion.div 
            variants={slideInFromLeft(0.7)}
            className="text-base sm:text-lg md:text-3xl text-white/40 mb-10 md:mb-20 max-w-4xl mx-auto leading-tight min-h-[4rem] px-2 font-medium"
          >
            <Typewriter text="Building high-performance storefronts, decentralized economies, and scalable systems for the modern web." />
          </motion.div>

          <motion.div 
            variants={slideInFromLeft(1)}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4"
          >
            <a href="#work" className="group px-8 py-4 md:px-12 md:py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center">
              Selected Work <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={18} />
            </a>
            <a href="#contact" className="px-8 py-4 md:px-12 md:py-6 glass glass-shine rounded-full font-black text-xs uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95 border-white/10">
              Hire Me
            </a>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-20 pointer-events-none"
      >
        <span className="text-[8px] font-black tracking-widest uppercase">Explore</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;

