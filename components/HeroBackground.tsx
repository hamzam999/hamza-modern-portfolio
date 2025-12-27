import React from 'react';
import { motion } from 'framer-motion';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
      {/* Animated SVG Constellation/Lines */}
      <svg className="w-full h-full opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <motion.path
          d="M0,500 Q250,300 500,500 T1000,500"
          fill="none"
          stroke="url(#grad1)"
          strokeWidth="1"
          animate={{
            d: ["M0,500 Q250,300 500,500 T1000,500", "M0,500 Q250,700 500,500 T1000,500", "M0,500 Q250,300 500,500 T1000,500"],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="300"
          cy="400"
          r="2"
          fill="#60a5fa"
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle
          cx="700"
          cy="600"
          r="1.5"
          fill="#a78bfa"
          animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 2, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    {/* Radial Gradients */}
    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_0%,rgba(96,165,250,0.1)_0%,transparent_50%)] pointer-events-none" />
  </div>
);

export default HeroBackground;

