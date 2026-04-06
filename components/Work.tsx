import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import MarqueeText from './MarqueeText';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const num = String(index + 1).padStart(2, '0');

  return (
    <div className="horizontal-scroll-card h-full">
      <div className="glass-card h-full flex flex-col p-6 md:p-8 lg:p-10 relative group">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124, 108, 240, 0.08) 0%, transparent 60%)' }}
        />

        {/* Top — Number + Arrow */}
        <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
          <span className="number-outline" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
            {num}
          </span>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-icon group-hover:border-[rgba(124,108,240,0.5)] group-hover:shadow-[0_0_16px_rgba(124,108,240,0.3)]"
            >
              <ArrowUpRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
            </a>
          )}
        </div>

        {/* Title */}
        <h3 className="heading-card text-white mb-3 relative z-10" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-white/35 text-sm md:text-base leading-relaxed mb-6 flex-1 relative z-10">
          {project.description}
        </p>

        {/* Impact Bullets */}
        <ul className="space-y-2 mb-6 relative z-10">
          {project.impact.slice(0, 2).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-white/30 text-xs md:text-sm leading-relaxed">
              <div className="mt-1.5 shrink-0">
                <div className="w-1 h-1 rounded-full bg-[rgba(124,108,240,0.6)]" />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Bottom — Services + Tools (Antimatter style) */}
        <div className="mt-auto relative z-10 border-t border-[rgba(124,108,240,0.08)] pt-4">
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="pill-tag text-[10px]">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerRef.current || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const totalWidth = scrollContainer.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(scrollContainer, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="section-work" ref={sectionRef} className="relative">
      {/* Marquee Divider */}
      <MarqueeText text="SELECTED WORK" className="py-4 md:py-8" speed={32} />

      {/* Header */}
      <div className="section-content px-4 md:px-8 mb-12 md:mb-16">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-label text-[rgba(124,108,240,0.7)] mb-4 block">Portfolio</span>
              <h2 className="heading-section text-white">
                Selected <span className="heading-italic-glow">Work</span>
              </h2>
            </div>
            <p className="text-white/35 text-base md:text-lg max-w-md leading-relaxed">
              Engineered for impact across e-commerce, Web3, and SaaS.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Horizontal Scroll Container — Antimatter Services Style */}
      <div ref={triggerRef} className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="horizontal-scroll-container py-8"
          style={{ height: '70vh' }}
        >
          {PROJECTS.slice(0, 8).map((project, idx) => (
            <ProjectCard key={project.title} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
