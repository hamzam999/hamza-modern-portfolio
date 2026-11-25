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

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    tailwindcss(),
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
