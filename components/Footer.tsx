import React from 'react';

const SOCIAL_LINKS = {
  email: "erhamza.dev@gmail.com",
  linkedin: "https://www.linkedin.com/in/er-mohammad-hamza/",
  github: "https://github.com/hamzam999"
};

const Footer = () => (
  <footer className="py-12 md:py-24 border-t border-white/5 container mx-auto px-4 md:px-8">
    <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 text-center md:text-left">
      <div className="text-xl md:text-3xl font-black tracking-tighter text-white">HAMZA.DEV</div>
      <div className="text-white/20 text-[8px] md:text-xs font-black uppercase tracking-[0.4em] max-w-xs md:max-w-none px-4">
        © 2024 MOHAMMAD HAMZA — ENGINEERED FOR THE FUTURE.
      </div>
      <div className="flex items-center space-x-6 md:space-x-12 text-[9px] md:text-[11px] font-black uppercase tracking-widest text-white/30">
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Github</a>
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">LinkedIn</a>
        <a href={`mailto:${SOCIAL_LINKS.email}`} className="hover:text-blue-500 transition-colors">Email</a>
      </div>
    </div>
  </footer>
);

export default Footer;

