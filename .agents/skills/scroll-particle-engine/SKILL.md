---
name: scroll-particle-engine
description: Design system and implementation guide for building scroll-reactive WebGL particle background animations. Covers architecture, section layering, NDC typography, responsive breakpoints, and project-specific theming.
---

# Scroll-Reactive Particle Engine — Design Direction

A reusable framework for building immersive, scroll-linked WebGL particle backgrounds that morph through narrative sections. Built on Three.js + GSAP, deployable in any React/Next.js project.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Fixed Background                      │
│  position: fixed; inset: 0; z-index: -1;                │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │           THREE.WebGLRenderer                    │    │
│  │                                                   │    │
│  │  25,000 Points (THREE.Points)                    │    │
│  │  ├── BufferGeometry                              │    │
│  │  │   ├── position (Float32Array × 3)             │    │
│  │  │   └── aRandom  (Float32Array × 1)             │    │
│  │  │                                                │    │
│  │  └── ShaderMaterial                              │    │
│  │      ├── Vertex Shader  (position morphing)      │    │
│  │      └── Fragment Shader (color/alpha/effects)    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  Uniforms Bus:                                           │
│  ├── uTime      ←  Clock.getElapsedTime()               │
│  ├── uSection   ←  Scroll position (0.0 → N)            │
│  ├── uMouseX/Y  ←  Mouse parallax                       │
│  └── uColor*    ←  Theme palette                         │
└─────────────────────────────────────────────────────────┘
```

### Core Principle: One Particle System, Many States

All particles exist in a single `THREE.Points` mesh. Their positions, colors, and opacity are controlled entirely by GLSL shaders reacting to a single `uSection` float uniform that tracks scroll progress. There are NO DOM particles — everything is GPU-accelerated.

---

## 2. The Section Layer System

The engine maps each page section to a numeric value on a continuous `uSection` timeline:

```
uSection:  0.0      1.0       2.0       3.0       4.0
           │         │         │         │         │
           ▼         ▼         ▼         ▼         ▼
        ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
        │ HERO │ │NOISE │ │SIGNAL│ │ EDGE │ │ PoN  │
        └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

Each layer uses `clamp()` math to isolate its blend region:

```glsl
// Each layer activates in its range and deactivates outside it
float layerBlend = clamp(uSection - START, 0.0, 1.0) 
                 - clamp(uSection - END, 0.0, 1.0);
```

### How to Define Sections for a New Project

```javascript
// In your BackgroundSystem component:
const trackedSections = [
    { id: 'section-hero',     target: 0 },    // Landing
    { id: 'section-problem',  target: 1 },    // Problem statement
    { id: 'section-solution', target: 2 },    // Solution
    { id: 'section-features', target: 3 },    // Features grid
    { id: 'section-cta',      target: 4 },    // Call to action
];
```

The scroll tracker computes `uSection` via **viewport intersection weighting**: it measures how many pixels of each tracked section are currently visible on screen, weights them proportionally, and outputs a smooth float.

---

## 3. Layer Animation Recipes

Below are battle-tested GLSL animation patterns you can mix-and-match per section:

### 3.1 — Ambient Drift (calm, floating)
```glsl
pos.y += sin(pos.x * 0.02 - uTime * 0.5) * 5.0;
```
**Use for:** Hero sections, intro states, idle backgrounds. Conveys peace, openness.

### 3.2 — Chaotic Glitch (aggressive noise)
```glsl
float glitch = snoise(pos.xz * 0.1 + uTime * 3.0) * 60.0 * aRandom;
pos.y += glitch * blend;
pos.x += snoise(pos.yz * 0.05 + uTime * 2.0) * 20.0 * blend;
```
**Use for:** "Problem" sections, disruption, market chaos, data overload.

### 3.3 — Organized Streams (lateral flow)
```glsl
float streamY = sin(pos.x * 0.05 + uTime * 2.0) * 10.0;
float streamZ = cos(pos.x * 0.02 + uTime) * 15.0;
pos.y = mix(pos.y, streamY, blend);
pos.z = mix(pos.z, pos.z + streamZ, blend);
```
**Use for:** "Solution" sections, data flowing, clarity emerging from noise.

