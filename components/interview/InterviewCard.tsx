import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Zap, Code, ShoppingCart, Box } from 'lucide-react';
import { InterviewQuestion } from '../../interviewData';

interface InterviewCardProps {
    question: InterviewQuestion;
    isExpanded: boolean;
    onToggle: () => void;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ question, isExpanded, onToggle }) => {
    const getCategoryIcon = (category: string) => {
        if (category.includes('Shopify')) return <ShoppingCart size={18} />;
        if (category.includes('React')) return <Box size={18} />;
        if (category.includes('JavaScript')) return <Code size={18} />;
        return <Zap size={18} />;
    };

    const getCategoryColor = (category: string) => {
        if (category.includes('Shopify')) return 'text-green-400';
        if (category.includes('React')) return 'text-blue-400';
        if (category.includes('JavaScript')) return 'text-amber-400';
        return 'text-purple-400';
    };

    return (
        <motion.div
            layout
            className={`glass-card relative overflow-hidden transition-all duration-300 ${
                isExpanded ? 'active' : ''
            }`}
        >
            <div
                className="p-6 cursor-pointer select-none flex items-start gap-4"
                onClick={onToggle}
            >
                <div className={`mt-1 p-2 rounded-lg bg-white/5 border border-white/10 ${getCategoryColor(question.category)}`}>
                    {getCategoryIcon(question.category)}
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-label !text-[10px]">{question.category}</span>
                        <div className="text-white/20 group-hover:text-white/40 transition-colors">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                    </div>
                    <h3 className="heading-card !text-lg text-white pr-8">{question.title}</h3>
                    {!isExpanded && (
                        <p className="text-body-lg !text-sm mt-2 line-clamp-1 opacity-60">
                            {question.question}
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
                        <div className="px-6 pb-6 pt-0 space-y-6 border-t border-white/5 bg-white/[0.02]">
                            <div className="pt-6">
                                <h4 className="text-label !text-[10px] !text-blue-400 mb-3 flex items-center gap-2">
                                    <BookOpen size={14} /> The Question
                                </h4>
                                <p className="text-base md:text-lg font-medium italic leading-relaxed text-white/90">
                                    "{question.question}"
                                </p>
                            </div>

                            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 glass-shine">
                                <h4 className="text-label !text-[10px] !text-emerald-400 mb-3 flex items-center gap-2">
                                    <Zap size={14} /> Ideal Response
                                </h4>
                                <p className="text-sm md:text-base leading-relaxed text-white/70">
                                    {question.answer}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                                <div className="flex flex-wrap gap-2">
                                    {question.tags.map(tag => (
                                        <span key={tag} className="pill-tag">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-[10px] font-medium text-white/30 uppercase italic">
                                    Context: {question.context}
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
