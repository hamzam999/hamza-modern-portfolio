import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, BookOpen } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SECTION_MAP, SOCIAL_LINKS } from '../constants';

const NAV_ITEMS = SECTION_MAP.filter(s => s.label !== 'Home');

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const lastScrollRef = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

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

      // Active section detection (only on home page)
      if (location.pathname === '/') {
        const sections = SECTION_MAP.map(s => document.getElementById(s.id));
        const viewportCenter = scrollY + window.innerHeight / 3;
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = sections[i];
          if (el && el.offsetTop <= viewportCenter) {
            setActiveSection(SECTION_MAP[i].id);
            break;
          }
        }
      } else {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      setMobileMenuOpen(false);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Effect to handle scrolling when navigating back to home page
  useEffect(() => {
    if (location.pathname === '/' && location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo;
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Clear state after scrolling
      window.history.replaceState({}, document.title);
    }
  }, [location.pathname, location.state]);

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
            isScrolled || location.pathname !== '/'
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
              
              {/* Interview Tool Link */}
              <Link
                to="/interview-framework"
                className={`relative px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  location.pathname === '/interview-framework'
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {location.pathname === '/interview-framework' && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <BookOpen size={11} /> Interview Tool
                </span>
              </Link>
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="hidden sm:block px-4 py-2 bg-[#EAEFFF] text-[#101010] rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
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

          {/* Progress Bar (only on portfolio) */}
          {location.pathname === '/' && (
            <motion.div
              className="absolute bottom-0 left-6 right-6 h-[1px] rounded-full bg-gradient-to-r from-[#EAEFFF] via-[#9BAFFF] to-[#EAEFFF] origin-left"
              style={{ width: progressWidth }}
            />
          )}
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
                <Link
                  to="/interview-framework"
                  className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === '/interview-framework'
                      ? 'text-white bg-white/10'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={14} /> Interview Tool
                  </span>
                </Link>
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="block w-full text-center py-3 mt-2 bg-[#EAEFFF] text-[#101010] rounded-xl font-bold text-xs uppercase tracking-widest"
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
