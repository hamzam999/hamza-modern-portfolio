import type { Experience } from '../types/content';
import type { ProjectSlug } from './projects';

/** Work experience from resume v6, oldest first. Wording is verbatim from the resume. */
export const EXPERIENCES: readonly Experience<ProjectSlug>[] = [
  {
    id: 'founder',
    role: 'Shopify & WordPress Developer (Founder)',
    company: 'Self-Employed',
    start: '2020-01',
    end: '2022-01',
    location: '', // resume gives no location for this role
    details: [
      'Built and scaled a D2C e-commerce business on Shopify/WooCommerce with custom Shopify themes, custom checkout logic and SEO.',
    ],
  },
  {
    id: 'thl',
    role: 'Shopify Developer / Frontend Developer',
    company: 'House of THL',
    start: '2022-03',
    end: '2023-01',
    location: 'Kanpur, U.P',
    details: [
      'Built responsive Shopify themes (Liquid, HTML5, CSS3/SCSS, JavaScript ES6+) from Figma/XD designs.',
      'Improved organic traffic by 30% through technical SEO, structured data and performance work.',
      'Integrated Shopify APIs, third-party apps and payment systems; built cart features that lifted AOV.',
    ],
  },
  {
    id: 'ith',
    role: 'Frontend & Web3 Engineer',
    company: 'ITH Technologies',
    start: '2023-02',
    end: '2025-12',
    location: 'Kanpur, U.P',
    details: [
      'Merged multiple trading platforms into one Next.js CRM with multi-tenant access control, reducing load times by 35%.',
      'Improved performance by 30-50% using SSR/SSG and code splitting.',
      'Built DEX & CEX trading dashboards with real-time data and wallet integrations; integrated Solana exchanges (Raydium SDK, SPL tokens, RPCs).',
      'Developed a multi-signature wallet with secure transaction workflows; worked with Node.js backend services and APIs alongside the frontend.',
    ],
    relatedProjects: ['unified-trading-crm', 'dex-cex-multisig-wallet'],
  },
  {
    id: 'freelance',
    role: 'Frontend & ERP Developer (Freelance)',
    company: 'Product & E-commerce Solutions',
    start: '2026-01',
    end: null,
    location: 'Remote',
    details: [
      'Built the CodesLytic Budget full-stack app (Next.js, Node.js, PostgreSQL) end to end as a solo developer.',
      'Customised ERPNext/Frappe for a manufacturing client’s workflow, replacing manual processes.',
      'Built custom Shopify apps (Remix, Polaris, Shopify CLI) integrating Admin/Storefront APIs and webhooks, plus Shopify Checkout Extensions and Shopify Functions.',
      'Delivered Shopify OS 2.0 storefronts and modern React/Next.js applications, including 3D animated websites with Three.js and GSAP.',
      'Testing Claude skills and AI agents to raise productivity and expand into new domains: built n8n automations for lead generation and reels/LinkedIn content.',
      'Led projects with no predefined design direction, independently defining UI/UX, animation systems and frontend architecture, and delivered production-ready solutions for undefined problems under evolving requirements.',
    ],
    relatedProjects: ['codeslytic-budget', 'erpnext-manufacturing', 'ai-agent-team'],
  },
];

/** ISO date for sitemap lastmod and JSON-LD dateModified; bump by hand when this file's content changes (plan 9.7). */
export const EXPERIENCE_UPDATED = '2026-11-25' as const;
