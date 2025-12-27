import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Terminal } from 'lucide-react';
import NeonIcon from './NeonIcon';

const About = () => (
  <section id="about" className="py-32 container mx-auto px-8">
    <div className="section-glow-box p-12 md:p-24 lg:p-32">
      <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <NeonIcon icon={Layers} color="#60a5fa" />
          <h2 className="text-5xl md:text-8xl font-black mt-10 mb-12 leading-[0.8] tracking-tighter">
            Reach Humans, <br /><span className="text-gradient">Not Folders.</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/50 leading-relaxed mb-12">
            I bridge the gap between complex engineering and elegant product design. Over the last 5 years, I've scaled platforms for thousands of users while maintaining pixel-perfect fidelity and sub-second performance.
          </p>
          
          <div className="grid grid-cols-2 gap-12">
            {[
              { val: "350K+", label: "Active Users" },
              { val: "50%", label: "Faster Load Time" },
              { val: "Web3", label: "Specialized" },
              { val: "Impact", label: "Focused" },
            ].map((stat, i) => (
              <div key={i} className="border-l-2 border-white/10 pl-8">
                <div className="text-4xl font-black mb-2">{stat.val}</div>
                <div className="text-[12px] text-white/30 uppercase tracking-[0.3em] font-black">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3.5rem] blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative glass-shine glass rounded-[3.5rem] overflow-hidden aspect-[4/5]">
            <img 
              src="https://picsum.photos/seed/hamza-p/1000/1250" 
              alt="Mohammad Hamza" 
              className="w-full h-full object-cover grayscale opacity-40 mix-blend-lighten scale-110 group-hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-12 left-12 right-12">
              <div className="glass p-8 rounded-3xl backdrop-blur-3xl border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em] mb-2">Currently Building</p>
                  <p className="font-black text-lg tracking-tight">Next-Gen Web3 SDKs</p>
                </div>
                <Terminal size={24} className="text-blue-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default About;

