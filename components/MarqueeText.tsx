import React from 'react';

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: number;
  reverse?: boolean;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  className = '',
  speed = 30,
  reverse = false,
}) => {
  const repeats = 8;

  return (
    <div className={`marquee-container relative border-y border-white/5 py-4 overflow-hidden ${className}`}>
      <div
        className="marquee-track flex items-center whitespace-nowrap"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {Array.from({ length: repeats }).map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 mx-8" style={{ fontFamily: 'var(--font-heading)' }}>
              {text}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/10 mx-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
