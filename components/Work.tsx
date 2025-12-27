import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ExternalLink } from 'lucide-react';
import { PROJECTS } from '../constants';
import SectionTitle from './SectionTitle';

const Work = () => (
  <section id="work" className="py-12 md:py-32 container mx-auto px-4 md:px-8">
    <div className="section-glow-box p-6 sm:p-10 md:p-24 lg:p-32">
      <SectionTitle 
        icon={Globe}
        title="Selected Cases" 
        subtitle="Impact-driven engineering across Web2 and Web3 ecosystems."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative z-10">
        {PROJECTS.map((project) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden mb-6 md:mb-10 border border-white/5 glass">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 md:top-10 md:left-10 flex gap-2">
                {project.tech.slice(0, 2).map(t => (
                  <span key={t} className="px-3 py-1 md:px-4 md:py-1.5 glass rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border-white/10 whitespace-nowrap">{t}</span>
                ))}
              </div>
              <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full glass flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all scale-90 md:scale-75 group-hover:scale-100 duration-500 hover:bg-white hover:text-black">
                  <ExternalLink size={18} />
                </div>
              </div>
            </div>
            
            <h3 className="text-xl md:text-4xl font-black mb-3 md:mb-6 tracking-tighter text-white">{project.title}</h3>
            <p className="text-sm md:text-xl text-white/40 mb-6 md:mb-10 line-clamp-2 leading-relaxed font-medium">{project.description}</p>
            
            <div className="space-y-3">
              {project.impact.map((imp, i) => (
                <div key={i} className="flex items-start text-xs md:text-sm text-white/30 group-hover:text-white/50 transition-colors">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 md:mr-4 mt-1.5 shrink-0" />
                  <span className="leading-tight">{imp}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Work;

