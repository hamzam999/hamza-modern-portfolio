import React from 'react';
import { SOCIAL_LINKS } from '../constants';

const Footer = () => (
  <footer className="py-8 md:py-12 border-t border-white/5">
    <div className="section-content">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left px-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-blue-400 text-lg">ء</span>
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            ER. HAMZA
          </span>
        </div>

        {/* Copyright */}
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/20">
          © {new Date().getFullYear()} Mohammad Hamza — Engineered for the Future.
        </span>

        {/* Social Links */}
        <div className="flex items-center gap-8 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Github
          </a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            LinkedIn
          </a>
          <a href={`mailto:${SOCIAL_LINKS.email}`} className="hover:text-white transition-colors">
            Email
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
