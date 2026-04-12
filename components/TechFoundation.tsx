import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Wallet, Wrench, Cpu, Globe, Rocket, Shield, Zap, Search, Layers, Box, Layout, Link, Github, Cpu as CpuIcon } from 'lucide-react';
import { SKILLS } from '../constants';
import ScrollReveal from './ScrollReveal';

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
    <section id="section-tech" className="relative py-24 md:py-32 overflow-hidden bg-[#0A0A0B]">
      <div className="absolute inset-0 bg-grid-tech opacity-5" />
      
      <div className="section-content px-6 relative z-10">
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-4 bg-cyan-400" />
              <span className="hud-label">Technical.Infrastructure</span>
            </div>
            <h2 className="heading-section text-white">
              Tech <span className="text-cyan-400">Stack.</span>
            </h2>
          </div>
        </ScrollReveal>

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
                <span className="text-[10px] font-mono text-cyan-500/50 uppercase">Active_Module: Architecture</span>
                <span className="text-xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>High-Performance Frontends</span>
              </div>
              <CpuIcon className="text-cyan-400" size={32} />
            </div>

            <p className="text-white/40 text-base mb-12 leading-relaxed">
              Architecting mission-critical storefronts and data-heavy dashboards. 
              Specializing in <span className="text-white/80">Shopify Online Store 2.0</span>, 
              <span className="text-white/80">Next.js App Router</span>, and immersive 3D web experiences.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {SKILLS[0].skills.slice(0, 4).map((skill) => (
                <div key={skill.name} className="flex flex-col items-center gap-2 group p-4 border border-white/5 bg-white/[0.02] hover:bg-cyan-400/5 transition-all">
                  <div className="w-8 h-8 rounded bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                    <Code2 size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-white/50 group-hover:text-white uppercase transition-colors">{skill.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Web3 Module */}
          <div className="md:col-span-2 lg:col-span-1 bento-card group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                <Wallet size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">Web3 Stack</span>
            </div>
            <div className="space-y-4">
              {SKILLS[1].skills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.02] hover:border-cyan-400/20 transition-all rounded-lg">
                  <span className="text-[11px] font-bold text-white/80">{skill.name}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                </div>
              ))}
            </div>
          </div>

          {/* Tools Module */}
          <div className="md:col-span-2 lg:col-span-1 bento-card">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-400">
                <Wrench size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">Systems</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILLS[2].skills.map((skill) => (
                <span key={skill.name} className="px-3 py-1.5 border border-white/5 bg-white/[0.03] text-[10px] font-bold text-white/40 uppercase tracking-widest rounded hover:text-cyan-400 hover:border-cyan-400/20 transition-all">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Status Box */}
          <div className="md:col-span-2 lg:col-span-2 bento-card flex items-center gap-8 bg-cyan-400/5 border-cyan-400/20">
            <div className="w-24 h-24 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 animate-spin-slow flex items-center justify-center">
              <div className="text-xl font-black text-cyan-400">99</div>
            </div>
            <div className="flex flex-col">
              <span className="hud-label mb-1">Performance.Score</span>
              <p className="text-white/60 text-sm">Optimal lighthouse audit results with focus on Core Web Vitals and First Meaningful Paint.</p>
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
