import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Layers } from 'lucide-react';
import { PROJECTS } from '../constants';
import ScrollReveal from './ScrollReveal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  return (
    <div className="project-card w-[90vw] md:w-[75vw] lg:w-[65vw] flex-shrink-0 h-full flex flex-col justify-center px-4 md:px-8">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative group flex flex-col lg:flex-row bg-white/[0.01] border border-white/5 backdrop-blur-sm rounded-3xl overflow-hidden hover:border-blue/30 hover:bg-white/[0.03] transition-all duration-500 shadow-2xl h-[70vh] lg:h-[65vh]"
      >
        {/* Project Image Panel */}
        <div className="w-full lg:w-1/2 relative overflow-hidden bg-black/50 border-b lg:border-b-0 lg:border-r border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue/10 to-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="text-white/10 text-6xl md:text-8xl font-heading font-black select-none tracking-tighter uppercase group-hover:scale-110 group-hover:text-white/20 transition-all duration-700">
              {project.title.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Project Info Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 md:p-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-mono text-emerald/70 bg-emerald/10 px-3 py-1 rounded-full border border-emerald/20">LOG_{String(index + 1).padStart(2, '0')}</span>
              <div className="h-px w-12 bg-white/10" />
            </div>

            <h3 className="text-4xl md:text-5xl font-black text-white mb-6 group-hover:text-blue transition-colors duration-500 font-heading tracking-tight">
              {project.title}
            </h3>

            <p className="text-white/50 text-lg leading-relaxed mb-8 font-light">
              {project.description}
            </p>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tech.map((t: string) => (
                <span key={t} className="px-3 py-1.5 border border-white/5 bg-white/[0.02] text-[10px] font-mono text-white/40 uppercase tracking-widest rounded-lg group-hover:border-blue/20 group-hover:text-white/80 transition-all">
                  {t}
                </span>
              ))}
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.impact.slice(0, 2).map((item: string, i: number) => (
                <div key={i} className="flex gap-3 text-xs text-white/50 leading-relaxed font-mono">
                  <Layers size={14} className="text-blue flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Link */}
          {project.link && (
            <div className="mt-8 pt-6 border-t border-white/5">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald hover:text-white transition-colors group/link font-heading"
              >
                <span>Launch Project</span>
                <ArrowUpRight size={16} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Work = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.project-card');

      gsap.to(cards, {
        xPercent: -100 * (cards.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1, // Smooth scrub
          snap: 1 / (cards.length - 1), // Optional: snap to nearest project
          end: () => "+=" + scrollWrapperRef.current?.offsetWidth
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="section-work" ref={containerRef} className="h-screen bg-background relative flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-tech opacity-10 pointer-events-none" />

      {/* Absolute Header Overlay */}
      <div className="absolute top-24 left-6 md:left-12 z-20 pointer-events-none">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-4 bg-emerald" />
            <span className="hud-label tracking-widest text-emerald">Production.Archive</span>
          </div>
          <h2 className="heading-section max-w-3xl">
            Selected <span className="text-gradient">Implementations.</span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="relative z-10 flex h-full items-center mt-24 md:mt-80">
        <div ref={scrollWrapperRef} className="flex pl-6 md:pl-12 pr-[50vw]">
          {PROJECTS.map((project, idx) => (
            // @ts-ignore
            <ProjectCard key={project.title as string} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
