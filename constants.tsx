
import { Project, Experience, SkillCategory } from './types';

export const PROJECTS: Project[] = [
  {
    title: "GeSIM.xyz",
    description: "Founding Engineer for global telecom coordination layer using on-chain identity and billing.",
    tech: ["Next.js", "React Native", "Web3", "SBTs"],
    impact: [
      "Built coordination layer for global telecom",
      "Created cross-platform apps with embedded wallet integration",
      "Enabled minting of SBTs and purchase of data plans via stablecoins"
    ],
    image: "https://picsum.photos/seed/gesim/800/600"
  },
  {
    title: "Bizthon Cursor (AI)",
    description: "VSCode extension in React enabling AI-powered coding assistance across 10+ LLMs.",
    tech: ["React", "VSCode API", "DeepSeek", "OpenAI"],
    impact: [
      "Integrated 10+ LLMs with intuitive UI",
      "Responsive in-editor developer workflow",
      "Optimized caching and seamless LLM switching"
    ],
    image: "https://picsum.photos/seed/bizthon/800/600"
  },
  {
    title: "NFT Marketplace",
    description: "Cross-chain NFT marketplace supporting ERC-721/1155 on Base, Sui, and Solana.",
    tech: ["React", "Solidity", "Paymaster", "Solana Web3"],
    impact: [
      "Implemented gas-subsidized free minting on Base",
      "Instant sale & auction modules with countdown timers",
      "Creator dashboard for managing minting and sales history"
    ],
    image: "https://picsum.photos/seed/nft/800/600"
  },
  {
    title: "Multi-Owner Safe",
    description: "Multi-signature wallet platform for secure team token management and governance.",
    tech: ["React", "Ethers.js", "Wagmi", "Web3.js"],
    impact: [
      "Implemented proposal → confirm → execute flows",
      "Wallet tagging and secure recovery mechanisms",
      "Governance dashboards for managing token holdings"
    ],
    image: "https://picsum.photos/seed/safe/800/600"
  }
];

export const EXPERIENCES: Experience[] = [
  {
    role: "Frontend & Web3 Developer",
    company: "ITH Technologies",
    period: "Feb 2023 – Present",
    location: "Kanpur, India",
    metrics: ["350K+ Users", "30-50% Faster Loads", "40% Dev Efficiency"],
    details: [
      "Developed multiple high-impact Web3 applications from scratch, implementing deep wallet integrations and real-time smart contract interactions.",
      "Engineered automated referral reward systems and decentralized governance modules for over 350,000 active users.",
      "Optimized complex DeFi dashboards with high-performance data fetching and real-time chart visualizations.",
      "Architected a unified CRM system bridging legacy Angular platforms with modern Next.js infrastructures."
    ]
  },
  {
    role: "Shopify Developer / Frontend Developer",
    company: "House of THL",
    period: "Mar 2022 – Feb 2023",
    location: "Kanpur, India",
    metrics: ["40% Load Reduction", "30% Organic Growth"],
    details: [
      "Developed high-conversion e-commerce storefronts using Liquid and React, focusing on mobile-first architecture and performance.",
      "Implemented advanced technical SEO strategies that directly led to a 30% increase in organic search traffic and user retention.",
      "Created custom Shopify theme modules and interactive product visualization tools to enhance the digital luxury shopping experience.",
      "Optimized critical rendering paths and asset delivery pipelines, achieving a 40% reduction in average page load times."
    ]
  },
  {
    role: "WordPress & E-commerce Founder",
    company: "Self-Founded Business",
    period: "Jan 2020 – Mar 2022",
    location: "Kanpur, India",
    metrics: ["Full Lifecycle Management", "D2C Scaling"],
    details: [
      "Founded and scaled a D2C home décor brand, architecting the entire digital commerce stack and logistics integration from the ground up.",
      "Designed conversion-optimized storefronts and managed the end-to-end technical lifecycle, from product procurement to secure payment processing.",
      "Executed data-driven growth strategies and optimized customer acquisition funnels to establish a profitable digital brand identity.",
      "Integrated complex third-party logistics and automated inventory management systems to streamline operations during rapid scaling."
    ]
  }
];

export const SKILLS: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React.js", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Angular", icon: "angular" },
      { name: "Shopify", icon: "shopify" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Redux", icon: "redux" },
      { name: "Chart.js", icon: "chartdotjs" },
      { name: "Recharts", icon: "recharts" }
    ]
  },
  {
    title: "Web3 / Blockchain",
    skills: [
      { name: "Wagmi", icon: "wagmi" },
      { name: "Ethers.js", icon: "ethers" },
      { name: "Solana Web3.js", icon: "solana" },
      { name: "RainbowKit", icon: "rainbow" },
      { name: "AppKit", icon: "walletconnect" },
      { name: "ERC-721/1155", icon: "ethereum" },
      { name: "DEX/CEX APIs", icon: "coinbase" }
    ]
  },
  {
    title: "Security & Tools",
    skills: [
      { name: "Multi-Sig Auth", icon: "gnosis" },
      { name: "RBAC", icon: "auth0" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Cursor", icon: "cursor" },
      { name: "WordPress", icon: "wordpress" }
    ]
  }
];
