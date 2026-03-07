export type ProjectAnalysis = {
  id: string;
  title: string;
  category: string;
  slug: string;
  url: string;
  analysis: {
    techStack: string[];
    businessModel: string;
    keyFeatures: string[];
    uxMaturity: 'Low' | 'Medium' | 'High';
    engineeringComplexity: 'Low' | 'Medium' | 'High';
  };
  caseStudy: {
    heroTitle: string;
    problem: string;
    solutionArchitecture: string;
    techStack: string;
    engineeringHighlights: string[];
    businessImpact: string;
  };
};

export const PROJECT_CASE_STUDIES: ProjectAnalysis[] = [
  {
    id: 'nighatahmadofficial',
    title: 'Nighat Ahmad Official',
    category: 'Fashion E-commerce',
    slug: 'nighatahmadofficial',
    url: 'https://nighatahmadofficial.com',
    analysis: {
      techStack: ['Shopify', 'Liquid theme', 'Shopify CDN', 'Meta Pixel', 'WhatsApp integration'],
      businessModel: 'Direct-to-consumer fashion retail with global shipping and seasonal promotions.',
      keyFeatures: ['Catalog browsing', 'Cart and checkout flows', 'Social proof and social links', 'Marketing tracking pixels'],
      uxMaturity: 'High',
      engineeringComplexity: 'Medium'
    },
    caseStudy: {
      heroTitle: 'Scaling a Premium Fashion Storefront for Conversion and Global Reach',
      problem: 'The brand needed a premium storefront that supports high-intent browsing, seasonal campaigns, and frictionless checkout for domestic and international buyers.',
      solutionArchitecture: 'Implemented a Shopify-first architecture with a tailored Liquid theme, optimized storefront scripts, CDN-backed assets, and embedded commerce apps for retention and messaging.',
      techStack: 'Shopify, Liquid, Shopify Storefront assets, Meta Pixel, third-party app scripts.',
      engineeringHighlights: ['Theme-level optimization for hero media and product browsing', 'Event instrumentation for ad attribution', 'Integrated WhatsApp conversion touchpoints'],
      businessImpact: 'Improved funnel continuity from landing pages to checkout while preserving premium brand perception.'
    }
  },
  {
    id: 'lammles',
    title: "Lammle's Western Wear",
    category: 'Enterprise E-commerce',
    slug: 'lammles',
    url: 'https://www.lammles.com/',
    analysis: {
      techStack: ['Shopify', 'Google Tag Manager', 'Klaviyo', 'Shopify theme assets'],
      businessModel: 'Multi-category retail commerce with omnichannel support and high-SKU catalog operations.',
      keyFeatures: ['Large mega-menu navigation', 'Store locator and customer support access', 'Promotions and lifecycle marketing', 'Integrated analytics and conversion tracking'],
      uxMaturity: 'High',
      engineeringComplexity: 'High'
    },
    caseStudy: {
      heroTitle: 'Modernizing High-SKU Western Retail Experience on Shopify',
      problem: 'A complex catalog and mixed online/offline buying journey required robust navigation, discoverability, and analytics-driven merchandising.',
      solutionArchitecture: 'Built around a scalable Shopify theme system with GTM-based event governance, Klaviyo lifecycle hooks, and modular front-end sections for fast merchandising iterations.',
      techStack: 'Shopify, Liquid, GTM, Klaviyo, storefront JS modules.',
      engineeringHighlights: ['Structured taxonomy for dense catalog navigation', 'Centralized event tagging strategy', 'Performance-aware section rendering for merchandising velocity'],
      businessImpact: 'Enabled consistent customer journeys across large inventories and improved campaign measurability.'
    }
  },
  {
    id: 'slurvo',
    title: 'Slurvo',
    category: 'B2B Manufacturing Website',
    slug: 'slurvo',
    url: 'http://slurvo.co/',
    analysis: {
      techStack: ['Next.js', 'React', 'Static asset chunks', 'SSR/ISR style routing'],
      businessModel: 'B2B lead generation for pet treat manufacturing and export partnerships.',
      keyFeatures: ['Corporate narrative sections', 'Product showcase', 'Testimonials and trust blocks', 'Contact and inquiry CTAs'],
      uxMaturity: 'Medium',
      engineeringComplexity: 'Medium'
    },
    caseStudy: {
      heroTitle: 'Building a B2B Export Funnel with Next.js',
      problem: 'The brand needed to establish trust with overseas buyers and convert informational traffic into qualified manufacturing inquiries.',
      solutionArchitecture: 'Delivered a content-forward Next.js site with componentized landing sections, optimized bundle delivery, and clear inquiry pathways from product storytelling to contact.',
      techStack: 'Next.js, React, app-router chunked bundles.',
      engineeringHighlights: ['Reusable section components for rapid content updates', 'SEO-friendly architecture for exporter visibility', 'Lean front-end payload for quick first impressions'],
      businessImpact: 'Strengthened digital credibility and increased lead readiness for international B2B conversations.'
    }
  },
  {
    id: 'wanhamleathers',
    title: 'WanHam Leathers',
    category: 'Industrial Export Website',
    slug: 'wanhamleathers',
    url: 'https://wanhamleathers.com/',
    analysis: {
      techStack: ['Next.js', 'React', 'App Router bundle architecture'],
      businessModel: 'B2B export pipeline for leather belts, pet accessories, and equestrian gear.',
      keyFeatures: ['Product vertical segmentation', 'Company credibility messaging', 'Global export positioning', 'Inquiry-first CTA design'],
      uxMaturity: 'Medium',
      engineeringComplexity: 'Medium'
    },
    caseStudy: {
      heroTitle: 'Positioning a Leather Exporter with a Conversion-Ready Digital Presence',
      problem: 'The company required a modern site that communicates manufacturing quality while turning global traffic into sales-qualified inquiries.',
      solutionArchitecture: 'Implemented a Next.js front-end with structured product storytelling, trust-building brand copy, and contact-first conversion architecture for B2B buyers.',
      techStack: 'Next.js, React, statically optimized page bundles.',
      engineeringHighlights: ['Clear information architecture for product categories', 'Content blocks tuned for B2B trust signals', 'Fast-loading app-shell experience'],
      businessImpact: 'Increased clarity of product offerings and improved readiness for export-focused lead capture.'
    }
  },
  {
    id: 'sedefanatolia',
    title: 'Sedef Anatolia',
    category: 'D2C Fragrance E-commerce',
    slug: 'sedefanatolia',
    url: 'https://sedefanatolia.com/',
    analysis: {
      techStack: ['Shopify', 'Liquid theme', 'Shopify checkout modules', 'Storefront tracking scripts'],
      businessModel: 'Direct-to-consumer fragrance sales driven by brand storytelling and promotions.',
      keyFeatures: ['Promotional banners', 'Collection-driven shopping', 'Brand story sections', 'Standard cart and checkout lifecycle'],
      uxMaturity: 'High',
      engineeringComplexity: 'Medium'
    },
    caseStudy: {
      heroTitle: 'Crafting a Story-Led Fragrance Commerce Journey',
      problem: 'The brand needed to communicate premium fragrance identity while keeping purchase flows simple and promotion-friendly.',
      solutionArchitecture: 'Used a Shopify commerce foundation with a content-rich theme, campaign banners, and optimized storefront scripts to balance storytelling and conversion.',
      techStack: 'Shopify, Liquid, theme JavaScript, storefront analytics scripts.',
      engineeringHighlights: ['Balanced visual storytelling with transactional CTAs', 'Theme customization for collection-first browsing', 'Promotion-ready homepage composition'],
      businessImpact: 'Improved the alignment between brand narrative and direct conversion outcomes.'
    }
  }
];
