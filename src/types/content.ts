export type ProjectCategory =
  | 'interactive'   // 3D and Interactive
  | 'ecommerce'     // E-commerce and Shopify
  | 'web3'          // Web3
  | 'product'       // Full-stack and Product
  | 'ai'            // AI and Automation
  | 'wordpress';    // WordPress and Client

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  interactive: '3D and Interactive',
  ecommerce: 'E-commerce and Shopify',
  web3: 'Web3',
  product: 'Full-stack and Product',
  ai: 'AI and Automation',
  wordpress: 'WordPress and Client',
};

export type SpineSwatch = 'cobalt' | 'ink' | 'graphite' | 'paper';

export type ProjectLink =
  | { kind: 'live'; url: `https://${string}`; note?: string }
  | { kind: 'repo'; url: `https://github.com/${string}`; note?: string }
  | { kind: 'private'; reason: 'client' | 'client-internal' | 'private-repo' }
  | { kind: 'offline'; reason: 'shut-down' };

export interface OwnerClaim {
  /** Exact wording as stated by the owner. Never paraphrase numbers. */
  text: string;
  source: 'csv' | 'resume' | 'previous-site' | 'owner-confirmed';
}

export interface ProjectMedia {
  /** Crop focus for cover art, 0..1 in each axis. */
  focal: { x: number; y: number };
  /** Alt text for the hero screenshot. Placeholder until the owner writes it. */
  alt: string;
  altStatus: 'placeholder' | 'final';
}

export interface ProjectSeo {
  title: string;        // <= 60 characters where possible
  description: string;  // 140 to 160 characters
  llmsSummary: string;  // one line for llms.txt
  schemaType: 'CreativeWork' | 'SoftwareApplication';
  applicationCategory?: string;
  operatingSystem?: string;
}

export interface Project {
  /** Optional subtitle shown under the title (for example 'CodesLytic AI Company'). */
  subtitle?: string;
  slug: string;                      // narrowed to ProjectSlug by `as const`
  title: string;                     // full title for H1
  cardTitle: string;                 // caption and cards, <= 28 characters
  spineTitle: string;                // uppercase on spine, <= 14 characters
  category: ProjectCategory;
  secondaryCategories?: readonly ProjectCategory[];
  genre: string;                     // playful VHS genre tag, paired with category in UI
  year: string | null;               // e.g. '2024' or '2023–2025'; null until confirmed
  yearStatus: 'confirmed' | 'inferred' | 'tbc'; // 'inferred' = derived from resume role dates; UI shows e.g. "2023–2025 (approx.)"
  yearSource?: string;               // e.g. 'resume: ITH Technologies, Feb 2023 – Dec 2025'
  featured: boolean;
  shelfOrder?: number;               // 1..N for featured items
  synopsis: string;                  // plain-language, faithful to the CSV
  role: string | null;               // null renders "Owner to confirm"
  stack: readonly string[];
  tools?: readonly string[];                  // AI or helper tools disclosed by the owner
  highlights?: readonly string[];             // owner-written bullets from the previous site
  claims?: readonly OwnerClaim[];
  productScope?: readonly string[];           // facts about the product, shown under "Product scope", never as the owner's work
  link: ProjectLink;
  spine: SpineSwatch;
  media: ProjectMedia;
  seo: ProjectSeo;
  flags?: readonly string[];                  // open questions, rendered nowhere in production
  updated: `${number}-${number}-${number}`; // ISO date for sitemap lastmod
}

export type LevelId = 'spawn' | 'origin' | 'skills' | 'archive' | 'career' | 'contact';

export interface Level {
  id: LevelId;
  index: 1 | 2 | 3 | 4 | 5 | 6;
  anchor: `level-${LevelId}`;
  name: string;          // "Archive"
  eyebrow: string;       // "LEVEL 04 / 06 · ARCHIVE"
  heading: string;       // descriptive H2 (H1 for level 1)
  kanji: string;         // "作品"
  jpLabel: string;       // "さくひん"
  xp: { enter: 40; clear: 60 };
}

export type SkillDepth = 'core' | 'working' | 'familiar';

export interface SkillNode<Slug extends string = string> {
  id: string;
  name: string;
  depth: SkillDepth;
  depthStatus: 'confirmed' | 'assumed';
  evidence: ReadonlyArray<Slug | `experience:${string}`>;
}

export interface SkillBranch<Slug extends string = string> {
  id: string;
  title: string;
  nodes: readonly SkillNode<Slug>[];
  /** Projects shown in the "Seen in" line for the whole branch (plan 5.3). */
  evidence: ReadonlyArray<Slug | `experience:${string}`>;
}

export type YearMonth = `${number}-${'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'}`;

export interface Experience<Slug extends string = string> {
  id: string;
  role: string;
  company: string;
  start: YearMonth;
  end: YearMonth | null;  // null = present
  location: string;
  details: readonly string[];
  relatedProjects?: readonly Slug[];
}

/** Earlier work (5.4a): plain list entries, no page, no link, no media. */
export interface EarlierWork {
  name: string;
  description: string;
  stack: readonly string[];
  source: 'owner-answer' | 'previous-site' | 'owner-answer+previous-site';
}

/** Profile from resume v6. Deliberately has no phone field. */
export interface Profile {
  name: string;
  title: string;                 // "Senior Frontend Engineer"
  currentRole: string;           // "Frontend & ERP Developer (Freelance)"
  location: string;              // "India"
  email: 'erhamza.dev@gmail.com';
  links: { linkedin: string; github: string; site: 'https://erhamza.tech' };
  summary: readonly string[];             // resume Summary, split into paragraphs
  education: { degree: string; school: string; city: string; year: 2020 };
  award: string;
  resumePdf: string | null;      // '/resume.pdf' once the phone-free export exists
}

export interface MediaManifestEntry {
  hero: { widths: readonly number[]; ratio: number } | null;
  cover: { widths: readonly number[] } | null;
  mobile: { widths: readonly number[] } | null;
  dominant: string;
  sourceHash: string;
}
export type MediaManifest = Record<string, MediaManifestEntry>;
