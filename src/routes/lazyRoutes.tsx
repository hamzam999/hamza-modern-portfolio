import { lazy } from 'react';
import ArcadeEager from './Arcade';
import InterviewEager from './InterviewFramework';

/**
 * Lazy on the client (separate chunks), eager during prerender so the page text is in the static HTML (plan 9.6).
 * `import.meta.env.SSR` is a build-time constant, so the eager imports drop out of the client main chunk.
 */
export const Arcade = import.meta.env.SSR ? ArcadeEager : lazy(() => import('./Arcade'));
export const InterviewFramework = import.meta.env.SSR ? InterviewEager : lazy(() => import('./InterviewFramework'));
