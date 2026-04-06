import React from 'react';
import SmoothScroller from './components/SmoothScroller';
import { ScrollProvider } from './components/ScrollContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import TechFoundation from './components/TechFoundation';
import Work from './components/Work';
import ExperienceTimeline from './components/ExperienceTimeline';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <ScrollProvider sectionCount={6}>
      <SmoothScroller>
        <div className="relative min-h-screen overflow-x-hidden w-full">
          <Navbar />
          
          <main className="relative z-10 w-full">
            <Hero />
            <About />
            <TechFoundation />
            <Work />
            <ExperienceTimeline />
            <CTA />
          </main>

          <Footer />
        </div>
      </SmoothScroller>
    </ScrollProvider>
  );
}
