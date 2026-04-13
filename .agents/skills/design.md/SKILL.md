---
name: design.md
description: Access official design systems and UI guidelines for 59 top tech companies via getdesign.md. Use when building UI styled after any of these brands.
---

# design.md — Design System Architect

This skill grants you the ability to fetch and implement exact design systems, UI guidelines, typography, and styling tokens from the world's leading tech companies and brands.

## How to Fetch a Design System

**URL Format:**
```
https://getdesign.md/<brand>/design-md
```

Use the `WebFetch` tool with the target URL and a prompt to extract colors, typography, spacing, and component rules.

**Example:**
```
WebFetch("https://getdesign.md/stripe/design-md", "Extract colors, typography, spacing, and component rules")
```

### Execution Workflow

1. Identify the requested brand from the user's prompt
2. Call `WebFetch` with `https://getdesign.md/<brand>/design-md`
3. Extract from the returned markdown:
   - **Color Palettes** (Primary, Secondary, Backgrounds, Text, Borders)
   - **Typography** (Font Families, Weights, Sizes, Line-heights)
   - **Spacing & Grid** (8px/4px base grid, breakpoints)
   - **Border Radii & Shadows**
   - **Component Examples** (buttons, cards, inputs, navbars)
4. Apply the design system strictly — use exact hex codes, fonts, and dimensions
5. Implement the micro-interactions and visual polish defined in the guidelines

---

## Brand Quick Reference

Use this table to pick the right brand for the desired aesthetic:

### Developer Tools & Infra

| Brand | Aesthetic | Best For |
|-------|-----------|----------|
| `vercel` | Black & white, Geist font, monochrome precision | Developer platforms, deployment tools |
| `linear.app` | Ultra-minimal, purple accent, dark UI | Project management, SaaS dashboards |
| `cursor` | Sleek dark, gradient accents, AI-first | Code editor UIs, AI dev tools |
| `raycast` | Dark chrome, vibrant gradient accents | Productivity tools, launcher UIs |
| `supabase` | Dark emerald, code-first | Backend/developer portals, open-source sites |
| `hashicorp` | Infrastructure-focused, professional dark | DevOps platforms, cloud tooling |
| `sentry` | Dark, monitoring-focused, orange accents | Error tracking, observability dashboards |
| `posthog` | Dark, analytics, product insight | Analytics platforms, data dashboards |
| `warp` | Dark terminal aesthetic, modern shell | Terminal UIs, CLI tool marketing |
| `clickhouse` | Data warehouse, technical, yellow accent | Database products, performance tools |
| `expo` | Mobile-first, React Native-adjacent | Mobile app showcases, dev tools |
| `ollama` | Minimal, local AI, clean | Local AI tools, lightweight dev products |
| `opencode.ai` | Modern AI coding aesthetic | AI coding assistants, dev platforms |
| `voltagent` | Agentic AI, dark, futuristic | AI agents, automation platforms |

### AI & ML Platforms

| Brand | Aesthetic | Best For |
|-------|-----------|----------|
| `claude` | Clean, thoughtful, Anthropic-inspired | AI assistants, thoughtful products |
| `x.ai` | Dark, minimal, Grok-inspired | AI products, frontier tech |
| `mistral.ai` | European AI, clean, minimal | AI models, research products |
| `cohere` | Enterprise AI, professional | NLP tools, enterprise AI |
| `replicate` | Open source ML, developer-first | ML model APIs, demo sites |
| `together.ai` | Collaborative AI, warm | AI platform marketing |
| `minimax` | AI video/audio, creative | Generative media tools |
| `runwayml` | Creative AI, dark cinematic | AI video/creative tools |
| `elevenlabs` | Audio AI, voice, dark | Voice synthesis, audio products |

### Fintech & Crypto

| Brand | Aesthetic | Best For |
|-------|-----------|----------|
| `stripe` | Purple gradients, weight-300 elegance | Payment platforms, premium fintech |
| `coinbase` | Crypto-blue, trustworthy, clean | Crypto exchanges, Web3 wallets |
| `kraken` | Dark, crypto, deep purple | Crypto trading, DeFi apps |
| `revolut` | Modern neobank, vibrant, mobile-first | Neobank apps, fintech dashboards |
| `wise` | Green, international, trustworthy | Money transfer, fintech products |

### Design & Creative

