import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ABOUT_CONTENT } from '../constants';
import MarqueeText from './MarqueeText';
import TextHighlight from './TextHighlight';
import ScrollReveal from './ScrollReveal';

const StatCounter = ({ label, value }: { label: string; value: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="heading-section text-white mb-2" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
        <motion.span
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="heading-italic-glow"
        >
          {value}
        </motion.span>
      </div>
      <span className="text-label text-[rgba(155,175,255,0.4)] tracking-[0.2em]">{label}</span>
    </motion.div>
  );
};

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [100, 0]);

  return (
    <section id="section-about" ref={sectionRef} className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="glow-orb glow-orb-purple" style={{ width: '800px', height: '800px', top: '20%', left: '-200px' }} />
      <div className="glow-orb glow-orb-blue" style={{ width: '600px', height: '600px', bottom: '10%', right: '-150px' }} />

      {/* Marquee Divider */}
      <MarqueeText text="ABOUT" className="py-4 md:py-8" speed={40} />

      {/* Main Content */}
      <div className="section-full" style={{ minHeight: 'auto', padding: 'var(--section-padding) clamp(1rem, 4vw, 4rem)' }}>
        <div className="section-content">
          <motion.div 
            style={{ y: contentY }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start"
          >
            {/* Left — Text Content */}
            <div className="relative z-10">
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-[1px] bg-[rgba(234,239,255,0.2)]" />
                  <span className="text-label text-[rgba(234,239,255,0.8)] tracking-[0.2em]">Who I Am</span>
                </div>
                <h2 className="heading-section text-white mb-8">
                  Engineering <span className="heading-italic-glow">Business Impact.</span>
                </h2>
              </ScrollReveal>

              {/* Scroll-based text highlight */}
              <TextHighlight
                text={ABOUT_CONTENT.bio}
                className="text-lg md:text-xl lg:text-2xl leading-relaxed font-medium mb-16 text-white/40"
                highlightColor="rgba(255, 255, 255, 0.95)"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Achievement */}
                <ScrollReveal delay={0.2}>
                  <div className="glass-card p-8 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#EAEFFF] to-transparent opacity-40" />
                    <span className="text-label text-[rgba(124,108,240,0.8)] mb-4 block">Recognition</span>
                    <p className="text-white/50 text-sm md:text-base leading-relaxed">
                      {ABOUT_CONTENT.achievement}
                    </p>
                  </div>
                </ScrollReveal>

                {/* Education */}
                <ScrollReveal delay={0.3}>
                  <div className="glass-card p-8 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#9BAFFF] to-transparent opacity-40" />
                    <span className="text-label text-[rgba(155,175,255,0.8)] mb-4 block">Education</span>
                    <p className="text-white/50 text-sm md:text-base">
                      {ABOUT_CONTENT.education}
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Right — Stats & Profile Image */}
            <div className="lg:sticky lg:top-32 relative z-10">
              <div className="grid grid-cols-2 gap-6 md:gap-8 mb-12">
                {ABOUT_CONTENT.stats.map((stat, i) => (
                  <ScrollReveal key={stat.label} delay={i * 0.1}>
                    <div className="glass-card p-6 md:p-10 flex flex-col items-center justify-center border-[rgba(234,239,255,0.08)] hover:border-[rgba(234,239,255,0.3)] transition-all">
                      <StatCounter label={stat.label} value={stat.value} />
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Profile Image with Antimatter Glow */}
              <ScrollReveal delay={0.4}>
                <motion.div
                  className="aspect-[4/5] rounded-[2rem] overflow-hidden glass-card p-1"
                  style={{ scale: imageScale, opacity: imageOpacity }}
                >
                  <div className="w-full h-full rounded-[1.8rem] bg-[#0c0c1a] overflow-hidden relative group">
                    {/* Placeholder gradient with glow orb */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c1a] via-[#12122b] to-[#0c0c1a]" />
                    <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(124,108,240,0.1),transparent_70%)] group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 border border-white/10 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                          <span className="text-4xl md:text-5xl heading-italic-glow">ء</span>
                        </div>
                        <span className="text-label text-white/30 tracking-[0.3em]">Mohammad Hamza</span>
                        <div className="w-8 h-[1px] bg-[rgba(234,239,255,0.3)] mx-auto mt-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
