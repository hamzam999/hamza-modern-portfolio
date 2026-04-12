import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EXPERIENCES } from '../constants';
import MarqueeText from './MarqueeText';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const ExperienceCard: React.FC<{ exp: typeof EXPERIENCES[0]; index: number; total: number }> = ({ exp, index, total }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="experience-card-fullscreen w-full flex flex-col items-center justify-center p-6 md:p-20 relative transition-all duration-1000"
      style={{ zIndex: index + 1 }}
      ref={cardRef}
    >
      {/* Glass Card Container — Uniform Size & Wider Desktop */}
      <div className="experience-glass-wrapper glass-card w-full max-w-7xl flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 relative z-10 shadow-2xl transition-all duration-1000"
           style={{ minHeight: 'min(700px, 75vh)' }}>
        
        {/* Left side: Timeline/Number */}
        <div className="md:w-1/4 flex flex-col items-center md:items-start p-6 md:p-16 md:pb-0">
          <div className="relative mb-8 md:mb-12">
            <span className="number-outline reveal-text" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', lineHeight: 0.8 }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="absolute top-1/2 left-full ml-6 md:ml-12 w-12 md:w-24 h-[1px] bg-[rgba(234,239,255,0.2)]" />
          </div>

          {exp.period && (
            <span className="inline-block px-6 py-3 rounded-full text-[0.7rem] md:text-[0.8rem] font-black tracking-[0.3em] uppercase text-[rgba(234,239,255,0.9)] bg-[rgba(234,239,255,0.08)] border border-[rgba(234,239,255,0.15)] mb-8 md:mb-12 shadow-[0_0_20px_rgba(234,239,255,0.05)] reveal-text">
              {exp.period}
            </span>
          )}
        </div>

        {/* Right side: Content */}
        <div className="md:w-3/4 p-6 md:p-16 md:pl-0">
          <h3 className="heading-card text-white mb-4 pr-12 reveal-text font-black leading-tight" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>
            {exp.role.split(' ').map((word, i) => (
                <span key={i} className={word.toLowerCase().includes('engineer') || word.toLowerCase().includes('dev') ? 'heading-italic-glow' : ''} style={{ paddingRight: '0.2em' }}>
                  {word}{' '}
                </span>
            ))}
          </h3>
          <p className="text-label text-[rgba(234,239,255,0.6)] mb-12 reveal-text" style={{ letterSpacing: '0.25em', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>
            {exp.company} — <span className="opacity-60">{exp.location}</span>
          </p>

          <ul className="space-y-6 md:space-y-8">
            {exp.details.map((detail, i) => (
              <li 
                key={i} 
                className="reveal-stagger flex items-start gap-6 text-white/50 text-sm md:text-xl leading-relaxed group/li hover:text-white/90 transition-colors"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="mt-2.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[rgba(234,239,255,0.4)] shadow-[0_0_12px_rgba(234,239,255,0.3)]" />
                </div>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ExperienceTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('.experience-card-fullscreen');

    // Create a context for GSAP
    const ctx = gsap.context(() => {
      // Pin and Track Active State
      sections.forEach((section, i) => {
        // Pinning logic
        if (i !== sections.length - 1) {
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            pin: true,
            pinSpacing: false,
          });
        }

        // Active State logic
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              section.classList.add('active');
              // Blur others
              sections.forEach((other, j) => {
                if (i !== j) other.classList.add('card-blur-background');
              });
            } else {
              section.classList.remove('active');
              // Unblur if no others are active (simple cleanup)
              sections.forEach((other) => other.classList.remove('card-blur-background'));
            }
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="section-experience" className="relative overflow-hidden">
      {/* Marquee Divider */}
      <MarqueeText text="EXPERIENCE" className="py-4 md:py-8" speed={38} reverse />

      <div ref={containerRef} className="relative">
        {EXPERIENCES.map((exp, idx) => (
          <ExperienceCard
            key={idx}
            exp={exp}
            index={idx}
            total={EXPERIENCES.length}
          />
        ))}
      </div>

      {/* Decorative vertical line in the center for depth */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[rgba(234,239,255,0.06)] to-transparent pointer-events-none" />
    </section>
  );
};

export default ExperienceTimeline;
