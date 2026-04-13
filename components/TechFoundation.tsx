import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Wallet, Wrench, Cpu, Globe, Rocket, Shield, Zap, Search, Layers, Box, Layout, Link, Github, Cpu as CpuIcon } from 'lucide-react';
import { SKILLS } from '../constants';
import ScrollReveal from './ScrollReveal';
import TechMarquee from './TechMarquee';

const ICON_MAP: Record<string, any> = {
  'react': Code2,
  'nextdotjs': Zap,
  'typescript': Layers,
  'angular': Globe,
  'threedotjs': Box,
  'greensock': Rocket,
  'tailwindcss': Layout,
  'shopify': Shield,
  'solana': Zap,
  'ethereum': Wallet,
  'wagmi': Code2,
  'walletconnect': Link,
  'git': Code2,
  'github': Github,
};

const CATEGORY_META: Record<string, { icon: any; label: string; gridSpan: string }> = {
  'Frontend': { icon: Code2, label: "Frontend Core", gridSpan: "md:col-span-2 lg:col-span-2" },
  'Web3 / Blockchain': { icon: Wallet, label: "Web3 Stack", gridSpan: "md:col-span-2 lg:col-span-1" },
  'Tools & Platform': { icon: Wrench, label: "Dev Tools", gridSpan: "md:col-span-2 lg:col-span-1" },
};

const TechFoundation = () => {
  return (
    <section id="section-tech" className="relative py-24 md:py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-tech opacity-10" />
      
      <div className="section-content relative z-10 w-full mb-16">
        <ScrollReveal>
          <div className="mb-16 px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-4 bg-emerald" />
              <span className="hud-label">Architecture</span>
            </div>
            <h2 className="heading-section">
              Systems & <span className="text-gradient">Stack.</span>
            </h2>
          </div>
        </ScrollReveal>
        
        {/* Infinite Tech Marquee added full width */}
        <TechMarquee />
      </div>

      <div className="section-content px-6 relative z-10">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Main Terminal Block (Large) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="md:col-span-2 lg:col-span-2 row-span-2 bento-card flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-emerald/60 uppercase">Active_Module: Engineering</span>
                <span className="text-2xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>High-Performance Architecture</span>
              </div>
              <CpuIcon className="text-blue" size={32} />
            </div>

            <p className="text-white/60 text-lg mb-12 leading-relaxed">
              Architecting mission-critical platforms and data-heavy systems. 
              Specializing in <span className="text-white font-medium">Shopify Headless</span>, 
              <span className="text-white font-medium">Next.js App Router</span>, and immersive WebGL experiences.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {SKILLS[0].skills.slice(0, 4).map((skill) => (
                <div key={skill.name} className="flex flex-col items-center gap-2 group p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all rounded-lg">
                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/50 group-hover:text-blue group-hover:shadow-[0_0_15px_rgba(0,153,255,0.4)]">
                    <Code2 size={16} />
                  </div>
                  <span className="text-[10px] font-mono text-white/40 group-hover:text-white uppercase transition-colors">{skill.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Web3 Module */}
          <div className="md:col-span-2 lg:col-span-1 bento-card group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded bg-emerald/10 text-emerald">
                <Wallet size={20} />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-white/50">Web3 Stack</span>
            </div>
            <div className="space-y-4">
              {SKILLS[1].skills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.01] hover:border-emerald/30 transition-all rounded-lg">
                  <span className="text-[11px] font-bold text-white/80">{skill.name}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald/50 group-hover:bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>
              ))}
            </div>
          </div>

          {/* Tools Module */}
          <div className="md:col-span-2 lg:col-span-1 bento-card">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded bg-blue/10 text-blue">
                <Wrench size={20} />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-white/50">Systems & Ops</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILLS[2].skills.map((skill) => (
                <span key={skill.name} className="px-3 py-1.5 border border-white/5 bg-white/[0.02] text-[10px] font-mono text-white/40 uppercase tracking-widest rounded hover:text-blue hover:border-blue/30 hover:bg-blue/10 transition-all cursor-default">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Status Box */}
          <div className="md:col-span-2 lg:col-span-2 bento-card flex items-center gap-8 border-none bg-gradient-to-r from-blue/5 to-emerald/5">
            <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-emerald animate-spin-slow flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <div className="text-xl font-black text-white/90">99</div>
            </div>
            <div className="flex flex-col">
              <span className="hud-label mb-2 text-emerald">System.Performance</span>
              <p className="text-white/60 text-sm font-mono leading-relaxed">Optimization algorithms returning max efficiency. Core Web Vitals validated across 4K displays and mobile form factors.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// Add a slow spin animation for the perf score
const style = document.createElement('style');
style.textContent = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
`;
document.head.append(style);

export default TechFoundation;
