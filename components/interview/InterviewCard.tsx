import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Code, ShoppingCart, Box } from 'lucide-react';
import { InterviewQuestion } from '../../interviewData';

interface InterviewCardProps {
    question: InterviewQuestion;
    isActive: boolean;
    index: number;
    onClick: () => void;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ question, isActive, index, onClick }) => {
    const getCategoryIcon = (category: string) => {
        if (category.includes('Shopify')) return <ShoppingCart size={16} />;
        if (category.includes('React')) return <Box size={16} />;
        if (category.includes('JavaScript')) return <Code size={16} />;
        return <Zap size={16} />;
    };

    return (
        <motion.div
            layout
            onClick={onClick}
            className={`border-b border-white/5 cursor-pointer select-none transition-all duration-300 block w-full text-left
                ${isActive
                    ? 'bg-blue/5 border-l-4 border-l-blue pl-4 py-3'
                    : 'bg-transparent border-l-4 border-l-transparent pl-5 py-3 hover:bg-white/[0.02]'
                }`}
        >
            <div className="flex flex-col gap-1.5">
                {/* Meta Row: Tag & Category */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className={`${isActive ? 'text-blue' : 'text-white/40'}`}>
                        {/* {getCategoryIcon(question.category)} */}
                        {index + 1}
                    </div>
                    <span className="text-[10px] font-mono text-emerald/60 uppercase tracking-widest bg-emerald/10 px-2 py-0.5 rounded">
                        {question.category}
                    </span>
                    <span className="text-[10px] font-bold text-white/40 px-2 border-l border-white/10">
                        {question.title}
                    </span>
                </div>

                {/* Primary Question Heading */}
                <h3 className={`text-sm md:text-base font-bold pr-4 tracking-tight font-heading leading-tight transition-colors ${isActive ? 'text-white' : 'text-white/70'}`}>
                    {question.question}
                </h3>
            </div>
        </motion.div>
    );
};

export default InterviewCard;
