import React, { useState } from 'react';
import { Search, Database } from 'lucide-react';
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
                questions.map((q, idx) => (
                    <InterviewCard
                        key={q.id}
                        question={q}
                        isExpanded={expandedId === q.id}
                        index={idx}
                        onToggle={() => toggleExpand(q.id)}
                    />
                ))
            ) : (
                <div className="text-center py-24 rounded-xl border border-dashed border-white/5 bg-white/[0.01]">
                    <div className="relative inline-block mb-6">
                        <Database className="text-cyan-500/10" size={64} />
                        <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400/20" size={32} />
                    </div>
                    <h3 className="hud-label !text-sm text-white/30 mb-2">Null_Pointer: No results found</h3>
                    <p className="text-zinc-600 text-xs tracking-widest uppercase font-bold">Try adjusting your search or category filters.</p>
                    <button
                        onClick={onClearFilters}
                        className="mt-8 px-6 py-2 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-500 hover:text-black transition-all"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Reset System Query
                    </button>
                </div>
            )}
        </section>
    );
};

export default InterviewList;
