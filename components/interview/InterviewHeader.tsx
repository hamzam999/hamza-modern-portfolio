import React from 'react';
import { Zap, Command } from 'lucide-react';

const InterviewHeader: React.FC = () => {
    return (
        <div className="text-center space-y-4 mb-20 pt-8">
            <div className="flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded text-[9px] font-black uppercase tracking-[0.3em] mb-8">
                    <Zap size={14} className="animate-pulse" /> 6+ Years Exp Master_Framework
                </div>
                
                <h1 className="heading-section !text-4xl md:!text-6xl !leading-[1.1] text-white max-w-2xl mx-auto uppercase">
                    Strategic <span className="glitch-text text-cyan-400" data-text="Architecture">Architecture</span> Bank
                </h1>
                
                <p className="text-body-lg max-w-2xl mx-auto text-white/40 mt-6 leading-relaxed font-medium">
                    Master-level architectural questions curated for senior frontend, Web3, and Shopify ecosystems. 
                    Designed to evaluate system-level thinking and technical depth.
                </p>
                
                <div className="mt-8 flex items-center gap-4 text-cyan-500/20">
                    <div className="h-px w-16 bg-current" />
                    <Command size={18} />
                    <div className="h-px w-16 bg-current" />
                </div>
            </div>
        </div>
    );
};

export default InterviewHeader;
