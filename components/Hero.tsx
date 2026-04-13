import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Cpu, ShieldCheck, Activity, Box } from 'lucide-react';
import { HERO_CONTENT, SOCIAL_LINKS } from '../constants';

const HERO_META = [
  { icon: Cpu, label: "SYS_STATUS", value: "ONLINE" },
  { icon: Activity, label: "LATENCY", value: "12ms" },
  { icon: ShieldCheck, label: "SECURITY", value: "SECURED" },
];

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="section-hero"
      className="section-full relative overflow-hidden flex items-center justify-center pt-24"
      style={{ minHeight: '100vh' }}
    >
      {/* Background Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-grid-tech opacity-10 pointer-events-none" />
      
      {/* Ambient glowing orb centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue/20 to-emerald/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      {/* Main Content */}
      <div className="section-content relative z-10 px-6 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Top Terminal Stats */}
        <div className="flex items-center gap-6 mb-16 overflow-hidden bg-white/[0.02] border border-white/5 px-6 py-3 rounded-full backdrop-blur-md">
          {HERO_META.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 border-r border-white/10 pr-6 last:border-0 last:pr-0"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/40">{item.label}</span>
                  <span className="text-[10px] font-mono text-emerald">{item.value}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Status Line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="px-4 py-1.5 rounded-full border border-blue/20 bg-blue/10 text-[11px] font-mono text-blue uppercase tracking-widest">
            {HERO_CONTENT.availability}
          </div>
        </motion.div>

        {/* Tagline / Heading */}
        <motion.div style={{ y: headingY, opacity }} className="text-center w-full">
          <h1 className="text-white mb-8 relative flex flex-col text-[clamp(3.5rem,10vw,10rem)] leading-[0.85] font-black tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="text-white drop-shadow-2xl">
              ENGINEERING
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue to-emerald drop-shadow-[0_0_20px_rgba(0,153,255,0.3)]">
              BUSINESS IMPACT.
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-white/50 leading-relaxed font-light"
          >
            {HERO_CONTENT.subtitle}
          </motion.p>
        </motion.div>

        {/* Primary Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <span className="relative z-10 text-[13px] font-bold uppercase tracking-widest">
              Initialize Session
            </span>
          </a>

          <a
            href="#section-work"
            className="flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 text-white/60 hover:text-white transition-all text-[13px] font-bold uppercase tracking-widest group"
          >
            <Box size={16} className="group-hover:text-blue transition-colors" />
            <span>Review Data</span>
          </a>
        </motion.div>
      </div>

      {/* Hero Footnotes / Technical Metadata */}
      <div className="absolute bottom-12 left-12 hidden xl:block">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-emerald/40 uppercase">Lat: 26.4499° N</span>
          <span className="text-[10px] font-mono text-emerald/40 uppercase">Long: 80.3319° E</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity: arrowOpacity as any }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="h-16 w-px bg-gradient-to-b from-blue to-transparent animate-pulse" />
        <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-white/40 rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Explore
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
