import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap, Layers, Globe, Box, Rocket, Layout, Shield, Wallet, Link, Github } from 'lucide-react';

// Tech stack data
const TECH_STACK = [
  { name: 'React', icon: Code2 },
  { name: 'Next.js', icon: Zap },
  { name: 'TypeScript', icon: Layers },
  { name: 'Three.js', icon: Box },
  { name: 'TailwindCSS', icon: Layout },
  { name: 'Framer Motion', icon: Rocket },
  { name: 'GSAP', icon: Rocket },
  { name: 'Shopify OS 2.0', icon: Shield },
  { name: 'Solana', icon: Zap },
  { name: 'Ethereum', icon: Wallet },
  { name: 'Wagmi', icon: Code2 },
  { name: 'Angular', icon: Globe },
];

const TechMarquee = () => {
  // Duplicate the array to create a seamless infinite loop
  const marqueeItems = [...TECH_STACK, ...TECH_STACK];

  return (
    <div className="w-full relative overflow-hidden py-12 flex items-center bg-black/50 border-y border-white/5 backdrop-blur-md">
      {/* Cinematic Gradient Fades on edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex whitespace-nowrap w-[200%] animate-marquee">
        <div className="flex gap-16 items-center flex-shrink-0 w-1/2 justify-around">
            {marqueeItems.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div key={`${tech.name}-${idx}`} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 group-hover:text-emerald group-hover:border-emerald/30 group-hover:bg-emerald/10 transition-all duration-500 shadow-lg">
                    <Icon size={24} />
                  </div>
                  <span className="font-heading text-2xl md:text-4xl font-black text-white/20 group-hover:text-white transition-colors duration-500 uppercase tracking-tighter">
                    {tech.name}
                  </span>
                </div>
              );
            })}
        </div>
        <div className="flex gap-16 items-center flex-shrink-0 w-1/2 justify-around">
            {marqueeItems.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div key={`${tech.name}-copy-${idx}`} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 group-hover:text-emerald group-hover:border-emerald/30 group-hover:bg-emerald/10 transition-all duration-500 shadow-lg">
                    <Icon size={24} />
                  </div>
                  <span className="font-heading text-2xl md:text-4xl font-black text-white/20 group-hover:text-white transition-colors duration-500 uppercase tracking-tighter">
                    {tech.name}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TechMarquee;
