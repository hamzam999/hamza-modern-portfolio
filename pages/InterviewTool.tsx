import React, { useState, useMemo, useEffect } from 'react';
import { Monitor, Zap, Box as BoxIcon, ChevronUp, Terminal, Key } from 'lucide-react';
import InterviewHeader from '../components/interview/InterviewHeader';
import InterviewSearch from '../components/interview/InterviewSearch';
import InterviewList from '../components/interview/InterviewList';
import { INTERVIEW_DATA, CATEGORIES } from '../interviewData';

const InterviewTool: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

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
        <div className="min-h-screen bg-[#0A0A0B] text-[#EAEFFF] selection:bg-cyan-500/30 font-body transition-colors">
            {/* HUD Scanlines and Grid */}
            <div className="fixed inset-0 bg-grid-tech opacity-5 pointer-events-none" />
            <div className="fixed inset-0 scanlines opacity-10 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.02)_0%,transparent_100%)] pointer-events-none" />

            <main className="max-w-5xl mx-auto px-6 py-24 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded">
                      <Key size={18} className="text-cyan-400" />
                   </div>
                   <span className="hud-label opacity-40">System_Access: Interview_Framework_v3.0</span>
                </div>

                <InterviewHeader />
                
                <div className="my-12 glass-console p-8 rounded-xl hud-border">
                    <InterviewSearch 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={CATEGORIES}
                    />
                </div>

                <InterviewList 
                    questions={filteredQuestions}
                    onClearFilters={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                />

                <footer className="mt-32 pt-12 border-t border-white/5 text-center space-y-12 pb-24">
                    <div className="flex justify-center flex-wrap gap-12">
                        <div className="flex flex-col items-center gap-3 group">
                            <div className="w-12 h-12 rounded bg-cyan-500/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/40 transition-all group-hover:bg-cyan-500/10">
                                <Monitor size={20} className="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <span className="hud-label !text-[9px] opacity-40 group-hover:opacity-100 transition-opacity">Responsive Architecture</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 group">
                            <div className="w-12 h-12 rounded bg-cyan-500/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/40 transition-all group-hover:bg-cyan-500/10">
                                <Zap size={20} className="text-zinc-500 group-hover:text-amber-400 transition-colors" />
                            </div>
                            <span className="hud-label !text-[9px] opacity-40 group-hover:opacity-100 transition-opacity">Senior Evaluation</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 group">
                            <div className="w-12 h-12 rounded bg-cyan-500/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/40 transition-all group-hover:bg-cyan-500/10">
                                <BoxIcon size={20} className="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <span className="hud-label !text-[9px] opacity-40 group-hover:opacity-100 transition-opacity">System Design Focus</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <Terminal size={14} className="text-cyan-500/20" />
                        <p className="text-[10px] font-mono !tracking-[0.4em] text-zinc-700 uppercase">
                            © 2026 Engineering Strategy Portal | Ver: 3.0.HUD
                        </p>
                    </div>
                </footer>
            </main>

            <div className="md:hidden fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-cyan-500 text-black p-4 rounded-sm shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95 transition-all"
                >
                    <ChevronUp size={24} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};

export default InterviewTool;
