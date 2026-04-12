import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { HERO_CONTENT, SOCIAL_LINKS } from '../constants';

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const ghostScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="section-hero"
      className="section-full relative overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Glow Orbs */}
      <div className="glow-orb glow-orb-purple" style={{ width: '600px', height: '600px', top: '-200px', left: '-100px' }} />
      <div className="glow-orb glow-orb-blue" style={{ width: '500px', height: '500px', bottom: '-150px', right: '-100px' }} />



      <div className="section-content flex flex-col items-center text-center relative z-10">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(234,239,255,0.15)] bg-[rgba(234,239,255,0.03)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-label text-[rgba(234,239,255,0.7)]" style={{ letterSpacing: '0.15em', fontSize: '0.6rem' }}>
              {HERO_CONTENT.availability}
            </span>
          </span>
        </motion.div>

        {/* Main Heading — Antimatter style staggered slide-up with italic glow */}
        <motion.div style={{ y: headingY, opacity }}>
          <h1 className="heading-hero text-white mb-6 md:mb-8 max-w-[14ch] mx-auto">
            {HERO_CONTENT.tagline.split(' ').map((word, i) => {
              const isAccent = word === 'Impact.' || word === 'Business';
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.7,
                    delay: 0.4 + i * 0.12,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className={`inline-block mr-[0.2em] ${isAccent ? 'heading-italic-glow' : ''}`}
                >
                  {word}
                </motion.span>
              );
            })}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div style={{ y: subtitleY, opacity }}>
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-body-lg max-w-2xl mx-auto mb-10 md:mb-16 px-4"
          >
            {HERO_CONTENT.subtitle}
          </motion.p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          style={{ opacity: opacity as any }}
        >
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="group relative px-8 py-4 bg-[#EAEFFF] text-[#101010] rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 overflow-hidden shadow-[0_0_30px_rgba(234,239,255,0.3)]"
          >
            <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Get in Touch</span>
          </a>
          <a
            href="#section-work"
            className="px-8 py-4 rounded-full border border-[rgba(234,239,255,0.2)] text-xs uppercase tracking-[0.2em] font-bold text-white/50 hover:text-white hover:border-[rgba(234,239,255,0.4)] hover:shadow-[0_0_20px_rgba(234,239,255,0.1)] transition-all"
          >
            View Work ↓
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity: arrowOpacity as any }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-label text-white/20" style={{ fontSize: '0.5rem' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} className="text-[rgba(234,239,255,0.4)]" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
