import type { SkillBranch, SkillDepth, SkillNode } from '../types/content';
import type { ProjectSlug } from './projects';

/**
 * Skill tree, mirroring the Skills section of resume v6 in its order.
 * Depth is mechanical (plan 5.3): nodes set in bold on the resume are `core`,
 * everything else is `working`, and "Currently learning" is `familiar`.
 * Only core nodes are `confirmed`; the rest are `assumed` until the owner confirms (Q15).
 */
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function node(name: string, depth: SkillDepth = 'working'): SkillNode<ProjectSlug> {
  return { id: slug(name), name, depth, depthStatus: depth === 'core' ? 'confirmed' : 'assumed', evidence: [] };
}
const core = (name: string) => node(name, 'core');

export const SKILL_BRANCHES: readonly SkillBranch<ProjectSlug>[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    nodes: [
      node('JavaScript (ES6+)'),
      core('TypeScript'),
      core('React'),
      core('Next.js (App Router, SSR, SSG)'),
      node('React Router'),
      node('Redux'),
      node('Context API'),
      node('HTML5'),
      node('CSS3/SCSS'),
      core('Tailwind CSS'),
      node('Bootstrap'),
      node('shadcn/ui'),
      core('TanStack Query'),
      node('Vite'),
      core('Responsive Design'),
      core('Accessibility (WCAG 2.2)'),
      node('Angular'),
      node('React Native'),
    ],
    evidence: ['codeslytic-budget', 'unified-trading-crm', 'muftimaaz', 'gesim', 'motiongrid'],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    nodes: [
      node('Reusable components'),
      node('REST/GraphQL API integration'),
      node('Offline-first sync (IndexedDB, PWA)'),
      node('Multi-tenant access control'),
      node('Performance optimization'),
    ],
    evidence: ['codeslytic-budget', 'unified-trading-crm'],
  },
  {
    id: '3d-animation',
    title: '3D & Animation',
    nodes: [node('Three.js'), node('GSAP'), node('WebGL'), node('GLSL')],
    evidence: ['navig', 'motiongrid', 'studio-solyn'],
  },
  {
    id: 'shopify',
    title: 'Shopify',
    nodes: [
      node('Online Store 2.0'),
      node('Dawn Theme Customization'),
      node('Liquid'),
      node('Shopify Functions'),
      node('Checkout Extensions'),
      node('Shopify Apps'),
      node('Shopify CLI'),
      node('Polaris'),
      node('Remix'),
      node('Webhooks'),
      node('Storefront API'),
      node('Admin API'),
    ],
    evidence: ['lammles', 'nighat-ahmad-official', 'hefashion', 'berbanto-atelier', 'experience:freelance'],
  },
  {
    id: 'web3',
    title: 'Web3 & Blockchain',
    nodes: [
      node('Solana Web3.js'),
      node('SPL Tokens'),
      node('Ethers.js'),
      node('Wagmi'),
      node('Wallet Integrations'),
      node('DEX & CEX APIs'),
      node('NFTs'),
    ],
    evidence: ['dex-cex-multisig-wallet', 'gesim', 'nft-marketplace', 'experience:ith'],
  },
  {
    id: 'ecommerce-saas',
    title: 'E-commerce & SaaS',
    nodes: [
      node('Shopify'),
      node('WordPress'),
      node('Headless Commerce'),
      node('CRM'),
      node('ATS'),
      node('Job Boards'),
    ],
    evidence: ['nighat-ahmad-official', 'promenade-medulin', 'bookease', 'unified-trading-crm'],
  },
  {
    id: 'erp',
    title: 'ERP',
    nodes: [node('ERPNext/Frappe (custom apps, doctypes, workflows)'), node('Python')],
    evidence: ['erpnext-manufacturing', 'ai-agent-team'],
  },
  {
    id: 'devops-tools',
    title: 'DevOps & Tools',
    nodes: [
      node('Git/GitHub'),
      node('Bitbucket'),
      node('Jira'),
      node('Agile/Scrum'),
      core('GitHub Actions CI/CD'),
      node('Docker'),
      node('AWS EC2'),
      node('Claude Code'),
      node('Cursor'),
      node('Antigravity'),
      node('VS Code Extensions'),
    ],
    evidence: ['codeslytic-budget', 'erpnext-manufacturing'],
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    nodes: [
      core('Claude Code (skills, subagents, MCP)'),
      core('n8n automations'),
      node('multi-agent workflows (Paperclip, Hermes)'),
      node('Postiz'),
      node('lead generation'),
      node('content automation (reels, LinkedIn)'),
    ],
    evidence: ['ai-agent-team'],
  },
  {
    id: 'learning-backend',
    title: 'Currently learning (backend)',
    nodes: [
      node('Node.js', 'familiar'),
      node('Express', 'familiar'),
      node('PostgreSQL', 'familiar'),
      node('Prisma', 'familiar'),
      node('Zod', 'familiar'),
      node('JWT auth', 'familiar'),
    ],
    evidence: ['codeslytic-budget'],
  },
];

/** ISO date for sitemap lastmod and JSON-LD dateModified; bump by hand when this file's content changes (plan 9.7). */
export const SKILLS_UPDATED = '2026-11-25' as const;
