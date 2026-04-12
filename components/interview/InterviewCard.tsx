import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Zap, Code, ShoppingCart, Box, Terminal, Activity, Fingerprint } from 'lucide-react';
import { InterviewQuestion } from '../../interviewData';

interface InterviewCardProps {
    question: InterviewQuestion;
    isExpanded: boolean;
    index: number;
    onToggle: () => void;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ question, isExpanded, index, onToggle }) => {
    const getCategoryIcon = (category: string) => {
        if (category.includes('Shopify')) return <ShoppingCart size={18} />;
        if (category.includes('React')) return <Box size={18} />;
        if (category.includes('JavaScript')) return <Code size={18} />;
        return <Zap size={18} />;
    };

    return (
        <motion.div
            layout
            className={`bento-card relative overflow-hidden transition-all duration-300 ${
                isExpanded ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)] bg-cyan-400/[0.02]' : 'hover:border-white/10'
            }`}
        >
            <div
                className="p-6 cursor-pointer select-none flex items-start gap-6"
                onClick={onToggle}
            >
                <div className={`mt-1 p-3 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 transition-all ${isExpanded ? 'scale-110 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : ''}`}>
                    {getCategoryIcon(question.category)}
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="hud-label !text-[9px] opacity-40">{question.category}</span>
                           <div className="w-1 h-1 rounded-full bg-cyan-500/20" />
                        </div>
                        <div className="text-cyan-500/30 group-hover:text-cyan-400 transition-colors">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white pr-8 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{question.title}</h3>
                    {!isExpanded && (
                        <p className="text-white/30 text-xs mt-2 line-clamp-1 italic font-medium">
                           LOG_{index + 1}: {question.question}
                        </p>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-8 pt-0 space-y-8 border-t border-white/5 relative">
                            {/* Decorative Background Icon */}
                            <Terminal size={120} className="absolute -bottom-10 -right-10 text-cyan-500/05 pointer-events-none" />

                            <div className="pt-8 relative z-10">
                                <h4 className="hud-label !text-[9px] !text-cyan-400 mb-4 flex items-center gap-2">
                                    <Fingerprint size={14} className="opacity-50" /> Access_Query: Engineering_Prompt
                                </h4>
                                <p className="text-lg md:text-xl font-medium leading-relaxed text-white/90 italic pl-6 border-l-2 border-cyan-500/20">
                                    "{question.question}"
                                </p>
                            </div>

                            <div className="p-8 rounded bg-cyan-400/[0.03] border border-cyan-400/10 relative z-10 glass-shine">
                                <h4 className="hud-label !text-[9px] !text-cyan-400 mb-4 flex items-center gap-2">
                                    <Activity size={14} className="opacity-50" /> Output_Log: Ideal_Integration_Framework
                                </h4>
                                <p className="text-sm md:text-base leading-relaxed text-white/50 font-medium">
                                    {question.answer}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-6 pt-4 relative z-10">
                                <div className="flex flex-wrap gap-2">
                                    {question.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-bold px-3 py-1 bg-white/5 text-white/30 border border-white/5 uppercase tracking-widest rounded-sm hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-[9px] font-mono text-cyan-500/20 uppercase tracking-[0.2em] italic">
                                    Ctx_Scope: {question.context}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default InterviewCard;
