import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { SECTION_MAP, SOCIAL_LINKS } from '../constants';

const NAV_ITEMS = SECTION_MAP.filter(s => s.label !== 'Home');

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const lastScrollRef = useRef(0);

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // Hide on scroll down, show on scroll up
      if (scrollY > 200) {
        setIsHidden(scrollY > lastScrollRef.current && scrollY - lastScrollRef.current > 5);
      } else {
        setIsHidden(false);
      }
      lastScrollRef.current = scrollY;

      // Active section detection
      const sections = SECTION_MAP.map(s => document.getElementById(s.id));
      const viewportCenter = scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= viewportCenter) {
          setActiveSection(SECTION_MAP[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-4 left-4 right-4 z-[100] transition-all duration-500 ${
          isScrolled ? 'top-3' : 'top-4 md:top-6'
        }`}
      >
        <div
          className={`max-w-4xl mx-auto rounded-full transition-all duration-500 ${
            isScrolled
              ? 'bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('section-hero')}
              className="flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                <span className="text-blue-400 text-lg">ء</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-white hidden sm:block" style={{ fontFamily: 'var(--font-heading)' }}>
                HAMZA
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all ${
                    activeSection === item.id
                      ? 'text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="hidden sm:block px-4 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Let's Build!
              </a>
              <button
                className="md:hidden text-white/70 hover:text-white p-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <motion.div
            className="absolute bottom-0 left-6 right-6 h-[1px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 origin-left"
            style={{ width: progressWidth }}
          />
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="md:hidden mt-2 mx-auto max-w-4xl rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {SECTION_MAP.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? 'text-white bg-white/10'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="block w-full text-center py-3 mt-2 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Let's Build!
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
