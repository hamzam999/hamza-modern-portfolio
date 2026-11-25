import type { Profile } from '../types/content';

/** Profile from resume v6. There is deliberately no phone field anywhere. */
export const PROFILE = {
  name: 'Mohammad Hamza',
  title: 'Senior Frontend Engineer',
  currentRole: 'Frontend & ERP Developer (Freelance)',
  location: 'Kanpur, India',
  email: 'erhamza.dev@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/er-mohammad-hamza/',
    github: 'https://github.com/hamzam999',
    site: 'https://erhamza.tech',
  },
  summary: [
    'Results-driven Frontend Engineer with 6+ years of experience building e-commerce platforms, Web3 applications, ERP interfaces and interactive web experiences. Proficient in React, Next.js, TypeScript and Shopify, with deep expertise in Shopify Store 2.0, Shopify Functions, Shopify Extensions and custom app development.',
    'Strong focus on performance optimization (SSR/SSG and code splitting, 30–50% gains), scalable architectures, reusable components, REST/GraphQL API integration, offline-first apps and conversion-driven UI/UX.',
    'Adapts quickly to new domains (Web3, Shopify, 3D web), with strong problem-solving and self-learning capabilities. Currently learning backend development (Node.js, Express, PostgreSQL).',
  ],
  education: {
    degree: 'Bachelor of Computer Science',
    school: 'CSJM University',
    city: 'Kanpur',
    year: 2020,
  },
  award:
    'Awarded “Promising Newcomer” at ITH Technologies for quickly ramping up on complex Web3 systems and delivering high-impact frontend solutions.',
  /** Stays null until the owner supplies the phone-free export (plan action A1). */
  resumePdf: null,
} as const satisfies Profile;

export const SOCIAL_LINKS = {
  email: PROFILE.email,
  linkedin: PROFILE.links.linkedin,
  github: PROFILE.links.github,
  portfolio: PROFILE.links.site,
} as const;

export const HERO_CONTENT = {
  name: PROFILE.name,
  tagline: 'Engineering Business Impact.',
  lead: 'Results-driven Frontend Engineer with 6+ years of experience building e-commerce platforms, Web3 applications, ERP interfaces and interactive web experiences.',
  focus: ['React', 'Next.js', 'Three.js / WebGL', 'Shopify', 'Web3'],
  availability: 'Available for Collaborations',
} as const;

/** Credit-style stats (plan 5.2). Each carries its context so it is never shown bare. */
export const ABOUT_STATS = [
  { value: '6+', label: 'years of experience', source: 'resume' },
  { value: '25+', label: 'projects shipped', source: 'previous-site' },
  {
    value: '35%',
    label: 'faster page loads after merging trading tools into one Next.js CRM',
    source: 'resume',
  },
  { value: '30–50%', label: 'performance gains from SSR/SSG and code splitting', source: 'resume' },
  { value: '30%', label: 'more organic traffic from technical SEO at House of THL', source: 'resume' },
] as const;
