import React from 'react';
import { ArrowRight, Linkedin, Github } from 'lucide-react';

const SOCIAL_LINKS = {
  email: "erhamza.dev@gmail.com",
  linkedin: "https://www.linkedin.com/in/er-mohammad-hamza/",
  github: "https://github.com/hamzam999"
};

const CTA = () => (
  <section id="contact" className="py-32 container mx-auto px-8">
    <div className="section-glow-box p-16 md:p-32 text-center group">
      <div className="relative z-10">
        <h2 className="text-6xl md:text-[9rem] font-black tracking-tighter mb-12 leading-[0.85]">
          Let's Build <br /><span className="text-gradient">Something Rare.</span>
        </h2>
        <p className="text-white/40 text-xl md:text-3xl max-w-3xl mx-auto mb-20 leading-relaxed font-medium">
          Ready to take your platform to the next level? Currently available for selective engineering collaborations.
        </p>
        
        <div className="flex flex-col items-center gap-12">
          <a href={`mailto:${SOCIAL_LINKS.email}`} className="group/btn relative px-16 py-8 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 group-hover/btn:text-white transition-colors">Initiate Conversation</span>
            <ArrowRight className="relative z-10 ml-4 group-hover/btn:translate-x-2 transition-all group-hover/btn:text-white" size={24} />
          </a>
          
          <div className="flex items-center space-x-12">
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="p-5 glass rounded-3xl hover:bg-white hover:text-black transition-all hover:-translate-y-2 border-white/5">
              <Linkedin size={32} />
            </a>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="p-5 glass rounded-3xl hover:bg-white hover:text-black transition-all hover:-translate-y-2 border-white/5">
              <Github size={32} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTA;