| Brand | Aesthetic | Best For |
|-------|-----------|----------|
| `figma` | Vibrant multi-color, playful professional | Design tools, collaborative platforms |
| `framer` | Motion-first, creative, dark | No-code, animation-forward sites |
| `miro` | Collaborative, colorful, canvas | Whiteboard tools, brainstorming apps |
| `webflow` | Dark, visual builder, modern | No-code platforms, web builder marketing |
| `pinterest` | Warm, visual-first, grid-heavy | Image boards, visual discovery |
| `lovable` | Warm, creative, inviting | Creative tools, consumer apps |

### Productivity & Workspace

| Brand | Aesthetic | Best For |
|-------|-----------|----------|
| `notion` | Warm minimalism, serif headings, soft surfaces | Workspace tools, note-taking apps |
| `airtable` | Colorful, data-forward, spreadsheet-meets-UI | Database tools, work management |
| `cal` | Minimal, scheduling-focused, clean | Calendar/scheduling apps |
| `intercom` | Friendly, chat-first, blue-green | Customer support, chat widgets |
| `superhuman` | Premium email, dark elegant, speed-first | Email clients, productivity apps |
| `zapier` | Orange accent, automation, accessible | Automation tools, workflow builders |

### Consumer & Lifestyle

| Brand | Aesthetic | Best For |
|-------|-----------|----------|
| `spotify` | Vibrant green on dark, bold type, album-art-driven | Music/media platforms, dark immersive UIs |
| `airbnb` | Warm, hospitality, rausch-red accent | Marketplace platforms, booking UIs |
| `uber` | High contrast, black/white, urban | Ride-sharing, delivery, logistics |
| `revolut` | Modern mobile banking, vibrant | Neobank apps |

### Enterprise & B2B

| Brand | Aesthetic | Best For |
|-------|-----------|----------|
| `ibm` | Blue, enterprise, grid-strict | Enterprise software, technical docs |
| `mongodb` | Green leaf, developer-friendly | Database products, developer portals |
| `semrush` | Orange, SEO/marketing, data-heavy | Marketing analytics, SEO tools |
| `sanity` | Red accent, content-first | CMS platforms, content tools |

### Luxury & Automotive

| Brand | Aesthetic | Best For |
|-------|-----------|----------|
| `apple` | SF Pro, premium white space, cinematic | Product pages, luxury consumer tech |
| `tesla` | Minimalist, white space, automotive | EV brands, clean product showcases |
| `spacex` | Dark, cinematic, space-grade precision | Aerospace, high-tech brands |
| `bmw` | German precision, dark luxury | Automotive, premium brands |
| `ferrari` | Italian luxury, red/black, passion | Luxury automotive, premium products |
| `lamborghini` | Aggressive, yellow-black, exotic | Exotic cars, high-performance brands |
| `renault` | French design, accessible luxury | European automotive, lifestyle brands |

### Developer-Adjacent & Marketing

| Brand | Aesthetic | Best For |
|-------|-----------|----------|
| `mintlify` | Clean docs, mint accent, elegant | Documentation sites, developer guides |
| `resend` | Minimal, email-dev-focused, clean | Email developer tools, API products |
| `composio` | Integration platform, dark | API integration tools |
| `nvidia` | Green-black energy, technical power | GPU/hardware sites, AI performance |
| `clay` | Soft clay style, 3D-lite, warm | Creative tools, playful products |

---

## Full Brand List (59 brands)

`airbnb` · `airtable` · `apple` · `bmw` · `cal` · `claude` · `clay` · `clickhouse` · `cohere` · `coinbase` · `composio` · `cursor` · `elevenlabs` · `expo` · `ferrari` · `figma` · `framer` · `hashicorp` · `ibm` · `intercom` · `kraken` · `lamborghini` · `linear.app` · `lovable` · `minimax` · `mintlify` · `miro` · `mistral.ai` · `mongodb` · `notion` · `nvidia` · `ollama` · `opencode.ai` · `pinterest` · `posthog` · `raycast` · `renault` · `replicate` · `resend` · `revolut` · `runwayml` · `sanity` · `semrush` · `sentry` · `spacex` · `spotify` · `stripe` · `supabase` · `superhuman` · `tesla` · `together.ai` · `uber` · `vercel` · `voltagent` · `warp` · `webflow` · `wise` · `x.ai` · `zapier`

---

## Implementation Rules

- **Never guess** colors, fonts, or layout rules for these brands — always fetch first
- Use exact hex codes, font names, and spacing values from the fetched design system
- Match the brand's micro-interactions (hover states, transitions, shadow depths)
- When the user says "make it look like X", X is the brand — fetch that brand's design system
- If multiple brands are requested, fetch each one and blend their systems thoughtfully
