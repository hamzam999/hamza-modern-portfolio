import React, { useState, useMemo, useEffect } from 'react';
import { Monitor, Zap, Box, ChevronUp } from 'lucide-react';
import InterviewHeader from '../components/interview/InterviewHeader';
import InterviewSearch from '../components/interview/InterviewSearch';
import InterviewList from '../components/interview/InterviewList';
import { INTERVIEW_DATA, CATEGORIES } from '../interviewData';

const InterviewTool: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Filter logic
    const filteredQuestions = useMemo(() => {
        return INTERVIEW_DATA.filter(item => {
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
            const matchesSearch =
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#101010] text-[#EAEFFF] selection:bg-blue-500/30">
            {/* Added a subtle background pattern to match main portfolio */}
            <div className="fixed inset-0 bg-grid opacity-50 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.03)_0%,transparent_100%)] pointer-events-none" />

            <main className="max-w-4xl mx-auto px-6 py-20 relative z-10">
                <InterviewHeader />
                
                <InterviewSearch 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={CATEGORIES}
                />

                <InterviewList 
                    questions={filteredQuestions}
                    onClearFilters={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                />

                {/* FOOTER INFO */}
                <footer className="mt-32 pt-12 border-t border-white/5 text-center space-y-8">
                    <div className="flex justify-center flex-wrap gap-12">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                                <Monitor size={18} className="text-white/40 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <span className="text-label !text-[9px]">Responsive Architecture</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                                <Zap size={18} className="text-white/40 group-hover:text-amber-400 transition-colors" />
                            </div>
                            <span className="text-label !text-[9px]">Senior Evaluation</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                                <Box size={18} className="text-white/40 group-hover:text-purple-400 transition-colors" />
                            </div>
                            <span className="text-label !text-[9px]">System Design Focus</span>
                        </div>
                    </div>
                    <p className="text-label !text-[10px] !tracking-[0.2em] opacity-30 mt-8">
                        © 2026 Engineering Strategy Portal | Developed for High-Growth Tech Hiring
                    </p>
                </footer>
            </main>

            {/* MOBILE CTA */}
            <div className="md:hidden fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-white text-black p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
                >
                    <ChevronUp size={24} />
                </button>
            </div>
        </div>
    );
};

export default InterviewTool;
