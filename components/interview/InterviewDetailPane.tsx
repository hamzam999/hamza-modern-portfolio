import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Fingerprint, ChevronLeft, ChevronRight } from 'lucide-react';
import { InterviewQuestion } from '../../interviewData';

interface InterviewDetailPaneProps {
    question: InterviewQuestion | null;
    onNext?: () => void;
    onPrev?: () => void;
}

const InterviewDetailPane: React.FC<InterviewDetailPaneProps> = ({ question, onNext, onPrev }) => {
    if (!question) {
        return (
            <div className="h-full flex items-center justify-center p-12 text-center bg-white/[0.01] rounded-2xl border border-white/5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-tech opacity-10 pointer-events-none" />
                <div className="flex flex-col items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        <Terminal size={24} className="text-white/20" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2 font-heading tracking-tight">System Ready</h3>
                        <p className="text-white/40 max-w-sm mx-auto font-light leading-relaxed">
                            Select an engineering prompt from the index to review potential integration paths and architectures.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="h-full relative overflow-hidden bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl flex flex-col"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue/40 via-emerald/40 to-transparent" />
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Header Context */}
                <div className="p-4 sm:p-6 lg:p-8 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Terminal size={14} className="text-emerald hidden sm:block" />
                            <span className="text-[10px] sm:text-xs font-mono text-white/50 tracking-widest uppercase">
                                Query_ID: {question.id}
                            </span>
                        </div>
                        {question.context && (
                            <div className="hidden sm:block px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] font-mono text-blue uppercase tracking-widest">
                                Ctx: {question.context}
                            </div>
                        )}
                    </div>
                    {/* Next / Prev Navigation */}
                    <div className="flex items-center gap-2">
                        {onPrev && (
                            <button onClick={onPrev} className="p-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded border border-white/5 transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                        )}
                        {onNext && (
                            <button onClick={onNext} className="p-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded border border-white/5 transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar" data-lenis-prevent="true">

                    {/* The Prompt */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-mono text-emerald uppercase tracking-widest flex items-center gap-2">
                            <Fingerprint size={12} className="opacity-50" /> Engineering_Prompt
                        </h4>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight font-heading tracking-tight">
                            {question.question}
                        </h2>
                    </div>

                    {/* The Output / Answer */}
                    <div className="space-y-4 relative">
                        <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue/20 to-transparent" />
                        <h4 className="text-[10px] font-mono text-blue uppercase tracking-widest flex items-center gap-2">
                            <Activity size={12} className="opacity-50" /> Answer
                        </h4>
                        <div className="prose prose-invert prose-emerald max-w-none">
                            <p className="text-lg leading-relaxed text-white/70 font-light whitespace-pre-wrap">
                                {question.answer}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer Tags */}
                <div className="p-8 border-t border-white/5 bg-black/20 flex flex-wrap gap-2">
                    {question.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold px-3 py-1.5 bg-white/5 text-white/40 border border-white/5 uppercase tracking-widest rounded hover:border-emerald/30 hover:text-emerald hover:bg-emerald/5 transition-all text-center">
                            #{tag}
                        </span>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InterviewDetailPane;
