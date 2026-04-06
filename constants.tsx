
import { Project, Experience, SkillCategory } from './types';

export const SECTION_MAP = [
  { id: 'section-hero', target: 0, label: 'Home' },
  { id: 'section-about', target: 1, label: 'About' },
  { id: 'section-tech', target: 2, label: 'Tech' },
  { id: 'section-work', target: 3, label: 'Work' },
  { id: 'section-experience', target: 4, label: 'Experience' },
  { id: 'section-cta', target: 5, label: 'Contact' },
];

export const SOCIAL_LINKS = {
  email: "erhamza.dev@gmail.com",
  linkedin: "https://www.linkedin.com/in/er-mohammad-hamza/",
  github: "https://github.com/hamzam999",
  portfolio: "https://erhamza.dev"
};

export const HERO_CONTENT = {
  name: "Mohammad Hamza",
  tagline: "Engineering Business Impact.",
  subtitle: "Results-driven Frontend Engineer with 6+ years of experience building e-commerce platforms, Web3 applications, and interactive web experiences.",
  availability: "Available for Collaborations",
};

export const ABOUT_CONTENT = {
  bio: "Results-driven Frontend Engineer with 6+ years of experience building e-commerce platforms, Web3 applications, and interactive web experiences. Proficient in React, Next.js, and Shopify, with deep expertise in Shopify Store 2.0, Shopify Functions, Shopify Extensions, and custom app development. Strong focus on performance optimization, scalable architectures, and conversion-driven UI/UX. Experienced in building high-performance storefronts, data heavy dashboards, and immersive 3D web experiences. Adapting quickly to new technologies and domains (Web3, Shopify, 3D web), demonstrating strong problem-solving and self-learning capabilities.",
  stats: [
    { label: "Years Experience", value: "6+" },
    { label: "Projects Shipped", value: "25+" },
    { label: "Performance Gain", value: "50%" },
    { label: "Load Time Reduction", value: "35%" },
  ],
  education: "Bachelor of Computer Science, CSJM University, Kanpur – 2020",
  achievement: "Awarded 'Promising Newcomer' at ITH Technologies for quickly ramping up on complex Web3 systems and delivering high-impact frontend solutions."
};

