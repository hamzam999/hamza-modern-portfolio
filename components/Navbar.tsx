import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, BookOpen, Terminal, Cpu, Layout, Code2, History, Send } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SECTION_MAP, SOCIAL_LINKS } from '../constants';

const NAV_ITEMS = [
  { id: 'section-about', label: 'About', icon: Cpu },
  { id: 'section-tech', label: 'Tech', icon: Code2 },
  { id: 'section-work', label: 'Work', icon: Layout },
  { id: 'section-experience', label: 'History', icon: History },
  { id: 'section-cta', label: 'Connect', icon: Send },
];

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

      if (scrollY > 200) {
        setIsHidden(scrollY > lastScrollRef.current && scrollY - lastScrollRef.current > 5);
      } else {
        setIsHidden(false);
      }
      lastScrollRef.current = scrollY;

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

  useEffect(() => {
    if (location.pathname === '/' && location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo;
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location.pathname, location.state]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-4 left-4 right-4 z-[100] transition-all duration-300 ${isScrolled ? 'md:top-3' : 'md:top-6'
          }`}
      >
        <div
          className={`max-w-5xl mx-auto glass-console transition-all duration-500 overflow-hidden hud-border ${isScrolled || location.pathname !== '/'
            ? 'rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
            : 'rounded-2xl'
            }`}
        >
          <div className="flex items-center justify-between px-4 md:px-8 py-3">
            {/* Logo Section */}
            <button
              onClick={() => scrollToSection('section-hero')}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-8 h-8 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:bg-cyan-500/20 transition-all rounded">
                  <span className="text-xl">ء</span>
                </div>
                <div className="absolute -inset-1 bg-cyan-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col items-start leading-none hidden sm:flex">
                <span className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-widest mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                  Er.
                </span>
                <span className="text-sm font-black tracking-tighter text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  HAMZA
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 xl:gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`group relative flex flex-col items-center px-4 py-1.5 transition-all ${isActive ? 'text-cyan-400' : 'text-white/40 hover:text-white/80'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-white/40 group-hover:text-cyan-400/70 transition-colors'} />
                      <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute -bottom-3 left-2 right-2 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                      />
                    )}
                  </button>
                );
              })}

              <div className="w-px h-6 bg-white/10 mx-2" />

              <Link
                to="/interview-framework"
                className={`flex items-center gap-2 px-4 py-1.5 transition-all text-[11px] font-bold tracking-[0.2em] uppercase ${location.pathname === '/interview-framework'
                  ? 'text-cyan-400'
                  : 'text-white/40 hover:text-white/80'
                  }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <BookOpen size={14} />
                <span>Interview</span>
              </Link>
            </div>

            {/* System Controls */}
            <div className="flex items-center gap-4">
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="hidden lg:flex items-center gap-2 px-5 py-2 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-cyan-500 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 group-hover:text-black transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                  Hire Me
                </span>
                <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:bg-black animate-pulse" />
              </a>

              <button
                className="md:hidden text-cyan-400 hover:text-white p-2 border border-cyan-500/20 rounded bg-cyan-500/5"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Load Progress Header */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5">
            <motion.div
              className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Mobile Terminal View */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 bg-[#0A0A0B]/95 backdrop-blur-2xl border border-cyan-500/20 rounded-xl overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="text-[10px] font-mono text-cyan-500/50 mb-2 font-bold tracking-widest">
                  ACCESSING NAV_SYSTEM_V3.0...
                </div>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center gap-4 w-full text-left py-2 group"
                    >
                      <Icon size={18} className="text-cyan-500/40 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-sm font-bold tracking-[0.2em] uppercase text-white/70 group-hover:text-cyan-400 transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                        {item.label}
                      </span>
                      <div className="flex-grow h-px bg-white/5 mx-2" />
                      <span className="text-[10px] text-cyan-500/20 font-mono">0{NAV_ITEMS.indexOf(item) + 1}</span>
                    </button>
                  );
                })}
                <Link
                  to="/interview-framework"
                  className="flex items-center gap-4 w-full text-left py-2 group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen size={18} className="text-cyan-500/40 group-hover:text-cyan-400" />
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-white/70 group-hover:text-cyan-400" style={{ fontFamily: 'var(--font-heading)' }}>
                    Interview
                  </span>
                  <div className="flex-grow h-px bg-white/5 mx-2" />
                  <span className="text-[10px] text-cyan-500/20 font-mono">06</span>
                </Link>
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="block w-full py-4 text-center bg-cyan-500 text-black font-black text-xs uppercase tracking-[0.4em] rounded"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Hire Me
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
