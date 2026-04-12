import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Cpu, ShieldCheck, Activity, Box } from 'lucide-react';
import { HERO_CONTENT, SOCIAL_LINKS } from '../constants';

const HUD_DECOR = [
  { icon: Cpu, label: "Core.Status", value: "Optimal" },
  { icon: Activity, label: "Pulse", value: "98.2%" },
  { icon: ShieldCheck, label: "Security", value: "Secured" },
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
      
      {/* Ambient Tech Glow */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <div className="section-content relative z-10 px-6 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Top HUD Stats */}
        <div className="flex items-center gap-6 mb-12 overflow-hidden">
          {HUD_DECOR.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2 border-r border-white/10 pr-6 last:border-0"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-cyan-500/50 uppercase tracking-[0.2em]">{item.label}</span>
                  <span className="text-[10px] font-mono text-white/80">{item.value}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Status Line */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-px w-12 bg-cyan-400" />
          <span className="hud-label text-cyan-400/80">{HERO_CONTENT.availability}</span>
        </motion.div>

        {/* Tagline / Heading */}
        <motion.div style={{ y: headingY, opacity }} className="text-center">
          <h1 className="heading-hero text-white mb-8 relative">
            <span className="absolute -top-6 left-0 text-[10px] text-cyan-500/20 font-mono tracking-[0.5em] hidden md:block">
              LOAD_PHASE_01
            </span>
            <div className="flex flex-col">
              <span className="glitch-text text-white" data-text="ENGINEERING">
                ENGINEERING
              </span>
              <span className="glitch-text text-cyan-400 neon-glow -mt-2 md:-mt-6" data-text="BUSINESS IMPACT.">
                BUSINESS IMPACT.
              </span>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-body-lg max-w-2xl mx-auto mb-12 text-white/50 leading-relaxed font-medium"
          >
            {HERO_CONTENT.subtitle}
          </motion.p>
        </motion.div>

        {/* Primary Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="group relative px-10 py-5 overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-x-0 bottom-0 top-0 border border-cyan-400" />
            <div className="absolute inset-0 bg-cyan-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

            <span className="relative z-10 text-[12px] font-black uppercase tracking-[0.4em] text-white group-hover:text-black transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
              Initialize Session
            </span>
          </a>

          <a
            href="#section-work"
            className="flex items-center gap-3 px-8 py-5 border border-white/10 hover:border-white/30 text-white/40 hover:text-white transition-all text-[11px] font-bold uppercase tracking-[0.3em] group"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Box size={14} className="group-hover:text-cyan-400 transition-colors" />
            <span>Review Data</span>
          </a>
        </motion.div>
      </div>

      {/* Hero Footnotes / Technical Metadata */}
      <div className="absolute bottom-12 left-12 hidden xl:block">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-cyan-500/30 uppercase">Lat: 26.4499° N</span>
          <span className="text-[10px] font-mono text-cyan-500/30 uppercase">Long: 80.3319° E</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity: arrowOpacity as any }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="h-12 w-[1px] bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-400/60 rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Explore
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
