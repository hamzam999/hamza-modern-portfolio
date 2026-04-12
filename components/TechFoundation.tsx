import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Wallet, Wrench, Cpu, Globe, Rocket } from 'lucide-react';
import { SKILLS } from '../constants';
import MarqueeText from './MarqueeText';
import ScrollReveal from './ScrollReveal';

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; description: string }> = {
  'Frontend': {
    icon: <Code2 size={24} />,
    color: '#EAEFFF',
    description: 'Specializing in React, Next.js, and immersive 3D experiences. High-performance storefronts and scalable UI architecture.',
  },
  'Web3 / Blockchain': {
    icon: <Wallet size={24} />,
    color: '#9BAFFF',
    description: 'Expertise in Solana and EVM-compatible ecosystems. Secure trading platforms and decentralized coordinating layers.',
  },
  'Tools & Platform': {
    icon: <Wrench size={24} />,
    color: '#EAEFFF',
    description: 'Leveraging modern CI/CD, version control, and collaborative tooling for precise delivery across all domains.',
  },
};

const TechFoundation = () => {
  return (
    <section id="section-tech" className="relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="glow-orb glow-orb-purple" style={{ width: '600px', height: '600px', top: '10%', right: '-100px' }} />
      <div className="glow-orb glow-orb-blue" style={{ width: '400px', height: '400px', bottom: '20%', left: '-50px' }} />

      {/* Marquee Divider */}
      <MarqueeText text="TECH STACK" className="py-4 md:py-8" speed={35} reverse />

      <div className="section-full" style={{ minHeight: 'auto', padding: 'var(--section-padding) clamp(1rem, 4vw, 4rem)' }}>
        <div className="section-content">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-16 md:mb-24">
              <span className="text-label text-[rgba(234,239,255,0.7)] mb-4 block tracking-[0.25em]">Expertise</span>
              <h2 className="heading-section text-white mb-4">
                Tech <span className="heading-italic-glow">Stack.</span>
              </h2>
              <p className="text-body-lg max-w-2xl mx-auto opacity-40">
                A selection of modern technologies and tools I leverage to build mission-critical solutions.
              </p>
            </div>
          </ScrollReveal>

          {/* Bento Grid — Enhanced Bento with Glow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {SKILLS.map((cat, idx) => {
              const meta = CATEGORY_META[cat.title] || { icon: <Rocket size={24} />, color: '#7c6cf0', description: '' };
              return (
                <ScrollReveal key={cat.title} delay={idx * 0.1}>
                  <div className="glass-card group p-8 md:p-10 h-full flex flex-col relative overflow-hidden transition-all duration-500 hover:border-[rgba(124,108,240,0.4)]">
                    {/* Hover Glow Effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at 100% 0%, ${meta.color}08 0%, transparent 60%)` }}
                    />
                    
                    {/* Visual Card Top — Floating Icon with Glow */}
                    <div className="mb-10 relative">
                      <div 
                        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                        style={{ background: `${meta.color}08`, border: `1px solid ${meta.color}15`, color: meta.color }}
                      >
                        {meta.icon}
                      </div>
                      <div 
                        className="absolute -top-2 -left-2 w-14 h-14 md:w-16 md:h-16 rounded-2xl blur-xl opacity-20"
                        style={{ background: meta.color }}
                      />
                    </div>

                    <h3 className="heading-card text-white text-xl md:text-2xl mb-4 group-hover:text-[rgba(155,175,255,1)] transition-colors">
                      {cat.title}
                    </h3>

                    <p className="text-white/35 text-base leading-relaxed mb-10 flex-1">
                      {meta.description}
                    </p>

                    {/* Skill Pills */}
                    <div className="flex flex-wrap gap-2.5">
                      {cat.skills.map((skill) => (
                        <span key={skill.name} className="pill-tag text-[11px] py-1.5 px-4 font-semibold uppercase tracking-wider group-hover:border-[rgba(124,108,240,0.3)] hover:!text-white transition-all">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechFoundation;