export const PROJECTS: Project[] = [
  // NAVIG
  {
    title: "NAVIG",
    description: "Cinematic Web3 Intelligence Platform with 25,000+ GPU-driven particles at 144 FPS.",
    tech: ["React", "Three.js", "GLSL", "WebGL", "GSAP"],
    impact: [
      "Architected a cinematic 3D scroll-driven web experience using React, Three.js, and raw GLSL shaders, rendering 25,000+ GPU-driven particles at 144 FPS.",
      "Developed procedural shader-based visual states (ocean waves, waterfalls, data streams, grid structures) to represent AI-driven data transformation.",
      "Took full ownership of frontend architecture and design direction in the absence of predefined UI/UX guidelines.",
      "Solved complex WebGL rendering and blending challenges, ensuring visual consistency and performance across devices."
    ],
    image: "/projects/navig.png",
    link: "https://navig-app.vercel.app/"
  },
  // lammles-shopify
  {
    title: "Lammle's Western Wear (CA)",
    description: "Enterprise-scale Shopify retail experience with dense catalog and omnichannel journeys.",
    tech: ["Shopify Apps", "Shopify Functions API", "Shopify Extensions", "Liquid"],
    impact: [
      "Created a custom shopify extension to handle pickup and delivery options on checkout page",
      "Created payment customization extension to handle payment options on checkout page"
    ],
    image: "/projects/lammles.png",
    link: "https://www.lammles.com/"
  },
  // louis cardin-shopify
  {
    title: "Louis Cardin (UAE)",
    description: "Story-led Shopify fragrance commerce implementation with strong promotional UX.",
    tech: ["Shopify", "Liquid", "Theme JS", "Analytics"],
    impact: [
      "Balanced premium brand narrative with direct conversion for launch in INDIA",
      "Enabled campaign-friendly homepage composition",
      "Improved collection discoverability and checkout flow"
    ],
    image: "/projects/louis-cardin.png",
    link: "https://louiscardin.in/"
  },
  // gesim-web3
  {
    title: "GeSIM.xyz",
    description: "Founding Engineer for global telecom coordination layer using on-chain identity and billing.",
    tech: ["Next.js", "React Native", "Web3", "SBTs"],
    impact: [
      "Built coordination layer for global telecom",
      "Created cross-platform apps with embedded wallet integration",
      "Enabled minting of SBTs and purchase of data plans via stablecoins"
    ],
    image: "/projects/gesim.png",
    link: "https://gesim.xyz"
  },
  // Unified CRM for Trading Platforms
  {
    title: "Unified CRM for Trading Platforms",
    description: "Migrated multiple trading tools into a unified Next.js CRM improving performance and scalability.",
    tech: ["Next.js", "React", "SSR/SSG", "Web3"],
    impact: [
      "Merged multiple DEX & CEX frontends into a unified CRM platform",
      "Reduced load times by 35% and development effort by 40%",
      "Improved application performance by 30–50% using memoization, SSR/SSG, and code splitting"
    ],
    image: "/projects/crm.png"
  },
  // AI Coding Assistant
  {
    title: "Bizthon Cursor (AI)",
    description: "VSCode extension in React enabling AI-powered coding assistance across 10+ LLMs.",
    tech: ["React", "VSCode API", "DeepSeek", "OpenAI"],
    impact: [
      "Built VS Code AI extension like Claude Code integrating multiple LLMs with in-editor UI",
      "Integrated 10+ LLMs with intuitive UI",
      "Responsive in-editor developer workflow",
      "Optimized caching and seamless LLM switching"
    ],
    image: "/projects/cursor.png"
  },
  // nft-marketplace
  {
    title: "NFT Marketplace (CA)",
    description: "Cross-chain NFT marketplace supporting ERC-721/1155 on Base, Sui, and Solana.",
    tech: ["React", "Solidity", "Paymaster", "Solana Web3"],
    impact: [
      "Implemented gas-subsidized free minting on Base",
      "Instant sale & auction modules with countdown timers",
      "Creator dashboard for managing minting and sales history"
    ],
    image: "/projects/nft.png"
  },
  // nighat ahmad official-shopify
  {
    title: "Nighat Ahmad Official",
    description: "Shopify-powered premium fashion storefront for D2C and international audiences.",
    tech: ["Shopify", "Liquid", "Meta Pixel", "CDN"],
    impact: [
      "Improved campaign-to-checkout continuity",
      "Enabled rich merchandising with conversion intent",
      "Integrated social and messaging-driven buyer touchpoints"
    ],
    image: "/projects/nighatahmadofficial.png",
    link: "https://nighatahmadofficial.com"
  },
  // multi-owner-safe
  {
    title: "Multi-Owner Safe",
    description: "Multi-signature wallet platform for secure team token management and governance.",
    tech: ["React", "Ethers.js", "Wagmi", "Web3.js"],
    impact: [
      "Implemented proposal → confirm → execute flows",
      "Wallet tagging and secure recovery mechanisms",
      "Governance dashboards for managing token holdings"
    ],
    image: "/projects/safe.png"
  },
  // slurvo-nextjs
  {
    title: "Slurvo",
    description: "Next.js B2B website focused on trust-building and export lead generation.",
    tech: ["Next.js", "React", "SEO", "Performance"],
    impact: [
      "Improved conversion path from story to inquiry",
      "Built credibility with testimonials and product sections",
      "Delivered fast first-load with optimized bundle strategy"
    ],
    image: "/projects/slurvo.png",
    link: "https://slurvo.co"
  },
  // wanhamleathers-nextjs
  {
    title: "WanHam Leathers",
    description: "Conversion-ready export website for leather and equestrian product lines.",
    tech: ["Next.js", "React", "App Router", "Static Assets"],
    impact: [
      "Clarified value proposition for international buyers",
      "Segmented offerings for faster product comprehension",
      "Enhanced lead readiness through inquiry-first structure"
    ],
    image: "/projects/wanhamleathers.png",
    link: "https://wanhamleathers.com/"
  },
];

