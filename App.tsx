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
          <div className="relative min-h-screen overflow-x-hidden w-full bg-[#0A0A0B]">
            {/* Global HUD Overlay Layer (Scanlines & Noise) */}
            <div className="fixed inset-0 z-[100] pointer-events-none scanlines opacity-[0.03]" />
            <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.02]"
            //  style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} 
            />

            <Navbar />
            <BackgroundSystem />

            {/* Contrast Shield — Tuned for Cyber Cyan */}
            <div className="fixed inset-0 z-[5] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(10,10,11,0.2)_0%,rgba(10,10,11,0.8)_100%)]" />

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
