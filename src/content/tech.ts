/**
 * Maps a technology name as written on the site to an icon id in public/art/tech-sprite.svg (built by
 * `npm run icons` from Simple Icons and Devicon; never drawn by hand). The icon data is not in the JS bundle:
 * components reference the sprite with <use>. First match wins.
 */
const RULES: readonly (readonly [RegExp, string])[] = [
  [/^React Native/i, 'reactnative'],
  [/^React Router/i, 'reactrouter'],
  [/^React$/i, 'react'],
  [/^Next\.js/i, 'nextjs'],
  [/^TypeScript/i, 'typescript'],
  [/^JavaScript/i, 'javascript'],
  [/^Angular/i, 'angular'],
  [/^Redux/i, 'redux'],
  [/^HTML5/i, 'html5'],
  [/^CSS3/i, 'css3'],
  [/^Tailwind/i, 'tailwind'],
  [/^Bootstrap/i, 'bootstrap'],
  [/^shadcn/i, 'shadcn'],
  [/^TanStack/i, 'tanstack'],
  [/^Vite$/i, 'vite'],
  [/^Three\.js/i, 'threejs'],
  [/^GSAP/i, 'gsap'],
  [/^WebGL/i, 'webgl'],
  [/^Remix/i, 'remix'],
  [/^(Shopify|Online Store 2\.0|Dawn Theme|Liquid|Checkout Extensions|Polaris|Storefront API|Admin API)/i, 'shopify'],
  [/^WordPress/i, 'wordpress'],
  [/^WooCommerce/i, 'woocommerce'],
  [/^PHP/i, 'php'],
  [/^Node\.js/i, 'nodejs'],
  [/^Express/i, 'express'],
  [/^PostgreSQL/i, 'postgresql'],
  [/^Prisma/i, 'prisma'],
  [/^Zod/i, 'zod'],
  [/^JWT/i, 'jwt'],
  [/^Docker/i, 'docker'],
  [/^AWS/i, 'aws'],
  [/^GitHub Actions/i, 'githubactions'],
  [/^Git\/GitHub/i, 'github'],
  [/^Bitbucket/i, 'bitbucket'],
  [/^Jira/i, 'jira'],
  [/^Figma/i, 'figma'],
  [/^Playwright/i, 'playwright'],
  [/^ERPNext/i, 'erpnext'],
  [/^Frappe/i, 'erpnext'],
  [/^Python/i, 'python'],
  [/^(Solana|SPL Tokens)/i, 'solana'],
  [/^Ethers/i, 'ethers'],
  [/^Wagmi/i, 'wagmi'],
  [/^Web3$/i, 'ethereum'],
  [/^Offline-first/i, 'pwa'],
  [/^n8n/i, 'n8n'],
  [/^Claude/i, 'claude'],
  [/^Cursor/i, 'cursor'],
  [/^VS Code/i, 'vscode'],
  [/^Postiz/i, 'postiz'],
];

/** Technologies the libraries do not cover: a neutral initial chip is shown, never an invented logo. */
const NO_LOGO = /^(Antigravity|multi-agent workflows|GLSL|Paperclip|Hermes)/i;

export type TechIcon = { kind: 'icon'; id: string } | { kind: 'chip'; initial: string } | { kind: 'none' };

/**
 * `icon`: a library icon. `chip`: a real technology without one (initial chip).
 * `none`: a concept or practice (for example Responsive Design), shown as text only.
 */
export function techIcon(name: string): TechIcon {
  for (const [re, id] of RULES) if (re.test(name)) return { kind: 'icon', id };
  if (NO_LOGO.test(name)) return { kind: 'chip', initial: name.charAt(0).toUpperCase() };
  return { kind: 'none' };
}

/** Skill names that are concepts or practices, not products: text only, by design. Checked by the unit test. */
export const CONCEPTS: readonly string[] = [
  'Context API', 'Responsive Design', 'Accessibility (WCAG 2.2)', 'Reusable components', 'REST/GraphQL API integration',
  'Multi-tenant access control', 'Performance optimization', 'Webhooks',
  'Wallet Integrations', 'DEX & CEX APIs', 'NFTs', 'Headless Commerce', 'CRM', 'ATS', 'Job Boards', 'Agile/Scrum', 'lead generation',
  'content automation (reels, LinkedIn)',
];
