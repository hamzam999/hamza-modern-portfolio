import React from 'react';

const NeonIcon = ({ icon: Icon, color = "#60a5fa", size = 24 }: { icon: any; color?: string; size?: number }) => (
  <div 
    className="p-3 md:p-4 rounded-xl md:rounded-2xl glass flex items-center justify-center relative group shrink-0"
    style={{ borderColor: `${color}33` }}
  >
    <div 
      className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-2xl"
      style={{ backgroundColor: color }}
    />
    <Icon size={size} style={{ color: color }} className="relative z-10" />
  </div>
);

export default NeonIcon;

