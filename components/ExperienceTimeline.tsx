import React from 'react';
import { Terminal } from 'lucide-react';
import { EXPERIENCES } from '../constants';
import SectionTitle from './SectionTitle';
import GlassCard from './GlassCard';

const ExperienceTimeline = () => (
  <section id="experience" className="py-12 md:py-32 container mx-auto px-4 md:px-8">
    <SectionTitle 
      icon={Terminal}
      title="History" 
      subtitle="Scaling expertise through foundational roles and startup success." 
    />
    
    <div className="space-y-6 md:space-y-12">
      {EXPERIENCES.map((exp, idx) => (
        <GlassCard key={idx} className="border-white/5 flex flex-col lg:flex-row lg:items-start justify-between gap-8 md:gap-16 group p-6 sm:p-10 lg:p-16">
          <div className="lg:w-2/5">
            <span className="text-[9px] md:text-[12px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3 md:mb-4 block">{exp.period}</span>
            <h3 className="text-2xl md:text-4xl font-black mb-2 md:mb-3 tracking-tighter group-hover:text-gradient transition-all">{exp.role}</h3>
            <p className="text-white/30 font-black uppercase text-[10px] md:text-[14px] tracking-[0.2em] mb-6 md:mb-8">{exp.company} — {exp.location}</p>
            
            <div className="flex flex-wrap gap-2 md:gap-4">
              {exp.metrics.map(m => (
                <span key={m} className="px-3 py-1.5 md:px-5 md:py-2 glass rounded-lg md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/60 border-white/10 group-hover:border-blue-500/30 transition-all whitespace-nowrap">{m}</span>
              ))}
            </div>
          </div>
          
          <div className="lg:w-3/5">
            <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 md:mb-10">Strategic Contributions</h4>
            <ul className="space-y-6 md:space-y-10">
              {exp.details.map((detail, i) => (
                <li key={i} className="text-white/50 text-base md:text-lg leading-relaxed flex items-start group/li">
                  <div className="mt-2 mr-4 md:mr-6 shrink-0 transition-all group-hover/li:scale-125">
                    <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                  </div>
                  <span className="group-hover/li:text-white transition-colors">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      ))}
    </div>
  </section>
);

export default ExperienceTimeline;

