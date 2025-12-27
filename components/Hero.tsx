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
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <HeroBackground />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        className="container mx-auto px-8 relative z-10 flex flex-col items-center justify-center text-center"
      >
        <div className="max-w-5xl">
          <motion.div 
            variants={slideInFromTop}
            className="welcome-box inline-flex items-center space-x-3 px-5 py-3 glass rounded-full mb-12 border-[#7042f88b] opacity-[0.9]"
          >
            <Sparkles className="text-[#b49bff] w-5 h-5" />
            <h1 className="text-[13px] font-black tracking-[0.2em] text-white uppercase">Available for New Projects</h1>
          </motion.div>
          
          <motion.h1 
            variants={slideInFromLeft(0.5)}
            className="text-5xl md:text-[8rem] font-black tracking-tighter mb-12 leading-[0.85] text-white"
          >
            Engineering <br /><span className="text-gradient">Business Impact.</span>
          </motion.h1>

          <motion.div 
            variants={slideInFromLeft(0.8)}
            className="text-xl md:text-3xl text-white/40 mb-20 max-w-4xl mx-auto leading-tight min-h-[4rem]"
          >
            <Typewriter text="Building high-performance storefronts, decentralized economies, and scalable systems for the modern web." />
          </motion.div>

          <motion.div 
            variants={slideInFromLeft(1)}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <a href="#work" className="group px-12 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center">
              Selected Work <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={20} />
            </a>
            <a href="#contact" className="px-12 py-6 glass glass-shine rounded-full font-black text-xs uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95 border-white/10">
              Hire Me
            </a>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 opacity-30"
      >
        <span className="text-[10px] font-black tracking-widest uppercase">Explore</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;