### 3.4 — Grid Snap (precision)
```glsl
float gridSize = 15.0;
float snapX = floor(pos.x / gridSize) * gridSize;
float snapZ = floor(pos.z / gridSize) * gridSize;
pos.x = mix(pos.x, snapX, blend);
pos.z = mix(pos.z, snapZ, blend);
pos.y = mix(pos.y, (aRandom - 0.5) * 10.0, blend);
```
**Use for:** Technology sections, precision, engineering, blockchain grids.

### 3.5 — Breathing Pulse (organic)
```glsl
float pulse = sin(uTime + aRandom * 20.0) * 30.0;
pos.y += pulse * blend;
```
**Use for:** Community sections, proof-of-narrative, living ecosystem.

### 3.6 — Vortex Spiral (dramatic)
```glsl
float angle = atan(pos.z, pos.x) + uTime * 0.3;
float radius = length(pos.xz);
pos.x = mix(pos.x, cos(angle) * radius, blend);
pos.z = mix(pos.z, sin(angle) * radius, blend);
pos.y = mix(pos.y, sin(radius * 0.1 + uTime) * 20.0, blend);
```
**Use for:** Token burn, deflationary mechanics, energy convergence.

### 3.7 — Explosion / Scatter (release)
```glsl
vec3 dir = normalize(pos) * (1.0 + sin(uTime * 2.0 + aRandom * 10.0) * 0.3);
pos = mix(pos, dir * 300.0, blend);
```
**Use for:** Launch sections, CTA, "go live" moments.

### 3.8 — Gravity Well (attractors)
```glsl
vec3 attractor = vec3(0.0, 0.0, 0.0);
vec3 toCenter = attractor - pos;
float dist = length(toCenter);
pos += normalize(toCenter) * (1.0 / (dist * 0.01 + 0.1)) * blend * 5.0;
```
**Use for:** Convergence, focus, core value proposition.

### 3.9 — Wave Field (terrain)
```glsl
pos.y = mix(pos.y, sin(pos.x * 0.03 + uTime) * 20.0 + cos(pos.z * 0.03 + uTime * 0.7) * 15.0, blend);
```
**Use for:** Landscape, ocean, data terrain, analytics.

### 3.10 — DNA Helix (double spiral)
```glsl
float angle = pos.y * 0.05 + uTime * 0.5;
float r = 30.0;
float strand = step(0.5, aRandom); // 0 or 1
pos.x = mix(pos.x, cos(angle + strand * 3.14159) * r, blend);
pos.z = mix(pos.z, sin(angle + strand * 3.14159) * r, blend);
```
**Use for:** Biotech, AI/ML, genetic algorithms, evolution.

---

## 4. NDC Screen-Space Typography

### The Problem
PerspectiveCamera distorts anything not at the center of the frustum. Text rendered in world-space at the edge of screen gets sheared.

### The Solution: Render in Clip Space
Compute letter coordinates as NDC (Normalized Device Coordinates, -1 to +1), then inject them directly into `gl_Position` by multiplying by `worldClip.w`:

```glsl
// 1. Compute letter position in NDC 
vec2 ndcText = vec2(screenX, screenY); // -1 to 1

// 2. Compute normal world-space clip position
vec4 worldClip = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

// 3. Override clip position for text particles
vec4 textClip = vec4(
    ndcText.x * worldClip.w,
    ndcText.y * worldClip.w,
    worldClip.z,
    worldClip.w
);

// 4. Blend between world and screen space
gl_Position = mix(worldClip, textClip, textBlend);
```

### Making Letters from Line Segments
Each letter is defined as a set of parametric line segments. Particles are distributed along these lines using their `aRandom` attribute as a `t` parameter:

```glsl
// Example: Letter "V"
if (t < 0.5) {
    ndcText = vec2(ox + (t/0.5)*(lw*0.5), lh*0.5 - (t/0.5)*lh);
} else {
    ndcText = vec2(ox + lw*0.5 + ((t-0.5)/0.5)*(lw*0.5), -lh*0.5 + ((t-0.5)/0.5)*lh);
}
```

### Responsive Letter Sizing
All letter dimensions are driven by uniforms so they adapt per breakpoint:

