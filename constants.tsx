
import { Project, Experience, SkillCategory } from './types';

export const PROJECTS: Project[] = [
  // lammles-shopify
  {
    title: "Lammle's Western Wear (CA)",
    description: "Enterprise-scale Shopify retail experience with dense catalog and omnichannel journeys.",
    tech: ["Shopify Apps", "SHopify funcions API","Shopify Extensions", "Liquid"],
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
  // cursor-vscode
  {
    title: "Bizthon Cursor (AI)",
    description: "VSCode extension in React enabling AI-powered coding assistance across 10+ LLMs.",
    tech: ["React", "VSCode API", "DeepSeek", "OpenAI"],
    impact: [
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
    role: "Frontend Engineer (Retainer)",
    company: "Meta Merchant",
    period: "Jan 2026 – Feb 2026",
    location: "Remote",
    metrics: [],
    details: [
      "Built the complete frontend for a prediction marketplace integrating Polymarket trading infrastructure.",
      "Implemented wallet-based trading flows using Next.js / React with seamless blockchain interactions.",
      "Designed responsive trading interfaces and optimized performance for real-time prediction market interactions."
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
      "Integrated Solana exchanges using Raydium SDK, SPL tokens, and Solana RPCs with robust async handling.",
      "Merged multiple DEX & CEX frontends into a unified CRM platform (Next.js), reducing load times by 35% and development effort by 40%.",
      "Developed a multi-signature wallet (Multi-Owner Safe) with proposal, confirmation, and execution flows.",
      "Improved application performance by 30–50% using memoization, SSR/SSG, and code splitting."
    ]
  },
  {
    role: "Shopify Developer",
    company: "E-commerce Platforms",
    period: "",
    location: "Remote",
    metrics: [],
    details: [
      "Developed and customized multiple Shopify stores using Dawn theme with advanced UI/UX and performance optimizations.",
      "Built custom Shopify extensions for payment customization, delivery logic, and checkout validations.",
      "Implemented checkout UI blocks and custom checkout workflows to enforce business rules and improve conversion.",
      "Delivered multiple Shopify stores with tailored themes, integrations, and scalable storefront architecture."
    ]
  },
  {
    role: "WordPress & E-commerce Developer (Founder)",
    company: "Self-Founded Business",
    period: "",
    location: "Remote",
    metrics: [],
    details: [
      "Built and operated a direct-to-consumer home décor brand, owning the complete WordPress (WooCommerce) stack.",
      "Designed conversion-optimized storefronts, handled payments, SEO, order flows, and performance tuning.",
      "Delivered additional Shopify & WordPress projects alongside the business for external clients."
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
      { name: "WordPress", icon: "wordpress" }
      // { name: "Recharts", icon: "recharts" }
    ]
  },
  {
    title: "Web3 / Blockchain",
    skills: [
      { name: "Wagmi", icon: "wagmi" },
      { name: "Ethers.js", icon: "ethers" },
      { name: "Solana Web3.js", icon: "solana" },
      // { name: "RainbowKit", icon: "image-wallet" },
      { name: "AppKit", icon: "walletconnect" },
      // { name: "ERC-721/1155", icon: "ethereum" },
      // { name: "DEX/CEX APIs", icon: "coinbase" }
    ]
  },
  {
    title: "Tools",
    skills: [
      { name: "Multi-Sig Auth", icon: "keystone" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Cursor", icon: "cursor" },
      { name: "Postman", icon: "postman" },
      { name: "Figma", icon: "figma" },
    ]
  }
];
