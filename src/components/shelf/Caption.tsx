import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/types/content';
import { CATEGORY_LABEL } from '@/types/content';
import { yearLabel } from '@/components/projects/ArchiveIndex';
import { IconArrowRight } from '@/components/icons/Icons';

interface Layer {
  key: number;
  project: Project;
  state: 'pre' | 'in' | 'out';
}

interface CaptionProps {
  project: Project;
  controls: string;
  onPrev: () => void;
  onNext: () => void;
}

const SWAP_MS = 650;

/**
 * Caption under the shelf (plan 6.6, 6.7). Visual only: the tape label and the live region carry the same text,
 * so the text block is aria-hidden. The two round buttons are real controls. The title swaps with a mask slide.
 */
export function Caption({ project, controls, onPrev, onNext }: CaptionProps) {
  const [layers, setLayers] = useState<Layer[]>([{ key: 0, project, state: 'in' }]);
  const counter = useRef(0);
  const shown = layers.find((l) => l.state !== 'out')?.project;

  useEffect(() => {
    if (shown?.slug === project.slug) return;
    const key = ++counter.current;
    setLayers((ls) => [...ls.map((l) => ({ ...l, state: 'out' as const })), { key, project, state: 'pre' }]);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setLayers((ls) => ls.map((l) => (l.key === key ? { ...l, state: 'in' } : l)))));
    const t = window.setTimeout(() => setLayers((ls) => ls.filter((l) => l.state !== 'out')), SWAP_MS + 80);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.slug]);

  return (
    <div className="cap-row">
      <button type="button" className="cap-btn" aria-controls={controls} aria-label="Previous project" onClick={onPrev}>
        <IconArrowRight className="cap-btn__flip" />
      </button>
      <div className="cap" aria-hidden="true">
        <div className="cap__stack">
          {layers.map((l) => (
            <div key={l.key} className="cap__layer" data-state={l.state}>
              <h3 className="cap__title">
                <span className="cap__mask">
                  <span className="cap__in">{l.project.cardTitle}</span>
                </span>
              </h3>
              <p className="cap__meta">
                <span className="cap__mask">
                  <span className="cap__in">
                    <span className="cap__cat">{CATEGORY_LABEL[l.project.category]}</span>
                    <span className="cap__sep"> · </span>
                    <span className="cap__genre">{l.project.genre}</span>
                  </span>
                </span>
              </p>
              <span className="cap__bar" />
              <p className="cap__year">{yearLabel(l.project)}</p>
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="cap-btn" aria-controls={controls} aria-label="Next project" onClick={onNext}>
        <IconArrowRight />
      </button>
    </div>
  );
}

interface ReelProps {
  items: readonly Project[];
  active: number;
  onJump: (index: number) => void;
}

/** Ruler scrubber (plan 6.5): one tick per tape with its frame number. Buttons are out of the tab order on purpose. */
export function Reel({ items, active, onJump }: ReelProps) {
  const n = items.length;
  return (
    <div className="reel" role="group" aria-label="Jump to a tape">
      <span className="reel__line" aria-hidden="true" />
      {items.map((p, i) => (
        <button key={p.slug} type="button" tabIndex={-1} className="reel__tick" aria-label={`Go to tape ${i + 1}: ${p.cardTitle}`} aria-current={i === active ? 'true' : undefined} onClick={() => onJump(i)}>
          <span className="reel__mark" aria-hidden="true" />
          <span className="reel__no" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
        </button>
      ))}
      <span className="reel__dot" aria-hidden="true" style={{ left: `${((active + 0.5) / n) * 100}%` }} />
    </div>
  );
}
