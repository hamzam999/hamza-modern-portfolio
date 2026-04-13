import React from 'react';
import { SOCIAL_LINKS } from '../constants';
import { Terminal, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const Footer = () => (
  <footer className="py-12 md:py-24 bg-[#0A0A0B] border-t border-white/5 relative overflow-hidden">
    {/* Decorative Terminal Accent */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

    <div className="section-content px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">

        {/* Brand/Status */}
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <span className=" text-xl">ء</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
              Er. HAMZA
            </span>
          </div>
          <p className="text-zinc-600 text-sm leading-relaxed max-w-xs uppercase tracking-wider font-medium">
            Engineering high-performance web solutions for the decentralized future.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-widest">System_Status: Standby</span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-12 md:gap-24">
          <div className="flex flex-col gap-6">
            <span className="hud-label opacity-40">Resources</span>
            <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Github size={14} /> GitHub
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Linkedin size={14} /> LinkedIn
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <span className="hud-label opacity-40">Contact</span>
            <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Mail size={14} /> Session_Init
              </a>
              <a href={SOCIAL_LINKS.portfolio} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                <ExternalLink size={14} /> Main_Core
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono uppercase tracking-[0.4em] text-zinc-800">
        <span>© {new Date().getFullYear()} M.HAMZA // ALL_RIGHTS_RESERVED</span>
        <div className="flex gap-4">
          <span className="text-cyan-500/20">VER: 3.0.HUD</span>
          <span className="text-cyan-500/20">LOC: DEV_INFRA_01</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
