import React from 'react';
import { Zap, MessageSquare, ShieldCheck } from 'lucide-react';
import NeonIcon from './NeonIcon';
import GlassCard from './GlassCard';

const Values = () => (
  <section className="py-12 md:py-32 container mx-auto px-4 md:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {[
        { icon: Zap, title: "Performance First", desc: "Optimizing critical rendering paths for sub-second delivery." },
        { icon: MessageSquare, title: "Clear Flow", desc: "Predictable communication and strategic alignment." },
        { icon: ShieldCheck, title: "Robust Scale", desc: "Building mission-critical systems that grow with you." },
      ].map((val, i) => (
        <GlassCard key={i} className="border-white/5 p-8 md:p-12">
          <div className="mb-6 md:mb-8">
            <NeonIcon icon={val.icon} color="#60a5fa" />
          </div>
          <h3 className="text-xl md:text-3xl font-black mb-4 md:mb-6 tracking-tight text-white">{val.title}</h3>
          <p className="text-sm md:text-lg text-white/40 leading-relaxed font-medium">{val.desc}</p>
        </GlassCard>
      ))}
    </div>
  </section>
);

export default Values;

