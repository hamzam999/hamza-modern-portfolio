import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Code2, Wallet, Shield } from 'lucide-react';
import { SKILLS } from '../constants';
import SectionTitle from './SectionTitle';
import GlassCard from './GlassCard';

const TechFoundation = () => (
  <section id="tech" className="py-32 container mx-auto px-8">
    <SectionTitle 
      icon={Cpu}
      title="Tech Stack" 
      subtitle="Modern tools for mission-critical web applications."
    />
    
    <div className="grid md:grid-cols-3 gap-10">
      {SKILLS.map((cat, i) => (
        <GlassCard key={cat.title} className="flex flex-col h-full border-white/5" glowColor={i === 1 ? "rgba(167, 139, 250, 0.2)" : "rgba(96, 165, 250, 0.2)"}>
          <div className="flex items-center space-x-4 mb-10">
             {i === 0 ? <Code2 size={24} className="text-blue-400" /> : i === 1 ? <Wallet size={24} className="text-purple-400" /> : <Shield size={24} className="text-emerald-400" />}
             <h3 className="text-xl font-black uppercase tracking-widest text-white/70">{cat.title}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cat.skills.map((skill) => (
              <motion.div
                key={skill.name}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center justify-center p-4 glass rounded-2xl border-white/5 hover:border-white/20 transition-all text-center group"
              >
                <div className="w-10 h-10 mb-3 flex items-center justify-center">
                  <img 
                    src={`https://cdn.simpleicons.org/${skill.icon}/60a5fa`} 
                    alt={skill.name} 
                    className="w-full h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${skill.name}&backgroundColor=000&textColor=60a5fa`;
                    }}
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-white/40 group-hover:text-white transition-colors">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  </section>
);

export default TechFoundation;

