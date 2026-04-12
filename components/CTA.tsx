import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Linkedin, Github, Mail, ShieldAlert, Cpu, Network } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';
import ScrollReveal from './ScrollReveal';

const CTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <section id="section-cta" ref={sectionRef} className="py-32 md:py-48 relative overflow-hidden bg-[#0A0A0B]">
      {/* Background HUD Decorative Elements */}
      <div className="absolute inset-0 bg-grid-tech opacity-10 pointer-events-none" />
      
      {/* Intense Backdrop Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/10 blur-[150px] rounded-full opacity-50" />

      <div className="section-content text-center relative z-10 px-6 max-w-5xl mx-auto">
        
        <motion.div style={{ scale, opacity }}>
          <ScrollReveal>
             <div className="flex flex-col items-center gap-6 mb-16">
               <div className="flex items-center gap-4 text-cyan-500/40 font-mono text-[10px] uppercase tracking-[0.5em]">
                 <div className="h-px w-8 bg-cyan-500/20" />
                 <span>Terminal_Final_Phase</span>
                 <div className="h-px w-8 bg-cyan-500/20" />
               </div>
               
               <h2 className="heading-section text-white max-w-[15ch] mx-auto text-4xl md:text-7xl lg:text-8xl leading-none">
                 Initialize <span className="glitch-text text-cyan-400" data-text="Impact.">Impact.</span>
               </h2>
             </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-20 leading-relaxed font-medium">
              Ready to take your platform to the next level? Currently available for selective engineering collaborations and high-impact technical leadership.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="flex flex-col items-center gap-16">
              
              {/* Button HUD Wrapper */}
              <div className="relative group">
                <div className="absolute -inset-4 border border-cyan-500/10 rounded-full group-hover:border-cyan-500/30 transition-all duration-700 animate-spin-slow" />
                <div className="absolute -inset-8 border-2 border-dashed border-cyan-500/5 rounded-full" />
                
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="group relative flex items-center gap-6 px-16 py-8 bg-cyan-500 text-black font-black text-sm md:text-base uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.4)] rounded-sm"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <span className="relative z-10">Start Session</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                  
                  {/* Internal Glitch Overlay on Hover */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </a>
              </div>

              {/* Technical Statistics Overlay */}
              <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 uppercase font-bold tracking-[0.3em] text-white/20 text-[10px] md:text-[11px]">
                  <div className="flex items-center gap-3">
                    <Cpu size={14} className="text-cyan-500/40" />
                    <span>Uptime: 99.9%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={14} className="text-cyan-500/40" />
                    <span>Encrypted: AES-256</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Network size={14} className="text-cyan-500/40" />
                    <span>Status: Open</span>
                  </div>
              </div>
            </div>
          </ScrollReveal>
        </motion.div>
      </div>

      {/* Decorative scanline for section ending */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
    </section>
  );
};

export default CTA;
