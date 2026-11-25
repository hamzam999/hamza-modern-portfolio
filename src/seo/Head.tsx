import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMeta } from './meta';

function setMeta(selector: string, create: () => HTMLElement, attr: string, value: string | null) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (value === null) return el?.remove();
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/** Keeps title, description, canonical and robots in step on client navigation. Crawlers read the prerendered HTML. */
export function Head() {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = getRouteMeta(pathname);
    document.title = m.title;
    const meta = (name: string) => () => Object.assign(document.createElement('meta'), { name });
    setMeta('meta[name="description"]', meta('description'), 'content', m.description || null);
    setMeta('meta[name="robots"]', meta('robots'), 'content', m.robots === 'noindex' ? 'noindex' : null);
    setMeta('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', m.canonical);
  }, [pathname]);
  return null;
}
