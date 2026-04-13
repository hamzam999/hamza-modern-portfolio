import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EXPERIENCES } from '../constants';
import ScrollReveal from './ScrollReveal';
import TextHighlight from './TextHighlight';
import { History, MapPin, Milestone, Box } from 'lucide-react';

const ExperienceCard = ({ exp, index }: { exp: typeof EXPERIENCES[0]; index: number }) => {
  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="relative pl-12 md:pl-24 mb-32 group">
        
        {/* Terminal Node Marker */}
        <div className="absolute left-[-2px] md:left-[2px] top-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black border border-emerald/30 rounded-full group-hover:border-emerald group-hover:scale-110 transition-all z-20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
        </div>

        {/* Content Console */}
        <div className="bg-black/50 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/5 relative overflow-hidden group-hover:border-emerald/20 transition-all duration-500 hover:shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Header Metadata */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-emerald uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-white/30">{`~/usr/local/`}</span>{exp.location}
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
                {exp.role}
              </h3>
            </div>
            <div className="flex flex-col md:items-end text-left md:text-right">
              <span className="text-lg md:text-xl font-bold text-white mb-1 tracking-tight">{exp.company}</span>
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">{exp.period}</span>
            </div>
          </div>

          {/* Details / Task List as Terminal Logs */}
          <div className="space-y-6">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-3">
              <div className="w-6 h-px bg-white/10" />
              <span>exec ./fetch_responsibilities.sh</span>
            </div>
            
            <ul className="flex flex-col gap-4">
              {exp.details.map((detail, i) => (
                <li key={i} className="flex gap-4 text-[13px] md:text-[15px] font-mono text-white/60 leading-relaxed group/item transition-colors items-start">
                  <span className="text-emerald mt-1 flex-shrink-0">{`>`}</span>
                  <span className="group-hover/item:text-white transition-colors tracking-tight">
                    {detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Decorative Terminal Footer */}
          <div className="absolute bottom-6 right-6 text-[10px] text-white/10 font-mono select-none hidden md:block group-hover:text-emerald/20 transition-colors">
            Process exited with code 0
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const ExperienceTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="section-experience" className="py-24 md:py-32 relative bg-background">
      {/* Background Perspective Lines */}
      <div className="absolute inset-0 bg-grid-tech opacity-10 pointer-events-none" />

      <div className="section-content px-6 relative z-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-32">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-4 bg-emerald" />
              <span className="hud-label tracking-widest text-emerald">Runtime.Logs</span>
            </div>
            <h2 className="heading-section text-white text-5xl md:text-8xl tracking-tighter mix-blend-difference">
              Professional <span className="text-emerald">Journey.</span>
            </h2>
            <div className="text-white/50 max-w-lg mt-8 text-lg md:text-xl font-light font-heading leading-relaxed">
              <TextHighlight text="Tracing architectural decisions and system scale operations spanning a 6+ year timeline." highlightColor="#10B981" />
            </div>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl relative pl-0 md:ml-12">
          {/* Dynamic Road Line (Vertical) */}
          <div className="absolute left-4 md:left-[21px] top-12 bottom-0 w-[2px] bg-white/5 bg-gradient-to-b from-emerald/50 via-white/5 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
          
          {EXPERIENCES.map((exp, idx) => (
            <ExperienceCard key={idx} exp={exp} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
