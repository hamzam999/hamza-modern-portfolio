import { existsSync, readFileSync } from 'node:fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { FontaineTransform } from 'fontaine';

/** `vite preview` only: serve prerendered files like a static host (clean URLs, real 404 page). */
const staticHostPreview: Plugin = {
  name: 'aq-static-host-preview',
  configurePreviewServer(server) {
    const dist = path.resolve(__dirname, 'dist');
    server.middlewares.use((req, res, next) => {
      const url = (req.url ?? '/').split('?')[0] ?? '/';
      if (req.method !== 'GET' || path.extname(url)) return next();
      const clean = url.replace(/\/$/, '') || '';
      if (existsSync(path.join(dist, clean, 'index.html'))) {
        req.url = `${clean}/index.html`;
        return next();
      }
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(readFileSync(path.join(dist, '404.html')));
    });
  },
};

/** Content types for the generated text files (dev server and `vite preview`). */
const TEXT_FILES: Record<string, string> = {
  '/llms.txt': 'text/plain; charset=utf-8',
  '/llms-full.txt': 'text/plain; charset=utf-8',
  '/robots.txt': 'text/plain; charset=utf-8',
  '/sitemap.xml': 'application/xml; charset=utf-8',
};

/**
 * Serves robots.txt, sitemap.xml, llms.txt, llms-full.txt and /projects/<slug>.md in `npm run dev` and `vite preview`
 * with the right Content-Type. Source: the committed copies in public/ (written by scripts/gen-seo-files.mjs), then dist/.
 */
const seoTextFiles: Plugin = {
  name: 'aq-seo-text-files',
  configureServer(server) {
    server.middlewares.use(serveSeoText([path.resolve(__dirname, 'public'), path.resolve(__dirname, 'dist')]));
  },
  configurePreviewServer(server) {
    server.middlewares.use(serveSeoText([path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'public')]));
  },
};

function serveSeoText(roots: string[]) {
  return (
    req: { url?: string; method?: string },
    res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b?: unknown) => void },
    next: () => void,
  ) => {
    const url = (req.url ?? '/').split('?')[0] ?? '/';
    const type = TEXT_FILES[url] ?? (/^\/projects\/[a-z0-9-]+\.md$/.test(url) ? 'text/markdown; charset=utf-8' : null);
    if (!type || (req.method !== 'GET' && req.method !== 'HEAD')) return next();
    for (const root of roots) {
      const file = path.join(root, url);
      if (existsSync(file)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', type);
        res.setHeader('X-Content-Type-Options', 'nosniff');
        return res.end(req.method === 'HEAD' ? undefined : readFileSync(file));
      }
    }
    next();
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    tailwindcss(),
    seoTextFiles,
    staticHostPreview,
    // Metric-adjusted local fallbacks so the web-font swap causes no layout shift (plan 3.7).
    FontaineTransform.vite({
      fallbacks: {
        'Inter Tight': ['Arial'],
        Newsreader: ['Georgia'],
      },
      fallbackName: (name) => `${name} Fallback`,
      resolvePath: (id) => new URL(`./node_modules/${id.replace(/^\.\//, '')}`, import.meta.url).href,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    manifest: true,
  },
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
    // The e2e build (`vite build --mode e2e`) enables window.__aq test hooks (plan 11.1).
    'import.meta.env.VITE_TEST_HOOKS': JSON.stringify(mode === 'e2e' ? 'true' : ''),
  },
}));
