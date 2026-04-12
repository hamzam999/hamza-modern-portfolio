import React, { useState } from 'react';
import { Search } from 'lucide-react';
import InterviewCard from './InterviewCard';
import { InterviewQuestion } from '../../interviewData';

interface InterviewListProps {
    questions: InterviewQuestion[];
    onClearFilters: () => void;
}

const InterviewList: React.FC<InterviewListProps> = ({ questions, onClearFilters }) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <section className="grid gap-6">
            {questions.length > 0 ? (
                questions.map((q) => (
                    <InterviewCard
                        key={q.id}
                        question={q}
                        isExpanded={expandedId === q.id}
                        onToggle={() => toggleExpand(q.id)}
                    />
                ))
            ) : (
                <div className="text-center py-20 glass-card !border-dashed !bg-transparent">
                    <Search className="mx-auto text-white/10 mb-4" size={48} />
                    <h3 className="heading-card text-white/50">No results found</h3>
                    <p className="text-body-lg !text-sm mt-2">Try adjusting your search or category filters.</p>
                    <button
                        onClick={onClearFilters}
                        className="mt-6 text-blue-400 font-bold hover:text-blue-300 transition-colors"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </section>
    );
};

export default InterviewList;
