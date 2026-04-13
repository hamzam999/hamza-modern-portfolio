import React from 'react';
import { Search, Database } from 'lucide-react';
import InterviewCard from './InterviewCard';
import InterviewDetailPane from './InterviewDetailPane';
import { InterviewQuestion } from '../../interviewData';

interface InterviewListProps {
    questions: InterviewQuestion[];
    activeQuestionId: number | string | null;
    onSelectQuestion: (id: number | string) => void;
    onClearFilters: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

const InterviewList: React.FC<InterviewListProps> = ({ questions, activeQuestionId, onSelectQuestion, onClearFilters, onNext, onPrev }) => {
    return (
        <section className="flex flex-col border-t border-white/5">
            {questions.length > 0 ? (
                questions.map((q, idx) => (
                    <React.Fragment key={q.id}>
                        <InterviewCard
                            question={q}
                            isActive={activeQuestionId === q.id}
                            index={idx}
                            onClick={() => onSelectQuestion(q.id)}
                        />
                        {/* Mobile Details Inline rendering */}
                        {activeQuestionId === q.id && (
                            <div className="lg:hidden mt-2 mb-8 h-[60vh] min-h-[500px]">
                                <InterviewDetailPane 
                                    question={q} 
                                    onNext={onNext}
                                    onPrev={onPrev}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))
            ) : (
                <div className="text-center py-24 border-t border-white/5 bg-white/[0.01]">
                    <div className="relative inline-block mb-6">
                        <Database className="text-white/5" size={64} />
                        <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={32} />
                    </div>
                    <h3 className="hud-label !text-[10px] text-emerald mb-2 font-mono">Null_Pointer: No results found</h3>
                    <p className="text-white/30 text-[11px] tracking-widest uppercase font-mono">Try adjusting your search or category filters.</p>
                    <button
                        onClick={onClearFilters}
                        className="mt-8 px-6 py-2 border border-white/10 text-white/40 text-[10px] font-mono uppercase tracking-widest bg-white/5 hover:bg-emerald/10 hover:border-emerald/30 hover:text-emerald transition-all rounded"
                    >
                        Reset System Query
                    </button>
                </div>
            )}
        </section>
    );
};

export default InterviewList;
