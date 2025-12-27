import React from 'react';
import { Zap, MessageSquare, ShieldCheck } from 'lucide-react';
import NeonIcon from './NeonIcon';
import GlassCard from './GlassCard';

const Values = () => (
  <section className="py-32 container mx-auto px-8">
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { icon: Zap, title: "Performance First", desc: "Optimizing critical rendering paths for sub-second delivery." },
        { icon: MessageSquare, title: "Clear Flow", desc: "Predictable communication and strategic alignment." },
        { icon: ShieldCheck, title: "Robust Scale", desc: "Building mission-critical systems that grow with you." },
      ].map((val, i) => (
        <GlassCard key={i} className="border-white/5 p-12">
          <NeonIcon icon={val.icon} color="#60a5fa" />
          <h3 className="text-3xl font-black mt-10 mb-6 tracking-tight">{val.title}</h3>
          <p className="text-white/40 text-lg leading-relaxed">{val.desc}</p>
        </GlassCard>
      ))}
    </div>
  </section>
);

export default Values;

