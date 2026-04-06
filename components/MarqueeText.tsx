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
  const repeats = 6;

  return (
    <div className={`marquee-container ${className}`}>
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {Array.from({ length: repeats }).map((_, i) => (
          <span key={i} className="marquee-text">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
