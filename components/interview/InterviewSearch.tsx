import React from 'react';
import { Search, Filter, Shield } from 'lucide-react';

interface InterviewSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    categories: string[];
}

const InterviewSearch: React.FC<InterviewSearchProps> = ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories
}) => {
    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-8">
                {/* Search Input HUD */}
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500/40 group-focus-within:text-cyan-400 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search questions, keywords, or technology tags..."
                        className="w-full pl-16 pr-6 py-5 rounded-lg bg-black/40 border border-white/5 text-white outline-none focus:border-cyan-500/30 transition-all placeholder:text-zinc-700 font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                       <span className="text-[9px] font-mono text-cyan-500/20 uppercase tracking-widest hidden sm:block">Filter_Mode_Ready</span>
                       <Shield size={14} className="text-cyan-500/20" />
                    </div>
                </div>

                {/* Category Filters HUD */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter size={14} className="text-cyan-500" />
                        <span className="hud-label !text-[9px] opacity-60">Category_Selector</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded border text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                                    selectedCategory === cat
                                        ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                                        : 'bg-white/5 text-white/40 border-white/5 hover:border-cyan-500/30 hover:text-white'
                                }`}
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InterviewSearch;
