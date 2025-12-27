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
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-3 glass border-b border-white/10' : 'py-6 md:py-8'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg md:text-2xl font-black tracking-tighter flex items-center space-x-2"
        >
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg glass-shine glass flex items-center justify-center border-blue-500/30">
            <span className="text-blue-400 text-xl md:text-3xl">ء</span>
          </div>
          <span className="text-gradient">ER. HAMZA</span>
        </motion.div>
        
        <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
          {['About', 'Tech', 'Work', 'Experience'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[10px] lg:text-xs font-bold tracking-widest uppercase text-white/50 hover:text-white transition-all hover:scale-105"
            >
              {item}
            </a>
          ))}
          <a 
            href="#contact" 
            className="px-5 py-2 md:px-6 md:py-2.5 bg-white text-black rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5"
          >
            Get in Touch
          </a>
        </div>

        <button 
          className="md:hidden text-white glass p-2 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
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
            className="md:hidden glass border-t border-white/10 mt-3 mx-4 rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col p-6 space-y-4">
              {['About', 'Tech', 'Work', 'Experience'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-white/70 hover:text-white py-2 border-b border-white/5 last:border-0"
                >
                  {item}
                </a>
              ))}
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-white text-black rounded-lg font-black text-xs uppercase tracking-widest mt-2"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;

