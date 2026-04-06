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
      className="experience-card-fullscreen w-full flex flex-col items-center justify-center p-6 md:p-20 bg-[#02020a] relative"
      ref={cardRef}
    >
      {/* Background Glow for current card */}
      {/* <div className="absolute inset-0 z-0 opacity-20" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(124, 108, 240, 0.08) 0%, transparent 70%)' }} /> */}

      {/* Glass Card Container */}
      <div className="glass-card w-full max-w-5xl p-8 md:p-16 flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
        {/* Left side: Timeline/Number */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start">
          <div className="relative mb-6">
            <span className="number-outline" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="absolute top-1/2 left-full ml-4 md:ml-8 w-8 md:w-16 h-[1px] bg-[rgba(124,108,240,0.3)]" />
          </div>

          {exp.period && (
            <span className="inline-block px-5 py-2.5 rounded-full text-[0.65rem] font-black tracking-[0.25em] uppercase text-[rgba(155,175,255,0.9)] bg-[rgba(124,108,240,0.15)] border border-[rgba(124,108,240,0.25)] mb-4 shadow-[0_0_20px_rgba(124,108,240,0.1)]">
              {exp.period}
            </span>
          )}
        </div>

        {/* Right side: Content */}
        <div className="md:w-2/3">
          <h3 className="heading-card text-white mb-2" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)' }}>
            {exp.role.split(' ').map((word, i) => (
              <span key={i} className={word.toLowerCase().includes('engineer') || word.toLowerCase().includes('dev') ? 'heading-italic-glow' : ''}>
                {word}{' '}
              </span>
            ))}
          </h3>
          <p className="text-label text-[rgba(124,108,240,0.6)] mb-8 md:mb-12" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            {exp.company} — <span className="opacity-60">{exp.location}</span>
          </p>

          <ul className="space-y-5">
            {exp.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-4 text-white/50 text-xs md:text-base leading-relaxed group/li hover:text-white/90 transition-colors">
                <div className="mt-2 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[rgba(124,108,240,0.5)] shadow-[0_0_10px_rgba(124,108,240,0.5)]" />
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
      // Pin the whole container
      // This creates the "scrolling through cards" effect
      sections.forEach((section, i) => {
        if (i === sections.length - 1) return; // Don't pin the last one or handle specially

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          pin: true,
          pinSpacing: false,
          snap: 1,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="section-experience" className="relative bg-[#02020a]">
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
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[rgba(124,108,240,0.1)] to-transparent pointer-events-none" />
    </section>
  );
};

export default ExperienceTimeline;
