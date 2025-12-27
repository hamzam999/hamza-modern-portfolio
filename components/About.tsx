import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Terminal } from 'lucide-react';
import NeonIcon from './NeonIcon';

const About = () => (
  <section id="about" className="py-12 md:py-32 container mx-auto px-4 md:px-8">
    <div className="section-glow-box p-6 sm:p-10 md:p-24 lg:p-32">
      <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-center md:text-left"
        >
          <div className="inline-block mb-6 md:mb-10">
            <NeonIcon icon={Layers} color="#60a5fa" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black mt-4 md:mt-10 mb-6 md:mb-12 leading-[1.1] md:leading-[0.8] tracking-tighter text-white">
            Reach Humans, <br className="hidden md:block" /><span className="text-gradient">Not Folders.</span>
          </h2>
          <p className="text-base md:text-2xl text-white/50 leading-relaxed mb-8 md:mb-12 font-medium">
            I bridge the gap between complex engineering and elegant product design. Over the last 5 years, I've scaled platforms for thousands of users while maintaining pixel-perfect fidelity and sub-second performance.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12">
            {[
              { val: "350K+", label: "Active Users" },
              { val: "50%", label: "Faster Load Time" },
              { val: "Web3", label: "Specialized" },
              { val: "Impact", label: "Focused" },
            ].map((stat, i) => (
              <div key={i} className="border-l-2 border-white/10 pl-5 md:pl-8 text-left">
                <div className="text-2xl md:text-4xl font-black mb-1">{stat.val}</div>
                <div className="text-[9px] md:text-[12px] text-white/30 uppercase tracking-[0.3em] font-black">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group w-full max-w-md mx-auto lg:max-w-none"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[1.5rem] md:rounded-[3.5rem] blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative glass-shine glass rounded-[1.5rem] md:rounded-[3.5rem] overflow-hidden aspect-[4/5]">
            <img 
              src="https://picsum.photos/seed/hamza-p/1000/1250" 
              alt="Mohammad Hamza Profile" 
              className="w-full h-full object-cover grayscale opacity-40 mix-blend-lighten scale-110 group-hover:scale-100 transition-transform duration-1000"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 md:bottom-12 left-4 md:left-12 right-4 md:right-12">
              <div className="glass p-4 md:p-8 rounded-xl md:rounded-3xl backdrop-blur-3xl border-white/5 flex items-center justify-between">
                <div className="overflow-hidden">
                  <p className="text-[8px] md:text-[10px] font-black uppercase text-white/30 tracking-[0.3em] mb-1 truncate">Currently Building</p>
                  <p className="font-black text-sm md:text-lg tracking-tight truncate">Prediction Platform</p>
                </div>
                <Terminal size={20} className="text-blue-400 shrink-0 ml-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default About;

