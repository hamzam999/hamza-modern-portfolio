import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink, Box, Tag, Layers } from 'lucide-react';
import { PROJECTS } from '../constants';
import ScrollReveal from './ScrollReveal';

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const isEven = index % 2 === 0;
  
  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className={`relative group mb-12 lg:mb-24 flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
      >
        {/* Project Image / Visual Block */}
        <div className="w-full lg:w-1/2 relative aspect-video overflow-hidden border border-white/10 bg-zinc-900 group-hover:border-cyan-400/50 transition-all duration-500 rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          
          {/* Animated Scanlines for Image */}
          <div className="absolute inset-0 scanlines opacity-0 group-hover:opacity-20 transition-opacity z-10" />
          
          {/* Mock Image Placeholder with Project Title */}
          <div className="w-full h-full flex items-center justify-center bg-zinc-950">
             <div className="text-zinc-800 text-6xl font-black select-none tracking-tighter uppercase opacity-20">
               {project.title.split(' ')[0]}
             </div>
          </div>

          {/* HUD Brackets around image on hover */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 z-20" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 z-20" />
        </div>

        {/* Project Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono text-cyan-500/50">DATA_SET_{String(index + 1).padStart(2, '0')}</span>
            <div className="h-px flex-grow bg-white/5" />
          </div>

          <h3 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
            {project.title}
          </h3>

          <p className="text-white/40 text-lg leading-relaxed mb-8">
            {project.description}
          </p>

          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((t: string) => (
              <span key={t} className="px-3 py-1 border border-white/5 bg-white/[0.02] text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] rounded group-hover:border-cyan-400/20 group-hover:text-white/60 transition-all">
                {t}
              </span>
            ))}
          </div>

          {/* Impact Stats / Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {project.impact.slice(0, 2).map((item: string, i: number) => (
              <div key={i} className="flex gap-3 text-xs text-white/30 leading-relaxed p-3 border border-white/5 rounded">
                <Layers size={14} className="text-cyan-500/30 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Action Link */}
          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-cyan-400 hover:text-white transition-colors group/link"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span>Access Direct Link</span>
              <ArrowUpRight size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
            </a>
          )}
        </div>
      </motion.div>
    </ScrollReveal>
  );
};

const Work = () => {
  return (
    <section id="section-work" className="py-24 md:py-32 bg-[#0A0A0B] relative">
      <div className="absolute inset-0 bg-grid-tech opacity-5" />
      
      <div className="section-content px-6 relative z-10">
        <ScrollReveal>
          <div className="mb-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-4 bg-cyan-400" />
              <span className="hud-label">Production.Archive</span>
            </div>
            <h2 className="heading-section text-white max-w-2xl">
              Selected <span className="text-cyan-400">Implementations.</span>
            </h2>
            <p className="text-white/30 max-w-lg mt-6 text-lg">
              A curated selection of mission-critical platforms and experiences architected for maximum business impact.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-0">
          {PROJECTS.map((project, idx) => (
            <ProjectCard key={project.title} project={project} index={idx} />
          ))}
        </div>
        
        {/* Symmetric Divider Decorative Line */}
        <div className="flex justify-center mt-24">
          <div className="h-24 w-px bg-gradient-to-b from-cyan-400 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Work;