```javascript
const computeLayout = (w, h) => {
    if (w > 1200) return { lw: 0.10, lh: 0.55, gap: 0.1, thick: 0.014 };
    if (w > 768)  return { lw: 0.07, lh: 0.30, gap: 0.1, thick: 0.014 };
    return              { lw: 0.065, lh: 0.22, gap: 0.1, thick: 0.012 };
};
```

---

## 5. Fragment Shader Recipes

### 5.1 — Soft Glow Dot (default)
```glsl
vec2 coord = gl_PointCoord - vec2(0.5);
float dist = length(coord);
if (dist > 0.5) discard;
float alpha = 0.35 * (1.0 - dist * 2.0);
```

### 5.2 — Aggressive Flicker
```glsl
alpha *= (0.8 + 1.2 * sin(vRandom * 200.0 + uTime * 15.0));
```

### 5.3 — Section-Based Fade Out
```glsl
float fadeBlend = clamp((vState - 3.25) * 4.0, 0.0, 1.0);
alpha *= (1.0 - fadeBlend); // Particles vanish when section > 3.25
```

---

## 6. Project Theming System

### Color Palette Configuration
```javascript
const THEMES = {
    crypto: {
        primary: 0xF2F0E8,  // Soft cream
        accent:  0xC8FF00,   // Neon lime
        bg:      0x0A0A0A,   // Near-black
    },
    fintech: {
        primary: 0xE8F0FF,  // Ice blue
        accent:  0x00D4FF,   // Electric cyan
        bg:      0x0D0D1A,   // Deep navy
    },
    biotech: {
        primary: 0xE0FFE8,  // Soft mint
        accent:  0x00FF88,   // Bio green
        bg:      0x080F0A,   // Dark forest
    },
    agency: {
        primary: 0xFFFFFF,  // Pure white
        accent:  0xFF4444,   // Signal red
        bg:      0x111111,   // Charcoal
    },
    luxury: {
        primary: 0xFFF8E7,  // Warm ivory
        accent:  0xD4AF37,   // Gold
        bg:      0x0A0A0A,   // True black
    },
};
```

### Applying a Theme
```javascript
const theme = THEMES.fintech;
uniforms.uColorPrimary.value = new THREE.Color(theme.primary);
uniforms.uColorAccent.value  = new THREE.Color(theme.accent);
renderer.setClearColor(theme.bg, 1);
scene.fog = new THREE.FogExp2(theme.bg, 0.002);
```

---

## 7. Project-Specific Narrative Maps

### Template: Mapping Sections → Animations

For each new project, create a **Narrative Animation Map** that pairs each content section with the most contextually appropriate particle behavior:

```
┌───────────────┬────────────────────────┬─────────────────────┐
│ Section       │ Content Context        │ Particle Animation  │
├───────────────┼────────────────────────┼─────────────────────┤
│ Hero          │ Brand reveal           │ NDC Typography      │
│               │                        │ + Ambient Drift     │
├───────────────┼────────────────────────┼─────────────────────┤
│ Problem       │ Pain point             │ Chaotic Glitch      │
├───────────────┼────────────────────────┼─────────────────────┤
│ Solution      │ Clarity emerges        │ Organized Streams   │
├───────────────┼────────────────────────┼─────────────────────┤
│ Features      │ Precision tech         │ Grid Snap           │
├───────────────┼────────────────────────┼─────────────────────┤
│ Social Proof  │ Community / growth     │ Breathing Pulse     │
├───────────────┼────────────────────────┼─────────────────────┤
│ CTA           │ Energy, urgency        │ Vortex or Explosion │
└───────────────┴────────────────────────┴─────────────────────┘
```

### Example Narrative Maps

**DeFi Protocol:**
| Section | Animation | Emotional Arc |
|---|---|---|
| Hero | Typography + Drift | "We exist" — Brand gravity |
| Market Chaos | Chaotic Glitch | "The market is broken" |
| Our Algorithm | Organized Streams | "We found the signal" |
| Yield Vaults | Grid Snap | "Precision infrastructure" |
| Tokenomics | Vortex Spiral | "Deflationary pressure" |
| Community | Breathing Pulse | "Living ecosystem" |
| Launch | Explosion | "Join now" |

