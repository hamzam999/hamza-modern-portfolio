import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-4 glass border-b border-white/10' : 'py-8'}`}>
      <div className="container mx-auto px-8 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter flex items-center space-x-2"
        >
          <div className="w-8 h-8 rounded-lg glass-shine glass flex items-center justify-center border-blue-500/30">
            <span className="text-blue-400">H</span>
          </div>
          <span className="text-gradient">HAMZA.DEV</span>
        </motion.div>
        
        <div className="hidden md:flex items-center space-x-10">
          {['About', 'Tech', 'Work', 'Experience'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-sm font-bold tracking-widest uppercase text-white/50 hover:text-white transition-all hover:scale-105"
            >
              {item}
            </a>
          ))}
          <a 
            href="#contact" 
            className="px-8 py-3 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5 hover:shadow-blue-500/20"
          >
            Get in Touch
          </a>
        </div>

        <button 
          className="md:hidden text-white glass p-2 rounded-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass border-t border-white/10 mt-4 mx-4 rounded-3xl overflow-hidden"
          >
            <div className="flex flex-col p-8 space-y-6">
              {['About', 'Tech', 'Work', 'Experience'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-bold text-white/70 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

