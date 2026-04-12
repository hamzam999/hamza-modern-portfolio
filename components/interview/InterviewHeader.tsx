import React from 'react';
import { Zap, Code } from 'lucide-react';

const InterviewHeader: React.FC = () => {
    return (
        <div className="text-center space-y-4 mb-16 pt-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <Zap size={14} /> 6+ Years Exp Engineering Portfolio
            </div>
            
            <h1 className="heading-hero !text-5xl md:!text-7xl !leading-[1.1] text-white">
                Strategic <span className="heading-italic-glow">Question</span> Bank
            </h1>
            
            <p className="text-body-lg max-w-2xl mx-auto opacity-70">
                Master-level architectural questions curated for senior frontend, Web3, and Shopify ecosystems. 
                Designed to evaluate system-level thinking and technical depth.
            </p>
        </div>
    );
};

export default InterviewHeader;
