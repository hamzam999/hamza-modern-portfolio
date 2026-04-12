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

const ProjectCard: React.FC<{ project: Project | null; index: number }> = ({ project, index }) => {
  if (!project) {
    // 3D Visuals Spacer (Antimatter style)
    return <div className="horizontal-scroll-card h-full min-w-[30vw] md:min-w-[45vw]" />;
  }

  const num = String(index).padStart(2, '0');

  return (
    <div className="horizontal-scroll-card h-full group/card">
      <div className="glass-card h-full flex flex-col p-6 md:p-8 lg:p-10 relative transition-all duration-700">
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-[.active]/card:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-[inherit]"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(234, 239, 255, 0.1) 0%, transparent 70%)' }}
        />

        {/* Top — Number + Arrow */}
        <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
          <span className="number-outline reveal-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
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
        <h3 className="heading-card text-white mb-3 relative z-10 reveal-text" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-white/35 text-sm md:text-base leading-relaxed mb-6 flex-1 relative z-10 reveal-text">
          {project.description}
        </p>

        {/* Impact Bullets — Wave Animation */}
        <ul className="space-y-2 mb-6 relative z-10">
          {project.impact.slice(0, 3).map((item, i) => (
            <li
              key={i}
              className="reveal-stagger flex items-start gap-2 text-white/30 text-xs md:text-sm leading-relaxed"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mt-1.5 shrink-0">
                <div className="w-1 h-1 rounded-full bg-[rgba(234,239,255,0.6)]" />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Bottom — Tech Tags */}
        <div className="mt-auto relative z-10 border-t border-[rgba(234,239,255,0.08)] pt-4 reveal-text">
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const totalWidth = scrollContainer.scrollWidth - window.innerWidth;
    const cards = scrollContainer.querySelectorAll('.horizontal-scroll-card');

    const ctx = gsap.context(() => {
      // Main horizontal animation
      const scrollTween = gsap.to(scrollContainer, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Active state triggers for each card
      cards.forEach((card) => {
        if (card.children.length === 0) return; // Skip spacer

        ScrollTrigger.create({
          containerAnimation: scrollTween,
          trigger: card,
          start: "left center+=20%",
          end: "right center-=20%",
          onToggle: (self) => {
            if (self.isActive) card.classList.add('active');
            else card.classList.remove('active');
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <MarqueeText text="PORTFOLIO" className="py-4 md:py-8" speed={20} />
      <section id="section-work" ref={sectionRef} className="relative min-h-screen overflow-hidden flex flex-col">
        {/* Marquee Divider */}

        {/* Header */}
        <div className="section-content px-4 md:px-8 pt-12">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="text-label text-[rgba(234,239,255,0.7)] mb-4 block">Portfolio</span>
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

        {/* Horizontal Scroll Container — Center Aligned */}
        <div className="flex-1 flex items-center">
          <div
            ref={scrollContainerRef}
            className="horizontal-scroll-container flex items-center py-12 md:py-20"
            style={{ height: 'min(800px, 70vh)' }}
          >
            {/* Antimatter style: Start with an empty space for 3D visuals */}
            <ProjectCard project={null} index={-1} />
            {PROJECTS.slice(0, 8).map((project, idx) => (
              <ProjectCard key={project.title} project={project} index={idx + 1} />
            ))}
            {/* End spacer for balance */}
            <ProjectCard project={null} index={-1} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Work;
