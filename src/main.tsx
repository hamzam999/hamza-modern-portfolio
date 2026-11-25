import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { attachStorageSync, useGame } from './game/store';
import './styles/app.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages hydrate; the dev server (empty #root) renders from scratch.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, tree);
} else {
  createRoot(rootElement).render(tree);
}

// Persisted state loads after hydration so server and client markup match (plan 4.2).
void useGame.persist.rehydrate();
attachStorageSync(window);

if (import.meta.env.VITE_TEST_HOOKS === 'true') {
  void import('./game/testHooks').then((m) => m.installTestHooks());
}
