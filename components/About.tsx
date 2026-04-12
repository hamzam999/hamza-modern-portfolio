import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ABOUT_CONTENT } from '../constants';
import ScrollReveal from './ScrollReveal';
import { User, Award, GraduationCap, Cpu, Fingerprint, Activity } from 'lucide-react';

const StatBox = ({ label, value, index }: { label: string; value: string; index: number }) => {
  return (
    <div className="bento-card flex flex-col items-center justify-center text-center group">
       <span className="text-4xl md:text-5xl font-black text-cyan-400 mb-2 neon-glow transition-all group-hover:scale-110" style={{ fontFamily: 'var(--font-heading)' }}>
         {value}
       </span>
       <span className="hud-label tracking-[0.2em]">{label}</span>
       <div className="absolute top-2 right-2 text-[8px] font-mono text-cyan-500/20">0{index + 1}</div>
    </div>
  );
};

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section id="section-about" ref={sectionRef} className="py-24 md:py-32 relative bg-[#0A0A0B] overflow-hidden">
      <div className="absolute inset-0 bg-grid-tech opacity-5" />
      
      <div className="section-content px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Header & Bio (Span 7) */}
          <div className="lg:col-span-7 flex flex-col">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-4 bg-cyan-400" />
                <span className="hud-label">Biometric.Profile</span>
              </div>
              <h2 className="heading-section text-white mb-8">
                Engineering <span className="glitch-text text-cyan-400" data-text="Impact.">Impact.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="glass-console p-10 rounded-xl hud-border relative mb-12">
                <div className="flex items-center gap-3 mb-6 text-cyan-500/40">
                  <Fingerprint size={18} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Identity_Authorized</span>
                </div>
                <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed italic border-l-2 border-cyan-500/20 pl-8">
                  {ABOUT_CONTENT.bio}
                </p>
                <div className="absolute top-4 right-6 flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-cyan-400/50" />
                  <div className="w-1 h-1 rounded-full bg-cyan-400/20" />
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <ScrollReveal delay={0.3}>
                  <div className="bento-card group">
                    <Award className="text-cyan-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
                    <span className="hud-label mb-2 block text-cyan-400/60">Recognition</span>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {ABOUT_CONTENT.achievement}
                    </p>
                  </div>
               </ScrollReveal>
               <ScrollReveal delay={0.4}>
                  <div className="bento-card group">
                    <GraduationCap className="text-cyan-500 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
                    <span className="hud-label mb-2 block text-cyan-400/60">Education</span>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {ABOUT_CONTENT.education}
                    </p>
                  </div>
               </ScrollReveal>
            </div>
          </div>

          {/* Stats & Profile Overlay (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              {ABOUT_CONTENT.stats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <StatBox label={stat.label} value={stat.value} index={i} />
                </ScrollReveal>
              ))}
            </div>

            {/* Profile Visualization Piece */}
            <ScrollReveal delay={0.5}>
              <div className="bento-card p-0 overflow-hidden aspect-square md:aspect-video lg:aspect-square relative group">
                 <div className="absolute inset-0 bg-[#0c0c1a] flex items-center justify-center">
                    {/* Abstract HUD Wireframe Visualization */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64">
                       <div className="absolute inset-0 border border-cyan-500/10 rounded-full animate-spin-slow" />
                       <div className="absolute inset-4 border border-cyan-500/20 rounded-full animate-reverse-spin" style={{ animationDuration: '10s' }} />
                       <div className="absolute inset-8 border-2 border-dashed border-cyan-500/5 rounded-full" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Activity size={48} className="text-cyan-400/20 animate-pulse" />
                       </div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8">
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-cyan-500/40 tracking-[0.3em]">CORE_STABILITY</span>
                          <span className="text-[10px] font-mono text-cyan-400">99.8%</span>
                       </div>
                       <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ duration: 2, delay: 1 }}
                            className="h-full bg-cyan-400" 
                          />
                       </div>
                    </div>
                 </div>
                 <div className="absolute top-4 left-6 text-[9px] font-mono text-white/10 uppercase tracking-[0.5em]">SYSTEM_SCAN_ACTIVE</div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