**SaaS Dashboard:**
| Section | Animation | Emotional Arc |
|---|---|---|
| Hero | Typography + Drift | Brand presence |
| Data Problem | Wave Field (chaotic) | "Data overload" |
| Analytics | Grid Snap | "Structured insights" |
| Integrations | DNA Helix | "Connected systems" |
| Security | Gravity Well | "Fortified core" |
| Pricing | Breathing Pulse | "Scales with you" |
| CTA | Organized Streams | "Start flowing" |

**Creative Agency:**
| Section | Animation | Emotional Arc |
|---|---|---|
| Hero | Typography + Wave Field | Artistic statement |
| Process | DNA Helix | "Our DNA" |
| Portfolio | Grid Snap → Explosion | "Breaking conventions" |
| Team | Breathing Pulse | "Living culture" |
| Contact | Gravity Well | "Pull them in" |

---

## 8. Performance Guidelines

| Parameter | Recommended | Max Before Frame Drop |
|---|---|---|
| Particle count | 25,000 | 50,000 |
| Pixel ratio | `min(devicePixelRatio, 2)` | 2 |
| Noise calls per vertex | 2–3 | 5 |
| Uniform updates per frame | 3–5 | 10 |
| Fog density | 0.002 | 0.005 |

### Performance Checklist
- [ ] `antialias: false` on the renderer
- [ ] `powerPreference: 'high-performance'`
- [ ] `depthWrite: false` on material
- [ ] `AdditiveBlending` for glow without depth sorting
- [ ] Lerp `uSection` in JS, not GPU (`currentUSection += (target - current) * 0.04`)
- [ ] Clamp pixel ratio to 2 max
- [ ] Dispose geometry, material, renderer on unmount

---

## 9. File Structure for New Projects

```
src/
├── components/
│   ├── BackgroundSystem.jsx      ← The particle engine
│   ├── HeroSection.jsx           ← id="section-hero"
│   ├── ProblemSection.jsx        ← id="section-problem"
│   ├── SolutionSection.jsx       ← id="section-solution"
│   └── ...
└── styles/
    └── globals.css               ← background: matches renderer clearColor
```

### Integration Checklist for a New Project
1. **Copy** `BackgroundSystem.jsx` as your starting template
2. **Define** your `trackedSections` array mapping section IDs to float targets
3. **Choose** your theme from §6 or create a custom one
4. **Map** your narrative using the template in §7
5. **Swap** the GLSL layer blocks (§3) to match your narrative map
6. **Customize** the NDC typography to spell your brand name (§4)
7. **Tune** the `computeLayout()` breakpoints for your design (§4)
8. **Add** `id` attributes to each HTML section element  
9. **Mount** `<BackgroundSystem />` as a fixed background in your App

---

## 10. Quick-Start: Adapting for a New Brand

```javascript
// 1. Change the brand name in the vertex shader
// Replace the letter geometry (N-A-V-I-G) with your brand letters.
// Each letter needs parametric line segments defined in NDC.

// 2. Change the color palette
uColorPrimary: new THREE.Color(0xYOURCOLOR),
uColorAccent:  new THREE.Color(0xYOURACCENT),

// 3. Change the section names
const trackedSections = [
    { id: 'your-section-1', target: 0 },
    { id: 'your-section-2', target: 1 },
    // ...
];

// 4. Swap animation layers in the vertex shader
// Replace the GLSL blocks between "LAYER N:" comments
// with recipes from §3 that match your narrative.
```

---

## Reference: NAVIG Letter Geometry

For building new letter sets, here's the parametric pattern used:

| Letter | Segments | Description |
|---|---|---|
| **N** | 3 segments | Left vertical → diagonal → right vertical |
| **A** | 3 segments | Left diagonal up → right diagonal down → horizontal crossbar |
| **V** | 2 segments | Left diagonal down → right diagonal up |
| **I** | 1 segment | Single vertical line |
| **G** | 5 segments | Top bar → left vertical → bottom bar → right half-vertical → middle bar |

Each segment distributes particles uniformly along its length using the particle's `aRandom` value as a parametric `t ∈ [0, 1]`.
