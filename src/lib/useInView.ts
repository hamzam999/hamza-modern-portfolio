import { useEffect, useState, type RefObject } from 'react';

/** True once the element has intersected the viewport (one-shot by default). SSR-safe: false until mounted. */
export function useInView(ref: RefObject<Element | null>, opts: { once?: boolean; rootMargin?: string; threshold?: number } = {}): boolean {
  const { once = true, rootMargin = '0px 0px -10% 0px', threshold = 0 } = opts;
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin, threshold]);
  return inView;
}