export const EXPERIENCES: Experience[] = [
  {
    role: "Frontend Developer (Freelance)",
    company: "Product & E-commerce Solutions",
    period: "Jan 2026 – Present",
    location: "Remote",
    metrics: [],
    details: [
      "Built modern React/Next.js applications including 3D animated websites using Three.js, GSAP, and scroll-based interactions.",
      "Architected and delivered Shopify Online Store 2.0 storefronts with full Dawn theme customization tailored to client requirements.",
      "Developed Shopify Checkout Extensions and Shopify Functions for payment, delivery, and checkout logic customization.",
      "Built custom Shopify apps using Remix, Polaris, and Shopify CLI, integrating Admin API, Storefront API, and webhooks.",
      "Led projects with no predefined design direction, independently defining UI/UX, animation systems, and frontend architecture from scratch.",
      "Consistently took ownership of complex, undefined problems, delivering production-ready solutions under ambiguity and evolving requirements."
    ]
  },
  {
    role: "Frontend & Web3 Engineer",
    company: "ITH Technologies",
    period: "Feb 2023 – Dec 2025",
    location: "Kanpur, U.P",
    metrics: [],
    details: [
      "Built DEX & CEX trading dashboards with real-time market data, wallet integrations, and optimized execution flows.",
      "Integrated Solana exchanges using Raydium SDK, SPL tokens, and Solana RPCs.",
      "Merged multiple trading platforms into a Next.js CRM, reducing load times by 35%.",
      "Developed a multi-signature wallet with secure transaction workflows.",
      "Improved performance by 30–50% using SSR/SSG and code splitting."
    ]
  },
  {
    role: "Shopify Developer / Frontend Developer",
    company: "House of THL",
    period: "Mar 2022 – Jan 2023",
    location: "Kanpur, U.P",
    metrics: [],
    details: [
      "Developed and customized Shopify themes using Liquid, HTML5, CSS3/SCSS, and JavaScript (ES6+) with full responsiveness across devices.",
      "Implemented UI/UX designs from Figma/XD and built conversion-focused storefronts with optimized user flows.",
      "Enhanced technical SEO using structured data, schema markup, and performance optimizations, improving organic traffic by 30%.",
      "Integrated Shopify APIs, third-party apps, and payment systems, and developed custom features like cart progress indicators to increase AOV."
    ]
  },
  {
    role: "Shopify & WordPress Developer (Founder)",
    company: "Self-Employed",
    period: "Jan 2020 – Jan 2022",
    location: "Remote",
    metrics: [],
    details: [
      "Built and scaled a D2C e-commerce business using Shopify and WooCommerce.",
      "Developed custom Shopify themes with deep Liquid customization and dynamic sections.",
      "Implemented custom checkout logic, payment workflows, and delivery customization.",
      "Managed SEO, analytics, and conversion optimization for growth."
    ]
  }
];

export const SKILLS: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React.js", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Angular", icon: "angular" },
      { name: "Three.js", icon: "threedotjs" },
      { name: "GSAP", icon: "greensock" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Shopify", icon: "shopify" },
    ]
  },
  {
    title: "Web3 / Blockchain",
    skills: [
      { name: "Solana Web3.js", icon: "solana" },
      { name: "Ethers.js", icon: "ethereum" },
      { name: "Wagmi", icon: "wagmi" },
      { name: "AppKit", icon: "walletconnect" },
    ]
  },
  {
    title: "Tools & Platform",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Figma", icon: "figma" },
      { name: "VS Code", icon: "vscodium" },
      { name: "Postman", icon: "postman" },
      { name: "Jira", icon: "jira" },
    ]
  }
];
