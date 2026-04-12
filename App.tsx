import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmoothScroller from './components/SmoothScroller';
import { ScrollProvider } from './components/ScrollContext';
import Navbar from './components/Navbar';
import BackgroundSystem from './components/BackgroundSystem';
import Footer from './components/Footer';
import Portfolio from './pages/Portfolio';
import InterviewTool from './pages/InterviewTool';

export default function App() {
  return (
    <Router>
      <ScrollProvider sectionCount={6}>
        <SmoothScroller>
          <div className="relative min-h-screen overflow-x-hidden w-full">
            <Navbar />
            <BackgroundSystem />
            
            {/* Contrast Shield — Ensures readability of foreground text over WebGL particles */}
            <div className="fixed inset-0 z-[5] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(16,16,16,0.3)_0%,rgba(16,16,16,0.6)_100%)]" />
            
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/interview-framework" element={<InterviewTool />} />
            </Routes>

            <Footer />
          </div>
        </SmoothScroller>
      </ScrollProvider>
    </Router>
  );
}
