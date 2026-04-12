import React from 'react';
import { Search, Filter } from 'lucide-react';

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
        <section className="space-y-6 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                        type="text"
                        placeholder="Search questions, keywords, or technology tags..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40">
                        <Filter size={18} />
                    </div>
                    <div className="flex gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap border ${
                                    selectedCategory === cat
                                        ? 'bg-white text-black border-white'
                                        : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
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
