import React, { useState, useMemo, useEffect } from 'react';
import InterviewHeader from '../components/interview/InterviewHeader';
import InterviewSearch from '../components/interview/InterviewSearch';
import InterviewList from '../components/interview/InterviewList';
import InterviewDetailPane from '../components/interview/InterviewDetailPane';
import { INTERVIEW_DATA, CATEGORIES } from '../content/interview';

const InterviewFramework: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [activeQuestionId, setActiveQuestionId] = useState<number | string | null>(null);

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

    const [visibleCount, setVisibleCount] = useState(10);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(10);
    }, [searchQuery, selectedCategory]);

    const activeIndex = useMemo(() => {
        if (!activeQuestionId) return -1;
        return filteredQuestions.findIndex(q => q.id === activeQuestionId);
    }, [activeQuestionId, filteredQuestions]);

    const handleNext = () => {
        if (activeIndex !== -1 && activeIndex < filteredQuestions.length - 1) {
            setActiveQuestionId(filteredQuestions[activeIndex + 1]?.id ?? null);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveQuestionId(filteredQuestions[activeIndex - 1]?.id ?? null);
        }
    };

    // Ensure the active item is always visible
    useEffect(() => {
        if (activeIndex >= visibleCount) {
            setVisibleCount(activeIndex + 10);
        }
    }, [activeIndex, visibleCount]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            if (visibleCount < filteredQuestions.length) {
                setVisibleCount(prev => prev + 10);
            }
        }
    };

    const displayedQuestions = useMemo(() => {
        return filteredQuestions.slice(0, visibleCount);
    }, [filteredQuestions, visibleCount]);

    const activeQuestion = activeQuestionId ? filteredQuestions.find(q => q.id === activeQuestionId) || null : null;
    return (
        <main id="main" tabIndex={-1} className="iv">
            <InterviewHeader />
            <div className="iv-grid">
                <div className="iv-left">
                    <InterviewSearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={CATEGORIES}
                    />
                    <p className="iv-count" role="status">{filteredQuestions.length} questions</p>
                    <div className="iv-scroll" onScroll={handleScroll}>
                        <InterviewList
                            questions={displayedQuestions}
                            activeQuestionId={activeQuestionId}
                            onSelectQuestion={setActiveQuestionId}
                            onClearFilters={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                            onNext={activeIndex < filteredQuestions.length - 1 ? handleNext : undefined}
                            onPrev={activeIndex > 0 ? handlePrev : undefined}
                        />
                    </div>
                </div>
                <div className="iv-right">
                    <InterviewDetailPane
                        question={activeQuestion}
                        onNext={activeIndex < filteredQuestions.length - 1 ? handleNext : undefined}
                        onPrev={activeIndex > 0 ? handlePrev : undefined}
                    />
                </div>
            </div>
        </main>
    );
};

export default InterviewFramework;
