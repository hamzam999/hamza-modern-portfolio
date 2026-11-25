import { createElement, useEffect, useRef, useState, type ReactNode } from 'react';
import { useInView } from '@/lib/useInView';

interface Props {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  /** One mask per line. Use `children` for a single line. */
  lines?: readonly string[];
  children?: ReactNode;
  /** Extra delay in ms before the first line. */
  delay?: number;
  trigger?: 'inview' | 'mount' | 'none';
  id?: string;
  className?: string;
  tabIndex?: number;
  'data-level-heading'?: boolean | '';
}

/**
 * Mask-slide reveal (plan 3.11): every line sits in an overflow-clip block and its inner span slides up from 110%.
 * The hidden state exists only under html.js with motion allowed (CSS in ui.css), so no-JS and reduced-motion
 * visitors always see the text. For headings and labels only, never paragraphs.
 */
export function MaskLine({ as = 'span', lines, children, delay = 0, trigger = 'inview', ...rest }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const seen = useInView(ref, { rootMargin: '0px 0px -8% 0px' });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (trigger !== 'mount') return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    return () => cancelAnimationFrame(id);
  }, [trigger]);
  const shown = trigger === 'none' || (trigger === 'mount' ? mounted : seen);

  const items: readonly ReactNode[] = lines ?? [children];
  const kids = items.flatMap((line, i) => {
    const mask = (
      <span key={`m${i}`} className="mask-line" data-state={shown ? 'in' : 'pending'}>
        <span className="mask-line__in" style={{ '--i': i, '--delay': `${delay}ms` } as React.CSSProperties}>
          {line}
        </span>
      </span>
    );
    // A real space between lines keeps the accessible name and copied text readable.
    return i < items.length - 1 ? [mask, ' '] : [mask];
  });
  return createElement(as, { ref, ...rest }, kids);
}
