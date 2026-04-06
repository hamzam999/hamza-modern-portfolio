import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Linkedin, Github, Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';
import ScrollReveal from './ScrollReveal';

const CTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const ghostY = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <section id="section-cta" ref={sectionRef} className="section-full relative overflow-hidden bg-[#02020a]">
      {/* Glow Orbs — Large Finale Glows */}
      <div className="glow-orb glow-orb-purple" style={{ width: '1000px', height: '1000px', bottom: '-400px', left: '50%', transform: 'translateX(-50%)', opacity: 0.2 }} />
      <div className="glow-orb glow-orb-blue" style={{ width: '800px', height: '800px', top: '10%', left: '50%', transform: 'translateX(-50%)', opacity: 0.1 }} />

      <div className="section-content text-center relative z-10 py-20">
        {/* Ghost Background — Antimatter-style visible ghost text */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ y: ghostY }}
        >
          <span
            className="text-[18vw] font-black tracking-tighter leading-none"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(124, 108, 240, 0.03)',
              userSelect: 'none'
            }}
            aria-hidden="true"
          >
            BUILD
          </span>
        </motion.div>

        <motion.div style={{ scale, opacity }}>
          <ScrollReveal>
            <div className="flex flex-col items-center gap-6 mb-12">
              <span className="text-label text-[rgba(155,175,255,0.6)] uppercase tracking-[0.4em]">Next Steps</span>
              <h2
                className="heading-hero text-white max-w-[15ch] leading-[0.85]"
                style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}
              >
                Let's Build{' '}
                <span className="heading-italic-glow">Something Rare.</span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-body-lg max-w-2xl mx-auto mb-16 px-4 text-white/40 leading-relaxed font-medium">
              Ready to take your platform to the next level? Currently available for selective engineering collaborations and high-impact projects.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="flex flex-col items-center gap-12">
              {/* CTA Button — Oversized Glowy Button */}
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="group relative px-14 py-8 bg-gradient-to-r from-[#7c6cf0] to-[#5a4ed4] text-white rounded-full font-bold text-sm md:text-base uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 overflow-hidden shadow-[0_0_50px_rgba(124,108,240,0.4)]"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-4">
                  Initiate Conversation
                  <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </a>

              {/* Social Links — Modern Transparent Icons */}
              <div className="flex items-center gap-6">
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 glass-card rounded-2xl hover:border-[rgba(124,108,240,0.4)] hover:shadow-[0_0_20px_rgba(124,108,240,0.15)] transition-all hover:-translate-y-1.5 relative group"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} className="text-white/40 group-hover:text-white transition-colors" />
                </a>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 glass-card rounded-2xl hover:border-[rgba(124,108,240,0.4)] hover:shadow-[0_0_20px_rgba(124,108,240,0.15)] transition-all hover:-translate-y-1.5 relative group"
                  aria-label="GitHub"
                >
                  <Github size={24} className="text-white/40 group-hover:text-white transition-colors" />
                </a>
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="p-5 glass-card rounded-2xl hover:border-[rgba(124,108,240,0.4)] hover:shadow-[0_0_20px_rgba(124,108,240,0.15)] transition-all hover:-translate-y-1.5 relative group"
                  aria-label="Email"
                >
                  <Mail size={24} className="text-white/40 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </motion.div>
      </div>

      {/* Extreme Bottom Radial Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen h-[40%] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(124, 108, 240, 0.2) 0%, transparent 70%)',
        }}
      />
    </section>
  );
};

export default CTA;
