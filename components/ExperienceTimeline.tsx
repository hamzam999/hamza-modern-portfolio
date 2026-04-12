import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EXPERIENCES } from '../constants';
import ScrollReveal from './ScrollReveal';
import { History, MapPin, Milestone, Box } from 'lucide-react';

const ExperienceCard = ({ exp, index }: { exp: typeof EXPERIENCES[0]; index: number }) => {
  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="relative pl-12 md:pl-24 mb-32 group">
        
        {/* Journey Marker / Milestone */}
        <div className="absolute left-0 top-0 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 rounded-md group-hover:border-cyan-400 group-hover:bg-cyan-500/20 transition-all z-20">
          <Milestone size={18} className="text-cyan-400" />
          {/* Neon Pulse */}
          <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content Console */}
        <div className="glass-console p-6 md:p-10 rounded-xl hud-border relative">
          {/* Header Metadata */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-[0.3em] mb-1">
                Node_Location: {exp.location}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {exp.role}
              </h3>
            </div>
            <div className="flex flex-col md:items-end">
              <span className="text-sm font-bold text-white/80">{exp.company}</span>
              <span className="text-[10px] font-mono text-cyan-500/40 uppercase">{exp.period}</span>
            </div>
          </div>

          {/* Details / Task List */}
          <div className="space-y-4">
            <div className="text-[9px] font-bold text-cyan-500/30 uppercase tracking-widest flex items-center gap-2 mb-4">
              <div className="w-4 h-[1px] bg-cyan-500/30" />
              <span>Project_Details.log</span>
            </div>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {exp.details.map((detail, i) => (
                <li key={i} className="flex gap-4 text-sm md:text-base text-white/40 leading-relaxed group/item transition-colors">
                  <span className="text-cyan-500/20 font-mono mt-1">[{String(i+1).padStart(2, '0')}]</span>
                  <span className="group-hover/item:text-white/70 transition-colors uppercase text-[12px] md:text-[13px] font-medium tracking-wide">
                    {detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Decorative HUD Corner */}
          <div className="absolute bottom-4 right-4 text-[10px] text-zinc-800 font-mono select-none hidden md:block">
            0X{index * 1234}AF.SYS
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const ExperienceTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="section-experience" className="py-24 md:py-32 relative bg-[#0A0A0B]">
      {/* Background Perspective Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-cyan-400 via-zinc-800 to-transparent" />
      </div>

      <div className="section-content px-6 relative z-10">
        <ScrollReveal>
          <div className="mb-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-4 bg-cyan-400" />
              <span className="hud-label">History.Sequence</span>
            </div>
            <h2 className="heading-section text-white">
              Professional <span className="text-cyan-400">Journey.</span>
            </h2>
            <p className="text-white/30 max-w-lg mt-6 text-lg">
              Tracing the core architectural decisions and successful implementations over a 6+ year professional timeline.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-6xl mx-auto relative pl-0">
          {/* Dynamic Road Line (Vertical in 2D, matches Perspective Road in 3D) */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-white/5 md:ml-[-1px]" />
          
          {EXPERIENCES.map((exp, idx) => (
            <ExperienceCard key={idx} exp={exp} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
