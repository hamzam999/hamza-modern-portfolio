import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import TechFoundation from '../components/TechFoundation';
import Work from '../components/Work';
import ExperienceTimeline from '../components/ExperienceTimeline';
import CTA from '../components/CTA';

const Portfolio: React.FC = () => {
    return (
        <main className="relative z-10 w-full">
            <Hero />
            <About />
            <TechFoundation />
            <Work />
            <ExperienceTimeline />
            <CTA />
        </main>
    );
};

export default Portfolio;
