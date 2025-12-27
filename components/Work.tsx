import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ExternalLink } from 'lucide-react';
import { PROJECTS } from '../constants';
import SectionTitle from './SectionTitle';

const Work = () => (
  <section id="work" className="py-32 container mx-auto px-8">
    <div className="section-glow-box p-12 md:p-24 lg:p-32">
      <SectionTitle 
        icon={Globe}
        title="Selected Cases" 
        subtitle="Impact-driven engineering across Web2 and Web3 ecosystems."
      />
      
      <div className="grid md:grid-cols-2 gap-16 relative z-10">
        {PROJECTS.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="relative aspect-[16/11] rounded-[3rem] overflow-hidden mb-10 border border-white/5 glass">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-10 left-10 flex gap-3">
                {project.tech.slice(0, 2).map(t => (
                  <span key={t} className="px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-widest border-white/10">{t}</span>
                ))}
              </div>
              <div className="absolute bottom-10 right-10">
                <div className="w-16 h-16 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-500 hover:bg-white hover:text-black">
                  <ExternalLink size={24} />
                </div>
              </div>
            </div>
            
            <h3 className="text-4xl font-black mb-6 tracking-tighter">{project.title}</h3>
            <p className="text-xl text-white/40 mb-10 line-clamp-2 leading-relaxed">{project.description}</p>
            
            <div className="space-y-4">
              {project.impact.map((imp, i) => (
                <div key={i} className="flex items-start text-sm text-white/30 group-hover:text-white/50 transition-colors">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-4 mt-1.5" />
                  {imp}
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

