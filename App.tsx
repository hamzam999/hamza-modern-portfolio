import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import TechFoundation from './components/TechFoundation';
import Work from './components/Work';
import ExperienceTimeline from './components/ExperienceTimeline';
import Values from './components/Values';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative min-h-screen selection:bg-blue-500/40 selection:text-white">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 z-[200] origin-left" 
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <TechFoundation />
        <Work />
        <ExperienceTimeline />
        <Values />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
