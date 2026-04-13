import React from 'react';
import { Zap, Command, Key } from 'lucide-react';

const InterviewHeader: React.FC = () => {
    return (
        <div className="text-center space-y-4 mb-16 pt-12">
            <div className="flex flex-col items-center">
                {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald/10 border border-emerald/20 text-emerald rounded text-[9px] font-black uppercase tracking-[0.3em] mb-8">
                    <Zap size={14} className="animate-pulse" /> 6+ Years Exp Master_Framework
                </div> */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-emerald/10 border border-emerald/20 rounded">
                        <Key size={18} className="text-emerald" />
                    </div>
                    <span className="hud-label opacity-40">System_Access: Interview_Framework_v3.0</span>
                </div>
                <h1 className="heading-section !text-4xl md:!text-6xl !leading-[1.1] text-white max-w-2xl mx-auto uppercase">
                    Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue to-emerald">Architecture</span> Bank
                </h1>

                <p className="text-lg max-w-2xl mx-auto text-white/40 mt-6 leading-relaxed font-light">
                    Master-level architectural questions curated for senior frontend, Web3, and Shopify ecosystems.
                    Designed to evaluate system-level thinking and technical depth.
                </p>

                <div className="mt-8 flex items-center gap-4 text-emerald/20">
                    <div className="h-px w-16 bg-current" />
                    <Command size={18} />
                    <div className="h-px w-16 bg-current" />
                </div>
            </div>
        </div>
    );
};

export default InterviewHeader;
